import {
    DropDownMenuItem,
    DropDownMenuSeparator
} from "@/components/ui/drop-down-list";

import { PiTelegramLogoBold } from "react-icons/pi";
import { FaChrome } from "react-icons/fa";
import { TelegramClient } from "@/store/api/types";

export const RedirectMenu = () => {
    const tg = (
        window as Window & typeof globalThis & { Telegram: TelegramClient }
    ).Telegram.WebApp;

    const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        tg.openLink(`${import.meta.env.VITE_BASE_URL}`);
    };

    return (
        <>
            <DropDownMenuItem>
                {tg?.initDataUnsafe?.user?.id ? (
                    <button
                        onClick={onClickHandler}
                        className="flex w-full items-center gap-x-2 px-2.5 py-2"
                    >
                        <FaChrome className="text-base text-[#767B85]" />
                        <span>Перейти на сайт</span>
                    </button>
                ) : (
                    <a
                        href={`https://t.me/${import.meta.env.VITE_BOT_NAME}`}
                        target="_blank"
                        className="flex gap-x-2 px-2.5 py-2"
                    >
                        <PiTelegramLogoBold className="text-base text-[#767B85]" />

                        <span>Перейти в Телеграм-бот</span>
                    </a>
                )}
            </DropDownMenuItem>
            <DropDownMenuSeparator />
        </>
    );
};
