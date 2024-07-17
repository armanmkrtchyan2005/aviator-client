import { Requisite } from "@/store/api/types";

import Visa from "@/assets/visa-360w.webp";

interface PaymentProps extends React.HTMLAttributes<HTMLLIElement> {
    requisite: Requisite;
}

export const PaymentMethod: React.FC<PaymentProps> = ({
    requisite,
    ...props
}) => {
    const onErrorHandler: React.ReactEventHandler<HTMLImageElement> = event => {
        event.currentTarget.src = Visa;
    };

    return (
        <li
            {...props}
            className="grid aspect-video w-full cursor-pointer select-none grid-rows-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,1fr)] items-center gap-y-1 rounded-2.5xl bg-slate-300/70 px-3 py-2 leading-none shadow-md transition-transform duration-200 mh:hover:scale-105"
        >
            <p className="text-right">{requisite?.currency}</p>
            <img
                src={requisite?.img || Visa}
                alt={requisite?.name}
                onError={onErrorHandler}
                loading="lazy"
                className="max-h-full object-cover object-center"
            />
            <p className="truncate text-left text-xs font-bold sm:text-base xs:text-sm">
                {requisite?.name}
            </p>
        </li>
    );
};
