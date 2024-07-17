import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

import { useAuth } from "@/store/hooks/useAuth";
import { useStateSelector } from "@/store/hooks";
import { useGetUserBalanceQuery } from "@/store/api/userApi";
import { useGetServiceLinkQuery } from "@/store/api/authApi";

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";

import {
    DropDownMenuItem,
    DropDownMenuSeparator
} from "@/components/ui/drop-down-list";

import { UserProfileDetails } from "@/components/user-profile-details";
import { RedirectMenu } from "@/components/redirect-menu";
import { GameSettings } from "@/components/game-settings";

import { Logo } from "@/containers/header/components/logo";
import { FiMenu } from "react-icons/fi";
import { BiSupport } from "react-icons/bi";
import { HiOutlineChatBubbleBottomCenterText } from "react-icons/hi2";
import { ImNewspaper } from "react-icons/im";

export const ServiceUnavailablePage = () => {
    const { isAuthenticated } = useAuth();
    const botState = useStateSelector(state => state.test.botState);

    const { data: balance, isLoading } = useGetUserBalanceQuery(undefined, {
        skip: !isAuthenticated
    });

    return (
        <main className="content-wrapper flex min-h-screen flex-col">
            <header className="flex items-center justify-between rounded-sm bg-[#1b1c1d] px-2.5">
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

                    {isAuthenticated ? (
                        isLoading ? (
                            <span className="h-[30px] w-20 animate-pulse rounded-full border border-[#414148] bg-slate-700" />
                        ) : (
                            <button className="rounded-full border border-[#414148] bg-[#252528] px-3 py-0.5">
                                <span className="font-bold text-[#28A909]">
                                    {balance?.balance?.toFixed(2)}
                                </span>{" "}
                                {balance?.currency}
                            </button>
                        )
                    ) : null}

                    <BurgerMenu />
                </div>
            </header>
            <section className="flex-auto place-content-center text-balance text-3xl font-bold">
                {botState?.message}
            </section>
            <Toaster />
        </main>
    );
};

const BurgerMenu = () => {
    const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
    const { data: links } = useGetServiceLinkQuery();

    const closeBurgerMenu = () => {
        setBurgerMenuOpen(false);
    };

    return (
        <Popover
            open={burgerMenuOpen}
            onOpenChange={setBurgerMenuOpen}
        >
            <PopoverTrigger className="rounded-full border border-[#414148] bg-[#252528] px-3 py-0.5 transition-colors duration-150 aria-expanded:text-[#e50539] mh:hover:text-[#e50539]">
                <FiMenu />
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={10}
                className="z-10 w-72 border-none bg-[#2c2d30] p-0 text-white"
            >
                <div className="p-0 text-sm">
                    <UserProfileDetails />
                    <GameSettings />
                </div>
                <DropDownMenuSeparator className="h-3" />

                <ul className="text-sm">
                    <DropDownMenuItem>
                        <a
                            href={links?.support}
                            target="_blank"
                            onClick={closeBurgerMenu}
                            className="flex gap-x-2 px-2.5 py-2"
                        >
                            <BiSupport className="text-base text-[#767b85]" />
                            <span>Поддержка</span>
                        </a>
                    </DropDownMenuItem>
                    <DropDownMenuSeparator />

                    <DropDownMenuItem>
                        <a
                            href={links?.news}
                            target="_blank"
                            onClick={closeBurgerMenu}
                            className="flex gap-x-2 px-2.5 py-2"
                        >
                            <ImNewspaper className="text-base text-[#767B85]" />
                            <span>Новости</span>
                        </a>
                    </DropDownMenuItem>
                    <DropDownMenuSeparator />

                    <DropDownMenuItem>
                        <a
                            href={links?.chat}
                            target="_blank"
                            onClick={closeBurgerMenu}
                            className="flex gap-x-2 px-2.5 py-2"
                        >
                            <HiOutlineChatBubbleBottomCenterText className="text-base text-[#767B85]" />
                            <span>Чат</span>
                        </a>
                    </DropDownMenuItem>
                    <DropDownMenuSeparator />

                    <RedirectMenu />
                </ul>
            </PopoverContent>
        </Popover>
    );
};
