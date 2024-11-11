import { Physics } from "@react-three/rapier";
import Level from "./Level.jsx";
import Lights from "./Lights.jsx";

export default function Experience() {
  /**
   * Gradient
   */
  return (
    <>
      <Physics>
        <Lights />
        <Level />
      </Physics>
    </>
  );
}
