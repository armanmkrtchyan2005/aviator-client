import * as z from "zod";

export const depositValidationSchema = (
    min: number,
    max: number,
    currency: string
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
            .gte(
                min,
                `Минимальная сумма пополнения ${min.toFixed(2)} ${currency}`
            )
            .lte(
                max,
                `Максимальная сумма пополнения ${max.toFixed(2)} ${currency}`
            )
    });
};

export type DepositValidationSchema = z.infer<
    ReturnType<typeof depositValidationSchema>
>;
