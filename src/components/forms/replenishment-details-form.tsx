import React, { useState, useId, PropsWithChildren } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

import {
    useFetchReplenishmentByIdQuery,
    useConfirmReplenishmentByIdMutation,
    useCancelReplenishmentByIdMutation,
    Replenishment
} from "@/api/replenishment";

import { DialogClose } from "@/components/ui/dialog";
import { CountDownTimer } from "../timer/count-down-timer";
import { ClipboardCopy } from "@/components/ui/clipboard-copy";
import { TimerTooltip } from "@/components/tooltips/timer-tooltip";
import { toast } from "@/components/toasts/toast";

import { cn } from "@/utils";
import { handleErrorResponse } from "@/store/services";

import { ImSpinner9 } from "react-icons/im";
import Visa from "@/assets/visa-360w.webp";
import UploadIcon from "@/assets/upload.png";

type ReplenishmentFormState =
    | "init"
    | "confirm"
    | "confirmed"
    | "reject"
    | "rejected";

export const ReplenishmentDetailsForm = () => {
    const params = useParams();
    const navigate = useNavigate();

    const { data: replenishment, isLoading: isReplenishmentDataLoading } =
        useFetchReplenishmentByIdQuery({
            id: params?.replenishmentId as string
        });

    const [formState, setFormState] = useState<ReplenishmentFormState>("init");
    const [receiptPhoto, setReceiptPhoto] = useState<File | null>(null);

    const [
        confirmReplenishment,
        { isLoading: isPaymentConfirmRequestLoading }
    ] = useConfirmReplenishmentByIdMutation();
    const [cancelReplenishment, { isLoading: isPaymentCancelRequestLoading }] =
        useCancelReplenishmentByIdMutation();

    const confirmPayment = async (id: string | undefined) => {
        if (!id) return;

        try {
            if (!receiptPhoto) {
                const { message } = await confirmReplenishment({ id }).unwrap();
                toast.notify(message);
            } else {
                const { message } = await confirmReplenishment({
                    id,
                    receipt: receiptPhoto
                }).unwrap();
                toast.notify(message);
            }

            setFormState("confirmed");
        } catch (error) {
            handleErrorResponse(error, message => toast.error(message));
        } finally {
            setReceiptPhoto(null);
        }
    };

    const abortReplenishment = async (id: string | undefined) => {
        if (!id) return;

        try {
            const { message } = await cancelReplenishment({ id }).unwrap();
            toast.notify(message);

            setFormState("rejected");
        } catch (error) {
            handleErrorResponse(error, message => toast.error(message));
        } finally {
            setReceiptPhoto(null);
        }
    };

    if (isReplenishmentDataLoading)
        return (
            <div className="flex w-full items-center justify-center px-3">
                <ScaleLoader color="rgb(54, 215, 183)" />
            </div>
        );

    // if (replenishment?.status === "В обработке...")
    //     return (
    //         <PaymentDetails
    //             replenishment={replenishment}
    //             setReceipt={setReceiptPhoto}
    //         >
    //             <Field
    //                 label={"Статус заявки"}
    //                 value={"В обработке..."}
    //             />

    //             <DialogClose
    //                 type="button"
    //                 onClick={() =>
    //                     navigate("/payment/replenishment", { replace: true })
    //                 }
    //                 className="border-none bg-slate-400/70 py-2 text-center text-black shadow-md focus-visible:outline-slate-400/70"
    //             >
    //                 Закрыть
    //             </DialogClose>
    //         </PaymentDetails>
    //     );

    if (
        replenishment?.status === "В обработке..." ||
        replenishment?.status === "Успешно завершена" ||
        replenishment?.status === "Отменена" ||
        formState === "rejected" ||
        formState === "confirmed"
    )
        return (
            <PaymentDetails
                replenishment={replenishment}
                formState={formState}
                setReceipt={setReceiptPhoto}
            >
                <Field
                    label={"Статус заявки"}
                    value={replenishment?.status}
                />

                <DialogClose
                    type="button"
                    onClick={() =>
                        navigate("/payment/replenishment", {
                            replace: true
                        })
                    }
                    className="border-none bg-slate-400/70 py-2 text-center text-black shadow-md focus-visible:outline-slate-400/70"
                >
                    Закрыть
                </DialogClose>
            </PaymentDetails>
        );

    // if (replenishment?.status === "Отменена" || formState === "rejected")
    //     return (
    //         <PaymentDetails
    //             replenishment={replenishment}
    //             setReceipt={setReceiptPhoto}
    //         >
    //             <Field
    //                 label={"Статус заявки"}
    //                 value={"Отменена"}
    //             />

    //             <DialogClose
    //                 type="button"
    //                 onClick={() =>
    //                     navigate("/payment/replenishment", { replace: true })
    //                 }
    //                 className="border-none bg-slate-400/70 py-2 text-center text-black shadow-md focus-visible:outline-slate-400/70"
    //             >
    //                 Закрыть
    //             </DialogClose>
    //         </PaymentDetails>
    //     );

    switch (formState) {
        case "init":
            return (
                <PaymentDetails
                    replenishment={replenishment}
                    formState={formState}
                    setReceipt={setReceiptPhoto}
                >
                    <p className="flex items-center justify-between text-xs text-slate-400">
                        <span className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={String(replenishment?.uid)}
                                className="inline-block max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {replenishment?.uid || ""}
                            </ClipboardCopy>
                        </span>
                        <span>
                            <span>Время на оплату</span>{" "}
                            <CountDownTimer
                                finishTime={
                                    new Date(
                                        replenishment?.createdAt as string
                                    ).getTime() +
                                    30 * 60 * 1000
                                }
                            />{" "}
                            <TimerTooltip />
                        </span>
                    </p>

                    <button
                        disabled={
                            replenishment?.requisite?.isReceiptFileRequired &&
                            !receiptPhoto
                        }
                        onClick={() => setFormState("confirm")}
                        className="mt-4 rounded-md bg-[#36ca12] px-4 py-2 text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5 disabled:pointer-events-none disabled:bg-slate-400/70"
                    >
                        Подтвердить оплату
                    </button>

                    <button
                        onClick={() => setFormState("reject")}
                        className="rounded-md bg-red-600 px-4 py-2 text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5"
                    >
                        Отменить
                    </button>
                </PaymentDetails>
            );

        case "confirm":
            return (
                <PaymentDetails
                    replenishment={replenishment}
                    formState={formState}
                    setReceipt={setReceiptPhoto}
                >
                    <p className="flex items-center justify-between text-xs text-slate-400">
                        <span className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={String(replenishment?.uid)}
                                className="inline-block max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {replenishment?.uid || ""}
                            </ClipboardCopy>
                        </span>
                        <span>
                            <span>Время на оплату</span>{" "}
                            <CountDownTimer
                                finishTime={
                                    new Date(
                                        replenishment?.createdAt as string
                                    ).getTime() +
                                    30 * 60 * 1000
                                }
                            />{" "}
                            <TimerTooltip />
                        </span>
                    </p>

                    <p className="text-center text-sm text-black">
                        Вы подтверждаете оплату?
                    </p>

                    <p>
                        <button
                            onClick={() => confirmPayment(replenishment?._id)}
                            disabled={isPaymentConfirmRequestLoading}
                            className="float-left w-24 bg-[#36ca12] py-2 text-white disabled:pointer-events-none"
                        >
                            {isPaymentConfirmRequestLoading ? (
                                <ImSpinner9 className="mx-auto animate-spin text-xl" />
                            ) : (
                                "Да"
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setFormState("init");
                            }}
                            className="float-right w-24 bg-red-600 py-2 text-white"
                        >
                            Нет
                        </button>
                    </p>
                </PaymentDetails>
            );

        case "reject":
            return (
                <PaymentDetails
                    replenishment={replenishment}
                    formState={formState}
                    setReceipt={setReceiptPhoto}
                >
                    <p className="flex items-center justify-between text-xs text-slate-400">
                        <span className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={String(replenishment?.uid)}
                                className="inline-block max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {replenishment?.uid || ""}
                            </ClipboardCopy>
                        </span>
                        <span>
                            <span>Время на оплату</span>{" "}
                            <CountDownTimer
                                finishTime={
                                    new Date(
                                        replenishment?.createdAt as string
                                    ).getTime() +
                                    30 * 60 * 1000
                                }
                            />{" "}
                            <TimerTooltip />
                        </span>
                    </p>

                    <p className="text-center text-sm text-black">
                        Вы уверены, что хотите отменить оплату?
                    </p>

                    <p>
                        <button
                            onClick={() =>
                                abortReplenishment(replenishment?._id)
                            }
                            disabled={isPaymentCancelRequestLoading}
                            className="float-left w-24 bg-red-600 py-2 text-white disabled:pointer-events-none"
                        >
                            {isPaymentCancelRequestLoading ? (
                                <ImSpinner9 className="mx-auto animate-spin text-xl" />
                            ) : (
                                "Да"
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setFormState("init");
                            }}
                            className="float-right w-24 bg-[#36ca12] py-2 text-white"
                        >
                            Нет
                        </button>
                    </p>
                </PaymentDetails>
            );

        // case "rejected":
        //     return (
        //         <PaymentDetails
        //             replenishment={replenishment}
        //             setReceipt={setReceiptPhoto}
        //         >
        //             <Field
        //                 label={"Статус заявки"}
        //                 value={"Отменена"}
        //             />

        //             <DialogClose
        //                 type="button"
        //                 onClick={() =>
        //                     navigate("/payment/replenishment", {
        //                         replace: true
        //                     })
        //                 }
        //                 className="border-none bg-slate-400/70 py-2 text-center text-black shadow-md focus-visible:outline-slate-400/70"
        //             >
        //                 Закрыть
        //             </DialogClose>
        //         </PaymentDetails>
        //     );

        default:
            break;
    }
};

