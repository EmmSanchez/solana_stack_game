import { useGameStore } from "../store/useGame.js";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import adjustBox from "../utils/adjustBox.js";
import createResidueBlock from "../utils/createResidueBlock.js";
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

export default function ValidatingBlock() {
  return (
    <></>
    // <RigidBody
    //   ref={block}
    //   type="kinematicPosition"
    //   colliders={false}
    //   position={position}
    // >
    //   <mesh geometry={boxGeometry} castShadow receiveShadow scale={scale}>
    //     <meshStandardMaterial
    //       color={`hsl(${(score - 1) * 14 + color}, 60%, 50%)`}
    //     />
    //   </mesh>
    //   <CuboidCollider args={colliderSize} />
    // </RigidBody>
  );
}
