import { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    withdrawValidationSchema as formSchema,
    WithdrawValidationSchema as FormSchema
} from "@/utils/schemas";

import { useGetUserBalanceQuery } from "@/store/api/userApi";
import {
    // useFetchRecommendedRequisitesQuery,
    useFetchRequisitesQuery
} from "@/api/requisite";
import {
    useFetchWithdrawalLimitsQuery,
    useCreateWithdrawMutation
} from "@/api/withdraw";

import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/toasts/toast";

import { ImSpinner9 } from "react-icons/im";
import Visa from "@/assets/visa-360w.webp";
import { handleErrorResponse } from "@/store/services/helpers";

interface CreateWithdrawFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRequisiteId: string | null;
}

export const CreateWithdrawalForm: React.FC<CreateWithdrawFormProps> = ({
    setOpen,
    selectedRequisiteId
}) => {
    const [createWithdrawal, { isLoading }] = useCreateWithdrawMutation();
    const { data: requisites } = useFetchRequisitesQuery({
        type: "withdrawal"
    });
    // const { data: recommendedRequisites } = useFetchRecommendedRequisitesQuery({
    //     type: "withdrawal"
    // });
    const {
        data: limits,
        isSuccess: isLimitsSuccessResponse,
        isLoading: isLimitsLoading
    } = useFetchWithdrawalLimitsQuery({
        id: selectedRequisiteId || ""
    });
    const { data: balance } = useGetUserBalanceQuery();

    const selectedRequisite = requisites
        ?.flatMap(requisite => requisite.requisites)
        .find(requisite => requisite._id === selectedRequisiteId);

    // const selectedRequisite = useMemo(
    //     () =>
    //         [
    //             ...requisites?.flatMap(requisite => requisite.requisites),
    //             ...recommendedRequisites
    //         ].find(requisite => requisite._id === selectedRequisiteId),
    //     [requisites, recommendedRequisites, selectedRequisiteId]
    // );

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(
            formSchema(
                limits?.minLimit || 100,
                limits?.maxLimit || 1000,
                balance?.currency || "USD",
                limits?.minSymbols || 10,
                limits?.maxSymbols || 20
            )
        ),
        defaultValues: {
            amount: undefined,
            userRequisite: ""
        }
    });

    console.log(limits);

    const onSubmitHandler: SubmitHandler<FormSchema> = async ({
        amount,
        userRequisite
    }) => {
        try {
            await createWithdrawal({
                currency: balance?.currency || "",
                amount: Number(amount),
                requisite: selectedRequisiteId || "",
                userRequisite
            }).unwrap();

            toast.notify("Заявка на вывод успешно создана");
            setOpen(false);
        } catch (error) {
            handleErrorResponse(error, message => toast.error(message));
        }
    };

    const onErrorHandler: React.ReactEventHandler<HTMLImageElement> = event => {
        event.currentTarget.src = Visa;
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="grid gap-y-4 "
        >
            <p className="flex h-10 items-center gap-2 rounded-lg bg-slate-300/70 px-2 py-1 leading-none text-black">
                <img
                    src={selectedRequisite?.img}
                    alt={selectedRequisite?.name}
                    onError={onErrorHandler}
                    className="h-full"
                />
                <span className="inline-block w-full truncate font-semibold">
                    {selectedRequisite?.name}
                </span>
            </p>
            <Label className="text-sm text-slate-400">
                <span className="text-left ">Введите реквизиты для вывода</span>
                <Input
                    inputMode="numeric"
                    {...register("userRequisite")}
                    aria-invalid={errors?.userRequisite ? "true" : "false"}
                    className="h-10 border-transparent bg-slate-300/70 text-center leading-none text-black shadow-md focus:placeholder:opacity-0 focus-visible:outline-slate-400/70"
                />
                {errors?.userRequisite ? (
                    <ErrorMessage message={errors?.userRequisite?.message} />
                ) : null}
            </Label>
            <Label className="text-sm text-slate-400">
                <span className="">Введите сумму в {balance?.currency}</span>
                <Input
                    inputMode="numeric"
                    {...register("amount")}
                    placeholder="0"
                    aria-invalid={errors?.amount ? "true" : "false"}
                    className="h-10 border-transparent bg-slate-300/70 leading-none text-black shadow-md focus:placeholder:opacity-0 focus-visible:outline-slate-400/70"
                />
                {errors?.amount ? (
                    <ErrorMessage message={`${errors?.amount?.message}`} />
                ) : isLimitsSuccessResponse ? (
                    <span className="block text-right text-xs">
                        {`от ${limits?.minLimit?.toFixed(
                            2
                        )} до ${limits?.maxLimit?.toFixed(
                            2
                        )} ${limits?.currency}`}
                    </span>
                ) : null}
            </Label>

            <button
                disabled={isLimitsLoading || isLoading}
                className="mt-4 rounded-md bg-[#36ca12] px-4 py-2 text-white shadow-md focus-visible:outline-green-400 active:translate-y-0.5 disabled:pointer-events-none disabled:bg-slate-400/70"
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-2xl" />
                ) : (
                    "Подтвердить"
                )}
            </button>
        </form>
    );
};
