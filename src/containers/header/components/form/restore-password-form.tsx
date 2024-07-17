import { useRef, useId } from "react";
import { useNavigate } from "react-router-dom";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    emailValidationSchema,
    EmailValidationFormSchema
} from "@/utils/schemas";

import { useSendConfirmationCodeMutation } from "@/store";
import { handleErrorResponse } from "@/store/services";

import {
    RestorePasswordDialogHeader,
    RestorePasswordDialogFooter
} from "../modals/restore-password-modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/input";

import { ImSpinner9 } from "react-icons/im";

export const RestorePasswordForm = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const emailId = useId();
    const emailErrorId = useId();
    const [sendConfirmationCode, { isLoading }] =
        useSendConfirmationCodeMutation();

    const navigate = useNavigate();

    const email = sessionStorage.getItem("email");

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm<EmailValidationFormSchema>({
        resolver: zodResolver(emailValidationSchema),
        defaultValues: {
            email: email || ""
        }
    });

    const onSubmit: SubmitHandler<EmailValidationFormSchema> = async ({
        email
    }) => {
        try {
            await sendConfirmationCode({ email }).unwrap();
            sessionStorage.setItem("email", email);
            navigate("/main/password/confirm-email");
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

        clearErrors();
    };

    return (
        <>
            <RestorePasswordDialogHeader />
            <form
                className="space-y-8"
                onSubmit={handleSubmit(onSubmit)}
                ref={formRef}
            >
                <Label>
                    <span className="text-sm">
                        Введите email, привязанный к аккаунту
                    </span>
                    <Input
                        id={emailId}
                        {...register("email")}
                        aria-invalid={
                            errors?.email || errors?.root ? "true" : "false"
                        }
                        aria-errormessage={
                            errors?.email || errors?.root
                                ? emailErrorId
                                : undefined
                        }
                        autoComplete="off"
                        onFocus={onFocusHandler}
                    />

                    {errors?.root ? (
                        <ErrorMessage
                            id={emailErrorId}
                            message={errors?.root?.message}
                        />
                    ) : errors?.email ? (
                        <ErrorMessage
                            id={emailErrorId}
                            message={errors?.email?.message}
                        />
                    ) : null}
                </Label>
                <Button
                    variant="confirm"
                    disabled={isLoading}
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
