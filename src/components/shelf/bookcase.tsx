"use client";

import { Component, Suspense, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { CASE_SCALE, KENNEY_CENTER } from "@/lib/shelf-case";
import { kenneyBookcaseObjectUrl } from "@/lib/kenney-bookcase-url";

function ProceduralBookcase() {
  const wood = "#d4a76c";
  const dark = "#8b5a2b";
  const s = CASE_SCALE;
  const cx = KENNEY_CENTER.x;
  const cy = KENNEY_CENTER.y;
  const cz = KENNEY_CENTER.z;

  function Box({
    args,
    pos,
    color = wood,
  }: {
    args: [number, number, number];
    pos: [number, number, number];
    color?: string;
  }) {
    return (
      <mesh
        position={[
          (pos[0] - cx) * s,
          (pos[1] - cy) * s,
          (pos[2] - cz) * s,
        ]}
        scale={s}
      >
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} roughness={0.72} metalness={0.04} />
      </mesh>
    );
  }

  return (
    <group>
      <Box args={[4, 8.8, 0.3]} pos={[-2, 4.4, 0.15]} color={dark} />
      <Box args={[0.4, 8.8, 2.5]} pos={[-3.8, 4.4, 1.25]} />
      <Box args={[0.4, 8.8, 2.5]} pos={[-0.2, 4.4, 1.25]} />
      <Box args={[4, 0.3, 2.5]} pos={[-2, 0.15, 1.25]} color={dark} />
      <Box args={[4, 0.3, 2.5]} pos={[-2, 8.65, 1.25]} color={dark} />
      <Box args={[3.6, 0.3, 2.1]} pos={[-2, 1.15, 1.25]} />
      <Box args={[3.6, 0.3, 2.1]} pos={[-2, 3.55, 1.25]} />
      <Box args={[3.6, 0.3, 2.1]} pos={[-2, 5.95, 1.25]} />
      <Box args={[3.6, 0.3, 2.1]} pos={[-2, 8.35, 1.25]} />
    </group>
  );
}

class CaseErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function KenneyBookcase() {
  const url = useMemo(() => kenneyBookcaseObjectUrl(), []);
  const { scene } = useGLTF(url);

  const clone = useMemo(() => {
    const next = scene.clone(true);
    next.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material;
        if (material && !Array.isArray(material)) {
          material.roughness = 0.78;
          material.metalness = 0.05;
        }
      }
    });
    return next;
  }, [scene]);

  return (
    <group
      scale={CASE_SCALE}
      position={[
        -KENNEY_CENTER.x * CASE_SCALE,
        -KENNEY_CENTER.y * CASE_SCALE,
        -KENNEY_CENTER.z * CASE_SCALE,
      ]}
    >
      <primitive object={clone} />
    </group>
  );
}

export function Bookcase() {
  return (
    <CaseErrorBoundary fallback={<ProceduralBookcase />}>
      <Suspense fallback={<ProceduralBookcase />}>
        <KenneyBookcase />
      </Suspense>
    </CaseErrorBoundary>
  );
}
