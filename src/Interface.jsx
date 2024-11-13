import { useGameStore } from "./store/useGame";
import { useEffect, useState } from "react";
import {
  ChartIcon,
  CrownIcon,
  HomeIcon,
  LogoutIcon,
  Restart,
  SolanaIcon,
  TelegramIcon,
  WalletIcon,
  XIcon,
} from "./assets/icons/interfaceIcons";
import { motion, AnimatePresence, easeIn, easeOut } from "framer-motion";
// import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

// const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

function Interface() {
  const [users, setUsers] = useState([]);
  const [solanaPrice, setSolanaPrice] = useState(0);

  const mode = useGameStore((state) => state.mode);
  const start = useGameStore((state) => state.start);
  const score = useGameStore((state) => state.score);
  const validating = useGameStore((state) => state.validating);
  const restart = useGameStore((state) => state.restart);
  const home = useGameStore((state) => state.home);
  const leaderboard = useGameStore((state) => state.leaderboard);
  // const perfectCount = useGameStore((state) => state.perfectCount);

  const userInfo = useGameStore((state) => state.userInfo);
  const setUserInfo = useGameStore((state) => state.setUserInfo);

  const handleStart = () => {
    start();
  };

  const handleCheckResult = () => {
    validating();
  };

  const handleRestart = () => {
    restart();
  };

  const handleGoToHome = () => {
    home();
  };

  const handleGoToLeaderboard = () => {
    leaderboard();
  };

  const handleConnectWallet = async () => {
    const verifyWallet = async (address) => {
      const res = await fetch(
        `https://solanastackgameapi-production-b8e7.up.railway.app/player?id=${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (data.message === "User not found") {
        return null;
      }

      if (users) {
        const index = users.findIndex((user) => user.address === address) + 1;
        const newInfo = {
          rank: index,
          address: data[0].address,
          max_score: data[0].max_score,
        };
        setUserInfo(newInfo);
      }

      return data;
    };

    const registerWallet = async (address, score = 0) => {
      const res = await fetch(
        "https://solanastackgameapi-production-b8e7.up.railway.app/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: address,
            score: score,
          }),
        }
      );

      const { success } = await res.json();

      if (success) {
        const newUserInfo = {
          address: address,
          max_score: score,
        };
        setUserInfo(newUserInfo);
      }
    };

    try {
      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();

      // Check if is already registered
      const res = await verifyWallet(publicKey);
      if (res) {
        // Check if the new result is higher than max_score
        if (score > userInfo.max_score) {
          updateMaxScore(userInfo.address, score);
          const newUserInfo = {
            address: userInfo.address,
            max_score: score,
          };
          setUserInfo(newUserInfo);
        }
      } else if (!res) {
        // Register new wallet
        const res = await registerWallet(publicKey, score);
      }

      return;
    } catch (error) {
      console.error("Connection to Phantom wallet failed:", error);
    }
  };

  const handleDisconnectWallet = async () => {
    await window.solana.disconnect();

    const INITIAL_USER_INFO = {
      rank: null,
      address: "invited",
      max_score: 0,
    };
    setUserInfo(INITIAL_USER_INFO);
  };

  useEffect(() => {
    const fetchRanking = async () => {
      const res = await fetch(
        "https://solanastackgameapi-production-b8e7.up.railway.app/ranking?limit=0&offset=0",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const players = await res.json();
      const mappedPlayers = players.map((player, index) => ({
        rank: index + 1,
        address: player.address,
        max_score: player.max_score,
      }));
      setUsers(mappedPlayers);
    };

    const getSolanaPrice = async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const { solana } = await res.json();
      const newPrice = solana.usd;
      setSolanaPrice(newPrice);
    };

    fetchRanking();
    getSolanaPrice();
  }, []);

  const updateMaxScore = async (address, newScore) => {
    await fetch(
      "https://solanastackgameapi-production-b8e7.up.railway.app/player/update-score",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: address,
          score: newScore,
        }),
      }
    );
  };

  useEffect(() => {
    const updateScore = async () => {
      await updateMaxScore(userInfo.address, score);
    };

    if (mode === "ended") {
      if (userInfo) {
        if (score > userInfo.max_score) {
          updateScore();
          const newUserInfo = {
            address: userInfo.address,
            max_score: score,
          };
          setUserInfo(newUserInfo);
        }
      }
    }
  }, [mode]);

  /**
   * For animation
   */
  const title = "SkyStacks";

  return (
    <>
      <AnimatePresence>
        {mode === "ready" && (
          <motion.div
            onClick={handleStart}
            className="fixed flex p-8 flex-col justify-between text-center top-0 left-0 size-full hover:cursor-pointer"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Hero */}
            <div className="flex flex-col justify-center items-center">
              <div className="flex w-full max-w-2xl">
                <div className="flex items-center w-full justify-between">
                  <motion.div
                    className="flex gap-2 text-gray-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <XIcon
                      onClick={(e) => e.stopPropagation()}
                      className="size-10 p-2 rounded-md hover:bg-zinc-900 hover:cursor-pointer"
                    />
                    <TelegramIcon
                      onClick={(e) => e.stopPropagation()}
                      className="size-10 p-2 rounded-md hover:bg-zinc-900 hover:cursor-pointer"
                    />
                  </motion.div>

                  {/* Solana Price */}
                  <motion.div
                    className="flex items-center gap-4 bg-gradient-to-bl from-neutral-800 to-neutral-950 rounded-md px-4 py-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <SolanaIcon className="size-6" />
                    <p className="text-white">$ {solanaPrice}</p>
                  </motion.div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-2 mt-5 text-6xl text-white font-bold">
                <motion.div
                  className="flex"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                      },
                    },
                  }}
                >
                  {title.split("").map((char, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 100 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.div>
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
                >
                  <CrownIcon className="size-6" />
                  <p className="text-2xl">
                    {userInfo && userInfo.address !== "invited" ? (
                      <>{userInfo.max_score}</>
                    ) : (
                      <>{score}</>
                    )}
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="mt-8 text-2xl text-white/50 font-medium animate-pulse">
              <p>Touch to Start</p>
            </div>

            {/*  Connect and Leaderboard Buttons */}
            <div className="flex w-full justify-center items-center">
              <div className="flex flex-col w-full justify-center items-center max-w-xl gap-3">
                <motion.div
                  className="w-full p-[1px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {!userInfo || userInfo.address === "invited" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnectWallet();
                      }}
                      className="flex w-full h-14 justify-center items-center gap-4 rounded-lg text-white bg-gradient-to-b from-[#352C65] to-[#121130] transition-all hover:opacity-95"
                    >
                      <p>Connect Wallet</p>
                      <WalletIcon className="size-6" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisconnectWallet();
                      }}
                      className="flex w-full h-14 justify-center items-center gap-4 rounded-lg text-white bg-gradient-to-b from-[#352C65] to-[#121130] transition-all hover:opacity-95"
                    >
                      <p>Disconnect Wallet</p>
                      <LogoutIcon className="size-6" />
                    </button>
                  )}
                </motion.div>
                <motion.div
                  className="w-full"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                >
                  <button
                    onClick={(e) => {
                      handleGoToLeaderboard();
                      e.stopPropagation();
                    }}
                    className="flex w-full h-14 justify-center items-center gap-4 rounded-lg text-white bg-gradient-to-br from-purple-400 to-blue-500 transition-all hover:opacity-95"
                  >
                    <p>Leaderboard</p>
                    <ChartIcon className="size-6" />
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mode !== "ready" && mode !== "ended" && mode !== "leaderboard" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.1, ease: "backOut" }}
            onClick={handleCheckResult}
            className="fixed flex justify-center top-0 left-0 size-full text-center hover:cursor-pointer"
          >
            <motion.div
              className="max-lg:mt-24 lg:mt-10 max-lg:text-7xl lg:text-9xl text-white font-bold"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "backOut" }}
            >
              <p>{score}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mode === "ended" && (
          <motion.div
            className="fixed flex flex-col justify-between items-start top-0 left-0 size-full"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="fixed flex flex-col justify-between text-center top-0 left-0 size-full">
              {/* Hero */}
              <div className="flex p-8 flex-col justify-center items-center">
                <div className="flex w-full max-w-2xl">
                  <div className="flex items-center w-full justify-between">
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                    >
                      <button
                        onClick={(e) => {
                          handleGoToHome();
                          e.stopPropagation();
                        }}
                        className="flex items-center gap-2 text-gray-200"
                      >
                        <HomeIcon className="size-10 p-2 rounded-md  hover:bg-zinc-900 hover:cursor-pointer" />
                        <p className="font-medium">Home</p>
                      </button>
                    </motion.div>

                    {/* Solana Price */}
                    <motion.div
                      className="flex items-center gap-4 bg-gradient-to-bl from-neutral-800 to-neutral-950 rounded-md px-4 py-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <SolanaIcon className="size-6" />
                      <p className="text-white">$ {solanaPrice}</p>
                    </motion.div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center gap-2 mt-5 text-white font-bold">
                  <p className="text-2xl">Highest Score</p>
                  <div className="flex items-center gap-3 -mt-2">
                    <p className="text-8xl">
                      {userInfo && userInfo.address !== "invited" ? (
                        <>{userInfo.max_score}</>
                      ) : (
                        <>{score}</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/*  Leaderboard  */}
              <div className="flex flex-col w-full justify-center items-center">
                <motion.div
                  className="w-full max-w-xl mb-4 px-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <button
                    onClick={(e) => {
                      handleRestart();
                      e.stopPropagation();
                    }}
                    className="flex w-full h-14 justify-center items-center gap-4 rounded-lg text-white bg-gradient-to-br from-purple-400 to-blue-500 transition-all hover:scale-[98%]"
                  >
                    <p className="text-xl">Play Again</p>
                    <Restart className="size-6 rotate-180" />
                  </button>
                </motion.div>

                <div className="flex flex-col w-full items-center pt-5 max-w-xl h-80 gap-2 bg-[#100D26]/80 backdrop-blur-md rounded-t-3xl">
                  {users ? (
                    <>
                      {users.slice(0, 5).map((user, index) => {
                        return (
                          <motion.div
                            key={index}
                            className={`${
                              index < 3
                                ? "p-[1px] bg-gradient-to-r from-blue-500 to-purple-500"
                                : ""
                            } w-11/12 rounded-lg`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{
                              delay: index / 10,
                              ease: "easeOut",
                            }}
                          >
                            <div
                              className={`flex w-full h-12 justify-around items-center gap-4 px-2 rounded-lg text-white ${
                                index < 3
                                  ? "bg-gradient-to-b from-[#352C65] to-[#121130]"
                                  : "bg-[#2F245E]"
                              } ${
                                user.address === userInfo.address
                                  ? "border-solid border-2 border-teal-500 animate-pulse"
                                  : "border-solid border-2 border-gray-600"
                              } transition-all hover:opacity-95`}
                            >
                              <p className="flex-1 font-medium">{user.rank}</p>
                              <p className="flex-grow text-left w-[60%]">
                                <span className="max-sm:hidden">
                                  {user.address}
                                </span>
                                {/* Mobile */}
                                <span className="sm:hidden">
                                  {user.address.slice(0, 10)} ...{" "}
                                  {user.address.slice(-10)}
                                </span>
                              </p>
                              <p className="flex-1">{user.max_score}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <p className="text-white">Refresh</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mode === "leaderboard" && (
          <motion.div
            className="fixed flex flex-col justify-between text-center top-0 left-0 size-full"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Hero */}
            <div className="flex flex-col pt-8 px-8 justify-center items-center">
              <div className="flex w-full max-w-2xl">
                <div className="flex items-center w-full justify-between">
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        handleGoToHome();
                        e.stopPropagation();
                      }}
                      className="flex items-center gap-2 text-gray-200"
                    >
                      <HomeIcon className="size-10 p-2 rounded-md  hover:bg-zinc-900 hover:cursor-pointer" />
                      <p className="font-medium">Home</p>
                    </button>
                  </motion.div>

                  {/* Solana Price */}
                  <div className="flex items-center gap-4 bg-gradient-to-bl from-neutral-800 to-neutral-950 rounded-md px-4 py-2">
                    <SolanaIcon className="size-6" />
                    <p className="text-white">$ {solanaPrice}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center mt-4 gap-4 text-xl text-white font-bold">
                <p>SkyStacks</p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <p className="text-sm px-2 py-1 rounded-full bg-cyan-500">
                    Leaderboard
                  </p>
                </motion.div>
              </div>
            </div>

            {/*  Leaderboard  */}
            <div className="flex flex-col w-full flex-grow justify-center items-center mt-4">
              <div className="table flex-col w-full h-full items-center max-w-xl">
                <div className="flex flex-col w-full h-full items-center py-5 max-w-xl gap-2 bg-[#100D26]/90 backdrop-blur-md rounded-t-3xl border-t-[1px] md:border-l-[1px] md:border-r-[1px] border-solid border-[#647096] overflow-y-auto no-scrollbar">
                  {users ? (
                    <>
                      {users.map((user, index) => {
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: index / 20, ease: "easeOut" }}
                            className={`${
                              index < 3
                                ? "p-[2px] bg-gradient-to-r from-blue-500 to-purple-500"
                                : ""
                            } w-11/12 text-sm rounded-lg`}
                          >
                            <div
                              className={`flex w-full h-10 justify-around items-center gap-4 px-2 rounded-lg text-white ${
                                index < 3
                                  ? "bg-gradient-to-b from-[#352C65] to-[#121130]"
                                  : "bg-[#2F245E]"
                              } ${
                                user.address === userInfo.address
                                  ? "bg-yellow-600"
                                  : "border-solid border-2 border-gray-600"
                              } transition-all hover:opacity-95`}
                            >
                              <p className="flex-1 font-medium">{user.rank}</p>
                              <p className="flex-grow text-left w-[60%]">
                                <span className="max-sm:hidden">
                                  {user.address}
                                </span>
                                {/* Mobile */}
                                <span className="sm:hidden">
                                  {user.address.slice(0, 10)} ...{" "}
                                  {user.address.slice(-10)}
                                </span>
                              </p>
                              <p className="flex-1 text-purple-100 font-semibold">
                                {user.max_score}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <p className="text-white">Refresh</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Current User */}
            {userInfo && userInfo.address !== "invited" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
                className="absolute flex justify-center bottom-0 w-full h-14 mb-3"
              >
                <div className="w-full max-w-xl h-full px-4">
                  <div className="h-full overflow-hidden rounded-xl border border-gray-800 p-[1px] backdrop-blur-3xl">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3B81F6_0%,#7769F6_50%,#A755F7_100%)]" />
                    <div className="inline-flex h-full w-full items-center justify-center rounded-xl bg-zinc-950 px-3 py-1 text-sm font-medium text-gray-50 backdrop-blur-3xl">
                      <p className="flex-1 font-bold">{userInfo.rank}</p>
                      <p className="flex-grow">
                        <span className="max-sm:hidden text-right">
                          {userInfo.address}
                        </span>
                        {/* Mobile */}
                        <span className="sm:hidden">
                          {userInfo.address.slice(0, 10)} ...{" "}
                          {userInfo.address.slice(-10)}
                        </span>
                      </p>
                      <p className="flex-1 font-bold">{userInfo.max_score}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Interface;
