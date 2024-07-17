export type Currency = "USD" | "RUB" | "UZS" | "KZT" | "USDT" | "UAH";

export type CurrencyRecord = Record<Currency, number>;

export interface Requisite {
    _id: string;
    requisite: string;
    name: string;
    currency: string;
    img: string;
    commission: number;
    status: string;
}

export interface Withdrawal {
    _id: string;
    user: string;
    amount: CurrencyRecord;
    currency: string;
    status: string;
    statusMessage: string;
    userRequisite: string;
    requisite: Requisite;
    createdAt: string;
    completedDate: string;
    uid: number;
}

export interface PaymentDrawRequest {
    currency: string;
    amount: number;
    requisite: string;
    userRequisite: string;
}

export interface FetchAllWithdrawsResponse extends Withdrawal {}

export interface CreateWithdrawResponse extends Withdrawal {}

export interface CreateWithdrawRequest {
    currency: string;
    amount: number;
    requisite: string;
    userRequisite: string;
}

export interface CreateWithdrawResponse extends Withdrawal {}

export interface CancelWithdrawByIdRequest {
    id: string;
}

export interface CancelWithdrawByIdResponse {
    message: string;
}

export interface WithdrawalLimitsRequest {
    id: string;
}

export interface WithdrawalLimitsResponse {
    minLimit: number;
    maxLimit: number;
    currency: Currency;
    minSymbols: number;
    maxSymbols: number;
}
