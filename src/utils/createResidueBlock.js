import * as THREE from "three";
export default function createResidueBlock(
  currentBlock,
  newBlock,
  difference,
  axis,
  score,
  color,
  colliderSize
) {
  // currentBlock properties are objects, newBlock's ones are arrays
  if (!newBlock) return null;
  if (difference === 0) return null;
  const axisIndex = axis === "x" ? 0 : 2;

  const currentBlockPosition = currentBlock.translation();

  const currentBlockScale = [
    colliderSize[0] * 2,
    colliderSize[1] * 2,
    colliderSize[2] * 2,
  ];

  const newScale = [...currentBlockScale];
  newScale[axisIndex] = newScale[axisIndex] - newBlock.scale[axisIndex];

  const newPosition = [
    currentBlockPosition["x"],
    currentBlockPosition["y"],
    currentBlockPosition["z"],
  ];

  if (difference > 0) {
    newPosition[axisIndex] -= 0.05 + newBlock.scale[axisIndex] / 2;
  } else {
    newPosition[axisIndex] += 0.05 + newBlock.scale[axisIndex] / 2;
  }

  return {
    position: newPosition,
    scale: newScale,
    color: new THREE.Color(`hsl(${(score - 1) * 14 + color}, 60%, 50%)`),
  };
}
