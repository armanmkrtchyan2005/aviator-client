import { createContext, useContext } from "react";

export const AccordionContext = createContext<{
    detailsRef: React.RefObject<HTMLDetailsElement>;
} | null>(null);

export const useAccordionContext = () => {
    const context = useContext(AccordionContext);

    if (!context) {
        throw new Error(
            "Component must be rendered as child of accordion component"
        );
    }

    return context;
};
