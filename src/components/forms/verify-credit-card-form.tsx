import { useState, useId } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useVerifyReplenishmentByIdMutation } from "@/api/replenishment";
import { handleErrorResponse } from "@/store/services";

import { toast } from "@/components/toasts/toast";

import UploadIcon from "@/assets/upload.png";
import { ImSpinner9 } from "react-icons/im";

interface FormFields {
    card: HTMLInputElement;
}

export const VerifyCreditCardForm = () => {
    const [cardPhoto, setCardPhoto] = useState<File | null>(null);
    const [submitEnabled, setSubmitEnabled] = useState(false);
    const inputFileId = useId();

    const [verify, { isLoading }] = useVerifyReplenishmentByIdMutation();

    const navigate = useNavigate();
    const { replenishmentId, requisiteId } = useParams();

    const uploadImageHandler: React.ChangeEventHandler<
        HTMLInputElement
    > = async event => {
        const input = event.currentTarget;

        if (!input.files) return;

        const file = input.files[0];

        if (file.size > 3 * 1024 * 1024) {
            toast.error("Размер файла не должен превышать 3 мб");
            input.value = "";
            setCardPhoto(null);
            setSubmitEnabled(false);
            return;
        }

        setCardPhoto(file);
        setSubmitEnabled(true);
    };

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        if (
            replenishmentId === undefined ||
            requisiteId === undefined ||
            !cardPhoto
        )
            return;

        try {
            const { message } = await verify({
                id: replenishmentId,
                card: cardPhoto
            }).unwrap();
            navigate(
                `/payment/replenishment/${replenishmentId}/requisite/${requisiteId}`
            );
            toast.notify(message);
        } catch (error) {
            handleErrorResponse(error, message => toast.error(message));
        }
    };

    return (
        <form onSubmit={onSubmitHandler}>
            <label
                htmlFor={inputFileId}
                className="mx-auto grid w-max cursor-pointer grid-cols-[auto_minmax(0,_1fr)] grid-rows-[repeat(3,_auto)] place-content-center gap-x-4"
            >
                <div className="row-span-3 flex w-full items-center justify-end">
                    <img
                        src={UploadIcon}
                        alt="Загрузить фото кредитной карты"
                        height="40"
                        width="60"
                        className=""
                    />
                </div>

                <strong className="row-span-3 flex items-center text-sm sm:row-auto md:text-lg xs:text-base">
                    Загрузить файл
                </strong>
                <span className="hidden text-xs sm:block">
                    Максимальный размер файла <strong>3 МБ</strong>
                </span>
                <span className="hidden text-xs sm:block">
                    Доступные форматы:{" "}
                    <strong>PNG, JPG, HEIC, WEBP, PDF</strong>
                </span>
            </label>

            <div className="mt-4 text-xs sm:hidden">
                <p>
                    * Максимальный размер файла: <strong>3 МБ</strong>
                </p>
                <p>
                    ** Доступные форматы:{" "}
                    <strong>PNG, JPG, HEIC, WEBP, PDF</strong>
                </p>
            </div>

            <input
                id={inputFileId}
                type="file"
                multiple={false}
                name="card"
                accept="image/*, .pdf"
                hidden
                onChange={uploadImageHandler}
            />

            <button
                disabled={!submitEnabled || isLoading}
                className="mx-auto mt-4 block w-full max-w-72 rounded-md bg-[#36ca12] px-4 py-2 text-base font-semibold text-white shadow-md transition-colors duration-300 focus-visible:outline-green-400 active:translate-y-0.5 disabled:pointer-events-none disabled:bg-slate-400/70"
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-2xl" />
                ) : (
                    "Продолжить"
                )}
            </button>
        </form>
    );
};
