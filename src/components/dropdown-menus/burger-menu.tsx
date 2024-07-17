import { useState, useTransition } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/store/hooks/useAuth";
import { useGetServiceLinkQuery } from "@/store/api/authApi";
import { GameSettings } from "@/components/game-settings";

import {
    MyBetsHistoryDialog,
    SignOutAlertDialog,
    BonusAndPromoDialog,
    DailyStatisticsDialog
} from "@/components/dialogs";

import {
    GameLimitsPopover,
    ReferralProgramPopover,
    SecurityPopover
} from "@/components/popovers";

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";

import {
    DropDownMenuItem,
    DropDownMenuSeparator
} from "@/components/ui/drop-down-list";

import { UserProfileDetails } from "../user-profile-details";
import { RedirectMenu } from "../redirect-menu";

import { FiMenu } from "react-icons/fi";
import { BiSupport } from "react-icons/bi";
import { HiOutlineChatBubbleBottomCenterText } from "react-icons/hi2";
import { ImNewspaper } from "react-icons/im";
import { SlPeople } from "react-icons/sl";
import { IoExitOutline } from "react-icons/io5";
import { BsStars } from "react-icons/bs";

export const BurgerMenu = () => {
    const [, startTransition] = useTransition();
    const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [myBetsHistoryDialogOpen, setMyBetsHistoryDialogOpen] =
        useState(false);
    const [bonusAndPromoDialogOpen, setBonusAndPromoDialogOpen] =
        useState(false);
    const [dailyStatisticsDialogOpen, setDailyStatisticsDialogOpen] =
        useState(false);
    const [referralProgramPopoverOpen, setReferralProgramPopoverOpen] =
        useState(false);
    const [gameLimitsPopoverOpen, setGameLimitsPopoverOpen] = useState(false);
    const [securityPopoverOpen, setSecurityPopoverOpen] = useState(false);

    const { isAuthenticated } = useAuth();

    const { data: links } = useGetServiceLinkQuery();

    const closeBurgerMenu = () => {
        setBurgerMenuOpen(false);
    };

    return (
        <>
            <Popover
                open={burgerMenuOpen}
                onOpenChange={open =>
                    startTransition(() => setBurgerMenuOpen(open))
                }
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
                        {isAuthenticated ? (
                            <>
                                <DropDownMenuItem
                                    onPointerUp={() => {
                                        closeBurgerMenu();
                                        setTimeout(() => {
                                            setBonusAndPromoDialogOpen(true);
                                        }, 200);
                                    }}
                                    className="flex gap-x-2 px-2.5 py-2"
                                >
                                    <BsStars className="text-base text-[#767b85]" />
                                    <span>Бонусы</span>
                                </DropDownMenuItem>
                                <DropDownMenuSeparator />
                            </>
                        ) : null}

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

                        <DropDownMenuItem
                            onClick={closeBurgerMenu}
                            className="flex gap-x-2 px-2.5 py-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="15"
                                viewBox="0 0 16 15"
                            >
                                <g
                                    fill="#767B85"
                                    fillRule="nonzero"
                                >
                                    <path d="M4.1.02A1.83 1.83 0 0 0 2.274 1.85l-.067 9.48.996.007.067-9.483c0-.454.372-.824.83-.824h10.008V.021H4.1z" />
                                    <path d="M14.108.02c-1.043 0-1.892.86-1.892 1.917v10.639c0 .769-.618 1.395-1.378 1.395-.76 0-1.377-.626-1.377-1.395v-1.227a.501.501 0 0 0-.498-.504H.498a.501.501 0 0 0-.498.504v1.227c0 1.325 1.065 2.403 2.373 2.403v-1.008c-.76 0-1.377-.626-1.377-1.395v-.723h7.469v.723c0 1.325 1.064 2.403 2.373 2.403 1.309 0 2.374-1.078 2.374-2.403V4.693h2.29A.501.501 0 0 0 16 4.19V1.937C16 .88 15.151.02 14.108.02zm.896 3.665h-1.792V1.937c0-.5.402-.908.896-.908s.896.407.896.908v1.748z" />
                                    <path d="M2.274 13.971h8.448v1.008H2.274zM7.402 2.828H4.83a.501.501 0 0 0-.498.504c0 .278.223.504.498.504h2.572a.501.501 0 0 0 .498-.504.501.501 0 0 0-.498-.504zM10.39 4.844H4.83a.501.501 0 0 0-.498.505c0 .278.223.504.498.504h5.56a.501.501 0 0 0 .498-.504.501.501 0 0 0-.498-.505zM10.39 6.861H4.83a.501.501 0 0 0-.498.505c0 .278.223.504.498.504h5.56a.501.501 0 0 0 .498-.504.501.501 0 0 0-.498-.505zM10.39 8.878H4.83a.501.501 0 0 0-.498.504c0 .279.223.505.498.505h5.56a.501.501 0 0 0 .498-.505.501.501 0 0 0-.498-.504z" />
                                </g>
                            </svg>
                            <span>Правила игры</span>
                        </DropDownMenuItem>
                        <DropDownMenuSeparator />

                        {isAuthenticated ? (
                            <>
                                <DropDownMenuItem
                                    onPointerUp={() => {
                                        closeBurgerMenu();
                                        setTimeout(() => {
                                            setGameLimitsPopoverOpen(true);
                                        }, 200);
                                    }}
                                    className="flex gap-x-2 px-2.5 py-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="10"
                                        viewBox="0 0 16 10"
                                    >
                                        <g
                                            fill="#767B85"
                                            fillRule="nonzero"
                                        >
                                            <path d="M14.796.027H1.204C.54.027 0 .567 0 1.23v7.226C0 9.12.54 9.66 1.204 9.66h13.592c.664 0 1.204-.54 1.204-1.204V1.23c0-.664-.54-1.204-1.204-1.204zm.172 8.43a.174.174 0 0 1-.172.172H1.204a.174.174 0 0 1-.172-.172V1.23c0-.093.08-.172.172-.172h13.592c.093 0 .172.079.172.172v7.226z" />
                                            <path d="M1.824.37v.775a.68.68 0 0 1-.689.688H.38v1.032h.756c.95 0 1.72-.772 1.72-1.72V.37H1.825zM14.882 1.833a.68.68 0 0 1-.688-.688V.37H13.16v.774c0 .948.772 1.72 1.72 1.72h.775V1.833h-.774zM1.153 6.822H.379v1.032h.774a.68.68 0 0 1 .688.689v.774h1.032v-.774c0-.949-.772-1.72-1.72-1.72zM14.882 6.822c-.949 0-1.72.772-1.72 1.72v.775h1.032v-.774a.68.68 0 0 1 .688-.688h.774V6.822h-.774zM10.137 2.793a2.88 2.88 0 0 0-2.051-.848 2.88 2.88 0 0 0-2.05.848 2.88 2.88 0 0 0-.849 2.05c0 .777.301 1.505.848 2.052a2.88 2.88 0 0 0 2.051.848 2.88 2.88 0 0 0 2.05-.848 2.88 2.88 0 0 0 .85-2.051 2.88 2.88 0 0 0-.85-2.051zm-.73 3.372a1.856 1.856 0 0 1-1.321.546c-.5 0-.97-.194-1.321-.546a1.855 1.855 0 0 1-.546-1.321c0-.5.194-.97.546-1.321a1.855 1.855 0 0 1 1.321-.546c.5 0 .97.194 1.321.546.352.352.546.82.546 1.32 0 .5-.194.97-.546 1.322z" />
                                        </g>
                                    </svg>
                                    <span>Игровые лимиты</span>
                                </DropDownMenuItem>
                                <DropDownMenuSeparator />
                            </>
                        ) : null}

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

                        {isAuthenticated ? (
                            <>
                                <DropDownMenuItem
                                    onPointerUp={() => {
                                        closeBurgerMenu();
                                        setTimeout(() => {
                                            setReferralProgramPopoverOpen(true);
                                        }, 200);
                                    }}
                                    className="flex gap-x-2 px-2.5 py-2"
                                >
                                    <SlPeople className="text-base text-[#767B85]" />
                                    <span>Реферальная программа</span>
                                </DropDownMenuItem>
                                <DropDownMenuSeparator />
                            </>
                        ) : null}

                        {isAuthenticated ? (
                            <>
                                <DropDownMenuItem
                                    onPointerUp={() => {
                                        closeBurgerMenu();
                                        setTimeout(() => {
                                            setSecurityPopoverOpen(true);
                                        }, 250);
                                    }}
                                >
                                    <Link
                                        to="/main/security"
                                        className="flex gap-x-2 px-2.5 py-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="13"
                                            height="16"
                                            viewBox="0 0 13 16"
                                        >
                                            <g
                                                fill="#767B85"
                                                fillRule="nonzero"
                                            >
                                                <path d="M5.85 8.935L3.894 7.008l-.834.906 2.86 2.814 4.358-5.016-.9-.835z" />
                                                <path d="M11.473 2.037C10.007 1.766 8.657.937 7.983.47A2.585 2.585 0 0 0 6.5 0c-.529 0-1.041.162-1.482.469-.674.469-2.025 1.297-3.491 1.568-.869.161-1.499.938-1.499 1.847v3.772c0 1.246.337 2.461 1.003 3.61.52.9 1.241 1.76 2.143 2.556 1.516 1.338 3.017 2.036 3.08 2.065L6.5 16l.246-.113c.063-.03 1.564-.727 3.08-2.065.902-.796 1.623-1.656 2.143-2.555.666-1.15 1.003-2.365 1.003-3.61V3.883c0-.91-.63-1.686-1.499-1.847zm.29 5.62c0 1.857-.909 3.605-2.7 5.194A13.388 13.388 0 0 1 6.5 14.62c-1.07-.562-5.262-3.017-5.262-6.965V3.884c0-.303.211-.562.502-.616 1.685-.312 3.2-1.238 3.953-1.762a1.407 1.407 0 0 1 1.614 0c.753.524 2.268 1.45 3.953 1.762a.622.622 0 0 1 .502.616v3.772z" />
                                            </g>
                                        </svg>
                                        <span>Безопасность</span>
                                    </Link>
                                </DropDownMenuItem>
                                <DropDownMenuSeparator />
                            </>
                        ) : null}

                        <RedirectMenu />

                        {isAuthenticated ? (
                            <DropDownMenuItem
                                onPointerDown={() => {
                                    closeBurgerMenu();
                                    setAlertDialogOpen(true);
                                }}
                                className="flex gap-x-2 px-2.5 py-2"
                            >
                                <IoExitOutline className="text-base text-[#767B85]" />
                                <span>Выйти</span>
                            </DropDownMenuItem>
                        ) : null}
                        <DropDownMenuSeparator className="h-3" />
                    </ul>
                </PopoverContent>
            </Popover>
            {isAuthenticated ? (
                <>
                    <MyBetsHistoryDialog
                        open={myBetsHistoryDialogOpen}
                        setOpen={setMyBetsHistoryDialogOpen}
                    />

                    <BonusAndPromoDialog
                        open={bonusAndPromoDialogOpen}
                        setOpen={setBonusAndPromoDialogOpen}
                    />

                    <DailyStatisticsDialog
                        open={dailyStatisticsDialogOpen}
                        setOpen={setDailyStatisticsDialogOpen}
                    />

                    <GameLimitsPopover
                        open={gameLimitsPopoverOpen}
                        setOpen={setGameLimitsPopoverOpen}
                        setBurgerMenuOpen={setBurgerMenuOpen}
                    />

                    <ReferralProgramPopover
                        open={referralProgramPopoverOpen}
                        setPopoverOpen={setReferralProgramPopoverOpen}
                        setDailyStatisticsDialogOpen={
                            setDailyStatisticsDialogOpen
                        }
                        setBurgerMenuOpen={setBurgerMenuOpen}
                    />

                    <SecurityPopover
                        open={securityPopoverOpen}
                        setPopoverOpen={setSecurityPopoverOpen}
                        setBurgerMenuOpen={setBurgerMenuOpen}
                    />

                    <SignOutAlertDialog
                        open={alertDialogOpen}
                        setOpen={setAlertDialogOpen}
                    />
                </>
            ) : null}
        </>
    );
};
