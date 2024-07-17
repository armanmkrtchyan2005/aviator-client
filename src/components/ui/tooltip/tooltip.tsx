import React, { useId, useMemo, useRef } from "react";
import ReactDOM from "react-dom";

import { cn } from "@/utils";

import { TooltipContext, useTooltipContext } from "./use-tooltip-context";

interface TooltipProps {
    children: React.ReactNode;
}

interface TooltipComposition {
    Trigger: React.FC<React.PropsWithChildren>;
    Portal: React.FC<React.PropsWithChildren>;
    Content: React.FC<TooltipContentProps>;
}

export const Tooltip: React.FC<TooltipProps> & TooltipComposition = ({
    children
}) => {
    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerId = useId();
    const tooltipId = useId();
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const contextValue = useMemo(
        () => ({ triggerRef, tooltipRef, triggerId, tooltipId, timerRef }),
        [triggerId, tooltipId]
    );

    return (
        <TooltipContext.Provider value={contextValue}>
            {children}
        </TooltipContext.Provider>
    );
};

const TooltipTrigger: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { triggerId, tooltipId, triggerRef, tooltipRef, timerRef } =
        useTooltipContext();

    const triggerElement = React.Children.only(children) as React.ReactElement;
    const props = triggerElement.props;

    if (!React.isValidElement(triggerElement)) return <>{children}</>;

    const onMouseEnterHandler = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.currentTarget;

        if (tooltipRef.current?.getAttribute("aria-hidden") === "false") {
            clearTimeout(timerRef.current);
        } else {
            timerRef.current = setTimeout(() => {
                if (!tooltipRef.current) return;

                const scrollOffset = document.documentElement.scrollTop;
                const viewportWidth = window.innerWidth;
                const tooltipElement = tooltipRef.current;
                const tooltipRect = tooltipElement.getBoundingClientRect();
                const anchorRect = target.getBoundingClientRect();

                if (
                    (anchorRect.right + anchorRect.left) / 2 +
                        (tooltipRect.right - tooltipRect.left) / 2 -
                        16 >
                    viewportWidth - 32
                ) {
                    tooltipElement.style.left = `${Math.max(
                        viewportWidth -
                            32 -
                            (tooltipRect.right - tooltipRect.left),
                        anchorRect.right - tooltipRect.width
                    )}px`;
                } else {
                    tooltipElement.style.left = `${
                        (anchorRect.right + anchorRect.left) / 2 -
                        (tooltipRect.right - tooltipRect.left) / 2
                    }px`;
                }

                tooltipElement.style.top = `calc(${
                    anchorRect.top + scrollOffset - tooltipRect.height
                }px - 8px)`;

                tooltipElement.setAttribute("aria-hidden", "false");
            }, 1000);
        }
    };

    const onMouseLeaveHandler = () => {
        if (tooltipRef.current?.getAttribute("aria-hidden") === "true") {
            clearTimeout(timerRef.current);
        } else {
            timerRef.current = setTimeout(() => {
                tooltipRef.current?.setAttribute("aria-hidden", "true");
            }, 500);
        }
    };

    const onClickHandler: React.PointerEventHandler<HTMLElement> = event => {
        event.stopPropagation();

        if (tooltipRef.current?.getAttribute("aria-hidden") === "true") {
            const target = event.currentTarget;

            if (!tooltipRef.current) return;

            const scrollOffset = document.documentElement.scrollTop;
            const viewportWidth = window.innerWidth;
            const tooltipElement = tooltipRef.current;
            const tooltipRect = tooltipElement.getBoundingClientRect();
            const anchorRect = target.getBoundingClientRect();

            if (
                (anchorRect.right + anchorRect.left) / 2 +
                    (tooltipRect.right - tooltipRect.left) / 2 -
                    16 >
                viewportWidth - 32
            ) {
                tooltipElement.style.left = `${Math.max(
                    viewportWidth - 32 - (tooltipRect.right - tooltipRect.left),
                    anchorRect.right - tooltipRect.width
                )}px`;
            } else {
                tooltipElement.style.left = `${
                    (anchorRect.right + anchorRect.left) / 2 -
                    (tooltipRect.right - tooltipRect.left) / 2
                }px`;
            }

            tooltipElement.style.top = `calc(${
                anchorRect.top + scrollOffset - tooltipRect.height
            }px - 8px)`;

            tooltipElement.setAttribute("aria-hidden", "false");
        } else {
            tooltipRef.current?.setAttribute("aria-hidden", "true");
        }
    };

    const onFocusHandler: React.FocusEventHandler<HTMLElement> = event => {
        event.stopPropagation();
        const target = event.currentTarget;

        if (tooltipRef.current?.getAttribute("aria-hidden") === "false") {
            clearTimeout(timerRef.current);
        } else {
            timerRef.current = setTimeout(() => {
                if (!tooltipRef.current) return;

                const scrollOffset = document.documentElement.scrollTop;
                const viewportWidth = window.innerWidth;
                const tooltipElement = tooltipRef.current;
                const tooltipRect = tooltipElement.getBoundingClientRect();
                const anchorRect = target.getBoundingClientRect();

                if (
                    (anchorRect.right + anchorRect.left) / 2 +
                        (tooltipRect.right - tooltipRect.left) / 2 -
                        16 >
                    viewportWidth - 32
                ) {
                    tooltipElement.style.left = `${Math.max(
                        viewportWidth -
                            32 -
                            (tooltipRect.right - tooltipRect.left),
                        anchorRect.right - tooltipRect.width
                    )}px`;
                } else {
                    tooltipElement.style.left = `${
                        (anchorRect.right + anchorRect.left) / 2 -
                        (tooltipRect.right - tooltipRect.left) / 2
                    }px`;
                }

                tooltipElement.style.top = `calc(${
                    anchorRect.top + scrollOffset - tooltipRect.height
                }px - 8px)`;

                tooltipElement.setAttribute("aria-hidden", "false");
            }, 1000);
        }
    };

    const onBlurHandler = () => {
        tooltipRef.current?.setAttribute("aria-hidden", "true");
    };

    const onKeyDownHandler: React.KeyboardEventHandler<HTMLElement> = event => {
        if (event.key === "Escape") {
            event.stopPropagation();
            tooltipRef.current?.setAttribute("aria-hidden", "true");
        } else if (event.key === " " || event.key === "Space") {
            event.preventDefault();

            if (tooltipRef.current?.getAttribute("aria-hidden") === "true") {
                tooltipRef.current?.setAttribute("aria-hidden", "false");
            } else {
                tooltipRef.current?.setAttribute("aria-hidden", "true");
            }
        }
    };

    return (
        <>
            {React.cloneElement(triggerElement as React.ReactElement, {
                id: triggerId,
                tabIndex: 0,
                "aria-haspopup": "true",
                "aria-labelledby": tooltipId,
                onMouseEnter: onMouseEnterHandler,
                onKeyDown: onKeyDownHandler,
                onFocus: onFocusHandler,
                onMouseLeave: onMouseLeaveHandler,
                onBlur: onBlurHandler,
                onPointerDown: onClickHandler,
                ref: triggerRef,
                ...props
            })}
        </>
    );
};

