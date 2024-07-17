import { cn } from "@/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    value: number | undefined;
}

export const Badge: React.FC<BadgeProps> = ({ className, value, ...props }) => {
    if (value === undefined || isNaN(value)) return "-";

    return (
        <span
            className={cn(generateClassName(value), className)}
            {...props}
        >
            {value?.toFixed(2)}x
        </span>
    );
};

const generateClassName = (value: number | undefined): string | undefined => {
    if (value === undefined) return;

    const baseClassName =
        "rounded-full min-w-[52px] py-0.5 px-3 text-xs font-bold bg-black-250 select-none";

    if (value < 2) return baseClassName + " text-[#34b4ff]";
    else if (value < 10) return baseClassName + " text-[#913ef8]";

    return baseClassName + " text-[#c017b4]";
};
