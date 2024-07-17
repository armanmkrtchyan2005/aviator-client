import { useRef, useId } from "react";
import { useNavigate } from "react-router-dom";
import {
    useConfirmPasswordChangeMutation,
    useSendConfirmationCodeMutation
} from "@/store/api/authApi";
import { handleErrorResponse } from "@/store/services";

import {
    RestorePasswordDialogHeader,
    RestorePasswordDialogFooter
} from "../modals/restore-password-modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ImSpinner9 } from "react-icons/im";
import {
    ResendCodeButton,
    ResendCodeElement
} from "@/components/ui/resend-code-button";
import { toast } from "@/components/toasts/toast";
import { EmailTooltip } from "@/components/tooltips/email-tooltip";

interface FormFields {
    code: HTMLInputElement;
}

export const ConfirmEmailForm = () => {
    const buttonRef = useRef<ResendCodeElement>(null);
    const codeId = useId();
    const email = sessionStorage.getItem("email");

    const navigate = useNavigate();
    const [confirmChange, { isLoading: isConfirming }] =
        useConfirmPasswordChangeMutation();
    const [sendConfirmationCode, { isLoading: isSending }] =
        useSendConfirmationCodeMutation();

    const handleSubmit: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        try {
            const { code } = event.currentTarget;

            const { token } = await confirmChange({
                code: Number(code.value)
            }).unwrap();
            navigate("/main/password/reset", { state: { token } });
        } catch (error) {
            handleErrorResponse(error, message => {
                toast.error(message);
            });
        }
    };

    const onClickHandler: React.MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        try {
            await sendConfirmationCode({
                email: sessionStorage.getItem("email") || ""
            }).unwrap();
            buttonRef.current?.show();
            buttonRef.current?.disable();
            navigate("/main/password/confirm-email");
        } catch (error) {
            handleErrorResponse(error, message => {
                toast.error(message);
            });
        }
    };

    return (
        <>
            <RestorePasswordDialogHeader />
            <form
                onSubmit={handleSubmit}
                className="grid gap-y-8"
            >
                <Label direction="column">
                    <span className="text-sm">
                        На ваш Email отправлен код для подтверждения
                    </span>
                    <Input
                        readOnly
                        value={email as string}
                        className="outline-none"
                    />
                </Label>
                <div className="space-y-2">
                    <p className="flex items-center justify-between">
                        <label htmlFor={codeId}>Введите код</label>
                        <EmailTooltip />
                    </p>
                    <Input
                        id={codeId}
                        inputMode="numeric"
                        name="code"
                        required
                    />
                    <ResendCodeButton
                        disabled={isSending}
                        onClick={onClickHandler}
                        ref={buttonRef}
                    />
                </div>
                <Button
                    variant="confirm"
                    disabled={isConfirming || isSending}
                >
                    {isConfirming ? (
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