Tooltip.Trigger = TooltipTrigger;

const portalRoot = document.querySelector("body")!;

const Portal: React.FC<React.PropsWithChildren> = ({ children }) => {
    return ReactDOM.createPortal(children, portalRoot);
};

Tooltip.Portal = Portal;

interface TooltipContentProps extends React.ComponentProps<"div"> {}

const TooltipContent: React.FC<TooltipContentProps> = ({
    className,
    children,
    ...props
}) => {
    const { tooltipRef, timerRef } = useTooltipContext();

    const onMouseEnterHandler: React.MouseEventHandler<HTMLDivElement> = () => {
        if (tooltipRef.current?.getAttribute("aria-hidden") === "false") {
            clearTimeout(timerRef.current);
        }
    };

    const onMouseLeaveHandler: React.MouseEventHandler<HTMLDivElement> = () => {
        timerRef.current = setTimeout(() => {
            tooltipRef.current?.setAttribute("aria-hidden", "true");
        }, 500);
    };

    return (
        <div
            {...props}
            aria-hidden="true"
            role="tooltip"
            onMouseEnter={onMouseEnterHandler}
            onMouseLeave={onMouseLeaveHandler}
            className={cn(
                "absolute isolate aria-[hidden=false]:visible aria-[hidden=true]:invisible",
                className
            )}
            ref={tooltipRef}
        >
            {children}
        </div>
    );
};

Tooltip.Content = TooltipContent;
