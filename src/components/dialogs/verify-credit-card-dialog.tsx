import { useNavigate } from "react-router-dom";

import * as Dialog from "@radix-ui/react-dialog";
import { VerifyCreditCardForm } from "@/components/forms/verify-credit-card-form";

import { X } from "lucide-react";

import CreditCard from "@/assets/credit-card.png";
import BankApplication from "@/assets/bank-application.png";

import { ZoomableImage } from "../ui/zoomable-image/zoomable-image";

export const VerifyReplenishmentDialog = () => {
    const navigate = useNavigate();

    return (
        <Dialog.Root
            modal={false}
            defaultOpen={true}
        >
            <Dialog.Portal>
                <Dialog.Content
                    onInteractOutside={event => {
                        const target = event.target as HTMLElement;

                        if (target.closest("li.toast")) {
                            event.preventDefault();
                            return;
                        }

                        navigate("/payment/replenishment", { replace: true });
                    }}
                    onEscapeKeyDown={() =>
                        navigate("/payment/replenishment", { replace: true })
                    }
                    className="fixed left-[50%] top-[50%] isolate z-30 grid w-[calc(100dvw_-_2rem)] min-w-64 max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2.5xl border border-slate-200 bg-slate-100 p-4 text-black-50 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] xs:p-6"
                >
                    <Dialog.Close
                        onClick={() =>
                            navigate("/payment/replenishment", {
                                replace: true
                            })
                        }
                        className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-white transition-opacity focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 mh:hover:opacity-100"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Закрыть</span>
                    </Dialog.Close>

                    <Dialog.DialogTitle className="text-center text-xl font-bold">
                        Верификация
                    </Dialog.DialogTitle>

                    <article className="space-y-2 text-sm">
                        <p>
                            В целях безопасности требуется верификация карты, с
                            которой вы будете отправлять средства.
                        </p>

                        <p>
                            ❗️ Если вы совершаете перевод не с указанной в этом
                            разделе карты, заявка на пополнение будет отменена.
                        </p>

                        <section>
                            <h3 className="text-base font-bold">
                                Требования к фотографии:
                            </h3>
                            <ol className="mt-1 space-y-1">
                                <li>
                                    <b>1.</b> Сделайте фотографию карты. На фото
                                    должны быть видны 4 последние цифры номера
                                    карты, имя и фамилия владельца карты.
                                </li>
                                <li>
                                    <b>2.</b> Если у вас виртуальная карта,
                                    пришлите её скриншот из личного кабинета
                                    вашего банка. На скриншоте должны быть видны
                                    последние 4 цифры номера карты, имя и
                                    фамилия владельца карты.
                                </li>
                            </ol>
                        </section>

                        {/* <ZoomableImage src={CreditCard} /> */}

                        <section className="grid grid-cols-[2fr,_1fr] grid-rows-[minmax(150px,_1fr)] place-items-center px-4 py-2">
                            <ZoomableImage
                                src={CreditCard}
                                alt=""
                                className="h-full"
                            />

                            <ZoomableImage
                                src={BankApplication}
                                alt=""
                                className="h-full"
                            />
                        </section>

                        <VerifyCreditCardForm />
                    </article>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
