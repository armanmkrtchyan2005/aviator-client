import { toast as sonner } from "sonner";
import { PiWarningFill } from "react-icons/pi";
import { SucceedToast } from "./succeed-toast";
import { NotEnoughMoneyToast } from "./not-enough-money-toast";

export const toast = {
    notify: (message: string) => {
        sonner(message, {
            position: "top-center",
            action: {
                label: "Скрыть",
                onClick: () => {}
            }
        });
    },
    error: (message: string) => {
        sonner.error(message, {
            position: "top-center",
            action: {
                label: "Скрыть",
                onClick: () => {}
            },
            icon: (
                <PiWarningFill className="text-4xl leading-none text-red-500" />
            )
        });
    },
    win: (gain: number, rate: number, currency: string) => {
        sonner.custom(
            t => (
                <SucceedToast
                    t={t}
                    gain={gain}
                    rate={rate}
                    currency={currency}
                />
            ),
            {
                position: "top-center",
                classNames: {
                    toast: "group-[.toaster]:!bg-transparent group-[.toaster]:!gap-0 group-[.toaster]:!shadow-none"
                },
                // duration: 50000,
                className: "sm:w-[356px] w-max"
            }
        );
    },
    notEnoughMoney: () => {
        sonner.custom(t => <NotEnoughMoneyToast t={t} />, {
            position: "top-center",
            classNames: {
                toast: "group-[.toaster]:!bg-transparent group-[.toaster]:!gap-0 group-[.toaster]:!shadow-none"
            },
            className: "w-[356px] h-auto"
        });
    }
};
