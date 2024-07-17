import { Currency, CurrencyRecord } from "../withdraw/types";

interface Turnover {
    confirmedCount: number;
    confirmed: number;
    inProcess: number;
}

interface Requisite {
    _id: string;
    name: string;
    account: string;
    requisite: string;
    active: boolean;
    currency: Currency;
    turnover: Turnover;
    isCardFileRequired: boolean;
    isReceiptFileRequired: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Limit {
    min: CurrencyRecord;
    max: CurrencyRecord;
}

export interface Method {
    _id: string;
    name: string;
    currency: Currency;
    img: string;
    commission: number;
    active: boolean;
    min_symbols_count: number;
    max_symbols_count: number;
    replenishment: boolean;
    withdrawal: boolean;
    replenishmentLimit: Limit;
    withdrawalLimit: Limit;
    balance: number;
}

export interface Replenishment {
    _id: string;
    user: string;
    amount: CurrencyRecord;
    deduction: CurrencyRecord;
    status: string;
    statusMessage: string;
    isPayConfirmed: boolean;
    requisite?: Requisite;
    method: Method;
    createdAt: string;
    completedDate: string;
    card: string;
    receipt: string;
    paymentUrl?: string;
    uid: number;
}

export interface SuccessResponse {
    message: string;
}

export type AllReplenishmentsResponse = Replenishment[];

export interface FetchReplenishmentByIdRequest {
    id: string;
}

export type FetchReplenishmentByIdResponse = Replenishment;

export interface ReplenishmentLimitsResponse {
    minLimit: number;
    maxLimit: number;
    currency: string;
}

export interface CreateReplenishmentRequest {
    currency: string;
    amount: number;
    requisite: string;
}

export type CreateReplenishmentResponse = Replenishment;

export interface CancelReplenishmentRequest {
    id: string;
}

export interface ConfirmReplenishmentRequest {
    id: string;
    receipt?: File;
}
