import { Link } from "react-router-dom";

import { BalanceMenu } from "@/components/dropdown-menus";
import { Logo } from "@/containers/header/components/logo";

export const Header = () => {
    return (
        <header className="content-wrapper flex items-center justify-between px-2.5 py-2">
            <Link to="/main">
                <Logo />
            </Link>
            <BalanceMenu />
        </header>
    );
};
