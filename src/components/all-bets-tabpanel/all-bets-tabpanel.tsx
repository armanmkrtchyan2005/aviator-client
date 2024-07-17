import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { useStateSelector, useAppDispatch } from "@/store/hooks";
import { setCurrentRound } from "@/store/slices/gameSlice";
import { ToggleRoundDetailsButton } from "./toggle-round-details-button";
import { CurrentRoundDetailsTab } from "./current-round-details-tab";
import GridLoader from "react-spinners/GridLoader";

const PreviousRoundDetailsTab = lazy(() =>
    import("./previous-round-details-tab").then(module => ({
        default: module.PreviousRoundDetailsTab
    }))
);

export const AllBetsTabpanel = () => {
    const currentRound = useStateSelector(state => state.game.currentRound);
    const dispatch = useAppDispatch();

    const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        dispatch(setCurrentRound());
    };

    return (
        <>
            <ToggleRoundDetailsButton onClick={onClickHandler}>
                {currentRound ? "Предыдущий" : "Текущий"}
            </ToggleRoundDetailsButton>
            {currentRound ? (
                <CurrentRoundDetailsTab />
            ) : (
                <Suspense
                    fallback={
                        <div className="mt-5">
                            <GridLoader color="red" />
                        </div>
                    }
                >
                    <PreviousRoundDetailsTab />
                </Suspense>
            )}
        </>
    );
};
