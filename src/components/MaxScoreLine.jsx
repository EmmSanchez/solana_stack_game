import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGame.js";
import { Center, Text3D, useMatcapTexture } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

function WordWithPhysics() {
  const userInfo = useGameStore((state) => state.userInfo);
  const letterSpacing = 0.35;

  const [matcapTexture] = useMatcapTexture("D1AC04_F8E50A_EDD004_B38D04", 128);

  return (
    <>
      <RigidBody
        key={"1"}
        type="dynamic"
        position={[0, userInfo.max_score * 0.5 + 0.2, 0]}
        colliders={false}
      >
        <Text3D
          font={"./fonts/Quicksand-VariableFont_wght.json"}
          rotation={[0, Math.PI / 4, 0]}
          size={0.45}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.04}
          bevelOffset={0.01}
          bevelSegments={5}
          letterSpacing={0.06}
          castShadow
          receiveShadow
        >
          R
          <meshMatcapMaterial matcap={matcapTexture} />
          <CuboidCollider
            args={[0.2, 0.27, 0.1]}
            position={[0.22, 0.22, 0.07]}
          />
        </Text3D>
      </RigidBody>
      <RigidBody
        key={"2"}
        type="dynamic"
        position={[
          letterSpacing * 0.95,
          userInfo.max_score * 0.5 + 0.2,
          -letterSpacing * 0.95,
        ]}
        colliders={false}
      >
        <Text3D
          font={"./fonts/Quicksand-VariableFont_wght.json"}
          rotation={[0, Math.PI / 4, 0]}
          size={0.45}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.04}
          bevelOffset={0.01}
          bevelSegments={5}
          letterSpacing={0.06}
          castShadow
          receiveShadow
        >
          e
          <meshMatcapMaterial matcap={matcapTexture} />
          <CuboidCollider
            args={[0.2, 0.22, 0.1]}
            position={[0.18, 0.17, 0.08]}
          />
        </Text3D>
      </RigidBody>
      <RigidBody
        key={"3"}
        type="dynamic"
        position={[
          letterSpacing * 1.8,
          userInfo.max_score * 0.5 + 0.2,
          -letterSpacing * 1.8,
        ]}
        colliders={false}
      >
        <Text3D
          font={"./fonts/Quicksand-VariableFont_wght.json"}
          rotation={[0, Math.PI / 4, 0]}
          size={0.45}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.04}
          bevelOffset={0.01}
          bevelSegments={5}
          letterSpacing={0.06}
          castShadow
          receiveShadow
        >
          c
          <meshMatcapMaterial matcap={matcapTexture} />
          <CuboidCollider
            args={[0.18, 0.22, 0.1]}
            position={[0.18, 0.17, 0.08]}
          />
        </Text3D>
      </RigidBody>
      <RigidBody
        key={"4"}
        type="dynamic"
        position={[
          letterSpacing * 2.6,
          userInfo.max_score * 0.5 + 0.2,
          -letterSpacing * 2.6,
        ]}
        colliders={false}
      >
        <Text3D
          font={"./fonts/Quicksand-VariableFont_wght.json"}
          rotation={[0, Math.PI / 4, 0]}
          size={0.45}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.04}
          bevelOffset={0.01}
          bevelSegments={5}
          letterSpacing={0.06}
          castShadow
          receiveShadow
        >
          o
          <meshMatcapMaterial matcap={matcapTexture} />
          <CuboidCollider
            args={[0.2, 0.22, 0.1]}
            position={[0.18, 0.17, 0.08]}
          />
        </Text3D>
      </RigidBody>
      <RigidBody
        key={"5"}
        type="dynamic"
        position={[
          letterSpacing * 3.45,
          userInfo.max_score * 0.5 + 0.2,
          -letterSpacing * 3.45,
        ]}
        colliders={false}
      >
        <Text3D
          font={"./fonts/Quicksand-VariableFont_wght.json"}
          rotation={[0, Math.PI / 4, 0]}
          size={0.45}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.04}
          bevelOffset={0.01}
          bevelSegments={5}
          letterSpacing={0.06}
          castShadow
          receiveShadow
        >
          r
          <meshMatcapMaterial matcap={matcapTexture} />
          <CuboidCollider
            args={[0.14, 0.22, 0.1]}
            position={[0.13, 0.17, 0.08]}
          />
        </Text3D>
      </RigidBody>
      <RigidBody
        key={"6"}
        type="dynamic"
        position={[
          letterSpacing * 4.05,
          userInfo.max_score * 0.5 + 0.2,
          -letterSpacing * 4.05,
        ]}
        colliders={false}
      >
        <Text3D
          font={"./fonts/Quicksand-VariableFont_wght.json"}
          rotation={[0, Math.PI / 4, 0]}
          size={0.45}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.04}
          bevelOffset={0.01}
          bevelSegments={5}
          letterSpacing={0.06}
          castShadow
          receiveShadow
        >
          d
          <meshMatcapMaterial matcap={matcapTexture} />
          <CuboidCollider
            args={[0.2, 0.28, 0.1]}
            position={[0.18, 0.22, 0.08]}
          />
        </Text3D>
      </RigidBody>
    </>
  );
}

export function MaxScoreLine() {
  const userInfo = useGameStore((state) => state.userInfo);
  const score = useGameStore((state) => state.score);
  const [isDynamic, setIsDynamic] = useState(false);

  const [matcapTexture] = useMatcapTexture("D1AC04_F8E50A_EDD004_B38D04", 128);

  useEffect(() => {
    if (userInfo.max_score > score + 1) {
      setIsDynamic(false);
      return;
    }

    const dynamic = userInfo.max_score <= score + 1;
    setIsDynamic(dynamic);
  }, [score]);

  return (
    <>
      {!isDynamic ? (
        <>
          <Center position={[0, userInfo.max_score * 0.5 + 0.2, 0]}>
            <Text3D
              font={"./fonts/Quicksand-VariableFont_wght.json"}
              rotation={[0, Math.PI / 4, 0]}
              size={0.45}
              height={0.15}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.04}
              bevelOffset={0.01}
              bevelSegments={5}
              letterSpacing={0.06}
              castShadow
            >
              Record
              <meshMatcapMaterial matcap={matcapTexture} />
            </Text3D>
          </Center>
        </>
      ) : (
        <>
          <Center>
            <WordWithPhysics />
          </Center>
        </>
      )}
    </>
  );
}
