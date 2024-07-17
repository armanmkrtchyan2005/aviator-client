import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type WebSocketStatus = "connected" | "disconnected";

interface WebSocketState {
    status: WebSocketStatus;
    token: string | null;
}

export const initialState: WebSocketState = {
    status: "disconnected",
    token: null
};

const webSocketSlice = createSlice({
    name: "webSocket",
    initialState,
    reducers: {
        wsConnect: state => {
            state.status = "connected";
        },
        wsDisconnect: state => {
            state.status = "disconnected";
        },
        authenticate: (state, action: PayloadAction<string>) => {}
    }
});

export const { actions: webSocketActions, reducer: webSocketReducer } =
    webSocketSlice;
export const { wsConnect, wsDisconnect, authenticate } = webSocketSlice.actions;
