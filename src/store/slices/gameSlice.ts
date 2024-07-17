import { RefObject } from "react";
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import { authApi } from "../api/authApi";
import { RootStore } from "../types";
import { Currency } from "@/api/withdraw/types";

type BetState = "init" | "start" | "bet" | "cash";

interface Bet {
    betState: BetState;
    betNumber: 1 | 2;
    balance: number;
    currency: Currency;
    autoModeOn: boolean;
    autoBetCoefficient: number;
    currentBet: number;
    min: number;
    max: number;
}

interface ActiveBonus {
    bonusId: string;
    bonusActive: true;
    bonusQuantity: number;
    bonusCoefficient: number;
    cashOutEnabled: boolean;
}

interface UnActiveBonus {
    bonusId: null;
    bonusActive: false;
    bonusQuantity: null;
    bonusCoefficient: null;
    cashOutEnabled: false;
}

// interface Player {
//     playerLogin: string;
//     bet: Record<Currency, number>;
//     currency: string;
//     time: Date;
//     coeff?: number;
//     win?: Record<Currency, number>;
//     profileImage: string;
// }

// export interface GameDetails {
//     betAmount: number;
//     winAmount: number;
//     currentPlayers: Player[];
// }

type Bonus = ActiveBonus | UnActiveBonus;

type Game = {
    bets: [Bet, Bet];
    bonus: Bonus;
    currentRound: boolean;
    // gameDetails: GameDetails;
};

const initialState = {
    bets: [
        {
            betState: "init",
            betNumber: 1,
            balance: 0,
            currency: "USD",
            autoModeOn: false,
            autoBetCoefficient: 1.1,
            currentBet: 1,
            min: 1,
            max: 100
        },
        {
            betState: "init",
            betNumber: 2,
            balance: 0,
            currency: "USD",
            autoModeOn: false,
            autoBetCoefficient: 1.1,
            currentBet: 1,
            min: 1,
            max: 100
        }
    ],
    bonus: {
        bonusId: null,
        bonusQuantity: null,
        bonusActive: false,
        bonusCoefficient: null,
        cashOutEnabled: false
    },
    currentRound: true
    // gameDetails: {
    //     betAmount: 0,
    //     winAmount: 0,
    //     currentPlayers: []
    // }
} as Game;

