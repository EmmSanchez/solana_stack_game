import * as THREE from "three";

export default function adjustBox(currentBlock, lastBlock, axis, score, color) {
  const axisIndex = axis === "x" ? 0 : 2; // [x, y, z]

  // LastBlock properties are array, currentBlock is an object
  const difference =
    lastBlock.position[axisIndex] - currentBlock.position[axis];
  const halfCombinedWith =
    (lastBlock.scale[axisIndex] + currentBlock.scale[axis]) / 2;

  if (Math.abs(difference) > halfCombinedWith) {
    return {};
  }

  // if (Math.abs(difference) < 0.1) {
  //   const newPosition = [...lastBlock.position];
  //   newPosition[1] = (score + 1) * 0.5;

  //   console.log("Perfect!");

  //   return {
  //     newBlock: {
  //       key: "instance_" + (score + 1),
  //       position: newPosition,
  //       scale: currentBlock.scale,
  //       color: new THREE.Color(`hsl(${(score - 1) * 14 + color}, 60%, 50%)`),
  //     },
  //     meta: {
  //       difference: 0,
  //     },
  //   };
  // }

  const newPosition = [...currentBlock.position];
  newPosition[axisIndex] += difference / 2;

  const newScale = [...currentBlock.scale];
  newScale[axisIndex] -= Math.abs(difference);

  return {
    newBlock: {
      key: "instance_" + (score + 1),
      position: newPosition,
      scale: newScale,
      color: new THREE.Color(`hsl(${(score - 1) * 14 + color}, 60%, 50%)`),
    },
    meta: {
      difference: difference,
    },
  };
}
