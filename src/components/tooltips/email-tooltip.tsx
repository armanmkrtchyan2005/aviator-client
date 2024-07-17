import { GrCircleQuestion } from "react-icons/gr";
import { Tooltip } from "@/components/ui/tooltip/tooltip";

export const EmailTooltip = () => {
    return (
        <Tooltip>
            <Tooltip.Trigger>
                <a className="rounded-full outline-transparent focus-visible:outline-1 focus-visible:outline-offset-2 mh:hover:cursor-help">
                    <GrCircleQuestion />
                </a>
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content className="z-50 w-40 rounded-md border-2 border-[#414148] bg-[#1b1c1d] px-1 py-0.5 text-center text-xs">
                    Если вам не пришёл код, проверьте папку «Спам»
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip>
    );
};
