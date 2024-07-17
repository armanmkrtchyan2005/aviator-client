import { userApi } from "@/store/api/userApi";

export const securityApi = userApi.injectEndpoints({
    endpoints: builder => ({
        turnOn2FA: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/two-fa/set/on",
                method: "POST"
            })
        }),
        turnOff2FA: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/two-fa/set/off",
                method: "POST"
            })
        }),
        send2FAConfirmationCode: builder.mutation<
            { message: string },
            { code: number }
        >({
            query: ({ code }) => ({
                url: "/two-fa/set",
                method: "POST",
                body: { code }
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(
                        userApi.util.updateQueryData(
                            "getUser",
                            undefined,
                            draft => {
                                draft.twoFA = !draft.twoFA;
                            }
                        )
                    );
                } catch {}
            }
        }),
        verifyUser: builder.mutation<
            { token: string },
            { login: string; code: number }
        >({
            query: body => ({
                url: "/auth/login/verify",
                method: "POST",
                body
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userApi.util.invalidateTags(["User", "Balance"]));
                } catch {}
            }
        })
    })
});

export const {
    useTurnOn2FAMutation,
    useTurnOff2FAMutation,
    useSend2FAConfirmationCodeMutation,
    useVerifyUserMutation
} = securityApi;
