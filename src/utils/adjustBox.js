import * as THREE from "three";

export default function adjustBox(
  currentBlock,
  lastBlock,
  axis,
  score,
  color,
  colliderSize
) {
  const axisIndex = axis === "x" ? 0 : 2; // [x, y, z]

  const currentBlockPosition = currentBlock.translation();

  const currentBlockScale = [
    colliderSize[0] * 2,
    colliderSize[1] * 2,
    colliderSize[2] * 2,
  ];

  // LastBlock properties are array, currentBlock is an object
  const difference = lastBlock.position[axisIndex] - currentBlockPosition[axis];

  const halfCombinedWith =
    (lastBlock.scale[axisIndex] + currentBlockScale[axisIndex]) / 2;

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

  // console.log(currentBlockPosition);
  // console.log(currentBlockScale);

  const newPosition = [
    currentBlockPosition["x"],
    currentBlockPosition["y"],
    currentBlockPosition["z"],
  ];
  newPosition[axisIndex] += difference / 2;

  const newScale = [...currentBlockScale];
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
