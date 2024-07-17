import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

export const ReferralRedirect = () => {
    const [searchParams] = useSearchParams();

    const uid = searchParams.get("uid");

    useEffect(() => {
        if (!uid) return;

        sessionStorage.setItem("referral", JSON.stringify({ uid: uid }));
    }, [uid]);

    return <Navigate to="/main" />;
};
