import * as THREE from "three";
export default function createResidueBlock(
  currentBlock,
  newBlock,
  difference,
  axis,
  score,
  color
) {
  // currentBlock properties are objects, newBlock's ones are arrays
  if (!newBlock) return null;
  if (difference === 0) return null;
  const axisIndex = axis === "x" ? 0 : 2;

  const newScale = [...currentBlock.scale];
  newScale[axisIndex] = newScale[axisIndex] - newBlock.scale[axisIndex];

  const newPosition = [...currentBlock.position];

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
