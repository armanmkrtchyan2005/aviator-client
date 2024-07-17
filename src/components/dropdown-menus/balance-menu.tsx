import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/store/hooks/useAuth";
import { useGetUserBalanceQuery } from "@/store/api/userApi";
import { useStateSelector } from "@/store/hooks";
import { selectCurrentGameTab } from "@/store";
import { toast } from "@/components/toasts/toast";

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";

import {
    DropDownMenuItem,
    DropDownMenuSeparator
} from "@/components/ui/drop-down-list";

export const BalanceMenu = () => {
    const [open, setOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const { betState: firstBetState } = useStateSelector(state =>
        selectCurrentGameTab(state, 1)
    );
    const { betState: secondBetState } = useStateSelector(state =>
        selectCurrentGameTab(state, 2)
    );

    const { data: balance, isLoading } = useGetUserBalanceQuery(undefined, {
        skip: !isAuthenticated
    });

    const onLinkClickHandler: React.MouseEventHandler<
        HTMLAnchorElement
    > = event => {
        if (firstBetState === "init" && secondBetState === "init") return;

        event.preventDefault();
        toast.error("Дождитесь окончания раунда");
    };

    const onClickHandler = () => {
        setOpen(false);
    };

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            {isLoading ? (
                <span className="h-[30px] w-20 animate-pulse rounded-full border border-[#414148] bg-slate-700" />
            ) : (
                <PopoverTrigger className="rounded-full border border-[#414148] bg-[#252528] px-3 py-0.5">
                    <span className="font-bold text-[#28A909]">
                        {balance?.balance?.toFixed(2)}
                    </span>{" "}
                    {balance?.currency}
                </PopoverTrigger>
            )}

            {isAuthenticated ? (
                <PopoverContent
                    side="bottom"
                    sideOffset={6}
                    align="center"
                    className="w-auto min-w-[8rem] border-none bg-[#252528] p-0 shadow-md"
                >
                    <ul className="select-none text-left text-sm text-white">
                        <li className="w-max bg-[#2c2d30] px-2.5 py-2 font-semibold">
                            Баланс {balance?.balance?.toFixed(2)}{" "}
                            {balance?.currency}
                        </li>

                        <DropDownMenuSeparator />

                        <DropDownMenuItem onClick={onClickHandler}>
                            <Link
                                to="/payment/replenishment"
                                onClick={onLinkClickHandler}
                                className="inline-block w-full px-2.5 py-2"
                            >
                                Пополнить
                            </Link>
                        </DropDownMenuItem>

                        <DropDownMenuSeparator />

                        <DropDownMenuItem onClick={onClickHandler}>
                            <Link
                                to="/payment/withdrawal"
                                onClick={onLinkClickHandler}
                                className="inline-block w-full px-2.5 py-2"
                            >
                                Вывести
                            </Link>
                        </DropDownMenuItem>
                    </ul>
                </PopoverContent>
            ) : null}
        </Popover>
    );
};
