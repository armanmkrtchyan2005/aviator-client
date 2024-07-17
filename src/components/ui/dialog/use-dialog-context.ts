import { createContext, useContext } from "react";

export const DialogContext = createContext<{
    dialogRef: React.RefObject<HTMLDialogElement>;
} | null>(null);

export const useDialogContext = () => {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error(
            "Component must be rendered as child of dialog component"
        );
    }

    return context;
};
