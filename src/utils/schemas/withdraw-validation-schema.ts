import * as z from "zod";

const alphanumericRegex = /^[0-9\s]+$/;

export const withdrawValidationSchema = (
    minLimit: number,
    maxLimit: number,
    currency: string,
    minSymbols: number,
    maxSymbols: number
) => {
    return z.object({
        amount: z.coerce
            .number({
                required_error: "Поле обязательно для заполнения",
                invalid_type_error: "Поле может содержать только цифры"
            })
            .multipleOf(0.01, {
                message: "Введена не корректная сумма пополнения"
            })
            // .int({ message: "Введенное значение должно быть целым числом" })
            .gte(
                minLimit,
                `Укажите сумму от ${minLimit.toFixed(2)} ${currency}`
            )
            .lte(
                maxLimit,
                `Максимальная сумма выплат ${maxLimit.toFixed(2)} ${currency}`
            ),
        userRequisite: z
            .string()
            .min(1, {
                message: "Поле обязательно для заполнения"
            })
            .regex(alphanumericRegex, {
                message: "Поле может содержать только цифры"
            })
            .min(minSymbols, {
                message: `Поле должно содержать не менее ${minSymbols} символов`
            })
            .max(maxSymbols, {
                message: `Превышено максимально допустимое количество символов (${maxSymbols})`
            })
            .transform(e => e.replace(/\s/g, ""))
    });
};

export type WithdrawValidationSchema = z.infer<
    ReturnType<typeof withdrawValidationSchema>
>;
