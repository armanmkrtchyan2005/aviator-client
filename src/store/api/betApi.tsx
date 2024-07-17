import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EntityState, createEntityAdapter } from "@reduxjs/toolkit";
import { Bet, PaginationParams, PreviousRoundInfoResponse } from "./types";
import { RootStore } from "../types";

interface Coefficient {
    _id: string;
    uid: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    endedAt: string;
    game_coeff: number;
}

export const topBetsEntityAdapter = createEntityAdapter({
    selectId: (bet: Bet) => bet._id,
    sortComparer: (a, b) => {
        return b.win["USD"] - a.win["USD"];
    }
});

export const userBetsEntityAdapter = createEntityAdapter({
    selectId: (bet: Bet) => bet._id,
    sortComparer: (a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
    }
});

export const topBetsEntitySelector = topBetsEntityAdapter.getSelectors();

export const userBetsEntitySelector = userBetsEntityAdapter.getSelectors();

export const betApi = createApi({
    reducerPath: "betApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootStore).auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),

    tagTypes: ["My", "Top", "Coefficients", "Previous"],

    endpoints: builder => ({
        getTopBets: builder.query<
            // { data: Bet[]; hasNextPage: boolean },
            EntityState<Bet, string>,
            (PaginationParams | undefined) & {
                dateSort: "day" | "month" | "year";
            }
        >({
            // queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
            //     const response = await baseQuery(
            //         `bets/tops?skip=${arg?.skip}&limit=${arg?.limit}`
            //     );

            //     if (response.error)
            //         return { error: response.error as FetchBaseQueryError };

            //     const data = response as Bet[];

            //     const hasNextPage = data.length === (arg?.limit ?? 0);

            //     return { data: data, hasNextPage: hasNextPage };
            // },
            // query: (args: PaginationParams | void) => ({
            //     url: "bets/tops",
            //     params: args
            //         ? { limit: args.limit, skip: args.skip }
            //         : undefined
            // }),
            // transformResponse: (response: Bet[]) => {
            //     return { data: response, hasNextPage: true } as const;
            // },
            // serializeQueryArgs: ({ endpointName }) => {
            //     return endpointName;
            // },
            // forceRefetch: ({ currentArg, previousArg, endpointState }) => {
            //     return (
            //         endpointState?.data?.hasNextPage &&
            //         currentArg?.skip !== previousArg?.skip
            //     );
            // },
            // merge: (currentCacheData, responseData, { arg }) => {
            //     currentCacheData.data.push(...responseData.data);
            //     currentCacheData.hasNextPage =
            //         responseData.data.length === (arg?.limit ?? 0);
            // },
            // merge: (currentCacheData, responseData) => {
            //     topBetsAdapter.addMany(
            //         currentCacheData,
            //         topBetsSelector.selectAll(responseData)
            //     );
            // }
            // keepUnusedDataFor: 0,

            query: (
                args: (PaginationParams | undefined) & {
                    dateSort: "day" | "month" | "year";
                }
            ) => ({
                url: "bets/tops",
                params: args
                    ? {
                          limit: args.limit,
                          skip: args.skip,
                          dateSort: args.dateSort
                      }
                    : undefined
            }),
            transformResponse: (response: Bet[]) => {
                return topBetsEntityAdapter.addMany(
                    topBetsEntityAdapter.getInitialState(),
                    response
                );
            },
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${queryArgs.dateSort}`;
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg?.skip !== previousArg?.skip;
            },
            merge: (currentCacheData, responseData) => {
                // topBetsEntitySelector.selectAll(responseData).length ===
                // (arg?.limit ?? 0);
                topBetsEntityAdapter.addMany(
                    currentCacheData,
                    topBetsEntitySelector.selectAll(responseData)
                );
            },
            providesTags: ["Top"]
        }),
        getUserBets: builder.query<
            EntityState<Bet, string>,
            PaginationParams | void
        >({
            query: args => ({
                url: "bets/my",
                params: args
                    ? { limit: args.limit, skip: args.skip }
                    : undefined
            }),
            // transformResponse: (response: Bet[]) => {
            //     return { data: response, hasNextPage: true } as const;
            // },
            // serializeQueryArgs: ({ endpointName }) => {
            //     return endpointName;
            // },
            // forceRefetch: ({ currentArg, previousArg, endpointState }) => {
            //     return (
            //         endpointState?.data?.hasNextPage &&
            //         currentArg?.skip !== previousArg?.skip
            //     );
            // },
            // merge: (currentCacheData, responseData, { arg }) => {
            //     currentCacheData.data.push(...responseData.data);
            //     currentCacheData.hasNextPage =
            //         responseData.data.length === (arg?.limit ?? 0);
            // },
            transformResponse: (response: Bet[]) => {
                return userBetsEntityAdapter.addMany(
                    userBetsEntityAdapter.getInitialState(),
                    response
                );
            },
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg?.skip !== previousArg?.skip;
            },
            merge: (currentCacheData, responseData) => {
                userBetsEntityAdapter.addMany(
                    currentCacheData,
                    userBetsEntitySelector.selectAll(responseData)
                );
            },
            providesTags: ["My"]
            // providesTags: (result, error, arg) => {
            //     console.log(result);

            //     return result
            //         ? [
            //               ...result.ids.map(() => ({
            //                   type: "My" as const,
            //                   page: arg?.skip / arg?.limit
            //               })),
            //               "My"
            //           ]
            //         : ["My"];
            // }
        }),
        getLastThirtyCoefficients: builder.query<
            Pick<Coefficient, "_id" | "game_coeff">[],
            void
        >({
            query: () => ({
                url: "bets/coeffs"
            }),
            transformResponse: (response: Coefficient[]) => {
                return response.map(rate => ({
                    _id: rate._id,
                    game_coeff: rate.game_coeff
                }));
            },
            providesTags: ["Coefficients"]
        }),
        getPreviousRoundInfo: builder.query<PreviousRoundInfoResponse, void>({
            query: () => ({
                url: "/bets/last-game"
            }),
            providesTags: ["Previous"]
        })
    })
});

export const {
    useGetTopBetsQuery,
    useLazyGetTopBetsQuery,
    useGetUserBetsQuery,
    useLazyGetUserBetsQuery,
    useGetLastThirtyCoefficientsQuery,
    useLazyGetLastThirtyCoefficientsQuery,
    useGetPreviousRoundInfoQuery,
    useLazyGetPreviousRoundInfoQuery
} = betApi;
