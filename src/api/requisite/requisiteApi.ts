import { userApi } from "@/store/api/userApi";
import { RequisitesResponse, RecommendedRequisitesResponse } from "./types";

export const requisiteApi = userApi.injectEndpoints({
    endpoints: builder => ({
        fetchRequisites: builder.query<
            RequisitesResponse,
            { type?: "replenishment" | "withdrawal" }
        >({
            query: ({ type = "replenishment" }) => ({
                url: "user/requisites",
                params: { type }
            })
        }),
        fetchRecommendedRequisites: builder.query<
            RecommendedRequisitesResponse,
            { type: "replenishment" | "withdrawal" }
        >({
            query: ({ type = "replenishment" }) => ({
                url: "user/requisites/recommended",
                params: { type }
            })
        })
    })
});

export const {
    useFetchRequisitesQuery,
    useLazyFetchRequisitesQuery,
    useFetchRecommendedRequisitesQuery,
    useLazyFetchRecommendedRequisitesQuery
} = requisiteApi;
