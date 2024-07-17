import { useRef, useId } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    useGetUserQuery,
    useSendConfirmationCodeOnExistingEmailMutation,
    useConfirmExistingEmailMutation
} from "@/store/api/userApi";
// import {
//     useSendConfirmationCodeMutation,
//     useConfirmPasswordChangeMutation
// } from "@/store/api/authApi";

import { useAuth } from "@/store/hooks/useAuth";
import { handleErrorResponse } from "@/store/services";

import { PreviousRouteLink } from "@/components/previous-route-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailTooltip } from "@/components/tooltips/email-tooltip";

import {
    ResendCodeButton,
    ResendCodeElement
} from "@/components/ui/resend-code-button";
import { toast } from "@/components/toasts/toast";

import { ImSpinner9 } from "react-icons/im";

interface FormFields {
    code: HTMLInputElement;
}

export const SecurityConfirmExistingEmailForm = () => {
    const buttonRef = useRef<ResendCodeElement>(null);
    const codeId = useId();

    const { isAuthenticated } = useAuth();
    const { data: user } = useGetUserQuery(undefined, {
        skip: !isAuthenticated
    });
    const [
        sendConfirmationCodeOnExistingEmail,
        { isLoading: isCodeSendingOnExistingEmail }
    ] = useSendConfirmationCodeOnExistingEmailMutation();
    const [confirmExistingEmail, { isLoading }] =
        useConfirmExistingEmailMutation();
    // const [confirmPasswordChange, { isLoading: isPasswordChangeConfirming }] =
    //     useConfirmPasswordChangeMutation();

    const location = useLocation();
    const navigate = useNavigate();

    const onClickHandler: React.MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        if (!user?.email) return;

        try {
            await sendConfirmationCodeOnExistingEmail({
                type: location.state.type === "email" ? "change" : "reset"
            }).unwrap();
            // if (location.state.type === "email") {
            //     await sendConfirmationCodeOnExistingEmail().unwrap();
            // } else if (location.state.type === "password") {
            //     await sendConfirmationCode({ email: user?.email }).unwrap();
            // }
            buttonRef.current?.show();
            buttonRef.current?.disable();
        } catch (error) {
            handleErrorResponse(error, message => toast.error(message));
        }
    };

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        if (!user?.email) return;

        event.preventDefault();

        try {
            const { code } = event.currentTarget;

            if (location.state.type === "email") {
                const { message } = await confirmExistingEmail({
                    code: Number(code.value),
                    email: user?.email,
                    type: "change"
                }).unwrap();
                toast.notify(message);
                navigate(location?.state?.nextUrl);
            } else if (location.state.type === "password") {
                const { token } = await confirmExistingEmail({
                    code: Number(code.value),
                    email: user?.email,
                    type: "reset"
                }).unwrap();
                // toast.notify(message);
                navigate(location?.state?.nextUrl, { state: { token } });
            }
        } catch (error) {
            handleErrorResponse(error, message => {
                toast.error(message);
            });
        }
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="relative grid gap-y-4"
        >
            <PreviousRouteLink />
            <h3 className="text-center">Подтвердждение Email</h3>
            <Label>
                <span>На ваш Email отправлен код</span>
                <Input
                    defaultValue={user?.email}
                    readOnly
                    className="border-[#414148] focus-visible:outline-transparent"
                />
            </Label>

            <div className="space-y-2">
                <p className="flex items-center justify-between">
                    <label htmlFor={codeId}>Код</label>
                    <EmailTooltip />
                </p>
                <Input
                    id={codeId}
                    placeholder="Введите код"
                    name="code"
                    required
                    className="border-[#414148]"
                />
                <ResendCodeButton
                    disabled={isCodeSendingOnExistingEmail}
                    onClick={onClickHandler}
                    ref={buttonRef}
                />
            </div>

            <button
                disabled={
                    isLoading
                    // isPasswordChangeConfirming
                }
                className="mt-2 border border-gray-50 bg-[#2c2d30] py-1.5"
            >
                {isLoading ? (
                    // || isPasswordChangeConfirming
                    <ImSpinner9 className="mx-auto animate-spin text-sm" />
                ) : (
                    "Изменить"
                )}
            </button>
        </form>
    );
};