interface FieldProps {
    className?: string;
    label: string;
    value: string | number | undefined;
}

const Field: React.FC<FieldProps> = ({ className, label, value }) => {
    return (
        <div className="grid gap-y-1 space-y-0 text-sm text-slate-400">
            <p>{label}</p>
            <p
                className={cn(
                    "h-10 rounded-lg border-none bg-slate-300/70 px-4 py-2 align-middle leading-6 text-black shadow-md focus-visible:outline-slate-400/70",
                    className
                )}
            >
                {value}
            </p>
        </div>
    );
};

interface PaymentDetailsProps extends PropsWithChildren {
    replenishment: Replenishment | undefined;
    formState: ReplenishmentFormState;
    setReceipt: React.Dispatch<React.SetStateAction<File | null>>;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
    replenishment,
    formState,
    setReceipt,
    children
}) => {
    const receiptId = useId();

    const onChangeHandler: React.ChangeEventHandler<
        HTMLInputElement
    > = event => {
        const input = event.currentTarget;

        if (!input.files) return;

        const file = input.files[0];

        if (file.size > 3 * 1024 * 1024) {
            toast.error("Размер файла не должен превышать 3 мб");
            input.value = "";
            setReceipt(null);
            return;
        }

        setReceipt(file);
    };

    const onErrorHandler: React.ReactEventHandler<HTMLImageElement> = event => {
        event.currentTarget.src = Visa;
    };

    return (
        <div className="grid gap-y-4">
            <p className="flex h-10 items-center gap-2 rounded-lg bg-slate-300/70 px-2 py-1 leading-none text-black">
                <img
                    src={replenishment?.method?.img || Visa}
                    alt={replenishment?.method?.name}
                    onError={onErrorHandler}
                    className="h-full"
                />
                <span className="inline-block w-full truncate font-semibold">
                    {replenishment?.method?.name}
                </span>
            </p>

            <div className="grid gap-y-1 space-y-0 text-sm text-slate-400">
                <p>Реквизиты для пополнения</p>
                <ClipboardCopy
                    textToCopy={replenishment?.requisite?.requisite}
                    toastMessage="Реквизиты скопированы в буфер обмена"
                    className="h-10 rounded-lg border-none bg-slate-300/70 px-4 py-2 text-black shadow-md transition-colors focus-visible:outline-slate-400/70 mh:hover:text-slate-600"
                >
                    {replenishment?.requisite?.requisite || ""}
                </ClipboardCopy>
            </div>

            <Field
                label={"Сумма депозита"}
                value={`${replenishment?.amount?.[
                    replenishment?.method?.currency || "USD"
                ]?.toFixed(2)} ${replenishment?.method?.currency}`}
            />

            <Field
                label={"Комиссия"}
                value={`${(
                    (replenishment?.deduction?.[
                        replenishment?.method?.currency || "USD"
                    ] || 0) -
                    (replenishment?.amount?.[
                        replenishment?.method?.currency || "USD"
                    ] || 0)
                )?.toFixed(2)} ${replenishment?.method?.currency}`}
            />

            <Field
                label={"К оплате"}
                value={`${replenishment?.deduction?.[
                    replenishment?.method?.currency || "USD"
                ]?.toFixed(2)} ${replenishment?.method?.currency}`}
                className="border-green-50 bg-green-450 shadow-[inset_0_1px_1px_#ffffff80]"
            />

            {replenishment?.requisite?.isReceiptFileRequired &&
            (formState === "init" ||
                formState === "confirm" ||
                formState === "reject") ? (
                <fieldset className="grid grid-cols-[minmax(0,_3fr),_minmax(0,_1fr)] place-items-center gap-x-1">
                    <p className="text-[0.625rem]">
                        Загрузите квитанцию об оплате после перевода. Квитанцию
                        можно получить в приложении или на сайте вашего банка.
                        Вносить в неё изменения запрещено. Максимальный размер
                        файла — <strong>3 МБ</strong>. Доступные форматы:{" "}
                        <strong>PNG, JPG, HEIC, WEBP, PDF.</strong>
                    </p>

                    <label
                        htmlFor={receiptId}
                        className="cursor-pointer"
                    >
                        <span className="text-sm">Загрузить</span>
                        <img
                            src={UploadIcon}
                            alt="Загрузите квитанцию"
                        />
                    </label>

                    <input
                        id={receiptId}
                        type="file"
                        multiple={false}
                        accept="image/*, .pdf"
                        name="receipt"
                        onChange={onChangeHandler}
                        hidden
                    />
                </fieldset>
            ) : null}

            {children}
        </div>
    );
};
