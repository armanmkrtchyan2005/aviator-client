export interface Requisite {
    _id: string;
    requisite: string;
    name: string;
    currency: string;
    img: string;
    commission: number;
    status: string;
}

export type RequisitesResponse = {
    requisites: Requisite[];
    currency: string;
}[];

export type RecommendedRequisitesResponse = Requisite[];
