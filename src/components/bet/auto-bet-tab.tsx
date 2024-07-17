import { useEffect, useRef } from "react";

import { useStateSelector, useAppDispatch } from "@/store/hooks";
import {
    selectBonus,
    selectCurrentGameTab,
    setAutoBetCoefficient,
    toggleAutoMode
} from "@/store/slices/gameSlice";
import { selectSoundSettings } from "@/store/slices/settingsSlice";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { decimal, validateBet } from "@/utils/helpers/validate-bet";

interface AutoBetTabProps {
    betNumber: 1 | 2;
    audioRef: React.RefObject<HTMLAudioElement>;
}

const MIN_RATE = 1.1;

export const AutoBetTab: React.FC<AutoBetTabProps> = ({
    betNumber,
    audioRef
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    const currentGameTab = useStateSelector(state =>
        selectCurrentGameTab(state, betNumber)
    );

    const bonus = useStateSelector(state => selectBonus(state));
    const soundEnabled = useStateSelector(state => selectSoundSettings(state));

    useEffect(() => {
        if (!bonus.bonusActive || betNumber !== 1 || !inputRef.current) return;

        inputRef.current.value = bonus.bonusCoefficient.toFixed(2);
        dispatch(
            setAutoBetCoefficient({
                betNumber: 1,
                coefficient: Number(bonus.bonusCoefficient.toFixed(2))
            })
        );
    }, [bonus.bonusActive]);

    const inputValidValue = useRef<string>(
        bonus.bonusActive && betNumber === 1
            ? (bonus.bonusCoefficient as number).toFixed(2)
            : MIN_RATE.toFixed(2)
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

    const onBlurHandler: React.FocusEventHandler<HTMLInputElement> = event => {
        // if (!currentGameTab.balance) return;

        const value = validateBet(
            event.target.value,
            bonus.bonusActive && betNumber === 1
                ? (bonus.bonusCoefficient as number)
                : MIN_RATE,
            100
        );
        event.currentTarget.value = value.toFixed(2);
        dispatch(
            setAutoBetCoefficient({ betNumber: betNumber, coefficient: value })
        );
    };

    return (
        <fieldset
            disabled={currentGameTab.betState !== "init"}
            className="grid grid-cols-[auto_100px] items-center justify-evenly  gap-3"
        >
            <Label
                direction="row"
                className="text-xs leading-none text-[#9ea0a3]"
            >
                <span>Авто кешаут</span>
                <Switch
                    disabled={currentGameTab.betState !== "init"}
                    onClick={() => dispatch(toggleAutoMode({ betNumber }))}
                />
            </Label>
            {/* <div className="flex h-8 items-center gap-2 rounded-full border border-gray-50 bg-black-250 px-3 leading-none"> */}
            <input
                disabled={!currentGameTab.autoModeOn}
                defaultValue={
                    bonus.bonusActive && betNumber === 1
                        ? bonus.bonusCoefficient.toFixed(2)
                        : MIN_RATE.toFixed(2)
                }
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                ref={inputRef}
                className="h-8 w-full rounded-full border border-gray-50 bg-black-250 px-3 text-center font-bold leading-none focus-visible:outline-none disabled:opacity-50"
            />

            {/* </div> */}
        </fieldset>
    );
};
