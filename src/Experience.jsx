import { Physics } from "@react-three/rapier";
import Level from "./Level.jsx";
import Lights from "./Lights.jsx";

export default function Experience() {
  return (
    <>
      <Physics>
        <Lights />
        <Level />
      </Physics>
    </>
  );
}
