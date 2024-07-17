import { useRef, useId } from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

import { Accordion } from "@/components/ui/accordion/accordion";
import { Input } from "@/components/ui/input";

import { RiArrowDownSLine } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";

interface FormProps
    extends UseFormReturn<
        {
            password: string;
            passwordConfirm: string;
            currency: string;
            login: string;
            accepted_terms: true;
            email?: string | undefined;
            promocode?: string | undefined;
            telegramId?: number | undefined;
        },
        any,
        undefined
    > {}

interface PromoCode
    extends ControllerRenderProps<
        {
            currency: string;
            login: string;
            password: string;
            passwordConfirm: string;
            accepted_terms: true;
            email?: string | undefined;
            promocode?: string | undefined;
            telegramId?: number | undefined;
        },
        "promocode"
    > {}

interface PromoCodeProps {
    form: FormProps;
    field: PromoCode;
}

export const PromoCodeAccordion: React.FC<PromoCodeProps> = ({
    form,
    field
}) => {
    const promoCodeId = useId();
    const labelId = useId();

    const promoCodeRef = useRef<HTMLInputElement>(null);

    const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        form.resetField("promocode", { keepError: false });

        if (!promoCodeRef?.current) return;

        promoCodeRef.current.value = "";
    };

    return (
        <Accordion className="-m-0.5 space-y-2">
            <Accordion.Trigger
                aria-disabled={
                    form.getValues("promocode") !== "" &&
                    form.getValues("promocode") !== undefined
                }
                aria-labelledby={labelId}
                className="accordion flex justify-between px-0.5 pb-1 text-blue-500 transition-all duration-300"
            >
                <label
                    id={labelId}
                    htmlFor={promoCodeId}
                >
                    Введите промокод
                </label>
                <RiArrowDownSLine className="text-2xl text-white duration-500 group-aria-[expanded=true]:rotate-180" />
            </Accordion.Trigger>

            <Accordion.Content className="p-0.5">
                <div className="grid grid-cols-[1fr_auto] grid-rows-1 rounded-lg border-2 border-gray-500 outline outline-2 outline-offset-1 outline-transparent has-[input[aria-invalid=true]]:border-red-750 has-[input:focus-visible]:outline-white/80">
                    <Input
                        id={promoCodeId}
                        placeholder="Введите промокод"
                        {...field}
                        ref={promoCodeRef}
                        className="peer border-none placeholder:text-sm focus-visible:outline-transparent"
                    />
                    <button
                        type="button"
                        onClick={onClickHandler}
                        className="group/button w-10 focus-visible:outline-transparent peer-placeholder-shown:hidden"
                    >
                        <span className="sr-only">Очистить промокод</span>
                        <IoCloseSharp className="mx-auto rounded-sm text-xl outline-offset-2 group-focus-visible/button:outline group-focus-visible/button:outline-2 group-focus-visible/button:outline-white/80 mh:hover:bg-slate-50/30" />
                    </button>
                </div>
            </Accordion.Content>
        </Accordion>
    );
};
