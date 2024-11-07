import { useGameStore } from "./store/useGame";
import data from "./fakeData.json";
import { useEffect, useState } from "react";
import {
  ChartIcon,
  HomeIcon,
  LogoutIcon,
  Restart,
  ShareIcon,
  TelegramIcon,
  UserIcon,
  WalletIcon,
  XIcon,
} from "./assets/icons/interfaceIcons";
// import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

// const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

function Interface() {
  const mode = useGameStore((state) => state.mode);
  const start = useGameStore((state) => state.start);
  const score = useGameStore((state) => state.score);
  const validating = useGameStore((state) => state.validating);
  const restart = useGameStore((state) => state.restart);
  const home = useGameStore((state) => state.home);
  const perfectCount = useGameStore((state) => state.perfectCount);

  const [users, setUsers] = useState(data);
  const [wallet, setWallet] = useState(null);

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
    try {
      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();
      setWallet(publicKey);
      return publicKey;
    } catch (error) {
      console.error("Connection to Phantom wallet failed:", error);
    }
  };

  const handleDisconnectWallet = async () => {
    await window.solana.disconnect();
    setWallet(null);
  };

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      console.log("Phantom wallet found!");
    } else {
      console.log("Phantom wallet not found. Please install it.");
    }

    const fetchPlayer = async () => {
      const res = await fetch(
        "https://solanastackgameapi-production.up.railway.app/ranking?limit=10&offset=0"
      );
      const players = await res.json();
      console.log(players);
    };

    fetchPlayer();
  }, []);

  return (
    <>
      {mode === "ready" && (
        <div
          onClick={handleStart}
          className="fixed flex justify-center text-center top-0 left-0 size-full hover:cursor-pointer"
        >
          <div className="absolute top-[5%] text-[8vw] text-white font-bold">
            <p>Shit Tower Game</p>
            <p className="text-[2vw] font-medium">Touch to Start</p>
          </div>

          <div className="absolute bottom-[4%] flex flex-col justify-center items-center gap-[1.6vw] text-white text-[1vw]">
            <div className="flex gap-[1vw]">
              {!wallet ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnectWallet();
                    }}
                    className="flex items-center justify-center gap-[.8vw] hover:bg-[#2A3540]/80 px-[1vw] py-[.6vw] rounded-[.6vw]"
                  >
                    <p>Connect Wallet</p>
                    <WalletIcon />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDisconnectWallet();
                    }}
                    className="flex items-center justify-center gap-[.8vw] bg-[#9886E5] hover:bg-[#9886E5]/80 px-[1vw] py-[.6vw] rounded-[.6vw]"
                  >
                    <p>
                      Disconnect{" "}
                      <span className="font-bold">
                        {wallet.slice(0, 4)}...{wallet.slice(-4)}
                      </span>
                    </p>
                    <WalletIcon />
                  </button>
                </>
              )}
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex gap-[.8vw] hover:bg-[#2A3540]/80 px-[1vw] py-[.6vw] rounded-[.6vw]"
              >
                <p>Leaderboard</p>
                <ChartIcon />
              </button>
            </div>
            <div className="flex gap-[1vw] text-gray-200">
              <XIcon
                onClick={(e) => e.stopPropagation()}
                className="size-[1.8vw] transition hover:text-[#3DD2B4] hover:cursor-pointer"
              />
              <TelegramIcon
                onClick={(e) => e.stopPropagation()}
                className="size-[1.8vw] transition hover:text-[#3DD2B4] hover:cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {mode !== "ready" && (
        <div
          onClick={handleCheckResult}
          className="fixed flex justify-center top-0 left-0 size-full text-center hover:cursor-pointer"
        >
          <div className="absolute top-[2%] text-[8vw] text-white font-bold">
            <p>{score}</p>
            {perfectCount > 0 && (
              <p className="text-[2vw] font-normal tracking-widest">
                x{perfectCount}
              </p>
            )}
          </div>
        </div>
      )}

      {mode === "ended" && (
        <div className="fixed flex justify-center items-start top-0 left-0 size-full">
          {/* Ranking */}
          <div className="bg-[#040D12] absolute top-[5%] left-[5%] w-[25%] h-[90%] rounded-[1.5vw] overflow-hidden shadow-[-15px_20px_30px_-22px_rgba(0,0,0,1)]">
            <div className="absolute z-10 size-full shadow-zinc-500/20 bg-gradient-to-b from-transparent via-zinc-950/60 via-90% to-zinc-950 rounded-b-[1.5vw] pointer-events-none"></div>

            <div className="relative flex text-white w-full h-[15%]">
              <div className="w-full flex justify-center items-center bg-gradient-to-r from-[#5C8374] to-[#93B1A6] rounded-t-[1.5vw]">
                <h2 className="text-[2vw] font-bold">Leaderboard</h2>
              </div>
            </div>

            {/* Table */}
            <div className="relative w-full h-full">
              <div className="table table-auto text-white w-full">
                <div className="table-header-group">
                  <div className="table-row bg-[#040D12]">
                    <div className="table-cell py-[.4vw] px-[.8vw] text-zinc-500 text-[1vw] font-semibold border-solid border-b-[.1vw] border-white/20">
                      Rank
                    </div>
                    <div className="table-cell py-[.4vw] px-[.8vw] text-zinc-500 text-[1vw] font-semibold border-solid border-b-[.1vw] border-white/20">
                      Name
                    </div>
                    <div className="table-cell py-[.4vw] px-[.8vw] text-zinc-500 text-[1vw] font-semibold border-solid border-b-[.1vw] border-white/20">
                      Score
                    </div>
                  </div>
                </div>

                <div className="table-row-group rounded-b-[1.5vw]">
                  {users &&
                    users.map((user, index) => {
                      return (
                        <div key={index} className="table-row">
                          <div className="table-cell py-[.4vw] px-[.8vw] text-zinc-300 text-[1vw] font-medium border-solid border-b-[.1vw] border-white/20">
                            {user.rank}
                          </div>
                          <div className="table-cell py-[.4vw] px-[.8vw] text-zinc-300 text-[1vw] font-medium border-solid border-b-[.1vw] border-white/20">
                            {user.username}
                          </div>
                          <div className="table-cell py-[.4vw] px-[.8vw] text-[#00FFB0] text-[1vw] font-medium border-solid border-b-[.1vw] border-white/20">
                            {user.score}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Current User */}
            <div className="absolute flex z-20 bottom-[2%] justify-center w-full h-[10%]">
              {wallet ? (
                <>
                  <div className="w-[95%] flex justify-around items-center text-white text-[1vw] font-semibold rounded-[1vw] bg-[#040D12]/20 backdrop-blur-[1vw] border-solid border-[.1vw] border-[#5C8374]">
                    <p>40</p>
                    <p>cosmic_ray</p>
                    <p className="text-[#00FFB0]">5200</p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnectWallet();
                    }}
                    className="w-[95%] flex justify-around items-center text-white text-[1vw] font-semibold rounded-[1vw] bg-[#040D12]/20 hover:underline underline-offset-4 hover:cursor-pointer backdrop-blur-[1vw] border-solid border-[.1vw] border-[#5C8374] transition-all"
                  >
                    <p>Connect Wallet To Save Score</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="absolute flex flex-col items-center gap-[1vw] top-[5%] right-[5%] w-[25%] h-[90%]">
            <div className="w-full h-[8%] flex justify-between items-center text-[#3DD2B4]">
              {wallet ? (
                <>
                  <div className="flex gap-[.6vw] text-[1vw] justify-center items-center font-semibold">
                    <UserIcon className="size-[1.4vw]" />
                    {wallet.slice(0, 4)}...{wallet.slice(-4)}
                  </div>
                  <div className="flex items-center gap-[.2vw]">
                    <HomeIcon
                      onClick={handleGoToHome}
                      className="size-[3vw] hover:bg-[#040D12] p-[.8vw] rounded-[.4vw] hover:cursor-pointer transition ease-in-out"
                    />
                    <LogoutIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisconnectWallet();
                      }}
                      className="size-[3vw] hover:bg-[#040D12] p-[.8vw] rounded-[.4vw] hover:cursor-pointer transition ease-in-out"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-[.6vw] text-[1vw] justify-center items-center font-semibold">
                    <UserIcon className="size-[1.4vw]" />
                    invited shitcoiner
                  </div>
                  <div className="flex items-center gap-[.2vw]">
                    <HomeIcon
                      onClick={handleGoToHome}
                      className="size-[3vw] hover:bg-[#040D12] p-[.8vw] rounded-[.4vw] hover:cursor-pointer transition ease-in-out"
                    />
                    <WalletIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnectWallet();
                      }}
                      className="size-[3vw] hover:bg-[#040D12] p-[.8vw] rounded-[.4vw] hover:cursor-pointer transition ease-in-out"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="relative flex flex-col justify-center items-center bg-[#040D12] w-full h-[20%] rounded-[1vw] overflow-hidden">
              <p className="text-[4vw] font-extrabold leading-[4vw] text-[#3DD2B4]">
                60
              </p>
              <p className="text-[1.5vw] font-medium text-gray-400">
                Highest Score
              </p>
            </div>

            <div className="flex w-full h-[8%] font-semibold text-[#040D12]">
              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-[.8vw] text-[1.2vw] w-full bg-[#3DD2B4] hover:bg-[#36b39a] px-[2vw] rounded-[1vw] transition ease-in-out"
              >
                <Restart className="rotate-180 size-[1.4vw]" />
                Restart
              </button>
            </div>

            <div className="relative top-[38%] left-0 flex flex-col justify-center items-center w-full h-[20%] gap-[1vw] font-semibold">
              {/* <button
                onClick={handleShareScore}
                className="flex items-center justify-center gap-[.8vw] text-[1.2vw] w-full h-[35%] hover:bg-[#040D12]/20 px-[2vw] rounded-[1vw] transition ease-in-out text-[#3DD2B4]"
              >
                <ShareIcon className="rotate-180 size-[1.4vw]" />
                Share Score
              </button> */}
              <div className="text-white text-[1vw]">
                <p>Logo</p>
              </div>

              <div className="flex gap-[1vw] text-gray-200">
                <XIcon className="size-[1.8vw] transition hover:text-[#3DD2B4] hover:cursor-pointer" />
                <TelegramIcon className="size-[1.8vw] transition hover:text-[#3DD2B4] hover:cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Interface;
