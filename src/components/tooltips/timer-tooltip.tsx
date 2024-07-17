import { GrCircleQuestion } from "react-icons/gr";
import { Tooltip } from "@/components/ui/tooltip/tooltip";

export const TimerTooltip = () => {
    return (
        <Tooltip>
            <Tooltip.Trigger>
                <a className="rounded-full outline-transparent focus-visible:outline-1 focus-visible:outline-offset-2 mh:hover:cursor-help">
                    <GrCircleQuestion className="mb-0.5 inline" />
                </a>
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content className="z-50 w-40 rounded-md border border-slate-200 bg-slate-100  px-1 py-0.5 text-center text-xs text-slate-400 shadow-md">
                    Если вы не подтвердите оплату до истечения таймера, заявка
                    будет автоматически отменена
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip>
    );
};
