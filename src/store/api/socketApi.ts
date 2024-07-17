import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createEntityAdapter } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";

import { io } from "socket.io-client";
// import { userApi } from "./userApi";

interface Player {
    id: number;
    bet: number;
    currency: string;
    time: string;
    coeff: number;
    win: number;
    player: string;
}

// interface Bet {
//     currency: string;
//     bet: number;
//     bonusId?: string;
// }

const URL = "http://5.45.65.88:8080/";

export const socket = io(URL, {
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGM2MjcyNGVjYmE1MmRhZmU1YWIwMCIsImlhdCI6MTcwNDMwMDYxNiwiZXhwIjoxNzA0OTA1NDE2fQ.PNQff-AWQpAEroZiO_Rgr5eTjWOEW7wwvmWdBiQFHn4"
    }
});

const messagesAdapter = createEntityAdapter<Player>();

export const socketApi = createApi({
    reducerPath: "socketApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/" }),
    endpoints: builder => ({
        placeBet: builder.query<EntityState<Player, number>, void>({
            query: () => "/",
            transformResponse(response: Player[]) {
                return messagesAdapter.addMany(
                    messagesAdapter.getInitialState(),
                    response
                );
            },
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                // socket.connect();
                try {
                    await cacheDataLoaded;

                    const listener = (event: MessageEvent) => {
                        const data = JSON.parse(event.data);

                        updateCachedData(draft => {
                            messagesAdapter.upsertOne(draft, data);
                        });
                    };

                    socket.on("currentPlayer", listener);
                } catch {
                    console.log("Error");
                }
                await cacheEntryRemoved;
                // socket.disconnect();
            }
        })
    })
});

socket.on("connect", () => {
    console.log("connected to server");
});

socket.on("disconnect", () => {
    console.log("Disconnect from server");
});

socket.on("currentPlayers", (data: Player[]) => {
    console.log("Player connected", data);
});

export const { usePlaceBetQuery } = socketApi;
