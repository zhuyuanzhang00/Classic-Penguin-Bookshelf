"use client";

function Wood({
  args,
  position,
}: {
  args: [number, number, number];
  position: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#5c3317" roughness={0.84} metalness={0.04} />
    </mesh>
  );
}

function Trim({
  args,
  position,
}: {
  args: [number, number, number];
  position: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#3b2112" roughness={0.7} />
    </mesh>
  );
}

export function Bookcase() {
  return (
    <group>
      <Wood args={[6.2, 7.15, 0.14]} position={[0, 0.15, -0.78]} />
      <Wood args={[0.2, 7.15, 1.55]} position={[-3.1, 0.15, -0.08]} />
      <Wood args={[0.2, 7.15, 1.55]} position={[3.1, 0.15, -0.08]} />
      <Wood args={[6.4, 0.22, 1.62]} position={[0, 3.66, -0.05]} />
      <Wood args={[6.4, 0.28, 1.7]} position={[0, -3.48, 0]} />
      <Wood args={[5.92, 0.12, 1.42]} position={[0, 2.18, -0.08]} />
      <Wood args={[5.92, 0.12, 1.42]} position={[0, -0.02, -0.08]} />
      <Wood args={[5.92, 0.12, 1.42]} position={[0, -2.22, -0.08]} />
      <Trim args={[6.5, 0.08, 1.76]} position={[0, 3.8, 0.02]} />
      <mesh position={[0, 0.15, -0.7]}>
        <planeGeometry args={[5.9, 6.8]} />
        <meshStandardMaterial color="#2a160e" roughness={0.95} />
      </mesh>
    </group>
  );
}
