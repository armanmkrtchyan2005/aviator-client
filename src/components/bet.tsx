import { useState, useRef, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useStateSelector } from "@/store/hooks";
import { useAuth } from "@/store/hooks/useAuth";
import { selectCurrentGameTab } from "@/store/slices/gameSlice";

import { BetTab } from "./bet/bet-tab";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AutoBetTab } from "./bet/auto-bet-tab";

import WinSound from "@/assets/sound/win.mp3";

interface BetProps {
    betNumber: 1 | 2;
}

export const Bet: React.FC<BetProps> = ({ betNumber }) => {
    const [open, setOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentGameTab = useStateSelector(state =>
        selectCurrentGameTab(state, betNumber)
    );
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const onClickHandler: React.MouseEventHandler<HTMLDivElement> = event => {
        if (isAuthenticated) return;

        event.stopPropagation();
        setOpen(true);
        navigate("/main/sign-in");
    };

    return (
        <>
            <Tabs
                defaultValue="bet"
                onClickCapture={onClickHandler}
                className="group rounded-2.5xl border-2 border-transparent bg-black-50 px-1.5 pb-8 pt-4 has-[fieldset[data-state=bet]:disabled]:border-[#cb011a] has-[fieldset[data-state=cash]:disabled]:border-[#d07206] has-[fieldset[data-state=start]:disabled]:border-[#cb011a] sm:px-6 xs:px-3"
            >
                <TabsList className="has-[button:disabled]:pointer-events-none has-[button:disabled]:opacity-75">
                    <TabsTrigger
                        value="bet"
                        disabled={currentGameTab.autoModeOn || !isAuthenticated}
                    >
                        Ставка
                    </TabsTrigger>
                    <TabsTrigger
                        value="auto"
                        disabled={currentGameTab.autoModeOn || !isAuthenticated}
                    >
                        Авто
                    </TabsTrigger>
                </TabsList>
                <BetTab
                    betNumber={betNumber}
                    audioRef={audioRef}
                />
                <TabsContent
                    value="auto"
                    className="flex items-center justify-around"
                >
                    <AutoBetTab
                        betNumber={betNumber}
                        audioRef={audioRef}
                    />
                </TabsContent>
            </Tabs>

            <audio
                preload="auto"
                ref={audioRef}
            >
                <source
                    src={WinSound}
                    type="audio/mpeg"
                />
                Ваш браузер не поддерживает элемент <code>audio</code>.
            </audio>

            <Dialog
                open={open}
                onOpenChange={() => {
                    if (open) sessionStorage.removeItem("email");
                    setOpen(open => !open);
                }}
            >
                <Suspense>
                    <DialogContent className="w-80">
                        <Outlet />
                    </DialogContent>
                </Suspense>
            </Dialog>
        </>
    );
};

// const raiseBets = {
//     USD: [1, 2, 5, 10],
//     UAH: [100, 200, 500, 1000],
//     RUB: [250, 500, 1000, 2000],
//     UZS: [50000, 100000, 200000, 500000],
//     KZT: [1000, 2500, 5000, 10000]
// };

// interface BetTabProps extends Pick<BetProps, "betNumber"> {
//     audioRef: React.RefObject<HTMLAudioElement>;
// }

// const BetTab: React.FC<BetTabProps> = ({ betNumber, audioRef }) => {
//     const currentGameTab = useStateSelector(state =>
//         selectCurrentGameTab(state, betNumber)
//     );
//     const bonus = useStateSelector(state => selectBonus(state));
//     const { isAuthenticated } = useAuth();
//     const { data: balance } = useGetUserBalanceQuery();

//     const inputRef = useRef<HTMLInputElement>(null);
//     const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
//     const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
//     const { refetch } = useGetUserBetsQuery({ skip: 0, limit: 6 });

//     const dispatch = useAppDispatch();
//     const socket = useStateSelector(state => selectSocket(state));
//     const soundEnabled = useStateSelector(state => selectSoundSettings(state));

//     useEffect(() => {
//         // const makeBet = () => {
//         //     if (currentGameTab.betState !== "bet") return;

//         //     if (bonus.bonusActive && betNumber === 1) {
//         //         socket.emit("bet", {
//         //             betNumber: betNumber,
//         //             currency: currentGameTab.currency,
//         //             bet: Math.round(Number(bonus.bonusQuantity)),
//         //             promoId: bonus.bonusId
//         //         });
//         //     } else {
//         //         socket.emit("bet", {
//         //             betNumber: betNumber,
//         //             currency: currentGameTab.currency,
//         //             bet: Math.round(currentGameTab.currentBet)
//         //         });
//         //     }
//         //     dispatch(userApi.util.invalidateTags(["Balance"]));

//         //     dispatch(setBetState({ betNumber, betState: "cash" }));
//         // };

//         const loose = () => {
//             // dispatch(resetGameDetails());

//             if (currentGameTab.betState !== "cash") return;

//             if (bonus.bonusActive && betNumber === 1) {
//                 dispatch(deactivateBonus());
//             }

//             dispatch(setBetState({ betNumber, betState: "init" }));

//             // dispatch(userApi.util.invalidateTags(["Balance"]));
//             refetch();
//             // dispatch(betApi.util.resetApiState());
//             // dispatch(betApi.util.invalidateTags(["My"]));
//         };

//         // const onGameDataUpdated = (data: GameDetails) => {
//         //     dispatch(
//         //         setGameDetails({
//         //             betAmount: data.betAmount?.[balance?.currency],
//         //             winAmount: data.winAmount?.[balance?.currency],
//         //             currentPlayers: data.currentPlayers
//         //         })
//         //     );
//         // };

//         // socket.on("currentPlayers", onGameDataUpdated);
//         // socket.on("loading", makeBet);
//         socket.on("crash", loose);

//         return () => {
//             // socket.off("currentPlayers", onGameDataUpdated);

//             // socket.off("loading", makeBet);
//             socket.off("crash", loose);
//         };
//     }, [
//         currentGameTab.currentBet,
//         currentGameTab.betState,
//         bonus.bonusActive,
//         bonus.bonusId,
//         bonus.bonusQuantity,
//         socket
//     ]);

//     const handlePointerDown = (
//         type: "increment" | "decrement",
//         value: number
//     ) => {
//         if (!inputRef.current) return;

//         dispatch(
//             setCurrentBet({
//                 type,
//                 betNumber,
//                 value,
//                 inputRef
//             })
//         );

//         timerRef.current = setTimeout(() => {
//             intervalRef.current = setInterval(() => {
//                 dispatch(
//                     setCurrentBet({
//                         type,
//                         betNumber,
//                         value,
//                         inputRef
//                     })
//                 );
//             }, 100);
//         }, 500);
//     };

//     const resetInterval = () => {
//         clearTimeout(timerRef.current);
//         clearInterval(intervalRef.current);
//     };

//     return (
//         <section className=" mx-auto mt-5 grid max-w-[400px] grid-cols-[auto,1fr] gap-x-1 text-lg">
//             <form
//                 onSubmit={event => {
//                     event.preventDefault();
//                 }}
//             >
//                 <fieldset
//                     disabled={
//                         currentGameTab.betState !== "init" || !isAuthenticated
//                     }
//                     data-state={currentGameTab.betState}
//                     className="grid grid-cols-[71px_71px] gap-x-1 gap-y-2 disabled:pointer-events-none disabled:opacity-75"
//                 >
//                     {betNumber === 1 && bonus.bonusActive ? (
//                         <div className="col-span-2 flex h-8.5 w-full items-center justify-between gap-1.5 rounded-full border border-gray-50 bg-black-250 px-2.5 leading-none">
//                             <span className="flex-auto text-center text-xl font-bold">
//                                 {bonus.bonusQuantity}
//                             </span>
//                             <button onClick={() => dispatch(deactivateBonus())}>
//                                 <IoIosCloseCircleOutline className="text-[#83878e]" />
//                                 <span className="sr-only">Отменить бонус</span>
//                             </button>
//                         </div>
//                     ) : (
//                         <>
//                             <div className="col-span-2 flex h-8.5 w-full items-center justify-between gap-0.5 rounded-full border border-gray-50 bg-black-250 px-2.5 leading-none">
//                                 <button
//                                     type="button"
//                                     disabled={
//                                         currentGameTab.betState !== "init"
//                                     }
//                                     onPointerDown={() => {
//                                         handlePointerDown(
//                                             "decrement",
//                                             currentGameTab.min
//                                         );
//                                     }}
//                                     onPointerUp={() => {
//                                         resetInterval();
//                                     }}
//                                     onPointerLeave={() => {
//                                         resetInterval();
//                                     }}
//                                     className="shrink-0"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 18 18"
//                                     >
//                                         <g
//                                             fillRule="nonzero"
//                                             fill="none"
//                                         >
//                                             <path
//                                                 d="M9 1C4.6 1 1 4.6 1 9s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"
//                                                 stroke="#767B85"
//                                             />
//                                             <path
//                                                 fill="#767B85"
//                                                 d="M13 9.8H5V8.2h8z"
//                                             />
//                                         </g>
//                                     </svg>
//                                 </button>

//                                 <BetInput
//                                     betNumber={betNumber}
//                                     disabled={
//                                         currentGameTab.betState !== "init"
//                                     }
//                                     ref={inputRef}
//                                 />

//                                 <button
//                                     type="button"
//                                     disabled={
//                                         currentGameTab.betState !== "init"
//                                     }
//                                     onPointerDown={() => {
//                                         handlePointerDown(
//                                             "increment",
//                                             currentGameTab.min
//                                         );
//                                     }}
//                                     onPointerUp={() => {
//                                         resetInterval();
//                                     }}
//                                     onPointerLeave={() => {
//                                         resetInterval();
//                                     }}
//                                     className="shrink-0"
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 18 18"
//                                     >
//                                         <g
//                                             fillRule="nonzero"
//                                             fill="none"
//                                         >
//                                             <path
//                                                 d="M9 1C4.6 1 1 4.6 1 9s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"
//                                                 stroke="#767B85"
//                                             />
//                                             <path
//                                                 fill="#767B85"
//                                                 d="M13 9.8H9.8V13H8.2V9.8H5V8.2h3.2V5h1.6v3.2H13z"
//                                             />
//                                         </g>
//                                     </svg>
//                                 </button>
//                             </div>
//                             {raiseBets?.[balance?.currency || "USD"]?.map(
//                                 number => (
//                                     <button
//                                         key={number}
//                                         type="button"
//                                         disabled={
//                                             currentGameTab.betState !== "init"
//                                         }
//                                         onPointerDown={() =>
//                                             handlePointerDown(
//                                                 "increment",
//                                                 number
//                                             )
//                                         }
//                                         onPointerUp={() => {
//                                             resetInterval();
//                                         }}
//                                         onPointerLeave={() => {
//                                             resetInterval();
//                                         }}
//                                         className="h-4.5 w-full select-none rounded-full border border-gray-50 bg-black-150 text-sm leading-none text-[#83878e] active:translate-y-[1px]"
//                                     >
//                                         {formatCurrency(number, 0)}
//                                     </button>
//                                 )
//                             )}
//                         </>
//                     )}
//                 </fieldset>
//             </form>

//             <BetButton
//                 betNumber={betNumber}
//                 onClick={() => {
//                     if (!audioRef.current || !soundEnabled) return;

//                     audioRef.current.currentTime = 0.25;
//                     audioRef.current?.play();
//                 }}
//             />
//         </section>
//     );
// };

// interface BetButtonProps extends Pick<BetProps, "betNumber"> {
//     onClick?: React.MouseEventHandler<HTMLButtonElement>;
// }

// export const BetButton: React.FC<BetButtonProps> = ({ betNumber, onClick }) => {
//     const [newRoundBegin, toggleRoundState] = useReducer(state => !state, true);
//     // const [bonusCashOutEnabled, setBonusCashOutEnabled] = useState(false);
//     const bonusCashOutEnabled = selectBonusCashOutEnabled();

//     const dispatch = useAppDispatch();
//     const currentGameTab = useStateSelector(state =>
//         selectCurrentGameTab(state, betNumber)
//     );
//     const socket = useStateSelector(state => selectSocket(state));
//     const bonus = useStateSelector(state => selectBonus(state));

//     const { refetch } = useGetUserBetsQuery({ skip: 0, limit: 6 });

//     const [coef, setCoef] = useState(currentGameTab.currentBet);

//     // useEffect(() => {
//     //     if (betNumber === 1 && bonus.bonusActive && bonus.bonusQuantity) {
//     //         setGain(bonus?.bonusQuantity);
//     //     } else {
//     //         currentGameTab.currentBet;
//     //     }
//     // }, [bonus.bonusActive]);

//     useEffect(() => {
//         const winnings = ({ x }: { x: number }) => {
//             if (currentGameTab.betState !== "cash") return;

//             // if (
//             //     betNumber === 1 &&
//             //     bonus.bonusActive &&
//             //     x >= bonus.bonusCoefficient
//             // ) {
//             //     setBonusCashOutEnabled(true);
//             // }

//             setCoef(x);

//             // if (
//             //     betNumber === 1 &&
//             //     bonus.bonusActive &&
//             //     bonus.bonusQuantity &&
//             //     bonus.bonusCoefficient
//             // ) {
//             //     setGain(x * bonus.bonusQuantity);
//             //     if (x >= bonus.bonusCoefficient) {
//             //         setBonusCashOutEnabled(true);
//             //     }
//             // } else {
//             //     setGain(x * currentGameTab.currentBet);
//             // }
//         };

//         const cancelBetBeforeGameStart = () => {
//             console.log("Loading event");

//             toggleRoundState();

//             if (currentGameTab.betState !== "bet") {
//                 // socket.off("loading", cancelBetBeforeGameStart);
//                 return;
//             }

//             dispatch(setBetState({ betNumber, betState: "start" }));

//             //================================================
//             if (bonus.bonusActive && betNumber === 1) {
//                 socket.emit("bet", {
//                     betNumber: betNumber,
//                     currency: currentGameTab.currency,
//                     bet: Math.round(Number(bonus.bonusQuantity)),
//                     promoId: bonus.bonusId
//                 });
//             } else {
//                 socket.emit("bet", {
//                     betNumber: betNumber,
//                     currency: currentGameTab.currency,
//                     bet: Math.round(currentGameTab.currentBet)
//                 });
//             }
//             dispatch(userApi.util.invalidateTags(["Balance"]));
//             //================================================
//         };

//         const startNewRound = () => {
//             if (newRoundBegin) {
//                 socket.off("game", startNewRound);
//                 return;
//             }

//             toggleRoundState();
//             console.log("New round started");
//         };

//         // const makeBet = () => {
//         //     if (currentGameTab.betState !== "start") {
//         //         socket.off("game", makeBet);
//         //         return;
//         //     }

//         //     if (bonus.bonusActive && betNumber === 1) {
//         //         socket.emit("bet", {
//         //             betNumber: betNumber,
//         //             currency: currentGameTab.currency,
//         //             bet: Math.round(Number(bonus.bonusQuantity)),
//         //             promoId: bonus.bonusId
//         //         });
//         //     } else {
//         //         socket.emit("bet", {
//         //             betNumber: betNumber,
//         //             currency: currentGameTab.currency,
//         //             bet: Math.round(currentGameTab.currentBet)
//         //         });
//         //     }
//         //     dispatch(userApi.util.invalidateTags(["Balance"]));

//         //     dispatch(setBetState({ betNumber, betState: "cash" }));

//         //     socket.off("game", makeBet);
//         // };

//         const makeBet = () => {
//             if (currentGameTab.betState !== "start") {
//                 socket.off("game", makeBet);
//                 return;
//             }

//             dispatch(setBetState({ betNumber, betState: "cash" }));

//             socket.off("game", makeBet);
//         };

//         const resetBet = () => {
//             if (betNumber === 1 && bonus.bonusActive && bonus.bonusQuantity) {
//                 // setGain(bonus.bonusQuantity);
//                 // setBonusCashOutEnabled(false);
//             }
//             // else {
//             //     setGain(currentGameTab.currentBet);
//             // }
//         };

//         socket.on("game", winnings);
//         socket.on("game", startNewRound);
//         socket.on("game", makeBet);
//         socket.on("loading", cancelBetBeforeGameStart);
//         socket.on("crash", resetBet);

//         return () => {
//             socket.off("game", winnings);
//             socket.off("game", startNewRound);
//             socket.off("game", makeBet);
//             socket.off("loading", cancelBetBeforeGameStart);
//             socket.off("crash", resetBet);
//         };
//     }, [
//         newRoundBegin,
//         currentGameTab.currentBet,
//         currentGameTab.betState,
//         bonus.bonusActive,
//         bonus.bonusQuantity
//     ]);

//     const cancelBet = () => {
//         dispatch(abortBet(betNumber));
//         // dispatch(setBetState({ betNumber, betState: "init" }));
//         // socket.emit("cancel", { betNumber });
//         // dispatch(userApi.util.invalidateTags(["Balance"]));
//     };

//     const cashOut: React.MouseEventHandler<HTMLButtonElement> = event => {
//         socket.emit("cash-out", {
//             betNumber
//         });

//         if (bonus.bonusActive && betNumber === 1) {
//             dispatch(deactivateBonus());
//             // toast({
//             //     title: `Вы выиграли ${(
//             //         gain - (bonus?.bonusQuantity as number)
//             //     ).toFixed(2)} ${currentGameTab.currency}`,
//             //     duration: 5000
//             // });
//         } else {
//             // toast({
//             //     title: `Вы выиграли ${(
//             //         gain - currentGameTab.currentBet
//             //     ).toFixed(2)} ${currentGameTab.currency}`,
//             //     duration: 5000
//             // });
//             toast.custom(
//                 t => (
//                     <SucceedToast
//                         t={t}
//                         gain={coef * currentGameTab.currentBet}
//                         rate={coef}
//                         currency={currentGameTab.currency}
//                     />
//                 ),
//                 {
//                     position: "top-center",
//                     classNames: {
//                         toast: "group-[.toaster]:!bg-transparent group-[.toaster]:!gap-0 group-[.toaster]:!shadow-none"
//                     },
//                     // duration: 50000,
//                     className: "sm:w-[356px] w-max"
//                 }
//             );
//         }

//         dispatch(setBetState({ betNumber, betState: "init" }));
//         dispatch(userApi.util.invalidateTags(["Balance"]));
//         // dispatch(betApi.util.resetApiState());
//         // dispatch(betApi.util.invalidateTags(["My"]));
//         refetch();
//         onClick?.(event);
//     };

//     switch (currentGameTab.betState) {
//         case "init":
//             return (
//                 <button
//                     style={{ textShadow: "0 1px 2px rgba(0, 0, 0, .5)" }}
//                     // disabled={
//                     //     betNumber === 1 && bonus.bonusActive
//                     //         ? false
//                     //         : currentGameTab.currentBet > currentGameTab.balance
//                     // }
//                     onClick={() => {
//                         if (
//                             currentGameTab.currentBet > currentGameTab.balance
//                         ) {
//                             toast.custom(t => <NotEnoughMoneyToast t={t} />, {
//                                 position: "top-center",
//                                 classNames: {
//                                     toast: "group-[.toaster]:!bg-transparent group-[.toaster]:!gap-0 group-[.toaster]:!shadow-none"
//                                 },
//                                 className: "w-[356px] h-auto"
//                             });
//                             return;
//                         }

//                         if (newRoundBegin)
//                             dispatch(
//                                 setBetState({ betNumber, betState: "bet" })
//                             );
//                         else {
//                             dispatch(
//                                 setBetState({ betNumber, betState: "start" })
//                             );
//                             //================================================
//                             if (bonus.bonusActive && betNumber === 1) {
//                                 socket.emit("bet", {
//                                     betNumber: betNumber,
//                                     currency: currentGameTab.currency,
//                                     bet:
//                                         Math.round(
//                                             Number(bonus.bonusQuantity) * 100
//                                         ) / 100,
//                                     promoId: bonus.bonusId
//                                 });
//                             } else {
//                                 socket.emit("bet", {
//                                     betNumber: betNumber,
//                                     currency: currentGameTab.currency,
//                                     bet: Math.round(currentGameTab.currentBet)
//                                 });
//                             }
//                             dispatch(userApi.util.invalidateTags(["Balance"]));
//                             //================================================
//                         }
//                     }}
//                     className="min-h-[86px] rounded-2.5xl border-2 border-green-50 bg-green-450 px-3 py-1.5 font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 active:translate-y-[1px] active:border-[#1c7430] mh:hover:bg-green-350"
//                 >
//                     <p className="text-xl">Ставка</p>
//                     <p>
//                         <span className="text-2xl">
//                             {betNumber === 1 && bonus.bonusActive
//                                 ? bonus.bonusQuantity
//                                 : currentGameTab.currentBet.toFixed(2)}
//                         </span>{" "}
//                         <span className="text-lg">
//                             {currentGameTab.currency}
//                         </span>
//                     </p>
//                 </button>
//             );
//         case "start":
//             return (
//                 <button
//                     onClick={cancelBet}
//                     className="h-full min-h-[86px] w-full rounded-2.5xl border-2 border-[#ff7171] bg-[#cb011a] px-3 py-1.5 text-xl font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 active:translate-y-[1px] active:border-[#b21f2d] mh:hover:bg-[#f7001f]"
//                 >
//                     Отмена
//                 </button>
//             );
//         case "bet":
//             return (
//                 <div className="grid h-full w-full grid-rows-[1fr_2fr] place-items-center">
//                     <p className="text-sm text-[#ffffffb3]">
//                         Ожидаем новый раунд
//                     </p>
//                     <button
//                         onClick={cancelBet}
//                         className="h-full min-h-[57px] w-full rounded-2.5xl border-2 border-[#ff7171] bg-[#cb011a] px-3 py-1.5 text-xl font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 active:translate-y-[1px] active:border-[#b21f2d] mh:hover:bg-[#f7001f]"
//                     >
//                         Отмена
//                     </button>
//                 </div>
//             );
//         case "cash":
//             return (
//                 <button
//                     onClick={cashOut}
//                     disabled={bonusCashOutEnabled}
//                     className="min-h-[86px] rounded-2.5xl border-2 border-[#ffbd71] bg-[#d07206] px-3 py-1.5 text-xl font-semibold uppercase leading-none tracking-wider shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 active:translate-y-[1px] active:border-[#c69500] disabled:opacity-80 mh:hover:enabled:bg-[#f58708] mh:disabled:hover:cursor-not-allowed"
//                 >
//                     <p>Вывести</p>
//                     <p className="text-2xl">
//                         <span className="text-2xl">
//                             {(coef * currentGameTab.currentBet)?.toFixed(2)}
//                         </span>{" "}
//                         <span className="text-lg">
//                             {currentGameTab.currency}
//                         </span>
//                     </p>
//                 </button>
//             );

//         default:
//             return <></>;
//     }
// };

// interface AutoBetTabProps {
//     betNumber: 1 | 2;
//     audioRef: React.RefObject<HTMLAudioElement>;
// }

// const MIN_RATE = 1.1;

// const AutoBetTab: React.FC<AutoBetTabProps> = ({ betNumber, audioRef }) => {
//     const dispatch = useAppDispatch();

//     const currentGameTab = useStateSelector(state =>
//         selectCurrentGameTab(state, betNumber)
//     );
//     const { refetch } = useGetUserBetsQuery({ skip: 0, limit: 6 });

//     const socket = useStateSelector(state => selectSocket(state));
//     const bonus = useStateSelector(state => selectBonus(state));
//     const soundEnabled = useStateSelector(state => selectSoundSettings(state));

//     const inputValidValue = useRef<string>(
//         bonus.bonusActive
//             ? (bonus.bonusCoefficient as number).toFixed(2)
//             : MIN_RATE.toFixed(2)
//     );
//     const [rate, setRate] = useState(
//         bonus.bonusActive ? (bonus.bonusCoefficient as number) : MIN_RATE
//     );

//     // const rate1 = useRef(
//     //     bonus.bonusActive ? (bonus.bonusCoefficient as number) : MIN_RATE
//     // );

//     useEffect(() => {
//         const autoBet = ({ x }: { x: number }) => {
//             if (
//                 !currentGameTab.autoModeOn ||
//                 currentGameTab.betState !== "cash"
//             ) {
//                 socket.off("game", autoBet);
//                 return;
//             }

//             if (x < rate) return;

//             socket.emit("cash-out", {
//                 betNumber
//             });

//             if (bonus.bonusActive && betNumber === 1) {
//                 dispatch(deactivateBonus());
//                 // toast({
//                 //     title: `Вы выиграли ${(
//                 //         (rate - 1) *
//                 //         (bonus?.bonusQuantity as number)
//                 //     ).toFixed(2)} ${currentGameTab.currency}`,
//                 //     duration: 5000
//                 // });
//             } else {
//                 // toast({
//                 //     title: `Вы выиграли ${(
//                 //         (rate - 1) *
//                 //         currentGameTab.currentBet
//                 //     ).toFixed(2)} ${currentGameTab.currency}`,
//                 //     duration: 5000
//                 // });
//                 toast.custom(
//                     t => (
//                         <SucceedToast
//                             t={t}
//                             gain={rate * currentGameTab.currentBet}
//                             rate={rate}
//                             currency={currentGameTab.currency}
//                         />
//                     ),
//                     {
//                         position: "top-center",
//                         classNames: {
//                             toast: "group-[.toaster]:!bg-transparent group-[.toaster]:!gap-0 group-[.toaster]:!shadow-none"
//                         },
//                         className: "w-[356px]"
//                     }
//                 );
//             }

//             dispatch(userApi.util.invalidateTags(["Balance"]));
//             // dispatch(betApi.util.resetApiState());
//             // dispatch(betApi.util.invalidateTags(["My"]));
//             refetch();
//             dispatch(setBetState({ betNumber, betState: "init" }));

//             socket.off("game", autoBet);

//             if (!audioRef.current || !soundEnabled) return;

//             audioRef.current.currentTime = 0.25;
//             audioRef.current?.play();
//         };

//         socket.on("game", autoBet);

//         return () => {
//             socket.off("game", autoBet);
//         };
//     }, [
//         rate,
//         currentGameTab.autoModeOn,
//         currentGameTab.betState,
//         socket,
//         soundEnabled
//     ]);

//     const onChangeHandler: React.ChangeEventHandler<
//         HTMLInputElement
//     > = event => {
//         try {
//             inputValidValue.current = decimal(event.currentTarget.value);
//         } catch (error) {
//             return;
//         } finally {
//             event.currentTarget.value = inputValidValue.current;
//         }
//     };

//     const onBlurHandler: React.FocusEventHandler<HTMLInputElement> = event => {
//         if (!currentGameTab.balance) return;

//         const value = validateBet(
//             event.target.value,
//             bonus.bonusActive ? (bonus.bonusCoefficient as number) : MIN_RATE,
//             100
//         );
//         event.currentTarget.value = value.toFixed(2);
//         setRate(value);
//     };

//     return (
//         <fieldset
//             disabled={currentGameTab.betState !== "init"}
//             className="grid grid-cols-[auto_100px] items-center justify-evenly  gap-3"
//         >
//             <Label
//                 direction="row"
//                 className="text-xs leading-none text-[#9ea0a3]"
//             >
//                 <span>Авто кешаут</span>
//                 <Switch
//                     disabled={currentGameTab.betState !== "init"}
//                     onClick={() => dispatch(toggleAutoMode({ betNumber }))}
//                 />
//             </Label>
//             {/* <div className="flex h-8 items-center gap-2 rounded-full border border-gray-50 bg-black-250 px-3 leading-none"> */}
//             <input
//                 disabled={!currentGameTab.autoModeOn}
//                 defaultValue={MIN_RATE.toFixed(2)}
//                 onChange={onChangeHandler}
//                 onBlur={onBlurHandler}
//                 className="h-8 w-full rounded-full border border-gray-50 bg-black-250 px-3 text-center font-bold leading-none focus-visible:outline-none disabled:opacity-50"
//             />

//             {/* </div> */}
//         </fieldset>
//     );
// };
