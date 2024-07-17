import { cn } from "@/utils";

interface DropDownMenuSeparatorProps
    extends React.HTMLAttributes<HTMLHRElement> {}

export const DropDownMenuSeparator: React.FC<DropDownMenuSeparatorProps> = ({
    className,
    ...props
}) => {
    return (
        <hr
            className={cn("border-t-2 border-transparent", className)}
            {...props}
        />
    );
};
