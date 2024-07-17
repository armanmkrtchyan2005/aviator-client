export interface Player {
    playerLogin: string;
    bet: number;
    currency: string;
    time: Date;
    coeff?: number;
    win?: number;
}

export interface GameData {
    x: number;
    currentPlayers: Player[];
}

export interface Bet {
    currency: string;
    bet: number;
    bonusId?: string;
}

export interface CashOut {
    betNumber: number;
}
