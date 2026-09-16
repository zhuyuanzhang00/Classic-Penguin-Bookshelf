"use client";

import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { makeSpineTexture } from "@/components/shelf/book-textures";
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

  useFrame((_, delta) => {
    if (!group.current) return;
    const pull = selected ? 0.42 : hovered ? 0.2 : 0;
    group.current.position.x = position[0];
    group.current.position.y = position[1];
    group.current.position.z = THREE.MathUtils.damp(
      group.current.position.z,
      position[2] + pull,
      8,
      delta,
    );
  });

  return (
    <group
      ref={group}
      position={position}
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
        />
        <meshStandardMaterial attach="material-5" color="#f0e6d2" roughness={0.88} />
      </mesh>
    </group>
  );
}
