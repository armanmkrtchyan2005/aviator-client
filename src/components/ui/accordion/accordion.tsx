import { useRef } from "react";
import { AccordionContext, useAccordionContext } from "./use-accordion-context";

import { cn } from "@/utils";
import React from "react";

interface AccordionProps extends React.ComponentPropsWithoutRef<"details"> {
    children: React.ReactNode;
}

interface AccordionComposition {
    Trigger: React.FC<AccordionTriggerProps>;
    Content: React.FC<AccordionContentProps>;
}

export const Accordion: React.FC<AccordionProps> & AccordionComposition = ({
    className,
    children,
    ...props
}) => {
    const detailsRef = useRef<HTMLDetailsElement>(null);

    return (
        <AccordionContext.Provider value={{ detailsRef }}>
            <details
                className={cn("group", className)}
                aria-expanded="false"
                open
                ref={detailsRef}
                {...props}
            >
                {children}
            </details>
        </AccordionContext.Provider>
    );
};

interface AccordionTriggerProps extends React.ComponentProps<"summary"> {}

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
    className,
    onClick,
    children,
    ...props
}) => {
    const { detailsRef } = useAccordionContext();

    const onClickHandler: React.MouseEventHandler<HTMLElement> = event => {
        event.preventDefault();

        if (event.currentTarget.getAttribute("aria-disabled") === "true")
            return;

        if (detailsRef.current?.getAttribute("aria-expanded") === "true") {
            detailsRef.current?.setAttribute("aria-expanded", "false");
        } else {
            detailsRef.current?.setAttribute("aria-expanded", "true");
            detailsRef.current?.setAttribute("open", "");
        }

        onClick?.(event);
    };

    return (
        <summary
            className={cn("cursor-pointer list-none", className)}
            onClick={onClickHandler}
            {...props}
        >
            {children}
        </summary>
    );
};

Accordion.Trigger = AccordionTrigger;

interface AccordionContentProps extends React.HTMLAttributes<HTMLElement> {}

const AccordionContent: React.FC<AccordionContentProps> = ({
    className,
    children
}) => {
    const { detailsRef } = useAccordionContext();

    const contentElement = React.Children.only(children) as React.ReactElement;
    const { className: childClassName, ...props } = contentElement.props;

    if (!React.isValidElement(contentElement)) return <>{children}</>;

    const onTransitionEndHandler: React.TransitionEventHandler<
        HTMLDivElement
    > = event => {
        event.stopPropagation();

        if (detailsRef.current?.getAttribute("aria-expanded") === "false") {
            detailsRef.current?.removeAttribute("open");
        }
    };

    return (
        <div
            onTransitionEnd={onTransitionEndHandler}
            className={cn(
                "grid overflow-hidden transition-all duration-500 group-aria-[expanded=false]:m-0 group-aria-[expanded=false]:grid-rows-[0fr] group-aria-[expanded=true]:grid-rows-[1fr] group-aria-[expanded=false]:p-0 group-aria-[expanded=false]:opacity-0 group-aria-[expanded=true]:opacity-100",
                className
            )}
        >
            {React.cloneElement(contentElement as React.ReactElement, {
                className: cn("min-h-0", childClassName),
                ...props
            })}
        </div>
    );
};

Accordion.Content = AccordionContent;
