import { useRef } from "react";

import { useActivatePromoCodeMutation } from "@/store/api/userApi";
import { handleErrorResponse } from "@/store/services";
import { toast } from "@/components/toasts/toast";

import { ImSpinner9 } from "react-icons/im";

interface FormFields {
    promoCode: HTMLInputElement;
}
export const ActivationBonusForm = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [activatePromo, { isLoading }] = useActivatePromoCodeMutation();

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        try {
            const { promoCode } = event.currentTarget;
            const promo = promoCode.value;

            await activatePromo({ promoCode: promo }).unwrap();

            promoCode.setAttribute("type", "button");
            buttonRef.current?.setAttribute("disabled", "");

            toast.notify("Промокод успешно активирован");
        } catch (error) {
            handleErrorResponse(error, message => toast.error(message));
        }
    };

    const onClickHandler: React.MouseEventHandler<HTMLInputElement> = event => {
        event.currentTarget.type = "text";
        event.currentTarget.setAttribute("defaultValue", "");
        event.currentTarget.setAttribute("value", "");
        buttonRef.current?.removeAttribute("disabled");
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="group ml-auto flex w-44 flex-col gap-1 px-3 py-2 text-sm"
        >
            <input
                type="button"
                name="promoCode"
                required
                autoComplete="off"
                defaultValue="Ввести промокод"
                onClick={onClickHandler}
                className="w-full rounded border border-green-50 bg-green-450 px-1.5 py-1 text-center text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 focus-visible:outline-none group-has-[input[type=button]:active]:translate-y-[1px] group-has-[input[type=button]:active]:border-[#1c7430] group-has-[input[type=button]:hover]:bg-green-350"
            />
            <button
                type="submit"
                disabled={isLoading}
                ref={buttonRef}
                className="w-full rounded-full border-2 border-gray-50 bg-[#2c2d30] text-center text-[10px] text-white disabled:opacity-75 group-has-[input[type=button]]:pointer-events-none group-has-[input[type=button]]:hidden"
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-[20px]" />
                ) : (
                    "Активировать"
                )}
            </button>
        </form>
    );
};
