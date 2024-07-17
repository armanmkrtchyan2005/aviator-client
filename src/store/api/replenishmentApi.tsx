import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithLogout } from "./api";

export const baseReplenishmentApi = createApi({
    reducerPath: "replenishmentApi",
    baseQuery: baseQueryWithLogout,
    tagTypes: ["Replenishment"],
    endpoints: () => ({})
});
