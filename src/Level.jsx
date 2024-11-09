import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useGameStore } from "./store/useGame.js";
import { BlocksTower } from "./components/BlocksTower.jsx";
import { MovingBlock } from "./components/MovingBlock.jsx";
import { ResidualBlock } from "./components/ResidualBlock.jsx";
import { MaxScoreLine } from "./components/MaxScoreLine.jsx";
import ValidatingBlock from "./components/ValidatingBlock.jsx";

export default function Level() {
  const blocks = useGameStore((state) => state.blocks);
  const score = useGameStore((state) => state.score);
  const mode = useGameStore((state) => state.mode);
  const residual = useGameStore((state) => state.residual);
  const setColor = useGameStore((state) => state.setColor);
  const perfectCount = useGameStore((state) => state.perfectCount);
  const userInfo = useGameStore((state) => state.userInfo);

  const { camera } = useThree();
  /**
   * Resize scale
   */
  const scale = blocks[blocks.length - 1].scale;
  const position = blocks[blocks.length - 1].position;

  /**
   * Camera
   */
  // const gl = useThree();

  useEffect(() => {
    camera.position.set(7, 8, 7);
  }, [camera]);

  const smoothedCameraYRef = useRef(8);
  useFrame(() => {
    const targetCameraY = 8 + score * 0.5;

    // Manual lerp, start to end with 0.1 intervals
    smoothedCameraYRef.current = THREE.MathUtils.lerp(
      smoothedCameraYRef.current,
      targetCameraY,
      0.1
    );

    camera.position.y = smoothedCameraYRef.current;
  });

  /**
   * Change color of blocks
   */
  useEffect(() => {
    if (mode === "ended") {
      const newRandomColor = Math.random() * 100;
      setColor(newRandomColor);
    }
  }, [mode]);

  return (
    <>
      <BlocksTower />

      {(mode === "playing" || mode === "validating") && (
        <MovingBlock
          position={[position[0], (score + 1) * 0.5, position[2]]}
          scale={scale}
        />
      )}

      {mode === "validating" && (
        <ValidatingBlock
          position={[position[0], (score + 1) * 0.5, position[2]]}
          scale={scale}
        />
      )}

      {residual &&
        residual.map((item, index) => {
          return <ResidualBlock key={index} {...item} />;
        })}

      {userInfo && userInfo.address !== "invited" && <MaxScoreLine />}
    </>
  );
}
