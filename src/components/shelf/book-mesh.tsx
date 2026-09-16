"use client";

import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  makePageTexture,
  makeSpineTexture,
  spineCloth,
} from "@/components/shelf/book-textures";
import { assetPath } from "@/lib/paths";
import {
  CASE_CLEARANCE,
  CLOSE_SPREAD_MS,
  clamp01,
  easeInOutCubic,
  easeOutCubic,
  easeOutQuart,
  FRONT_Z,
  HOVER_PULL,
  LIFT_DISTANCE,
  pullDistanceFor,
  PULL_DURATION_MS,
  PUSH_DURATION_MS,
  SPREAD_DURATION_MS,
  TURN_BACK_MS,
  TURN_DURATION_MS,
} from "@/lib/shelf-case";
import type { Book } from "@/types/book";

type BookMeshProps = {
  book: Book;
  position: [number, number, number];
  selected: boolean;
  onSelect: (book: Book) => void;
};

/** Almost 180° so covers lie side by side with insides toward the camera. */
const FRONT_OPEN = Math.PI * 0.98;

function coverThickness(book: Book) {
  return Math.max(0.018, Math.min(0.038, book.thickness * 0.17));
}

export function BookMesh({ book, position, selected, onSelect }: BookMeshProps) {
  const root = useRef<THREE.Group>(null);
  const turnGroup = useRef<THREE.Group>(null);
  const frontHinge = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [spineMap, setSpineMap] = useState<THREE.CanvasTexture | null>(null);
  const [pageMap, setPageMap] = useState<THREE.CanvasTexture | null>(null);
  const [coverMap, setCoverMap] = useState<THREE.Texture | null>(null);
  const pull = useRef(0);
  const turn = useRef(0);
  const spread = useRef(0);
  const fromPull = useRef(0);
  const fromTurn = useRef(0);
  const fromSpread = useRef(0);
  const startedAt = useRef(0);
  const opening = useRef(false);
  const cloth = useMemo(() => spineCloth(book), [book]);
  const coverT = coverThickness(book);
  const pagesT = Math.max(0.05, book.thickness - coverT * 2);
  const pullDist = pullDistanceFor(book.depth);
  const spineZ = book.depth / 2;
  useCursor(hovered || selected);

  useEffect(() => {
    const texture = makeSpineTexture(book);
    setSpineMap(texture);
    return () => {
      texture.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id, book.title, book.author, book.palette.band]);

  useEffect(() => {
    const texture = makePageTexture();
    setPageMap(texture);
    return () => {
      texture.dispose();
    };
  }, []);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let cancelled = false;
    const tex = loader.load(assetPath(book.coverImageUrl), (loaded) => {
      if (cancelled) {
        loaded.dispose();
        return;
      }
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = 8;
      loaded.minFilter = THREE.LinearFilter;
      loaded.magFilter = THREE.LinearFilter;
      setCoverMap(loaded);
    });
    return () => {
      cancelled = true;
      tex.dispose();
    };
  }, [book.coverImageUrl]);

  useEffect(() => {
    fromPull.current = pull.current;
    fromTurn.current = turn.current;
    fromSpread.current = spread.current;
    startedAt.current = performance.now();
    opening.current = selected;
  }, [selected]);

  useFrame(() => {
    if (!root.current || !turnGroup.current || !frontHinge.current) {
      return;
    }
    const elapsed = performance.now() - startedAt.current;

    if (opening.current) {
      const pullU = easeOutQuart(clamp01(elapsed / PULL_DURATION_MS));
      const turnU = easeInOutCubic(
        clamp01((elapsed - PULL_DURATION_MS) / TURN_DURATION_MS),
      );
      const spreadU = easeOutCubic(
        clamp01(
          (elapsed - PULL_DURATION_MS - TURN_DURATION_MS) / SPREAD_DURATION_MS,
        ),
      );
      pull.current = fromPull.current + (1 - fromPull.current) * pullU;
      turn.current = fromTurn.current + (1 - fromTurn.current) * turnU;
      spread.current = fromSpread.current + (1 - fromSpread.current) * spreadU;
    } else {
      const closeU = easeInOutCubic(clamp01(elapsed / CLOSE_SPREAD_MS));
      const turnU = easeInOutCubic(
        clamp01((elapsed - CLOSE_SPREAD_MS) / TURN_BACK_MS),
      );
      const pushU = easeInOutCubic(
        clamp01((elapsed - CLOSE_SPREAD_MS - TURN_BACK_MS) / PUSH_DURATION_MS),
      );
      spread.current = fromSpread.current * (1 - closeU);
      turn.current = fromTurn.current * (1 - turnU);
      pull.current = fromPull.current * (1 - pushU);
    }

    let z = position[2] + pull.current * pullDist;
    const y = position[1] + pull.current * LIFT_DISTANCE;
    if (!selected && pull.current < 0.02 && hovered) {
      z = position[2] + HOVER_PULL;
    }

    const backFace = z - book.depth / 2;
    if (pull.current > 0.2 && backFace < FRONT_Z + CASE_CLEARANCE * 0.25) {
      z = FRONT_Z + CASE_CLEARANCE * 0.25 + book.depth / 2;
    }

    root.current.position.set(position[0], y, z);
    // Face the jacket toward the camera; spine ends on the viewer's left.
    turnGroup.current.rotation.y = -turn.current * (Math.PI / 2);
    // Hinge at the spine (+Z). Negative Y rotation swings the fore-edge
    // outward so the covers finish side by side, insides facing the camera.
    frontHinge.current.rotation.y = -spread.current * FRONT_OPEN;
  });

  const pageH = book.height * 0.96;
  const pageD = book.depth * 0.9;
  const jacketColor = coverMap ? "#ffffff" : book.palette.band;

  return (
    <group
      ref={root}
      position={position}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(book);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <group ref={turnGroup}>
        {/* Back cover — stays put; after the turn its inside faces the camera through the pages. */}
        <mesh position={[-(pagesT / 2 + coverT / 2), 0, 0]} castShadow>
          <boxGeometry args={[coverT, book.height, book.depth]} />
          <meshStandardMaterial
            attach="material-0"
            color="#f4ead4"
            roughness={0.88}
          />
          <meshStandardMaterial
            attach="material-1"
            color={cloth}
            roughness={0.58}
            metalness={0.02}
          />
          <meshStandardMaterial attach="material-2" color="#efe4cc" roughness={0.9} />
          <meshStandardMaterial attach="material-3" color="#e4d4b4" roughness={0.9} />
          <meshStandardMaterial
            attach="material-4"
            color={cloth}
            roughness={0.55}
            metalness={0.02}
          />
          <meshStandardMaterial attach="material-5" color="#f0e6d2" roughness={0.88} />
        </mesh>

        {/* Page block: +X is the right-hand page of the open spread. */}
        <mesh>
          <boxGeometry args={[pagesT, pageH, pageD]} />
          <meshStandardMaterial color="#f7f0de" roughness={0.92} />
        </mesh>
        {pageMap ? (
          <mesh position={[pagesT / 2 + 0.0015, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[book.depth * 0.9, book.height * 0.92]} />
            <meshStandardMaterial
              map={pageMap}
              color="#fffaf0"
              roughness={0.9}
              metalness={0}
            />
          </mesh>
        ) : null}

        {/* Spine strip + lettering (visible on the shelf; gutter when open). */}
        <mesh position={[0, 0, spineZ - 0.014]} castShadow>
          <boxGeometry args={[book.thickness * 0.98, book.height, 0.028]} />
          <meshStandardMaterial
            color={cloth}
            roughness={0.52}
            metalness={0.02}
            envMapIntensity={0.3}
          />
        </mesh>
        <mesh position={[0, 0, spineZ + 0.001]}>
          <planeGeometry args={[book.thickness * 0.94, book.height * 0.97]} />
          <meshStandardMaterial
            map={spineMap}
            color="#ffffff"
            roughness={0.46}
            metalness={0.01}
            emissive="#1a120c"
            emissiveIntensity={0.04}
          />
        </mesh>

        {/* Front cover hinged at the spine edge (local +Z). */}
        <group ref={frontHinge} position={[pagesT / 2, 0, spineZ]}>
          <mesh position={[coverT / 2, 0, -book.depth / 2]} castShadow>
            <boxGeometry args={[coverT, book.height, book.depth]} />
            <meshStandardMaterial
              attach="material-0"
              color={jacketColor}
              map={coverMap}
              roughness={0.48}
              metalness={0.02}
            />
            <meshStandardMaterial
              attach="material-1"
              color="#f4ead4"
              roughness={0.86}
            />
            <meshStandardMaterial attach="material-2" color="#efe4cc" roughness={0.9} />
            <meshStandardMaterial attach="material-3" color="#e4d4b4" roughness={0.9} />
            <meshStandardMaterial attach="material-4" color={cloth} roughness={0.55} />
            <meshStandardMaterial attach="material-5" color="#f0e6d2" roughness={0.88} />
          </mesh>
          {coverMap ? (
            <mesh
              position={[coverT + 0.0015, 0, -book.depth / 2]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <planeGeometry args={[book.depth * 0.96, book.height * 0.96]} />
              <meshStandardMaterial
                map={coverMap}
                color="#ffffff"
                roughness={0.46}
                metalness={0.02}
              />
            </mesh>
          ) : null}
          {pageMap ? (
            <mesh
              position={[-0.0015, 0, -book.depth / 2]}
              rotation={[0, -Math.PI / 2, 0]}
            >
              <planeGeometry args={[book.depth * 0.9, book.height * 0.92]} />
              <meshStandardMaterial
                map={pageMap}
                color="#fffaf0"
                roughness={0.9}
                metalness={0}
              />
            </mesh>
          ) : null}
        </group>
      </group>
    </group>
  );
}
