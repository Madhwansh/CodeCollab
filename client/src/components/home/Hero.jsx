import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
} from "framer-motion";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";

const COLORS_TOP = ["#000000", "#00000f", "#00f000", "#0ff000"];

const CyberCubes = ({ count = 100 }) => {
  const meshRef = useRef();

  // Pre-create geometry with rounded edges and compute its bounding sphere
  const geometry = useMemo(() => {
    const geo = new RoundedBoxGeometry(0.3, 0.3, 0.3, 8, 0.05);
    geo.computeBoundingSphere();
    return geo;
  }, []);

  // Initialize instance data
  const cubes = useRef(
    Array.from({ length: count }, () => ({
      position: [
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
      ],
      rotationSpeed: [
        Math.random() * 0.1,
        Math.random() * 0.1,
        Math.random() * 0.1,
      ],
      moveFactor: Math.random() * 0.5 + 0.5,
    }))
  );

  // Update instance transforms every frame
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    cubes.current.forEach((cube, i) => {
      const yOffset = Math.sin(time * cube.moveFactor + i) * 0.5;
      const quaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          time * cube.rotationSpeed[0],
          time * cube.rotationSpeed[1],
          time * cube.rotationSpeed[2]
        )
      );
      const matrix = new THREE.Matrix4().compose(
        new THREE.Vector3(
          cube.position[0],
          cube.position[1] + yOffset,
          cube.position[2]
        ),
        quaternion,
        new THREE.Vector3(0.25, 0.25, 0.25)
      );
      meshRef.current.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, count]}
      frustumCulled={false}
    >
      <meshStandardMaterial
        color="#0f0"
        emissive="#0f0"
        emissiveIntensity={1}
        transparent
        opacity={1.0}
        metalness={0.7}
        roughness={0.2}
      />
    </instancedMesh>
  );
};

export const AuroraHero = () => {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 12,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #000000 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative grid min-h-screen w-full place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <div className="relative z-10 flex flex-col items-center">
        <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
          Beta Now Live!
        </span>
        <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
          Collab and Code with your friends
        </h1>
        <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
          Experience the future of coding with our collaborative platform. Join
          forces with your friends and code together in real-time, no matter
          where
        </p>
        <motion.button
          style={{ border, boxShadow }}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
        >
          Lets Go !
          <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
        </motion.button>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <CyberCubes count={200} />
          <OrbitControls enableZoom={false} />
          <EffectComposer>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.1}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </motion.section>
  );
};
