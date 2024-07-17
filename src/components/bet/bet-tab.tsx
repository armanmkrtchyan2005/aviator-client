import { useRef } from "react";

import { useGetUserBalanceQuery } from "@/store/api/userApi";

import { useAppDispatch, useStateSelector } from "@/store/hooks";
import { useAuth } from "@/store/hooks/useAuth";

import { selectSoundSettings } from "@/store/slices/settingsSlice";
import {
    deactivateBonus,
    selectBonus,
    selectCurrentGameTab,
    setCurrentBet
} from "@/store/slices/gameSlice";

import { BetInput } from "./bet-input";
import { BetButton } from "./bet-button";

import { formatCurrency } from "@/utils/helpers/format-currency";

import { IoIosCloseCircleOutline } from "react-icons/io";

const raiseBets = {
    USD: [1, 2, 5, 10],
    UAH: [100, 200, 500, 1000],
    RUB: [250, 500, 1000, 2000],
    UZS: [50000, 100000, 200000, 500000],
    KZT: [1000, 2500, 5000, 10000],
    USDT: [1, 1, 1, 1]
};

interface BetTabProps {
    betNumber: 1 | 2;
    audioRef: React.RefObject<HTMLAudioElement>;
}

export const BetTab: React.FC<BetTabProps> = ({ betNumber, audioRef }) => {
    const currentGameTab = useStateSelector(state =>
        selectCurrentGameTab(state, betNumber)
    );
    const bonus = useStateSelector(state => selectBonus(state));
    const { isAuthenticated } = useAuth();
    const { data: balance } = useGetUserBalanceQuery(undefined, {
        skip: !isAuthenticated
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const dispatch = useAppDispatch();
    const soundEnabled = useStateSelector(state => selectSoundSettings(state));

    const handlePointerDown = (
        type: "increment" | "decrement",
        value: number
    ) => {
        if (!inputRef.current) return;

        dispatch(
            setCurrentBet({
                type,
                betNumber,
                value,
                inputRef
            })
        );

        timerRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                dispatch(
                    setCurrentBet({
                        type,
                        betNumber,
                        value,
                        inputRef
                    })
                );
            }, 100);
        }, 500);
    };

    const resetInterval = () => {
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);
    };

    return (
        <section className=" mx-auto mt-5 grid max-w-[400px] grid-cols-[auto,1fr] gap-x-1 text-lg">
            <form
                onSubmit={event => {
                    event.preventDefault();
                }}
            >
                <fieldset
                    disabled={
                        currentGameTab.betState !== "init" || !isAuthenticated
                    }
                    data-state={currentGameTab.betState}
                    className="grid grid-cols-[71px_71px] gap-x-1 gap-y-2 disabled:pointer-events-none disabled:opacity-75"
                >
                    {betNumber === 1 && bonus.bonusActive ? (
                        <div className="col-span-2 flex h-8.5 w-full items-center justify-between gap-1.5 rounded-full border border-gray-50 bg-black-250 px-2.5 leading-none">
                            <span className="flex-auto text-center text-base font-bold">
                                {bonus.bonusQuantity}
                            </span>
                            <button onClick={() => dispatch(deactivateBonus())}>
                                <IoIosCloseCircleOutline className="text-[#83878e]" />
                                <span className="sr-only">Отменить бонус</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="col-span-2 flex h-8.5 w-full items-center justify-between gap-0.5 rounded-full border border-gray-50 bg-black-250 px-2.5 leading-none">
                                <button
                                    type="button"
                                    disabled={
                                        currentGameTab.betState !== "init"
                                    }
                                    onPointerDown={() => {
                                        handlePointerDown(
                                            "decrement",
                                            currentGameTab.min
                                        );
                                    }}
                                    onPointerUp={() => {
                                        resetInterval();
                                    }}
                                    onPointerLeave={() => {
                                        resetInterval();
                                    }}
                                    className="shrink-0"
                                >
                                    <DecrementIcon />
                                </button>

                                <BetInput
                                    betNumber={betNumber}
                                    disabled={
                                        currentGameTab.betState !== "init"
                                    }
                                    ref={inputRef}
                                />

                                <button
                                    type="button"
                                    disabled={
                                        currentGameTab.betState !== "init"
                                    }
                                    onPointerDown={() => {
                                        handlePointerDown(
                                            "increment",
                                            currentGameTab.min
                                        );
                                    }}
                                    onPointerUp={() => {
                                        resetInterval();
                                    }}
                                    onPointerLeave={() => {
                                        resetInterval();
                                    }}
                                    className="shrink-0"
                                >
                                    <IncrementIcon />
                                </button>
                            </div>
                            {raiseBets?.[balance?.currency || "USD"]?.map(
                                number => (
                                    <button
                                        key={number}
                                        type="button"
                                        disabled={
                                            currentGameTab.betState !== "init"
                                        }
                                        onPointerDown={() =>
                                            handlePointerDown(
                                                "increment",
                                                number
                                            )
                                        }
                                        onPointerUp={() => {
                                            resetInterval();
                                        }}
                                        onPointerLeave={() => {
                                            resetInterval();
                                        }}
                                        className="h-4.5 w-full select-none rounded-full border border-gray-50 bg-black-150 text-sm leading-none text-[#83878e] active:translate-y-[1px]"
                                    >
                                        {formatCurrency(number, 0)}
                                    </button>
                                )
                            )}
                        </>
                    )}
                </fieldset>
            </form>

            <BetButton
                betNumber={betNumber}
                onClick={() => {
                    if (!audioRef.current || !soundEnabled) return;

                    audioRef.current.currentTime = 0.25;
                    audioRef.current?.play();
                }}
            />
        </section>
    );
};

const DecrementIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
        >
            <g
                fillRule="nonzero"
                fill="none"
            >
                <path
                    d="M9 1C4.6 1 1 4.6 1 9s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"
                    stroke="#767B85"
                />
                <path
                    fill="#767B85"
                    d="M13 9.8H5V8.2h8z"
                />
            </g>
        </svg>
    );
};

const IncrementIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
        >
            <g
                fillRule="nonzero"
                fill="none"
            >
                <path
                    d="M9 1C4.6 1 1 4.6 1 9s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z"
                    stroke="#767B85"
                />
                <path
                    fill="#767B85"
                    d="M13 9.8H9.8V13H8.2V9.8H5V8.2h3.2V5h1.6v3.2H13z"
                />
            </g>
        </svg>
    );
};
