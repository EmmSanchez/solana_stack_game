import { useGameStore } from "../store/useGame.js";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import adjustBox from "../utils/adjustBox.js";
import createResidueBlock from "../utils/createResidueBlock.js";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

export function MovingBlock(props) {
  const block = useRef();

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

  /**
   * Movement
   */
  const { clock } = useThree();

  useFrame((state, delta) => {
    if (mode === "playing") {
      // To fix when is ended in 0 and restart
      block.current.position.y = (score + 1) * 0.5;

      const elapsedTime = state.clock.elapsedTime;

      if (score % 2 === 0) {
        block.current.position.x = Math.sin(elapsedTime * speed) * 6;
      } else {
        block.current.position.z = Math.sin(elapsedTime * speed) * 6;
      }
    }
  });

  useEffect(() => {
    if (mode === "validating") {
      const lastBlock = blocks[blocks.length - 1];
      const currentBlock = block.current;

      if (score % 2 === 0) {
        const { newBlock, meta } = adjustBox(
          currentBlock,
          lastBlock,
          "x",
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
          "x",
          score,
          color
        );

        setBlocks([...blocks, newBlock]);

        if (newResidualBlock) {
          setResidual([...residual, newResidualBlock]);
        }
      } else {
        const { newBlock, meta } = adjustBox(
          currentBlock,
          lastBlock,
          "z",
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
          "z",
          score,
          color
        );

        setBlocks([...blocks, newBlock]);

        if (newResidualBlock) {
          setResidual([...residual, newResidualBlock]);
        }
      }

      continuePlaying();
    }

    // Restart clock to 0 to change block position to default
    clock.elapsedTime = 4.8;
  }, [mode]);

  return (
    <>
      <mesh ref={block} geometry={boxGeometry} castShadow {...props}>
        <meshStandardMaterial
          color={`hsl(${(score - 1) * 14 + color}, 60%, 50%)`}
        />
      </mesh>
    </>
  );
}
