import { createSlice, createSelector } from "@reduxjs/toolkit";

import { authApi } from "../api/authApi";
import { userApi } from "../api/userApi";
import { securityApi } from "@/api/securityApi";
// import { authApi } from "@/api/auth";
import { RootStore } from "../types";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    // initData: Pick<User, "login" | "telegramId" | "profileImage"> | null;
}

// type AuthState = AuthorizedUser | NonAuthorizedUser;

export const authSlice = createSlice({
    name: "auth",
    initialState: () => {
        const storedData = localStorage.getItem("token");

        if (!storedData)
            return {
                token: null,
                isAuthenticated: false
                // initData: null
            };

        const { token } = JSON.parse(storedData);

        return {
            token,
            isAuthenticated: true
            // initData: null
        } as AuthState;
    },
    reducers: {
        logout: state => {
            // localStorage.removeItem("token");
            state.token = null;
            state.isAuthenticated = false;
        }
        // setUserInitData: (
        //     state,
        //     {
        //         payload
        //     }: { payload: Pick<User, "login" | "telegramId" | "profileImage"> }
        // ) => {
        //     state.initData = {
        //         login: payload.login,
        //         telegramId: payload.telegramId,
        //         profileImage: payload.profileImage
        //     };
        // }
    },
    extraReducers: builder => {
        builder
            .addMatcher(
                authApi.endpoints.authenticateUser.matchFulfilled,
                (state, { payload }) => {
                    if (payload.twoFactorEnabled) return;

                    localStorage.setItem(
                        "token",
                        JSON.stringify({ token: payload.token })
                    );
                    state.token = payload.token;
                    state.isAuthenticated = true;
                }
            )
            .addMatcher(
                securityApi.endpoints.verifyUser.matchFulfilled,
                (state, { payload }) => {
                    localStorage.setItem(
                        "token",
                        JSON.stringify({ token: payload.token })
                    );
                    state.token = payload.token;
                    state.isAuthenticated = true;
                }
            )
            .addMatcher(
                authApi.endpoints.createNewUserAccount.matchFulfilled,
                (state, { payload }) => {
                    if (payload.isEmailToken) return state;

                    localStorage.setItem(
                        "token",
                        JSON.stringify({ token: payload.token })
                    );
                    state.token = payload.token;
                    state.isAuthenticated = true;
                }
            )
            .addMatcher(
                authApi.endpoints.confirmNewUserEmail.matchFulfilled,
                (state, { payload }) => {
                    localStorage.setItem(
                        "token",
                        JSON.stringify({ token: payload.token })
                    );
                    state.token = payload.token;
                    state.isAuthenticated = true;
                }
            );
        // .addMatcher(
        //     userApi.endpoints.changePasswordConfirm.matchFulfilled,
        //     (state, { payload }) => {
        //         localStorage.setItem(
        //             "token",
        //             JSON.stringify({ token: payload.token })
        //         );
        //         state.token = payload.token;
        //     }
        // );
        // .addMatcher(authApi.endpoints.signOut.matchFulfilled, state => {
        //     localStorage.removeItem("token");
        //     state.token = null;
        //     state.isAuthenticated = false;
        // state.initData = {
        //     login: state?.initData?.login as string,
        //     telegramId: state.initData?.telegramId as number,
        //     profileImage: state.initData?.profileImage as string
        // };
        //     userApi.util.resetApiState();
        // });
    }
});

export const { reducer: authReducer, actions: authActions } = authSlice;

export const { logout } = authSlice.actions;

export const getAuthenticationStatus = (state: RootStore) => ({
    token: state.auth.token,
    isAuthenticated: state.auth.isAuthenticated
});

export const selectToken = (state: RootStore) => state.auth.token;
export const selectAuthenticationStatus = (state: RootStore) =>
    state.auth.isAuthenticated;

// export const { setUserInitData } = authSlice.actions;

const selectLogin = (state: RootStore) => state.auth.initData?.login;
const selectTelegramId = (state: RootStore) => state.auth.initData?.telegramId;
const selectProfileImage = (state: RootStore) =>
    state.auth.initData?.profileImage;

export const selectInitData = createSelector(
    [selectLogin, selectTelegramId, selectProfileImage],
    (login, telegramId, profileImage) => ({
        login,
        telegramId,
        profileImage
    })
);
