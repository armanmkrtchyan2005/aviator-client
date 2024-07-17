import { configureStore, Tuple } from "@reduxjs/toolkit";
import {
    authApi,
    betApi,
    baseWithdrawApi,
    baseReplenishmentApi,
    // socketApi,
    userApi
} from "./api";
import { authReducer, gameSliceReducer, webSocketReducer } from "./slices";
import { settingsReducer } from "./slices/settingsSlice";
import { testSliceReducer } from "./slices/test.slice";

import { webSocketMiddleware } from "./middleware/webSocket.middleware";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        game: gameSliceReducer,
        webSocket: webSocketReducer,
        test: testSliceReducer,
        settings: settingsReducer,
        [authApi.reducerPath]: authApi.reducer,
        [betApi.reducerPath]: betApi.reducer,
        [baseWithdrawApi.reducerPath]: baseWithdrawApi.reducer,
        [baseReplenishmentApi.reducerPath]: baseReplenishmentApi.reducer,
        // [socketApi.reducerPath]: socketApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: getDefaultMiddleware =>
        // new Tuple(
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(betApi.middleware)
            .concat(baseWithdrawApi.middleware)
            .concat(baseReplenishmentApi.middleware)
            // .concat(socketApi.middleware)
            .concat(userApi.middleware)
            .concat(webSocketMiddleware)
    // )
});