const gameSlice = createSlice({
    name: "game",
    // initialState: () => {
    //     const storedData = sessionStorage.getItem("settings");

    //     if (!storedData) return initialState;

    //     const settings = JSON.parse(storedData);

    //     return { ...initialState, settings };
    // },
    initialState,
    reducers: {
        setBetState: (
            state,
            action: PayloadAction<{ betNumber: 1 | 2; betState: BetState }>
        ) => {
            state.bets[action.payload.betNumber - 1].betState =
                action.payload.betState;
        },
        toggleAutoMode: (
            state,
            action: PayloadAction<{ betNumber: 1 | 2; state?: boolean }>
        ) => {
            if (action.payload.state !== undefined) {
                state.bets[action.payload.betNumber - 1].autoModeOn =
                    action.payload.state;
            } else {
                state.bets[action.payload.betNumber - 1].autoModeOn =
                    !state.bets[action.payload.betNumber - 1].autoModeOn;
            }
        },
        setCurrentBet: (
            state,
            action: PayloadAction<
                | {
                      type: "input";
                      betNumber: 1 | 2;
                      value: number;
                      inputRef?: never;
                  }
                | {
                      type: "increment" | "decrement";
                      betNumber: 1 | 2;
                      value: number;
                      inputRef: RefObject<HTMLInputElement>;
                  }
            >
        ) => {
            switch (action.payload.type) {
                case "input":
                    state.bets[action.payload.betNumber - 1].currentBet =
                        action.payload.value;
                    break;

                case "increment":
                    if (
                        state.bets[action.payload.betNumber - 1].currentBet +
                            action.payload.value >
                            Math.min(
                                state.bets[action.payload.betNumber - 1].max,
                                state.bets[action.payload.betNumber - 1].balance
                            ) ||
                        !action.payload.inputRef.current
                    )
                        return state;

                    state.bets[action.payload.betNumber - 1].currentBet +=
                        Number(action.payload.value.toFixed(2));
                    action.payload.inputRef.current.value =
                        state.bets[
                            action.payload.betNumber - 1
                        ].currentBet.toFixed(2);

                    break;

                case "decrement":
                    if (
                        state.bets[action.payload.betNumber - 1].currentBet -
                            action.payload.value <
                            state.bets[action.payload.betNumber - 1].min ||
                        !action.payload.inputRef.current
                    )
                        return state;

                    state.bets[action.payload.betNumber - 1].currentBet -=
                        Number(action.payload.value.toFixed(2));
                    action.payload.inputRef.current.value =
                        state.bets[
                            action.payload.betNumber - 1
                        ].currentBet.toFixed(2);

                    break;

                default:
                    return state;
            }
        },
        setAutoBetCoefficient: (
            state,
            action: PayloadAction<{ betNumber: 1 | 2; coefficient: number }>
        ) => {
            state.bets[action.payload.betNumber - 1].autoBetCoefficient =
                action.payload.coefficient;
        },
        activateBonus: (
            state,
            action: PayloadAction<{
                bonusId: string;
                bonusQuantity: number;
                bonusCoefficient: number;
            }>
        ) => {
            state.bonus.bonusActive = true;
            state.bonus.bonusId = action.payload.bonusId;
            state.bonus.bonusQuantity =
                Math.round(Number(action.payload.bonusQuantity) * 100) / 100;
            state.bonus.bonusCoefficient = Number(
                action.payload.bonusCoefficient
            );
        },
        deactivateBonus: state => {
            state.bonus.bonusActive = false;
            state.bonus.bonusId = null;
            state.bonus.bonusQuantity = null;
            state.bonus.bonusCoefficient = null;
            state.bonus.cashOutEnabled = false;
        },
        enableBonusCashOut: state => {
            state.bonus.cashOutEnabled = true;
        },
        setCurrentRound: (
            state,
            action: PayloadAction<boolean | undefined>
        ) => {
            if (action.payload !== undefined) {
                state.currentRound = action.payload;
            } else {
                state.currentRound = !state.currentRound;
            }
        }
        // setGameDetails: (state, action: PayloadAction<GameDetails>) => {
        //     state.gameDetails.betAmount = action.payload.betAmount;
        //     state.gameDetails.winAmount = action.payload.winAmount;
        //     state.gameDetails.currentPlayers = action.payload.currentPlayers;
        // },
        // resetGameDetails: state => {
        //     state.gameDetails = initialState.gameDetails;
        // }
    },
    extraReducers: builder => {
        builder
            .addMatcher(authApi.endpoints.signOut.matchFulfilled, () => {
                return initialState;
            })
            // .addCase(authSlice.actions.logout, () => {
            //     return initialState;
            // })
            .addMatcher(
                userApi.endpoints.getUserBalance.matchFulfilled,
                (state, { payload }) => {
                    state.bets[0].balance = payload.balance;
                    state.bets[0].currency = payload.currency;
                    state.bets[1].balance = payload.balance;
                    state.bets[1].currency = payload.currency;
                }
            )
            .addMatcher(
                userApi.endpoints.getGameLimits.matchFulfilled,
                (state, { payload }) => {
                    state.bets[0].currentBet = Math.ceil(payload.min);
                    state.bets[1].currentBet = Math.ceil(payload.min);
                    state.bets[0].min = Math.ceil(payload.min);
                    state.bets[0].max = Math.floor(payload.max);
                    state.bets[1].min = Math.ceil(payload.min);
                    state.bets[1].max = Math.floor(payload.max);
                }
            );
    }
});

export const { reducer: gameSliceReducer, actions: gameSliceActions } =
    gameSlice;

export const {
    setBetState,
    setCurrentBet,
    // setGameDetails,
    // resetGameDetails,
    toggleAutoMode,
    activateBonus,
    setAutoBetCoefficient,
    setCurrentRound,
    deactivateBonus,
    enableBonusCashOut
} = gameSlice.actions;

const gameTab = (state: RootStore) => state.game;

export const selectCurrentGameTab = createSelector(
    [gameTab, (gameTab, betNumber: 1 | 2) => betNumber],
    (gameTab, betNumber) => {
        return gameTab.bets[betNumber - 1];
    }
);

const bonusId = (state: RootStore) => state.game.bonus.bonusId;
const bonusActive = (state: RootStore) => state.game.bonus.bonusActive;
const bonusQuantity = (state: RootStore) => state.game.bonus.bonusQuantity;
const bonusCoefficient = (state: RootStore) =>
    state.game.bonus.bonusCoefficient;
const bonusCashOutEnabled = (state: RootStore) =>
    state.game.bonus.cashOutEnabled;

export const selectBonus = createSelector(
    [
        bonusId,
        bonusActive,
        bonusQuantity,
        bonusCoefficient,
        bonusCashOutEnabled
    ],
    (
        bonusId,
        bonusActive,
        bonusQuantity,
        bonusCoefficient,
        bonusCashOutEnabled
    ) => ({
        bonusId,
        bonusActive,
        bonusQuantity,
        bonusCoefficient,
        bonusCashOutEnabled
    })
);

export const selectBonusCashOutEnabled = createSelector(
    [bonusCashOutEnabled],
    bonusCashOutEnabled => bonusCashOutEnabled
);

// const betAmount = (state: RootStore) => state.game.gameDetails.betAmount;
// const winAmount = (state: RootStore) => state.game.gameDetails.winAmount;
// const currentPlayers = (state: RootStore) =>
//     state.game.gameDetails.currentPlayers;

// export const selectGameDetails = createSelector(
//     [betAmount, winAmount, currentPlayers],
//     (betAmount, winAmount, currentPlayers) => ({
//         betAmount,
//         winAmount,
//         currentPlayers
//     })
// );
