import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/store/hooks/useAuth";

interface PrivateRouteProps {
    to: string;
    asChild?: boolean;
    children?: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
    to,
    asChild = false,
    children
}) => {
    const { isAuthenticated } = useAuth();
    // const location = useLocation();

    return isAuthenticated ? (
        asChild ? (
            children
        ) : (
            <Outlet />
        )
    ) : (
        <Navigate
            to={to}
            replace={true}
        />
    );
};
