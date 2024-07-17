import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { PopoverClose } from "@radix-ui/react-popover";

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";

import { IoMdArrowRoundBack } from "react-icons/io";

interface SecurityPopoverProps {
    open: boolean;
    setPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setBurgerMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SecurityPopover: React.FC<SecurityPopoverProps> = ({
    open,
    setPopoverOpen,
    setBurgerMenuOpen
}) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const onClickHandler = () => {
        setTimeout(() => {
            setBurgerMenuOpen(true);
        }, 200);
    };

    return (
        <Popover
            open={open}
            onOpenChange={setPopoverOpen}
        >
            <PopoverTrigger
                tabIndex={-1}
                className="sr-only right-0"
            >
                Trigger
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                sideOffset={20}
                align="end"
                onPointerDownOutside={event => {
                    if ((event.target as HTMLElement).closest("li.toast"))
                        return;

                    sessionStorage.removeItem("email");
                    navigate("/main");
                }}
                onEscapeKeyDown={() => {
                    sessionStorage.removeItem("email");
                    navigate("/main");
                }}
                className="w-60 border-[#414148] bg-[#1b1c1d] text-sm font-semibold leading-none text-white"
            >
                <>
                    {pathname === "/main/security" ? (
                        <PopoverClose
                            className="absolute left-[17px] top-[15px] p-0 text-base text-white-50 transition-colors mh:hover:text-slate-300"
                            onClick={onClickHandler}
                        >
                            <IoMdArrowRoundBack />
                        </PopoverClose>
                    ) : null}
                    <Outlet />
                </>
            </PopoverContent>
        </Popover>
    );
};
