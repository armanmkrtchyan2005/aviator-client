import { toast } from "sonner";

import { IoCloseSharp } from "react-icons/io5";

interface SucceedToastProps {
    t: string | number;
    gain: number;
    rate: number;
    currency: string | undefined;
}

export const SucceedToast: React.FC<SucceedToastProps> = ({
    t,
    rate,
    gain,
    currency
}) => {
    return (
        <div className="mx-auto flex h-14 w-[300px] items-center justify-self-center rounded-[26px] border border-[#427f00] bg-[#123405] text-white">
            <div className="pl-3 pr-2.5">
                <p className="text-xs text-[#9ea0a3]">Вы вывели средства</p>
                <p className="mt-1 text-xl font-semibold leading-none">{`${rate.toFixed(
                    2
                )}x`}</p>
            </div>
            <div className="min-w-[120px] max-w-[120px] rounded-3xl bg-[#4eaf11] px-2 py-1 ">
                <p className="text-sm font-semibold leading-none">
                    Выигрыш, {currency}
                </p>
                <p className="mt-1 text-xl font-medium leading-none">
                    {gain.toFixed(2)}
                </p>
            </div>
            <button
                onClick={() => toast.dismiss(t)}
                className="flex flex-auto items-center justify-center text-xl"
            >
                <IoCloseSharp className="isolate" />
                <span className="sr-only">Закрыть вслывающее уведомление</span>
            </button>
        </div>
    );
};
