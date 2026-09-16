"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { BookMesh } from "@/components/shelf/book-mesh";
import { Bookcase } from "@/components/shelf/bookcase";
import { layoutBooks } from "@/lib/shelf-layout";
import type { Book } from "@/types/book";

type ShelfCanvasProps = {
  books: Book[];
  selectedId: number | null;
  onSelect: (book: Book) => void;
  onDeselect: () => void;
  onCreated?: () => void;
};

function Scene({
  books,
  selectedId,
  onSelect,
}: Omit<ShelfCanvasProps, "onDeselect">) {
  const placed = layoutBooks(books);

  return (
    <>
      <color attach="background" args={["#2a1c14"]} />
      <hemisphereLight args={["#fff1dd", "#5a3a24", 0.72]} />
      <ambientLight intensity={0.95} />
      <directionalLight
        position={[4.2, 7.5, 6]}
        intensity={1.7}
        color="#fff4e5"
      />
      <directionalLight
        position={[-5, 3.4, 4.2]}
        intensity={0.55}
        color="#ffc48a"
      />
      <spotLight
        position={[0, 6.8, 8]}
        angle={0.62}
        penumbra={0.75}
        intensity={0.42}
        color="#fff7ea"
      />
      <Bookcase />
      {placed.map(({ book, position }) => (
        <BookMesh
          key={book.id}
          book={book}
          position={position}
          selected={selectedId === book.id}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={11}
        maxDistance={20}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2.02}
        minAzimuthAngle={-0.5}
        maxAzimuthAngle={0.5}
        target={[0, 0.15, 0]}
      />
    </>
  );
}

export default function ShelfCanvas({
  books,
  selectedId,
  onSelect,
  onDeselect,
  onCreated,
}: ShelfCanvasProps) {
  return (
    <Canvas
      className="relative z-0 h-full w-full"
      style={{ zIndex: 0 }}
      camera={{ position: [0, 0.4, 15.2], fov: 32, near: 0.1, far: 60 }}
      dpr={1}
      onCreated={(state) => {
        state.gl.toneMapping = THREE.ACESFilmicToneMapping;
        state.gl.toneMappingExposure = 1.28;
        onCreated?.();
      }}
      onPointerMissed={() => {
        if (selectedId != null) return;
        onDeselect();
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
      }}
    >
      <Scene books={books} selectedId={selectedId} onSelect={onSelect} />
    </Canvas>
  );
}
