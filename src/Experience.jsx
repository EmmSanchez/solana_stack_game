import { Physics } from "@react-three/rapier";
import Level from "./Level.jsx";
import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import { Perf } from "r3f-perf";

export default function Experience() {
  return (
    <>
      {/* <Perf position="top-left" /> */}

      {/* <OrbitControls /> */}

      <Physics debug>
        <Lights />
        <Level />
      </Physics>
    </>
  );
}
