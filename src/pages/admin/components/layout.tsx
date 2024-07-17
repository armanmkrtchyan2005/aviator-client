import { Outlet } from "react-router-dom";

import { NavigationPanel } from "./navigation-panel";

export const Layout = () => {
    return (
        <>
            <header>
                <NavigationPanel />
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
};
