import { useGameStore } from "../store/useGame.js";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import adjustBox from "../utils/adjustBox.js";
import createResidueBlock from "../utils/createResidueBlock.js";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

export function MovingBlock({ position, scale }) {
  const block = useRef();
  const meshBlock = useRef();

  const blocks = useGameStore((state) => state.blocks);
  const setBlocks = useGameStore((state) => state.setBlocks);
  const residual = useGameStore((state) => state.residual);
  const setResidual = useGameStore((state) => state.setResidual);

  const score = useGameStore((state) => state.score);
  const speed = useGameStore((state) => state.speed);
  const color = useGameStore((state) => state.color);
  const perfectCount = useGameStore((state) => state.perfectCount);
  const resetPerfectCount = useGameStore((state) => state.resetPerfectCount);
  const increasePerfectCount = useGameStore(
    (state) => state.increasePerfectCount
  );
  const mode = useGameStore((state) => state.mode);
  const continuePlaying = useGameStore((state) => state.continuePlaying);
  const end = useGameStore((state) => state.end);

  const colliderSize = [scale[0] / 2, scale[1] / 2, scale[2] / 2];

  /**
   * Movement
   */
  const { clock } = useThree();

  useFrame((state, delta) => {
    const elapsedTime = state.clock.elapsedTime;
    if (mode === "playing") {
      // Move oscilation of mesh
      meshBlock.current.position.y = (score + 1) * 0.5;

      if (score % 2 === 0) {
        meshBlock.current.position.x = -Math.cos(elapsedTime * speed) * 6;
      } else {
        meshBlock.current.position.z = -Math.cos(elapsedTime * speed) * 6;
      }

      // Move oscilation of collider
      block.current.setNextKinematicTranslation({
        x:
          score % 2 === 0
            ? -Math.cos(elapsedTime * 1) * 6
            : block.current.translation().x,
        y: (score + 1) * 0.5,
        z:
          score % 2 !== 0
            ? -Math.cos(elapsedTime * 1) * 6
            : block.current.translation().z,
      });
    }
  });

  useEffect(() => {
    if (mode === "validating") {
      const lastBlock = blocks[blocks.length - 1];
      const currentBlock = meshBlock.current;

      const adjustAxis = score % 2 === 0 ? "x" : "z";
      const { newBlock, meta } = adjustBox(
        currentBlock,
        lastBlock,
        adjustAxis,
        score,
        color
      );

      if (!newBlock) {
        const finalBlock = {
          position: currentBlock.position,
          scale: currentBlock.scale,
          color: currentBlock.material.color,
        };

        setResidual([...residual, finalBlock]);
        return end();
      }

      if (meta.difference === 0) {
        increasePerfectCount();
      } else {
        resetPerfectCount();
      }

      const newResidualBlock = createResidueBlock(
        currentBlock,
        newBlock,
        meta.difference,
        adjustAxis,
        score,
        color
      );

      setBlocks([...blocks, newBlock]);

      if (newResidualBlock) {
        setResidual([...residual, newResidualBlock]);
      }

      continuePlaying();
    }
    clock.elapsedTime = 0;
  }, [mode]);

  return (
    <>
      {/* Mesh Block */}
      <mesh
        ref={meshBlock}
        geometry={boxGeometry}
        castShadow
        position={position}
        scale={scale}
      >
        <meshStandardMaterial
          color={`hsl(${(score - 1) * 14 + color}, 60%, 50%)`}
        />
      </mesh>

      {/* Collider */}
      <RigidBody
        ref={block}
        type="kinematicPosition"
        colliders={false}
        position={position}
      >
        <CuboidCollider args={colliderSize} />
      </RigidBody>
    </>
  );
}
