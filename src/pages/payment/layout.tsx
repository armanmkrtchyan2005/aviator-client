import { Outlet } from "react-router-dom";
import { Header } from "./components";

import { Toaster } from "@/components/ui/sonner";

// import { Toaster } from "@/components/ui/toaster";

export const Layout = () => {
    return (
        <>
            <Header />

            <main className="content-wrapper flex flex-auto flex-col gap-y-4">
                <Outlet />
            </main>

            <Toaster />
        </>
    );
};
