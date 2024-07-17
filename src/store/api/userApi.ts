import { createApi } from "@reduxjs/toolkit/query/react";
import { EntityState, createEntityAdapter } from "@reduxjs/toolkit";

import { baseQueryWithLogout } from "./api";

import {
    User,
    UserBalance,
    Promo,
    Token,
    SuccessResponse,
    ChangePasswordRequest,
    PaginationParams
} from "./types";
// import { toast } from "sonner";
// import { isErrorWithMessage, isFetchBaseQueryError } from "../services";

interface Referral {
    currency: string;
    referralBalance: number;
    descendants: Descendant[];
}
export interface Descendant {
    _id: string;
    uid: number;
    createdAt: string;
    updatedUt: string;
    earnings: number;
}

interface ReferralByDay {
    _id: string;
    date: string;
    totalEarned: number;
}

interface GameLimits {
    min: number;
    max: number;
    maxWin: number;
    currency: string;
}

export const referralEntityAdapter = createEntityAdapter({
    selectId: (referral: ReferralByDay) => referral._id
});

export const referralEntitySelector = referralEntityAdapter.getSelectors();

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithLogout,
    tagTypes: ["User", "Balance", "Promo"],
    endpoints: builder => ({
        //! =================================================================
        getUser: builder.query<User, void>({
            query: () => ({
                url: "user"
            }),
            providesTags: ["User"]
        }),
        getGameLimits: builder.query<GameLimits, void>({
            query: () => ({
                url: "/user/game-limits"
            })
        }),
        getUserReferral: builder.query<Referral, void>({
            query: () => ({
                url: "/user/referral"
            }),
            transformResponse: (response: Referral) => {
                response.descendants.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );

                return response;
            }
        }),
        getUserReferralByDays: builder.query<
            EntityState<ReferralByDay, string>,
            PaginationParams | void
        >({
            query: args => ({
                url: "/user/referral/by-days",
                params: args
                    ? { limit: args.limit, skip: args.skip }
                    : undefined
            }),
            // transformResponse: (
            //     response: {
            //         _id: string;
            //         date: string;
            //         totalEarned: number;
            //     }[]
            // ) => {
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
            // }
            transformResponse: (response: ReferralByDay[]) => {
                return referralEntityAdapter.addMany(
                    referralEntityAdapter.getInitialState(),
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
                referralEntityAdapter.addMany(
                    currentCacheData,
                    referralEntitySelector.selectAll(responseData)
                );
            }
        }),
        getUserBalance: builder.query<UserBalance, void>({
            query: () => ({
                url: "user/balance"
            }),
            providesTags: ["Balance"]
        }),
        getUserPromo: builder.query<Promo[], { type: "add_balance" | "promo" }>(
            {
                query: ({ type }) => ({
                    url: "user/promos",
                    params: { type }
                }),
                providesTags: ["Promo"]
            }
        ),

        //! =================================================================
        activatePromoCode: builder.mutation<
            SuccessResponse,
            { promoCode: string }
        >({
            query: body => ({
                url: "user/promos",
                method: "POST",
                body
            }),
            // async onQueryStarted(_, { queryFulfilled }) {
            //     try {
            //         const { data } = await queryFulfilled;
            //         toast("Промокод успешно активирован", {
            //             position: "top-center",
            //             action: {
            //                 label: "Скрыть",
            //                 onClick: () => {}
            //             }
            //         });
            //     } catch {
            //         toast(data, {
            //             position: "top-center",
            //             action: {
            //                 label: "Скрыть",
            //                 onClick: () => {}
            //             }
            //         });
            //         if (isFetchBaseQueryError(error)) {
            //             const errorMessage =
            //                 "error" in error
            //                     ? error.error
            //                     : (
            //                           error.data as {
            //                               status: number;
            //                               message: string;
            //                           }
            //                       ).message;
            //             toast(errorMessage, {
            //                 position: "top-center",
            //                 action: {
            //                     label: "Скрыть",
            //                     onClick: () => {}
            //                 }
            //                 // icon: (
            //                 //     <PiWarningFill className="text-4xl leading-none text-red-500" />
            //                 // )
            //             });
            //         } else if (isErrorWithMessage(error)) {
            //             toast(error.message, {
            //                 position: "top-center",
            //                 action: {
            //                     label: "Скрыть",
            //                     onClick: () => {}
            //                 }
            //                 // icon: (
            //                 //     <PiWarningFill className="text-4xl leading-none text-red-500" />
            //                 // )
            //             });
            //         }
            //     }
            // },

            invalidatesTags: (result, error) => (error ? [] : ["Promo"])

            // invalidatesTags: ["Promo"]
        }),
        sendConfirmationCodeOnExistingEmail: builder.mutation<
            SuccessResponse,
            { type: "change" | "reset" } | void
        >({
            query: args => ({
                url: "user/confirm-email/send-code",
                method: "POST",
                body: {
                    type: args?.type ? args?.type : "change"
                }
            })
        }),
        confirmExistingEmail: builder.mutation<
            { message: string; token: string },
            { code: number; email: string; type: "reset" | "change" }
        >({
            query: body => ({
                url: "user/confirm-email",
                method: "POST",
                body
            })
        }),
        sendEmailChangeCode: builder.mutation<
            SuccessResponse,
            { email: string }
        >({
            query: body => ({
                url: "user/change-email/send-code",
                method: "POST",
                body
            })
        }),
        //! =================================================================
        changeEmail: builder.mutation<{ message: string }, { code: number }>({
            query: ({ code }) => ({
                url: "user/change-email",
                method: "PUT",
                body: {
                    code,
                    email: sessionStorage.getItem("email")
                }
            }),
            invalidatesTags: (result, error) => (error ? [] : ["User"])
        }),
        changeUserPassword: builder.mutation<
            SuccessResponse,
            ChangePasswordRequest
        >({
            query: ({ token, ...body }) => ({
                url: `/user/password/${token}`,
                method: "PUT",
                body
            })
        }),
        changePasswordConfirm: builder.mutation<Token, { password: string }>({
            query: body => ({
                url: "user/password/confirm",
                method: "PUT",
                body
            })
        }),
        changeProfileImage: builder.mutation<User, File>({
            query: file => {
                const formData = new FormData();
                formData.append("file", file);
                return {
                    url: "/user/profile-image",
                    method: "PUT",
                    body: formData,
                    headers: {
                        Accept: "application/json"
                    },
                    formData: true
                };
            },
            // async onQueryStarted(_, { dispatch, queryFulfilled }) {
            //     try {
            //         await queryFulfilled;
            //         dispatch(userApi.util.invalidateTags(["User"]));
            //     } catch (error) {
            //         console.error(error);
            //     }
            // }
            invalidatesTags: ["User"]
        })
    })
});

export const {
    useGetUserQuery,
    useLazyGetUserQuery,
    useGetGameLimitsQuery,
    useLazyGetGameLimitsQuery,
    useGetUserReferralQuery,
    useLazyGetUserReferralQuery,
    useGetUserReferralByDaysQuery,
    useLazyGetUserReferralByDaysQuery,
    useGetUserBalanceQuery,
    useLazyGetUserBalanceQuery,
    useGetUserPromoQuery,
    useLazyGetUserPromoQuery,
    useActivatePromoCodeMutation,
    useSendConfirmationCodeOnExistingEmailMutation,
    useConfirmExistingEmailMutation,
    useSendEmailChangeCodeMutation,
    useChangeEmailMutation,
    useChangePasswordConfirmMutation,
    useChangeUserPasswordMutation,
    useChangeProfileImageMutation
} = userApi;
