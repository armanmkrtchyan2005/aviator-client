import { createContext, useContext } from "react";

export const TooltipContext = createContext<{
    triggerRef: React.RefObject<HTMLElement>;
    tooltipRef: React.RefObject<HTMLDivElement>;
    triggerId: string;
    tooltipId: string;
    timerRef: React.RefObject<NodeJS.Timeout | undefined>;
} | null>(null);

export const useTooltipContext = () => {
    const context = useContext(TooltipContext);

    if (!context) {
        throw new Error(
            "Component must be rendered as child of tooltip component"
        );
    }

    return context;
};
