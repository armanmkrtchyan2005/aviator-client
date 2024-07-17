import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithLogout } from "./api";

export const baseWithdrawApi = createApi({
    reducerPath: "withdrawApi",
    baseQuery: baseQueryWithLogout,
    tagTypes: ["Withdraw"],
    endpoints: () => ({})
});
