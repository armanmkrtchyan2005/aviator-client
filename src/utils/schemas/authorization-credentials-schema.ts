import * as z from "zod";

const alphanumericRegex = /^\s?[A-Za-z0-9_]+\s?$/;

export const authorizationCredentialsSchema = z
    .object({
        // login: z.union([
        //     z
        //         .string()
        //         .min(1, {
        //             message: "Поле обязательно для заполнения"
        //         })
        //         .regex(alphanumericRegex)
        //         .min(5)
        //         .max(20)
        //         .transform(e => e.trim()),
        //     z.string().email().max(60)
        // ]),
        login: z
            .string()
            .min(1, { message: "Поле обязательно для заполнения" }),
        password: z
            .string()
            .min(1, { message: "Поле обязательно для заполнения" })

        // .regex(alphanumericRegex)
        // .min(8)
        // .max(30)
    })
    // .superRefine(({ login, password }, ctx) => {
    //     try {
    //         z.string()
    //             .regex(alphanumericRegex)
    //             .min(5)
    //             .max(20)
    //             .transform(e => e.trim())
    //             .parse(login);
    //         z.string().regex(alphanumericRegex).min(8).max(30).parse(password);
    //     } catch (error) {
    //         ctx.addIssue({
    //             code: z.ZodIssueCode.custom,
    //             path: ["login"],
    //             fatal: true,
    //             message: "Неверное имя пользователя или пароль"
    //         });
    //         ctx.addIssue({
    //             code: z.ZodIssueCode.custom,
    //             path: ["password"],
    //             fatal: true,
    //             message: "Неверное имя пользователя или пароль"
    //         });
    //     }
    // });
    .superRefine(({ login, password }, ctx) => {
        // try {
        //     z.string().min(1).parse(login);
        // } catch (error) {
        //     ctx.addIssue({
        //         code: z.ZodIssueCode.custom,
        //         path: ["login"],
        //         fatal: true,
        //         message: "Поле обязательно для заполнения"
        //     });
        // }

        // try {
        //     z.string().min(1).parse(password);
        // } catch (error) {
        //     ctx.addIssue({
        //         code: z.ZodIssueCode.custom,
        //         path: ["password"],
        //         fatal: true,
        //         message: "Поле обязательно для заполнения"
        //     });
        //     return;
        // }

        try {
            z.union([
                z
                    .string()
                    .regex(alphanumericRegex)
                    .min(5)
                    .max(20)
                    .transform(e => e.trim()),
                z
                    .string()
                    .email()
                    .max(60)
                    .transform(e => e.trim())
            ]).parse(login);
            z.string().regex(alphanumericRegex).min(8).max(30).parse(password);
        } catch (error) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["login"],
                fatal: true,
                message: "Неверное имя пользователя или пароль"
            });
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["password"],
                fatal: true,
                message: "Неверное имя пользователя или пароль"
            });
            return;
        }
    });
// .refine(
//     ({ login, password }) => {
//         try {
//             z.string().regex(alphanumericRegex).min(5).max(20).parse(login);
//             z.string()
//                 .regex(alphanumericRegex)
//                 .min(8)
//                 .max(30)
//                 .parse(password);
//             return true;
//         } catch (error) {
//             return false;
//         }
//         // z.string().regex(alphanumericRegex).min(5).max(20).parse(login);
//     },
//     {
//         message: "Неверное имя пользователя или пароль",
//         path: ["login"]
//     }
// )
// .refine(
//     ({ login, password }) => {
//         try {
//             z.union([
//                 z
//                     .string()
//                     .regex(alphanumericRegex)
//                     .min(5)
//                     .max(20)
//                     .transform(e => e.trim()),
//                 z
//                     .string()
//                     .email()
//                     .max(60)
//                     .transform(e => e.trim())
//             ]).parse(login);
//             z.string()
//                 .regex(alphanumericRegex)
//                 .min(8)
//                 .max(30)
//                 .parse(password);
//             return true;
//         } catch (error) {
//             return false;
//         }
//     },
//     {
//         message: "Неверное имя пользователя или пароль",
//         path: ["password"]
//     }
// );

export type AuthorizationCredentialsFormSchema = z.infer<
    typeof authorizationCredentialsSchema
>;
