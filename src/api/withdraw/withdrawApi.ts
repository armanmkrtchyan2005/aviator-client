import { userApi } from "@/store/api/userApi";
import { baseWithdrawApi } from "@/store/api/withdrawal";
import {
    FetchAllWithdrawsResponse,
    CreateWithdrawRequest,
    CreateWithdrawResponse,
    CancelWithdrawByIdRequest,
    CancelWithdrawByIdResponse,
    Currency,
    WithdrawalLimitsRequest,
    WithdrawalLimitsResponse
} from "./types";

export const withdrawApi = baseWithdrawApi.injectEndpoints({
    endpoints: builder => ({
        fetchAllWithdraws: builder.query<FetchAllWithdrawsResponse[], void>({
            query: () => ({
                url: "withdrawals"
            }),
            providesTags: ["Withdraw"]
        }),
        fetchWithdrawalLimits: builder.query<
            WithdrawalLimitsResponse,
            WithdrawalLimitsRequest
        >({
            query: ({ id }) => ({ url: `/withdrawals/limits/${id}` })
        }),
        createWithdraw: builder.mutation<
            CreateWithdrawResponse,
            CreateWithdrawRequest
        >({
            query: body => ({
                url: "withdrawals",
                method: "POST",
                body
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    dispatch(userApi.util.invalidateTags(["Balance"]));
                } catch {}
            },
            invalidatesTags: (result, error) => (error ? [] : ["Withdraw"])
        }),
        cancelWithdrawById: builder.mutation<
            CancelWithdrawByIdResponse,
            CancelWithdrawByIdRequest
        >({
            query: ({ id }) => ({
                url: `withdrawals/${id}/cancel`,
                method: "PUT"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    dispatch(userApi.util.invalidateTags(["Balance"]));
                } catch {}
            },
            invalidatesTags: (result, error) => (error ? [] : ["Withdraw"])
        })
    })
});

export const {
    useFetchAllWithdrawsQuery,
    useLazyFetchAllWithdrawsQuery,
    useFetchWithdrawalLimitsQuery,
    useLazyFetchWithdrawalLimitsQuery,
    useCreateWithdrawMutation,
    useCancelWithdrawByIdMutation
} = withdrawApi;
