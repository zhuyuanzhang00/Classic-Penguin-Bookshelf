"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
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

function Scene({ books, selectedId, onSelect }: Omit<ShelfCanvasProps, "onDeselect">) {
  const placed = layoutBooks(books);

  return (
    <>
      <color attach="background" args={["#140c09"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3.5, 6, 5]} intensity={1.35} color="#ffe1c2" />
      <directionalLight position={[-4, 2, 3]} intensity={0.35} color="#ff7a3c" />
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
        minDistance={6}
        maxDistance={14}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.05}
        minAzimuthAngle={-0.55}
        maxAzimuthAngle={0.55}
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
      className="h-full w-full"
      camera={{ position: [0, 0.55, 8.4], fov: 38, near: 0.1, far: 40 }}
      dpr={1}
      onCreated={() => onCreated?.()}
      onPointerMissed={onDeselect}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
      }}
    >
      <Scene books={books} selectedId={selectedId} onSelect={onSelect} />
    </Canvas>
  );
}
