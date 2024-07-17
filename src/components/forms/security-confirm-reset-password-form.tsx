import { useId } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/toasts/toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    passwordPairSchema as formSchema,
    PasswordPairFormSchema as FormSchema
} from "@/utils/schemas";

import { useChangeUserPasswordMutation } from "@/store/api/userApi";
import { handleErrorResponse } from "@/store/services";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input, ErrorMessage } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImSpinner9 } from "react-icons/im";

export const SecurityConfirmResetPasswordForm = () => {
    const passwordId = useId();
    const passwordConfirmId = useId();
    const passwordErrorId = useId();
    const passwordConfirmErrorId = useId();

    const navigate = useNavigate();
    const location = useLocation();

    const [changePassword, { isLoading }] = useChangeUserPasswordMutation();

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            passwordConfirm: ""
        }
    });

    const onSubmitHandler: SubmitHandler<FormSchema> = async ({
        password,
        passwordConfirm
    }) => {
        const token = location.state.token;
        console.log("Token: ", token);

        if (!token) return;

        try {
            await changePassword({ token, password, passwordConfirm }).unwrap();
            toast.notify("Пароль успешно изменён");
            navigate("/main/security");
        } catch (error) {
            handleErrorResponse(error, message => {
                toast.error(message);
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="relative grid gap-y-4"
        >
            <PreviousRouteLink />

            <h3 className="text-center">Сброс пароля</h3>
            <Label>
                <span>Введите новый пароль</span>
                <Input
                    id={passwordId}
                    placeholder="Введите пароль"
                    aria-invalid={errors?.password ? "true" : "false"}
                    aria-errormessage={
                        errors?.password ? passwordErrorId : undefined
                    }
                    {...register("password")}
                    className="border-[#414148]"
                />
                {errors?.password ? (
                    <ErrorMessage
                        id={passwordErrorId}
                        htmlFor={passwordId}
                        message={errors?.password?.message}
                    />
                ) : null}
            </Label>
            <Label>
                <span>Повторите пароль</span>
                <Input
                    id={passwordConfirmId}
                    placeholder="Повторите пароль"
                    aria-invalid={errors?.passwordConfirm ? "true" : "false"}
                    aria-errormessage={
                        errors?.passwordConfirm
                            ? passwordConfirmErrorId
                            : undefined
                    }
                    {...register("passwordConfirm")}
                    className="border-[#414148]"
                />
                {errors?.passwordConfirm ? (
                    <ErrorMessage
                        id={passwordConfirmErrorId}
                        htmlFor={passwordConfirmId}
                        message={errors?.passwordConfirm?.message}
                    />
                ) : null}
            </Label>
            <button
                disabled={isLoading}
                className="mt-2 border border-gray-50 bg-[#2c2d30] py-2"
            >
                {isLoading ? (
                    <ImSpinner9 className="mx-auto animate-spin text-sm" />
                ) : (
                    "Сохранить"
                )}
            </button>
        </form>
    );
};
