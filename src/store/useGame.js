import { create } from "zustand";

const INITAL_SPEED = 1;
const INITAL_SCORE = 0;
const INITIAL_BLOCK = {
  position: [0, 0, 0],
  color: "#333fff",
  scale: [4, 0.5, 4],
};
const RANDOM_COLOR = Math.random() * 100;
const INTIAL_PERFECT_COUNT = 0;
const MODES = {
  READY: "ready",
  PLAYING: "playing",
  VALIDATING: "validating",
  ENDED: "ended",
};

export const useGameStore = create((set) => {
  return {
    userInfo: null,
    setUserInfo: (value) => {
      set({ userInfo: value });
    },
    speed: INITAL_SPEED,
    score: INITAL_SCORE,
    color: RANDOM_COLOR,
    setColor: (value) => {
      set({ color: value });
    },
    blocks: [INITIAL_BLOCK],
    setBlocks: (value) => {
      set({ blocks: value });
    },
    residual: [],
    setResidual: (value) => {
      set({ residual: value });
    },
    perfectCount: INTIAL_PERFECT_COUNT,
    increasePerfectCount: () => {
      set((state) => ({ perfectCount: state.perfectCount + 1 }));
    },
    resetPerfectCount: () => {
      set({ perfectCount: INTIAL_PERFECT_COUNT });
    },
    mode: MODES.READY,
    setScore: (value) => {
      set({ score: value });
    },
    start: () => {
      set((state) => {
        if (state.mode === MODES.READY) {
          return { mode: MODES.PLAYING, score: INITAL_SCORE };
        } else {
          return {};
        }
      });
    },
    validating: () => {
      set((state) => {
        if (state.mode === MODES.PLAYING) {
          return { mode: MODES.VALIDATING };
        } else {
          return {};
        }
      });
    },
    continuePlaying: () => {
      set((state) => {
        if (state.mode === MODES.VALIDATING) {
          return { mode: MODES.PLAYING, score: state.score + 1 };
        } else {
          return {};
        }
      });
    },
    restart: () => {
      set((state) => {
        if (state.mode === "playing" || state.mode === "ended") {
          return {
            blocks: [INITIAL_BLOCK],
            speed: INITAL_SPEED,
            mode: MODES.PLAYING,
            score: INITAL_SCORE,
            residual: [],
          };
        }
      });
    },
    home: () => {
      set((state) => {
        if (state.mode === "ended") {
          return {
            blocks: [INITIAL_BLOCK],
            speed: INITAL_SPEED,
            mode: MODES.READY,
            score: INITAL_SCORE,
            residual: [],
          };
        }
      });
    },
    end: () => {
      set((state) => {
        if (state.mode === MODES.VALIDATING) {
          return { mode: MODES.ENDED };
        } else {
          return {};
        }
      });
    },
  };
});
