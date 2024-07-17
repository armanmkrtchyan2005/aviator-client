import { cn } from "@/utils";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export const Form: React.FC<FormProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <form
            className={cn("grid gap-y-8", className)}
            {...props}
        >
            {children}
        </form>
    );
};
