import { Link, useNavigate } from "react-router-dom";

import { IoMdArrowRoundBack } from "react-icons/io";

import { cn } from "@/utils";

export const PreviousRouteLink = ({
    className,
    to
}: {
    className?: string;
    to?: string;
}) => {
    const navigate = useNavigate();

    const onClickHandler = () => {
        if (to !== undefined) return;

        navigate(-1);
    };

    return (
        <Link
            to={to || ""}
            onClick={onClickHandler}
            className={cn(
                "absolute -top-0.5 p-0 text-base text-white-50 transition-colors mh:hover:text-slate-300",
                className
            )}
        >
            <IoMdArrowRoundBack />
        </Link>
    );
};
