import { useGameStore } from "./store/useGame";
import { useEffect, useState } from "react";
import {
  ChartIcon,
  CrownIcon,
  HomeIcon,
  LogoutIcon,
  Restart,
  ShareIcon,
  SolanaIcon,
  TelegramIcon,
  UserIcon,
  WalletIcon,
  XIcon,
} from "./assets/icons/interfaceIcons";
// import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

// const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

function Interface() {
  const [users, setUsers] = useState([]);

  const mode = useGameStore((state) => state.mode);
  const start = useGameStore((state) => state.start);
  const score = useGameStore((state) => state.score);
  const validating = useGameStore((state) => state.validating);
  const restart = useGameStore((state) => state.restart);
  const home = useGameStore((state) => state.home);
  const perfectCount = useGameStore((state) => state.perfectCount);

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

  const handleConnectWallet = async () => {
    const verifyWallet = async (address) => {
      const res = await fetch(
        `https://solanastackgameapi-production.up.railway.app/player?id=${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const [data] = await res.json();

      if (!data) {
        return null;
      }

      if (users) {
        const index = users.findIndex((user) => user.address === address) + 1;
        const newInfo = {
          rank: index,
          address: data.address,
          max_score: data.max_score,
        };
        setUserInfo(newInfo);
      }

      return data;
    };

    const registerWallet = async (address, score = 0) => {
      const res = await fetch(
        "https://solanastackgameapi-production.up.railway.app/register",
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
        "https://solanastackgameapi-production.up.railway.app/ranking?limit=0&offset=0",
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

    fetchRanking();
  }, []);

  const updateMaxScore = async (address, newScore) => {
    const res = await fetch(
      "https://solanastackgameapi-production.up.railway.app/player/update-score",
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

    const response = await res.json();
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

  return (
    <>
      {mode === "ready" && (
        <div
          onClick={handleStart}
          className="fixed flex p-8 flex-col justify-between text-center top-0 left-0 size-full hover:cursor-pointer"
        >
          {/* Hero */}
          <div className="flex flex-col justify-center items-center">
            <div className="flex w-full max-w-2xl">
              <div className="flex items-center w-full justify-between">
                <div className="flex gap-2 text-gray-200">
                  <XIcon
                    onClick={(e) => e.stopPropagation()}
                    className="size-10 p-2 rounded-md hover:bg-zinc-900 hover:cursor-pointer"
                  />
                  <TelegramIcon
                    onClick={(e) => e.stopPropagation()}
                    className="size-10 p-2 rounded-md hover:bg-zinc-900 hover:cursor-pointer"
                  />
                </div>

                {/* Solana Price */}
                <div className="flex items-center gap-4 bg-gradient-to-bl from-neutral-800 to-neutral-950 rounded-md px-4 py-2">
                  <SolanaIcon className="size-6" />
                  <p className="text-white">$207.28</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-2 mt-5 text-6xl text-white font-bold">
              <p>SkyStacks</p>
              <div className="flex items-center gap-3">
                <CrownIcon className="size-6" />
                <p className="text-2xl">
                  {userInfo && userInfo.address !== "invited" ? (
                    <>{userInfo.max_score}</>
                  ) : (
                    <>{score}</>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-2xl text-white/50 font-medium animate-pulse">
            <p>Touch to Start</p>
          </div>

          {/*  Connect and Leaderboard  */}
          <div className="flex w-full justify-center items-center">
            <div className="flex flex-col w-full justify-center items-center max-w-xl gap-3">
              <div className="w-full p-[1px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
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
              </div>
              <button className="flex w-full h-14 justify-center items-center gap-4 rounded-lg text-white bg-gradient-to-br from-[#A57FFE] to-[#4E6EFF] transition-all hover:opacity-95">
                <p>Leaderboard</p>
                <ChartIcon className="size-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {mode !== "ready" && mode !== "ended" && (
        <div
          onClick={handleCheckResult}
          className="fixed flex justify-center top-0 left-0 size-full text-center hover:cursor-pointer"
        >
          <div className="max-lg:mt-24 lg:mt-10 max-lg:text-7xl lg:text-9xl text-white font-bold">
            <p>{score}</p>
            {/* {perfectCount > 0 && (
              <p className="text-[2vw] font-normal tracking-widest">
                x{perfectCount}
              </p>
            )} */}
          </div>
        </div>
      )}

      {mode === "ended" && (
        <div className="fixed flex flex-col justify-between items-start top-0 left-0 size-full">
          <div className="fixed flex flex-col justify-between text-center top-0 left-0 size-full hover:cursor-pointer">
            {/* Hero */}
            <div className="flex p-8 flex-col justify-center items-center">
              <div className="flex w-full max-w-2xl">
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center gap-2 text-gray-200">
                    <HomeIcon
                      onClick={(e) => e.stopPropagation()}
                      className="size-10 p-2 rounded-md  hover:bg-zinc-900 hover:cursor-pointer"
                    />
                    <p className="font-medium">Home</p>
                  </div>

                  {/* Solana Price */}
                  <div className="flex items-center gap-4 bg-gradient-to-bl from-neutral-800 to-neutral-950 rounded-md px-4 py-2">
                    <SolanaIcon className="size-6" />
                    <p className="text-white">$207.28</p>
                  </div>
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

              <div className="w-full max-w-xl mt-2">
                <button
                  onClick={(e) => {
                    handleRestart();
                    e.stopPropagation();
                  }}
                  className="flex w-full h-14 justify-center items-center gap-4 rounded-lg text-white bg-gradient-to-br from-[#A57FFE] to-[#4E6EFF] transition-all hover:opacity-95"
                >
                  <p className="text-xl">Play Again</p>
                  <Restart className="size-6 rotate-180" />
                </button>
              </div>
            </div>

            {/*  Leaderboard  */}
            <div className="flex w-full justify-center items-center">
              <div className="flex flex-col w-full items-center pt-5 max-w-xl h-96 gap-2 bg-[#100D26]/80 backdrop-blur-md rounded-t-3xl">
                {users ? (
                  <>
                    {users.slice(0, 5).map((user, index) => {
                      return (
                        <div
                          key={index}
                          className={`${
                            index < 3
                              ? "p-[1px] bg-gradient-to-r from-blue-500 to-purple-500"
                              : ""
                          } w-11/12 rounded-lg`}
                        >
                          <div
                            className={`flex w-full h-12 justify-around items-center gap-4 rounded-lg text-white ${
                              index < 3
                                ? "bg-gradient-to-b from-[#352C65] to-[#121130]"
                                : "bg-[#2D1C46]"
                            } transition-all hover:opacity-95`}
                          >
                            <p className="flex-1">{index}</p>
                            <p className="flex-grow text-left w-[60%]">
                              5oKHBsVJyE2vk5rfkbneTzTrjbvJKkcgxpuB7LeAtrve
                            </p>
                            <p className="flex-1">120</p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <p className="text-white">Hello</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Interface;
