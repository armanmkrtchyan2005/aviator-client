import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootStore } from "../types";

type AvailableState = "idle" | "loading" | "start" | "game" | "crash" | "end";

type Currency = "USD" | "RUB" | "KZT" | "UZS" | "USDT";

export type CurrencyRecordTest = Record<Currency, number>;

type ActiveBotState = {
    status: "active";
    message: null;
};

type InactiveBotState = {
    status: "inactive";
    message: string;
};

type BotState = ActiveBotState | InactiveBotState;

type ActiveGameStatus = {
    status: "active";
    message: null;
};

type InactiveGameStatus = {
    status: "inactive";
    message: string;
};

export type GameStatus = ActiveGameStatus | InactiveGameStatus;

export interface RoundStatistic {
    playersAmount: number;
    betAmount: CurrencyRecordTest;
    winAmount: CurrencyRecordTest;
}

export interface PlayerTest {
    playerLogin: string;
    bet: CurrencyRecordTest;
    currency: string;
    time: Date;
    coeff?: number;
    win?: CurrencyRecordTest;
    profileImage: string;
}

interface State {
    rate: number;
    lastRate: number;
    state: AvailableState;
    gameStatus: GameStatus;
    botState: BotState;
    roundStats: RoundStatistic;
    playersList: PlayerTest[];
}

const initialState: State = {
    rate: 1,
    lastRate: 1,
    state: "idle",
    gameStatus: {
        status: "active",
        message: null
    },
    botState: { status: "active", message: null },
    roundStats: {
        playersAmount: 0,
        betAmount: { USD: 0, UZS: 0, KZT: 0, RUB: 0, USDT: 0 },
        winAmount: { USD: 0, UZS: 0, KZT: 0, RUB: 0, USDT: 0 }
    },
    playersList: []
};

export interface BetTest {
    betNumber: 1 | 2;
    currency: Currency;
    bet: number;
    promoId?: string;
}

const testSlice = createSlice({
    name: "test",
    initialState,
    reducers: {
        setRate: (state, action: PayloadAction<number>) => {
            state.rate = Math.round(action.payload * 100) / 100;
        },
        setLastRate: (state, action: PayloadAction<number>) => {
            state.lastRate = action.payload;
        },
        toggleState: (state, action: PayloadAction<AvailableState>) => {
            state.state = action.payload;
        },
        abortBet: (state, action: PayloadAction<1 | 2>) => {},
        makeBet: (state, action: PayloadAction<BetTest>) => {},
        cashOut: (state, action: PayloadAction<1 | 2>) => {},
        updateRoundData: (
            state,
            action: PayloadAction<{
                betAmount: CurrencyRecordTest;
                winAmount: CurrencyRecordTest;
                currentPlayers: PlayerTest[];
            }>
        ) => {
            state.roundStats.playersAmount =
                action.payload.currentPlayers.length;
            state.roundStats.betAmount = action.payload.betAmount;
            state.roundStats.winAmount = action.payload.winAmount;
            state.playersList = action.payload.currentPlayers;
        },
        activateGame: state => {
            state.gameStatus = { status: "active", message: null };
        },
        deactivateGame: (state, action: PayloadAction<{ message: string }>) => {
            state.gameStatus = {
                status: "inactive",
                message: action.payload.message
            };
        },
        activateBot: state => {
            state.botState = { status: "active", message: null };
        },
        deactivateBot: (state, action: PayloadAction<{ message: string }>) => {
            state.botState = {
                status: "inactive",
                message: action.payload.message
            };
        }
    }
    // selectors: { selectRate: state => state.rate }
});

export const { actions: testSliceActions, reducer: testSliceReducer } =
    testSlice;

export const {
    setRate,
    setLastRate,
    toggleState,
    abortBet,
    makeBet,
    cashOut,
    updateRoundData,
    activateGame,
    deactivateGame,
    activateBot,
    deactivateBot
} = testSlice.actions;

// export const { selectRate } = testSlice.selectors;

const rate = (state: RootStore) => state.test.rate;

export const selectRate = createSelector([rate], rate => rate);

const betTab = (state: RootStore) => state.game;
export const selectRoundRate = createSelector(
    [betTab, rate, (betTab, betNumber: 1 | 2) => betNumber],
    (betTab, rate, betNumber) => {
        if (betTab.bets[betNumber - 1].betState === "cash") return rate;
        return 1;
    }
);

const lastRate = (state: RootStore) => state.test.lastRate;

export const selectLastRate = createSelector([lastRate], lastRate => {
    return lastRate;
});

const airplaneState = (state: RootStore) => state.test.state;

export const selectAirplaneState = createSelector(
    [airplaneState],
    airplaneState => airplaneState
);

const roundStatistic = (state: RootStore) => state.test.roundStats;

export const selectRoundStatistic = createSelector(
    [roundStatistic],
    roundStatistic => roundStatistic
);

const playersList = (state: RootStore) => state.test.playersList;

export const selectPlayersList = createSelector(
    [playersList],
    playersList => playersList
);
