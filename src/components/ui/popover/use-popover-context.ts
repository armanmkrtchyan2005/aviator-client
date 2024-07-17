import { createContext, useContext } from "react";

export const PopoverContext = createContext<{
    dialogRef: React.RefObject<HTMLDialogElement>;
} | null>(null);

export const usePopoverContext = () => {
    const context = useContext(PopoverContext);

    if (!context) {
        throw new Error(
            "Component must be rendered as child of popover component"
        );
    }

    return context;
};
