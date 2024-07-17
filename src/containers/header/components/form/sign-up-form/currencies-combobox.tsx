import { useState, useId } from "react";

import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

import KZIcon from "@/assets/kz-flag.png";
import RUIcon from "@/assets/ru-flag.png";
import UAIcon from "@/assets/ua-flag.png";
import UZIcon from "@/assets/uz-flag.png";
import { ChevronsUpDown, Search } from "lucide-react";

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

interface Currency
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
        "currency"
    > {}

interface CurrenciesPopoverProps {
    form: FormProps;
    field: Currency;
}

const currenciesList = [
    { id: 1, label: "Казахстанский тенге", value: "KZT", icon: KZIcon },
    { id: 2, label: "Российский рубль", value: "RUB", icon: RUIcon },
    { id: 3, label: "Узбекистанский сум", value: "UZS", icon: UZIcon },
    { id: 4, label: "Украинская гривна", value: "UAH", icon: UAIcon }
];

export const CurrenciesCombobox: React.FC<CurrenciesPopoverProps> = ({
    form,
    field
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredCurrencies, setFilteredCurrencies] =
        useState(currenciesList);

    const dialogId = useId();

    const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        setIsOpen(open => !open);
    };

    const onChangeHandler: React.ChangeEventHandler<
        HTMLInputElement
    > = event => {
        setFilteredCurrencies(currencies => {
            if (!event.target.value) return currenciesList;

            return currencies.filter(currency =>
                currency.label
                    .toLowerCase()
                    .includes(event.target.value.toLocaleLowerCase())
            );
        });
    };

    return (
        <div className="relative">
            <button
                type="button"
                role="combobox"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-controls={dialogId}
                onClick={onClickHandler}
                className={`flex h-11 w-full items-center justify-between border-2 border-gray-500 bg-none px-4 text-base aria-[invalid=true]:border-red-750 focus:aria-[invalid=true]:outline focus:aria-[invalid=true]:-outline-offset-2 ${
                    !field.value && "text-muted-foreground"
                }`}
                {...field}
            >
                <span>
                    {field.value
                        ? currenciesList.find(
                              currency => currency.value === field.value
                          )?.label
                        : "Выберите валюту"}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>

            {isOpen ? (
                <div
                    id={dialogId}
                    role="dialog"
                    aria-hidden={isOpen}
                    className="absolute top-full z-10 w-full translate-y-1 overflow-hidden rounded-md bg-white p-1 text-slate-950"
                >
                    <div className="flex items-center px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />

                        <input
                            placeholder="Выберите валюту..."
                            onChange={onChangeHandler}
                            className="py-3 text-sm placeholder:text-slate-500"
                        />
                    </div>
                    {filteredCurrencies.length !== 0 ? (
                        <ul role="listbox">
                            {filteredCurrencies.map(currency => (
                                <li
                                    key={currency.id}
                                    role="option"
                                    onClick={() => {
                                        form.resetField("currency", {
                                            keepError: false
                                        });

                                        form.setValue(
                                            "currency",
                                            currency.value
                                        );

                                        setIsOpen(false);
                                    }}
                                    className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm font-medium mh:hover:bg-slate-100"
                                >
                                    <img
                                        src={currency.icon}
                                        alt={currency.label}
                                        className="mr-2 h-6 w-6"
                                    />
                                    <span>{currency.label}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div
                            role="presentation"
                            className="py-6 text-center text-sm"
                        >
                            Валюта не найдена
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};
