import { useId } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    passwordPairSchema as formSchema,
    PasswordPairFormSchema as FormSchema
} from "@/utils/schemas";

import { useChangePasswordMutation } from "@/store";
// import { useAuth } from "@/store/hooks/useAuth";
import { handleErrorResponse } from "@/store/services";

import {
    RestorePasswordDialogHeader,
    RestorePasswordDialogFooter
} from "../modals/restore-password-modal";
import { Label } from "@/components/ui/label";
import { Password, ErrorMessage } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ImSpinner9 } from "react-icons/im";

export const ResetPasswordForm = () => {
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const navigate = useNavigate();
    const location = useLocation();

    const passwordId = useId();
    const passwordConfirmId = useId();
    const passwordErrorId = useId();
    const passwordConfirmErrorId = useId();
    const serverErrorId = useId();

    const {
        handleSubmit,
        register,
        getValues,
        setError,
        clearErrors,
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
        if (!location?.state?.token) return;

        try {
            await changePassword({
                password,
                passwordConfirm,
                token: location?.state?.token
            }).unwrap();
            navigate("/main/sign-in", {
                state: {
                    password: getValues().password
                }
            });
        } catch (error) {
            handleErrorResponse(error, message => {
                setError("root", {
                    type: "manual",
                    message: message
                });
            });
        }
    };

    const onFocusHandler: React.FocusEventHandler<HTMLInputElement> = () => {
        if (!errors?.root) return;

        clearErrors("root");
    };

    return (
        <>
            <RestorePasswordDialogHeader />
            <form
                className="grid gap-y-8"
                onSubmit={handleSubmit(onSubmitHandler)}
            >
                <Label>
                    <span className="text-xs">
                        Придумайте новый пароль (мин. 8 символов)
                    </span>
                    <Password
                        id={passwordId}
                        {...register("password")}
                        aria-invalid={errors?.password ? "true" : "false"}
                        aria-errormessage={
                            errors.password ? passwordErrorId : undefined
                        }
                        onFocus={onFocusHandler}
                    />
                    {errors.password ? (
                        <ErrorMessage
                            id={passwordErrorId}
                            htmlFor={passwordId}
                            message={errors.password?.message}
                        />
                    ) : null}
                </Label>
                <Label>
                    <span>Повторите пароль</span>
                    <Password
                        id={passwordConfirmId}
                        {...register("passwordConfirm")}
                        aria-invalid={errors.passwordConfirm ? "true" : "false"}
                        aria-errormessage={
                            errors.passwordConfirm
                                ? passwordConfirmErrorId
                                : undefined
                        }
                        onFocus={onFocusHandler}
                    />
                    {errors?.root ? (
                        <ErrorMessage
                            id={serverErrorId}
                            message={errors.root?.message}
                        />
                    ) : errors.passwordConfirm ? (
                        <ErrorMessage
                            id={passwordConfirmErrorId}
                            htmlFor={passwordConfirmId}
                            message={errors.passwordConfirm?.message}
                        />
                    ) : null}
                </Label>

                <Button
                    disabled={isLoading}
                    variant="confirm"
                >
                    {isLoading ? (
                        <ImSpinner9 className="mx-auto animate-spin text-[28px]" />
                    ) : (
                        "Восстановить"
                    )}
                </Button>
            </form>
            <RestorePasswordDialogFooter />
        </>
    );
};
