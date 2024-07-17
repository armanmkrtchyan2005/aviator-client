import { useRef } from "react";
import { Portal, PortalElement } from "@/components/ui/portal/portal";
import { PopoverContext, usePopoverContext } from "./use-popover-context";

import { cn } from "@/utils";

interface PopoverProps {
    children: React.ReactNode;
}

interface PopoverComposition {
    Trigger: React.FC<PopoverTriggerProps>;
    Portal: React.FC<PortalElement>;
    Content: React.FC<PopoverContentProps>;
}

export const Popover: React.FC<PopoverProps> & PopoverComposition = ({
    children
}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <PopoverContext.Provider value={{ dialogRef }}>
            {children}
        </PopoverContext.Provider>
    );
};

interface PopoverTriggerProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

Popover.Trigger = ({ children, onClick, ...props }) => {
    const { dialogRef } = usePopoverContext();

    const handleTriggerClick: React.MouseEventHandler<
        HTMLButtonElement
    > = event => {
        onClick?.(event);
        const dialog = dialogRef.current;
        const isOpen = dialog?.hasAttribute("open");

        if (!isOpen) {
            event.stopPropagation();
            dialog?.show();
            document.addEventListener("click", handleOutsideClick);
        }
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (!dialogRef.current) return;

        const rect = dialogRef.current.getBoundingClientRect();
        const isInDialog =
            rect.top <= event.clientY &&
            event.clientY <= rect.bottom &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width;

        if (!isInDialog) {
            dialogRef.current.close();
            document.removeEventListener("click", handleOutsideClick);
        }
    };

    return (
        <button
            {...props}
            onClick={handleTriggerClick}
        >
            {children}
        </button>
    );
};

Popover.Portal = Portal;

interface PopoverContentProps
    extends React.DialogHTMLAttributes<HTMLDialogElement> {}

Popover.Content = ({ className, children, ...props }) => {
    const { dialogRef } = usePopoverContext();

    return (
        <dialog
            {...props}
            ref={dialogRef}
            className={cn(
                "absolute left-auto top-[calc(100%+0.25rem)] isolate z-[1] m-0 min-w-72",
                className
            )}
        >
            {children}
        </dialog>
    );
};
