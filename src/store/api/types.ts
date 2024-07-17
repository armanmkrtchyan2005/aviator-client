//! ================= Authentication types ================= //

export interface UserRegistrationCredentials {
    currency: string;
    login: string;
    password: string;
    passwordConfirm: string;
    email?: string;
    telegramId?: number;
    from?: string;
    promocode?: string;
}

export interface AuthenticationUserRequest {
    login: string;
    password: string;
}

export interface AuthenticationUserResponse {
    twoFactorEnabled: boolean;
    token: string;
    message: string;
}

export interface Token {
    token: string;
}

export interface CreateNewUserResponse {
    isEmailToken: boolean;
    token: string;
}

export interface ConfirmNewUserEmailRequest {
    currency: string;
    login: string;
    password: string;
    passwordConfirm: string;
    email: string;
    telegramId?: number;
    promocode?: string;
    from?: string;
    token: string;
    code: number;
}

export interface SuccessResponse {
    message: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ChangePasswordConfirmRequest {
    code: number;
    email: string;
}

export interface ChangePasswordRequest {
    token: string;
    password: string;
    passwordConfirm: string;
}

//! ================= User types ================= //

export type Currency = "USD" | "RUB" | "UZS" | "KZT" | "UAH" | "USDT";

export type CurrencyRecord = Record<Currency, number>;

export interface User {
    _id: string;
    telegramId: number;
    currency: Currency;
    login: string;
    email: string;
    balance: number;
    profileImage: string;
    twoFA: boolean;
    uid: number;
}

export interface UserBalance {
    balance: number;
    currency: Currency;
}

export interface Promo {
    _id: string;
    type: "add_balance" | "promo";
    name: string;
    amount: number;
    currency: Currency;
    max_count: number;
    limit: number | null;
    coef: number;
    will_finish: "string";
}

export interface UserRequisite {
    requisites: Requisite[];
    currency: string;
}

//! ================= Bet types ================= //

export interface Bet {
    _id: string;
    bet: CurrencyRecord;
    currency: Currency;
    time: string;
    coeff: number;
    win: CurrencyRecord;
    playerId: string;
    playerLogin: string;
    profileImage: string;
    game_coeff: number;
}

export interface PaginationParams {
    skip?: number;
    limit?: number;
}

export interface Player {
    bet: CurrencyRecord;
    time: string;
    coeff: number;
    win: CurrencyRecord | undefined;
    playerId: string;
    playerLogin: string;
    profileImage: string;
}

export interface PreviousRoundInfoResponse {
    winAmount: CurrencyRecord;
    betAmount: CurrencyRecord;
    bets: Player[];
}

//! ================= Admin types ================= //

export interface AdminAuthorizationData {
    login: string;
    password: string;
}

//! ================= Payment types ================= //
export interface Requisite {
    _id: string;
    requisite: string;
    name: string;
    currency: string;
    img: string;
    commission: number;
    status: string;
}

export interface Replenishment {
    _id: string;
    user: string;
    amount: number;
    currency: string;
    deduction: number;
    status: string;
    statusMessage: string;
    isPayConfirmed: boolean;
    requisite: Requisite;
    createdAt: string;
    completedDate: string;
}

export interface PaymentDrawRequest {
    currency: string;
    amount: number;
    requisite: string;
    userRequisite: string;
}

//! ================= Telegram types ================= //

interface WebAppUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    is_premium: boolean;
    added_to_attachment_menu: boolean;
    allows_write_to_pm: boolean;
    photo_url: string;
}

interface WebAppChat {
    id: number;
    type: string;
    title: string;
    username: string;
    photo_url: string;
}
interface WebAppInitData {
    query_id: string;
    user: WebAppUser;
    receiver: WebAppUser;
    chat: WebAppChat;
    chat_type: string;
    chat_instance: string;
    start_param: string;
    can_send_after: number;
    auth_date: number;
    hash: string;
}

interface BackButton {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
}

interface MainButton {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: unknown) => boolean;
    hideProgress: () => void;
    setParams: (params: {
        text: string;
        color: string;
        text_color: string;
        is_active: boolean;
        is_visible: boolean;
    }) => void;
}

interface WebApp {
    initData: string;
    initDataUnsafe: WebAppInitData;
    version: string;
    platform: string;
    colorScheme: string;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    isClosingConfirmationEnabled: boolean;
    BackButton: BackButton;
    MainButton: MainButton;
    openLink: (url: string) => void;
}

export interface TelegramClient {
    WebApp: WebApp;
}
