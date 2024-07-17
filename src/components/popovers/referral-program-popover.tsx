import { PopoverClose } from "@radix-ui/react-popover";
import { useGetUserQuery, useGetUserReferralQuery } from "@/store/api/userApi";

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";

import { GuestListTable } from "../tables";
import { ClipboardCopy } from "@/components/ui/clipboard-copy";

import { IoMdArrowRoundBack } from "react-icons/io";

interface ReferralProgramPopoverProps {
    open: boolean;
    setPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDailyStatisticsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setBurgerMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReferralProgramPopover: React.FC<ReferralProgramPopoverProps> = ({
    open,
    setPopoverOpen,
    setDailyStatisticsDialogOpen,
    setBurgerMenuOpen
}) => {
    const { data: referral } = useGetUserReferralQuery(undefined, {
        skip: !open
    });
    const { data: user } = useGetUserQuery(undefined, { skip: !open });

    const referralLink = `${
        import.meta.env.VITE_BASE_URL
    }/referral?uid=${user?.uid}`;

    const telegramReferralLink = `https://t.me/${
        import.meta.env.VITE_BOT_NAME
    }?start=${user?.uid}`;

    const onClickHandler = () => {
        setTimeout(() => {
            setBurgerMenuOpen(true);
        }, 200);
    };

    return (
        <Popover
            open={open}
            onOpenChange={setPopoverOpen}
        >
            <PopoverTrigger
                tabIndex={-1}
                className="sr-only right-0"
            >
                Реферальная программа
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                sideOffset={20}
                align="end"
                className="space-y-2 border-gray-50 bg-[#1b1c1d] leading-none text-[#83878e]"
            >
                <h3 className="relative col-span-2 text-center text-base font-bold text-white">
                    <PopoverClose
                        className="absolute left-0 top-[3px] p-0 text-base text-white-50 transition-colors mh:hover:text-slate-300"
                        onClick={onClickHandler}
                    >
                        <IoMdArrowRoundBack />
                    </PopoverClose>
                    Реферальная программа
                </h3>
                <p className="text-sm">
                    Приглашая людей, вы можете заработать до 40% от их ставок{" "}
                    <a
                        href="#"
                        target="_blank"
                        className="text-blue-600"
                    >
                        Подробнее...
                    </a>
                </p>
                <p className="text-center text-sm font-bold text-white">
                    Ваша ссылка для приглашения
                </p>

                <p className="grid grid-cols-[1fr_auto] items-center gap-1.5 text-xs text-white">
                    <a
                        href={referralLink}
                        target="_blank"
                        className="w-full overflow-hidden text-ellipsis text-nowrap text-blue-600"
                    >
                        Ссылка на сайт
                    </a>
                    <ClipboardCopy
                        textToCopy={referralLink}
                        toastMessage="Ссылка скопирована в буфер обмена"
                        className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-xs text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 active:translate-y-[1px] active:border-[#1c7430] mh:hover:bg-green-350"
                    >
                        Скопировать
                    </ClipboardCopy>

                    <a
                        href={telegramReferralLink}
                        target="_blank"
                        className="w-full overflow-hidden text-ellipsis text-nowrap text-blue-600"
                    >
                        Ссылка на телеграм-бот
                    </a>
                    <ClipboardCopy
                        textToCopy={telegramReferralLink}
                        toastMessage="Ссылка скопирована в буфер обмена"
                        className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-xs text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 active:translate-y-[1px] active:border-[#1c7430] mh:hover:bg-green-350"
                    >
                        Скопировать
                    </ClipboardCopy>

                    <span>Количество приглашённых</span>
                    <span className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-center text-xs text-white shadow-[inset_0_1px_1px_#ffffff80]">
                        {referral?.descendants
                            ? referral?.descendants.length
                            : 0}
                    </span>

                    <span>Всего заработано</span>
                    <span className="rounded border border-green-50 bg-green-450 px-1.5 py-1 text-center text-xs text-white shadow-[inset_0_1px_1px_#ffffff80]">
                        {referral?.referralBalance?.toFixed(2) || 0} {referral?.currency}
                    </span>
                </p>

                <GuestListTable
                    setDailyStatisticsDialogOpen={setDailyStatisticsDialogOpen}
                />
            </PopoverContent>
        </Popover>
    );
};
