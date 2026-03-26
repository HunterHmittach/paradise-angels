"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";

/* ============================= */
/* ROOT GENERATOR                */
/* ============================= */

function generateRoots(count: number) {
  const roots: THREE.Vector3[][] = [];

  for (let i = 0; i < count; i++) {
    const points: THREE.Vector3[] = [];

    const angle = (i / count) * Math.PI * 2;
    let x = 0;
    let y = 0;

    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);

    for (let j = 0; j < 25; j++) {
      x += dirX * (0.25 + Math.random() * 0.15);
      y += dirY * (0.25 + Math.random() * 0.15);

      x += (Math.random() - 0.5) * 0.3;
      y += (Math.random() - 0.5) * 0.3;

      points.push(new THREE.Vector3(x, y, 0));
    }

    roots.push(points);
  }

  return roots;
}

/* ============================= */
/* ROOT SYSTEM                   */
/* ============================= */

function RootSystem({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const roots = useMemo(() => generateRoots(14), []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = progress * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {roots.map((points, i) => {
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, 120, 0.02, 8, false);

        return (
          <mesh key={i} geometry={geometry}>
            <meshStandardMaterial
              color="#f5f4ef"
              emissive="#f5f4ef"
              emissiveIntensity={1.2 * progress}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ============================= */
/* MARBLE BACKGROUND             */
/* ============================= */

function MarblePlane({ progress }: { progress: number }) {
  return (
    <mesh position={[0, 0, -0.5]}>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial
        color="#f4f3ef"
        transparent
        opacity={progress}
        roughness={0.6}
        metalness={0.05}
      />
    </mesh>
  );
}

/* ============================= */
/* SCENE                         */
/* ============================= */

function Scene({ progress }: { progress: number }) {
  const camRef = useRef<THREE.PerspectiveCamera>(null!);

  useFrame(() => {
    if (camRef.current) {
      const targetZ = 6 - progress * 2;
      camRef.current.position.z = THREE.MathUtils.lerp(
        camRef.current.position.z,
        targetZ,
        0.05
      );
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        position={[0, 0, 6]}
        fov={45}
      />

      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 5]} intensity={1.5} />

      <RootSystem progress={progress} />
      <MarblePlane progress={progress} />

      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
}

/* ============================= */
/* ARRIVAL LAYER                 */
/* ============================= */

export default function ArrivalLayer() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const played = sessionStorage.getItem("pa_cinematic_v1");

    if (!played) {
      setShow(true);
      sessionStorage.setItem("pa_cinematic_v1", "true");
      document.body.style.overflow = "hidden";

      let start: number | null = null;

      const animate = (time: number) => {
        if (!start) start = time;
        const elapsed = time - start;
        let p = Math.min(elapsed / 5000, 1);

        // Versnel eerste helft
        if (p < 0.5) {
        p = p * 1.6;
        }
        setProgress(p);

        if (p < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(() => {
            document.body.style.overflow = "";
            setShow(false);
          }, 400);
        }
      };

      requestAnimationFrame(animate);
    }
  }, []);

  if (!show) return null;

  return (
  <div className="fixed inset-0 z-[999] bg-black">
    <Canvas>
      <Scene progress={progress} />
    </Canvas>

    {/* LOGO REVEAL */}
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        opacity: progress > 0.6 ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <div className="text-center leading-[0.9]">
        <div
          className="font-serif tracking-[0.12em] text-6xl md:text-8xl"
          style={{
            color: progress > 0.8 ? "#111" : "#f5f4ef",
            transition: "color 0.6s ease",
          }}
        >
          PARADISE
        </div>

        <div
          className="font-serif tracking-[0.12em] text-6xl md:text-8xl mt-4"
          style={{
            color: progress > 0.8 ? "#111" : "#f5f4ef",
            transition: "color 0.6s ease",
          }}
        >
          ANGELS
        </div>
      </div>
    </div>
  </div>
);
}