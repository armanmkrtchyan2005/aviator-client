import { useMemo } from "react";
// import { useSelector } from "react-redux";
import { useStateSelector } from "..";
// import {
// getAuthenticationStatus
// selectToken,
// selectAuthenticationStatus
// } from "../slices/authSlice";

// export const useAuth = () => {
//     const { token, isAuthenticated } = useSelector(getAuthenticationStatus);

//     return useMemo(
//         () => ({
//             token,
//             isAuthenticated
//         }),
//         [token, isAuthenticated]
//     );
// };

export const useAuth = () => {
    const token = useStateSelector(state => state.auth.token);
    const isAuthenticated = useStateSelector(
        state => state.auth.isAuthenticated
    );

    return useMemo(
        () => ({
            token,
            isAuthenticated
        }),
        [token, isAuthenticated]
    );
};
