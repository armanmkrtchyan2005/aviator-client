import { cn } from "@/utils";

interface DropDownMenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {}

export const DropDownMenuItem: React.FC<DropDownMenuItemProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <li
            className={cn(
                "rounded-sm bg-[#1b1c1d] transition-colors duration-150 mh:hover:cursor-pointer mh:hover:bg-slate-100 mh:hover:text-slate-900",
                className
            )}
            {...props}
        >
            {children}
        </li>
    );
};
