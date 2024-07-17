import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Portal, PortalElement } from "@/components/ui/portal/portal";
import { DialogContext, useDialogContext } from "./use-dialog-context";

import { MdClose } from "react-icons/md";

import { cn } from "@/utils";

interface DialogProps {
    children: React.ReactNode;
}

interface DialogComposition {
    Trigger: React.FC<PopoverTriggerProps>;
    Portal: React.FC<PortalElement>;
    Header: React.FC<DialogHeaderProps>;
    Title: React.FC<DialogTitleProps>;
    Description: React.FC<DialogDescriptionProps>;
    Content: React.FC<DialogContentProps>;
    Close: React.FC<DialogCloseProps>;
}

export const Dialog: React.FC<DialogProps> & DialogComposition = ({
    children
}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <DialogContext.Provider value={{ dialogRef }}>
            {children}
        </DialogContext.Provider>
    );
};

interface PopoverTriggerProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

Dialog.Trigger = ({ children, onClick, ...props }) => {
    const { dialogRef } = useDialogContext();

    const handleTriggerClick: React.MouseEventHandler<
        HTMLButtonElement
    > = event => {
        onClick?.(event);
        const dialog = dialogRef.current;
        const isOpen = dialog?.hasAttribute("open");

        if (!isOpen) {
            // event.stopPropagation();
            dialog?.showModal();
            // document.addEventListener("click", handleOutsideClick);
        } else {
            dialog?.close();
        }
    };

    // const handleOutsideClick = (event: MouseEvent) => {
    //     if (!dialogRef.current) return;

    //     const rect = dialogRef.current.getBoundingClientRect();
    //     const isInDialog =
    //         rect.top <= event.clientY &&
    //         event.clientY <= rect.bottom &&
    //         rect.left <= event.clientX &&
    //         event.clientX <= rect.left + rect.width;

    //     if (!isInDialog) {
    //         dialogRef.current.close();
    //         document.removeEventListener("click", handleOutsideClick);
    //     }
    // };

    return (
        <button
            {...props}
            onClick={handleTriggerClick}
        >
            {children}
        </button>
    );
};

Dialog.Portal = Portal;

interface DialogContentProps
    extends React.DialogHTMLAttributes<HTMLDialogElement> {
    route?: boolean;
}

Dialog.Content = ({ className, children, route = true, ...props }) => {
    const { dialogRef } = useDialogContext();

    return (
        <dialog
            {...props}
            ref={dialogRef}
            className={cn(
                "max-w-lg bg-transparent duration-1000 backdrop:backdrop-blur-sm open:animate-in open:fade-in-0 open:zoom-in-95",
                className
            )}
        >
            <section className="grid gap-4 rounded-2.5xl border border-gray-50 bg-black-50 p-6 shadow-lg">
                {route ? <Outlet /> : children}
            </section>
        </dialog>
    );
};

interface DialogHeaderProps extends React.HTMLAttributes<HTMLElement> {}

Dialog.Header = ({ className, ...props }) => {
    return (
        <header
            {...props}
            className={cn(
                "flex flex-col space-y-1.5 text-center text-2xl",
                className
            )}
        />
    );
};

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLElement> {}

Dialog.Description = ({ className, ...props }) => {
    return (
        <header
            {...props}
            className={cn("text-sm text-slate-400", className)}
        />
    );
};

interface DialogTitleProps extends React.HTMLAttributes<HTMLElement> {}

Dialog.Title = ({ className, ...props }) => {
    return (
        <h2
            {...props}
            className={cn(
                "font-semibold leading-none tracking-tight",
                className
            )}
        />
    );
};

interface DialogCloseProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

Dialog.Close = ({ className, onClick, ...props }) => {
    const navigate = useNavigate();
    const { dialogRef } = useDialogContext();

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
        onClick?.(event);
        dialogRef.current?.close();
        navigate("/main/sign-in");
    };

    return (
        <button
            {...props}
            onClick={handleClick}
            className={cn(
                "mh:hover:opacity-100 absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500",
                className
            )}
        >
            <MdClose />
        </button>
    );
};
