import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    UserRegistrationCredentials,
    AuthenticationUserRequest,
    CreateNewUserResponse,
    ConfirmNewUserEmailRequest,
    Token,
    SuccessResponse,
    AuthenticationUserResponse,
    ForgotPasswordRequest,
    ChangePasswordConfirmRequest,
    ChangePasswordRequest
} from "./types";
import { userApi } from ".";
import { authenticate } from "../slices/socketSlice";

interface SignOutRequest {
    token: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL
    }),
    endpoints: builder => ({
        getServiceLink: builder.query<
            {
                support: "string";
                news: "string";
                chat: "string";
            },
            void
        >({
            query: () => ({
                url: "links"
            })
        }),
        createNewUserAccount: builder.mutation<
            CreateNewUserResponse,
            UserRegistrationCredentials
        >({
            query: body => ({
                url: "auth/registration",
                method: "POST",
                body
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userApi.util.invalidateTags(["User", "Balance"]));
                } catch {}
            }
        }),
        confirmNewUserEmail: builder.mutation<
            Token,
            ConfirmNewUserEmailRequest
        >({
            query: body => ({
                url: "/auth/registration/confirm",
                method: "POST",
                body: body
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userApi.util.invalidateTags(["User", "Balance"]));
                } catch {}
            }
        }),
        authenticateUser: builder.mutation<
            AuthenticationUserResponse,
            AuthenticationUserRequest
        >({
            query: body => ({
                url: "auth/login",
                method: "POST",
                body
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const response = await queryFulfilled;

                    if (!response.data.twoFactorEnabled) {
                        dispatch(
                            userApi.util.invalidateTags(["User", "Balance"])
                        );
                        dispatch(authenticate(response.data.token));
                    }
                } catch {}
            }
        }),
        signOut: builder.mutation<void, SignOutRequest>({
            query: ({ token }) => ({
                url: "/auth/sign-out",
                method: "POST",
                body: { token: token }
            })
        }),
        // verifyUser: builder.mutation<
        //     { token: string },
        //     { login: string; code: number }
        // >({
        //     query: body => ({
        //         url: "/auth/login/verify",
        //         method: "POST",
        //         body
        //     }),
        //     async onQueryStarted(_, { dispatch, queryFulfilled }) {
        //         try {
        //             await queryFulfilled;
        //             dispatch(userApi.util.invalidateTags(["User", "Balance"]));
        //         } catch {}
        //     }
        // }),
        sendConfirmationCode: builder.mutation<
            SuccessResponse,
            ForgotPasswordRequest
        >({
            query: body => ({
                url: "auth/forgot/send-code",
                method: "POST",
                body
            })
        }),
        confirmPasswordChange: builder.mutation<
            Token,
            ChangePasswordConfirmRequest
        >({
            query: ({ code }) => ({
                url: "auth/forgot/confirm-code",
                method: "POST",
                body: {
                    code,
                    email: sessionStorage.getItem("email")
                }
            })
        }),
        changePassword: builder.mutation<
            SuccessResponse,
            ChangePasswordRequest & Token
        >({
            query: ({ token, ...body }) => ({
                url: `auth/forgot/change-password/${token}`,
                method: "PUT",
                body
            })
        })
    })
});

export const {
    useCreateNewUserAccountMutation,
    useConfirmNewUserEmailMutation,
    useAuthenticateUserMutation,
    useSignOutMutation,
    useSendConfirmationCodeMutation,
    useConfirmPasswordChangeMutation,
    useChangePasswordMutation,
    useGetServiceLinkQuery,
    useLazyGetServiceLinkQuery
} = authApi;
