import * as z from "zod";

export const emailValidationSchema = z.object({
    email: z
        .string()
        .min(1, {
            message: "Поле обязательно для заполнения"
        })
        .email({ message: "Укажите корректный адрес электронной почты" })
});

export type EmailValidationFormSchema = z.infer<typeof emailValidationSchema>;
