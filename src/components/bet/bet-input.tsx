import { forwardRef, useRef } from "react";

import { useGetGameLimitsQuery } from "@/store/api/userApi";
import { useAuth } from "@/store/hooks/useAuth";
import { useAppDispatch, useStateSelector } from "@/store/hooks";
import { selectCurrentGameTab, setCurrentBet } from "@/store/slices/gameSlice";

import { decimal, validateBet } from "@/utils/helpers/validate-bet";

interface BetInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    betNumber: 1 | 2;
}

export const BetInput = forwardRef<HTMLInputElement, BetInputProps>(
    ({ betNumber, ...props }, ref) => {
        const { isAuthenticated } = useAuth();
        const { data: limits } = useGetGameLimitsQuery(undefined, {
            skip: !isAuthenticated
        });
        const currentGameTab = useStateSelector(state =>
            selectCurrentGameTab(state, betNumber)
        );
        const dispatch = useAppDispatch();
        const inputValidValue = useRef<string>(
            String(currentGameTab.currentBet)
        );

        const onChangeHandler: React.ChangeEventHandler<
            HTMLInputElement
        > = event => {
            try {
                inputValidValue.current = decimal(event.currentTarget.value);
            } catch (error) {
                return;
            } finally {
                event.currentTarget.value = inputValidValue.current;
            }
        };

        const onBlurHandler: React.FocusEventHandler<
            HTMLInputElement
        > = event => {
            if (currentGameTab.balance === undefined) return;

            const value = validateBet(
                event.target.value,
                currentGameTab.min,
                Math.min(currentGameTab.max, currentGameTab.balance)
            );
            event.currentTarget.value = value.toFixed(2);

            dispatch(setCurrentBet({ type: "input", betNumber, value }));
        };

        return (
            <input
                {...props}
                maxLength={11}
                autoComplete="off"
                inputMode="numeric"
                defaultValue={
                    limits?.min ? Math.ceil(limits?.min).toFixed(2) : undefined
                }
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                ref={ref}
                className="h-full w-full border-none bg-inherit text-center text-base font-bold leading-none text-white outline-none focus-visible:outline-none"
            />
        );
    }
);
