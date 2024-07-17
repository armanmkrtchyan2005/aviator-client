import { IoCloseSharp } from "react-icons/io5";
import { toast } from "sonner";

interface NotEnoughMoneyToastProps {
    t: string | number;
}

export const NotEnoughMoneyToast: React.FC<NotEnoughMoneyToastProps> = ({
    t
}) => {
    return (
        <div className="flex min-h-14 select-none items-center justify-center rounded-2.5xl border-2 border-[#ff7171] bg-[#cb011a] text-xl font-semibold text-white transition-all duration-1000 mh:hover:bg-[#f7001f]">
            <p className="flex-auto text-balance px-3 py-2 leading-none">
                Недостаточно средств на балансе
            </p>
            <button
                onClick={() => toast.dismiss(t)}
                className="flex flex-auto grow-0 basis-10 items-center justify-center text-xl"
            >
                <IoCloseSharp className="isolate" />
                <span className="sr-only">Закрыть вслывающее уведомление</span>
            </button>
        </div>
    );
};
