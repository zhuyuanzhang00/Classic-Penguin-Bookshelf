"use client";

import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { makeSpineTexture, spineCloth } from "@/components/shelf/book-textures";
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

const FRONT_OPEN = Math.PI * 0.82;
const BACK_OPEN = Math.PI * 0.22;
const PAGE_FAN = 0.16;

function coverThickness(book: Book) {
  return Math.max(0.018, Math.min(0.038, book.thickness * 0.17));
}

export function BookMesh({ book, position, selected, onSelect }: BookMeshProps) {
  const root = useRef<THREE.Group>(null);
  const turnGroup = useRef<THREE.Group>(null);
  const frontHinge = useRef<THREE.Group>(null);
  const backHinge = useRef<THREE.Group>(null);
  const pageLeaves = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [spineMap, setSpineMap] = useState<THREE.CanvasTexture | null>(null);
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
    if (!root.current || !turnGroup.current || !frontHinge.current || !backHinge.current) {
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
    turnGroup.current.rotation.y = -turn.current * (Math.PI / 2);
    frontHinge.current.rotation.y = -spread.current * FRONT_OPEN;
    backHinge.current.rotation.y = spread.current * BACK_OPEN;
    if (pageLeaves.current) {
      pageLeaves.current.children.forEach((leaf, index) => {
        leaf.rotation.y = (index - 1) * spread.current * PAGE_FAN;
      });
    }
  });

  const pageW = pagesT * 0.92;
  const pageH = book.height * 0.96;
  const pageD = book.depth * 0.92;

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
        <group ref={backHinge} position={[-pagesT / 2, 0, 0]}>
          <mesh position={[-coverT / 2, 0, 0]} castShadow>
            <boxGeometry args={[coverT, book.height, book.depth]} />
            <meshStandardMaterial
              attach="material-0"
              color={book.palette.paper}
              roughness={0.7}
            />
            <meshStandardMaterial attach="material-1" color={cloth} roughness={0.62} />
            <meshStandardMaterial attach="material-2" color="#efe4cc" roughness={0.9} />
            <meshStandardMaterial attach="material-3" color="#e4d4b4" roughness={0.9} />
            <meshStandardMaterial attach="material-4" color={cloth} roughness={0.6} />
            <meshStandardMaterial attach="material-5" color="#f0e6d2" roughness={0.88} />
          </mesh>
        </group>

        <group ref={pageLeaves}>
          {[-0.28, 0, 0.28].map((offset, index) => (
            <mesh key={index} position={[offset * pagesT * 0.15, 0, 0]}>
              <boxGeometry args={[pageW / 3, pageH, pageD]} />
              <meshStandardMaterial color="#f7edd8" roughness={0.92} />
            </mesh>
          ))}
        </group>

        <group ref={frontHinge} position={[pagesT / 2, 0, 0]}>
          <mesh position={[coverT / 2, 0, 0]} castShadow>
            <boxGeometry args={[coverT, book.height, book.depth]} />
            <meshStandardMaterial
              attach="material-0"
              color={book.palette.band}
              map={coverMap}
              roughness={0.48}
            />
            <meshStandardMaterial
              attach="material-1"
              color={book.palette.paper}
              roughness={0.72}
            />
            <meshStandardMaterial attach="material-2" color="#efe4cc" roughness={0.9} />
            <meshStandardMaterial attach="material-3" color="#e4d4b4" roughness={0.9} />
            <meshStandardMaterial attach="material-4" color={cloth} roughness={0.6} />
            <meshStandardMaterial attach="material-5" color="#f0e6d2" roughness={0.88} />
          </mesh>
          <mesh
            position={[coverT + 0.0015, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[book.depth * 0.96, book.height * 0.96]} />
            <meshStandardMaterial
              map={coverMap}
              color={book.palette.band}
              roughness={0.46}
              metalness={0.02}
            />
          </mesh>
        </group>

        <mesh position={[0, 0, book.depth / 2 - 0.014]}>
          <boxGeometry args={[book.thickness * 0.98, book.height, 0.028]} />
          <meshStandardMaterial color={cloth} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, book.depth / 2 + 0.001]}>
          <planeGeometry args={[book.thickness * 0.94, book.height * 0.97]} />
          <meshStandardMaterial
            map={spineMap}
            color={cloth}
            roughness={0.42}
            emissive={selected ? cloth : "#000000"}
            emissiveIntensity={selected ? 0.1 : 0}
          />
        </mesh>
      </group>
    </group>
  );
}
