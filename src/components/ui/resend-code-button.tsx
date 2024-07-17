import { useState, forwardRef, useImperativeHandle } from "react";
import { CountDownTimer } from "@/components/timer/count-down-timer";

import { cn } from "@/utils";

export interface ResendCodeElement
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    hide: () => void;
    show: () => void;
    enable: () => void;
    disable: () => void;
}

interface ResendCodeButtonProps
    extends React.ComponentPropsWithoutRef<"button"> {
    onTimeout?: () => void;
}

export const ResendCodeButton = forwardRef<
    ResendCodeElement,
    ResendCodeButtonProps
>(({ className, disabled, onTimeout, ...props }, ref) => {
    const [state, setState] = useState({ disabled: true, visible: true });

    useImperativeHandle(
        ref,
        () => ({
            hide: () => setState(state => ({ ...state, visible: false })),
            show: () => setState(state => ({ ...state, visible: true })),
            enable: () => setState(state => ({ ...state, disabled: false })),
            disable: () => setState(state => ({ ...state, disabled: true }))
        }),
        []
    );

    const onTimeoutHandler = () => {
        setState(state => ({ ...state, visible: false, disabled: false }));
        onTimeout?.();
    };

    return (
        <button
            type="button"
            disabled={state.disabled || disabled}
            className={cn(
                "ml-auto block text-xs text-[#757b85] disabled:cursor-not-allowed disabled:opacity-60",
                className
            )}
            {...props}
        >
            Отправить повторно{" "}
            {state.visible ? (
                <b>
                    (
                    <CountDownTimer
                        minutes={1}
                        onTimeout={onTimeoutHandler}
                    />
                    )
                </b>
            ) : null}
        </button>
    );
});
