"use client";

import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { makeSpineTexture } from "@/components/shelf/book-textures";
import {
  easeInOutCubic,
  easeOutCubic,
  HOVER_PULL,
  PULL_DISTANCE,
  PULL_DURATION_MS,
  PUSH_DURATION_MS,
} from "@/lib/shelf-case";
import type { Book } from "@/types/book";

type BookMeshProps = {
  book: Book;
  position: [number, number, number];
  selected: boolean;
  onSelect: (book: Book) => void;
};

export function BookMesh({ book, position, selected, onSelect }: BookMeshProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [spineMap, setSpineMap] = useState<THREE.CanvasTexture | null>(null);
  const fromZ = useRef(position[2]);
  const toZ = useRef(position[2]);
  const startedAt = useRef(0);
  const durationMs = useRef(PULL_DURATION_MS);
  const currentZ = useRef(position[2]);
  useCursor(hovered || selected);

  useEffect(() => {
    const texture = makeSpineTexture(book);
    setSpineMap(texture);
    return () => {
      texture.dispose();
    };
    // Spine art is fixed per title; ignore live critic-field identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id, book.title, book.palette.band]);

  useEffect(() => {
    fromZ.current = currentZ.current;
    toZ.current = position[2] + (selected ? PULL_DISTANCE : 0);
    startedAt.current = performance.now();
    durationMs.current = selected ? PULL_DURATION_MS : PUSH_DURATION_MS;
  }, [selected, position[2]]);

  useFrame(() => {
    if (!group.current) return;
    const elapsed = performance.now() - startedAt.current;
    const u = Math.min(1, elapsed / durationMs.current);
    const eased = selected ? easeOutCubic(u) : easeInOutCubic(u);
    let z = fromZ.current + (toZ.current - fromZ.current) * eased;
    if (!selected && u >= 1 && hovered) {
      z = position[2] + HOVER_PULL;
    }
    currentZ.current = z;
    group.current.position.set(position[0], position[1], z);
  });

  return (
    <group
      ref={group}
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
      <mesh>
        <boxGeometry args={[book.thickness, book.height, book.depth]} />
        <meshStandardMaterial
          attach="material-0"
          color={book.palette.paper}
          roughness={0.62}
        />
        <meshStandardMaterial
          attach="material-1"
          color={book.palette.cloth}
          roughness={0.72}
        />
        <meshStandardMaterial attach="material-2" color="#efe4cc" roughness={0.92} />
        <meshStandardMaterial attach="material-3" color="#e4d4b4" roughness={0.92} />
        <meshStandardMaterial
          attach="material-4"
          color={book.palette.band}
          map={spineMap}
          roughness={0.5}
          emissive={selected ? book.palette.band : "#000000"}
          emissiveIntensity={selected ? 0.22 : 0}
        />
        <meshStandardMaterial attach="material-5" color="#f0e6d2" roughness={0.88} />
      </mesh>
    </group>
  );
}
