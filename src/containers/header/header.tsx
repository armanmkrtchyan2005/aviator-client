import { BurgerMenu, BalanceMenu } from "@/components/dropdown-menus";
import { SignInButton } from "./components/sign-in-button";
import { SignUpButton } from "./components/sign-up-button";
import { Logo } from "./components/logo";

import { useAuth } from "@/store/hooks/useAuth";

export const Header = () => {
    const { isAuthenticated } = useAuth();

    return (
        <header className="content-wrapper">
            <div className="flex items-center justify-between rounded-sm bg-[#1b1c1d] px-2.5">
                <div className="flex items-center justify-between gap-2 xs:gap-4">
                    <Logo />
                    {isAuthenticated ? (
                        <button className="h-6 w-6 rounded-full bg-[#2c2d30] p-1 text-center text-sm font-bold leading-none text-slate-400">
                            <span>?</span>
                            <span className="sr-only">Как играть?</span>
                        </button>
                    ) : null}
                </div>
                <div className="relative flex items-center gap-2 py-2 xs:gap-4">
                    {!isAuthenticated ? (
                        <button className="h-6 w-6 rounded-full bg-[#2c2d30] p-1 text-center text-sm font-bold leading-none text-slate-400">
                            <span>?</span>
                            <span className="sr-only">Как играть?</span>
                        </button>
                    ) : null}

                    {isAuthenticated ? <BalanceMenu /> : null}

                    <BurgerMenu />
                </div>
            </div>
            {!isAuthenticated ? (
                <div className="mt-2 flex gap-2">
                    <SignInButton />
                    <SignUpButton />
                </div>
            ) : null}
        </header>
    );
};
