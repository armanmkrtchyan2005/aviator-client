import { useReducer } from "react";

import { useStateSelector, useAppDispatch } from "@/store/hooks";
import { Bet } from "@/components/bet";
import { selectCurrentGameTab, toggleAutoMode } from "@/store/slices/gameSlice";

export const BettingZone = () => {
    const [multiBetEnabled, toggleMultiBetState] = useReducer(
        state => !state,
        true
    );
    const dispatch = useAppDispatch();

    const secondGameTab = useStateSelector(state =>
        selectCurrentGameTab(state, 2)
    );

    const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        toggleMultiBetState();
        dispatch(toggleAutoMode({ betNumber: 2, state: false }));
    };

    return (
        <section
            className={`relative ${
                multiBetEnabled ? "grid grid-cols-1 gap-2 md:grid-cols-2" : ""
            }`}
        >
            <Bet betNumber={1} />
            {multiBetEnabled ? <Bet betNumber={2} /> : null}
            <button
                style={{ textShadow: "0 1px 2px rgba(0,0,0,.5)" }}
                disabled={secondGameTab.betState !== "init"}
                onClick={onClickHandler}
                aria-pressed={multiBetEnabled}
                className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full shadow-[inset_0_1px_1px_#ffffff80] transition-colors disabled:pointer-events-none aria-[pressed=false]:bg-[#427f00] mh:aria-[pressed=false]:hover:bg-[#28a909]"
            >
                {multiBetEnabled ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                    >
                        <g
                            fill="none"
                            fillRule="evenodd"
                        >
                            <rect
                                fill="#141516"
                                width="24"
                                height="24"
                                rx="10"
                            />
                            <path
                                fill="#767B85"
                                d="M6 11h12v2H6z"
                            />
                        </g>
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        className="h-3 w-3"
                    >
                        <path
                            d="M7 0v4.999L12 5v2l-5-.001V12H5V6.999L0 7V5l5-.001V0h2z"
                            fill="#FFF"
                            fillRule="evenodd"
                        />
                    </svg>
                )}
            </button>
        </section>
    );
};
