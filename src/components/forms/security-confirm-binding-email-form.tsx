// import { useState, useId } from "react";
import { useRef, useId } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    useChangeEmailMutation,
    useSendEmailChangeCodeMutation
} from "@/store/api/userApi";
import { handleErrorResponse } from "@/store/services";

import { toast } from "@/components/toasts/toast";
import { PreviousRouteLink } from "@/components/previous-route-link";
import {
    ResendCodeButton,
    ResendCodeElement
} from "@/components/ui/resend-code-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailTooltip } from "@/components/tooltips/email-tooltip";

import { ImSpinner9 } from "react-icons/im";

interface FormFields {
    code: HTMLInputElement;
}

export const SecurityConfirmBindingEmailForm = () => {
    // const [errorState, setErrorState] = useState({
    //     message: "",
    //     isError: false
    // });
    const buttonRef = useRef<ResendCodeElement>(null);

    const navigate = useNavigate();
    const location = useLocation();

    const [sendChangeCode, { isLoading: isCodeSending }] =
        useSendEmailChangeCodeMutation();

    const codeId = useId();
    // const codeErrorId = useId();

    const [changeEmail, { isLoading: isEmailConfirming }] =
        useChangeEmailMutation();

    const onClickHandler: React.MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        try {
            await sendChangeCode({ email: location?.state?.email }).unwrap();
            buttonRef.current?.show();
            buttonRef.current?.disable();
        } catch (error) {
            handleErrorResponse(error, message => toast.error(message));
        }
    };

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & FormFields
    > = async event => {
        event.preventDefault();

        try {
            const { code } = event.currentTarget;
            await changeEmail({
                code: Number(code.value)
            }).unwrap();
            toast.notify("Email был успешно изменён");
            navigate("/main/security");
        } catch (error) {
            handleErrorResponse(error, message => {
                toast.error(message);
            });
        }
    };

    // const onFocusHandler: React.FocusEventHandler<HTMLInputElement> = () => {
    //     setErrorState(state => ({ ...state, isError: false, message: "" }));
    // };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="relative grid gap-y-4"
        >
            <PreviousRouteLink />
            <h3 className="text-center">Привязать Email</h3>
            <Label>
                <span>На ваш Email отправлен код</span>
                <Input
                    readOnly
                    value={location?.state?.email}
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
                    required
                    name="code"
                    className="border-[#414148]"
                />
                {/* {errorState.isError ? (
                    <ErrorMessage
                        id={codeErrorId}
                        htmlFor={codeId}
                        message={errorState.message}
                    />
                ) : null} */}
                <ResendCodeButton
                    disabled={isCodeSending}
                    onClick={onClickHandler}
                    ref={buttonRef}
                />
            </div>
            <button
                disabled={isEmailConfirming}
                className="mt-2 border border-gray-50 bg-[#2c2d30] py-1.5"
            >
                {isEmailConfirming ? (
                    <ImSpinner9 className="mx-auto animate-spin text-sm" />
                ) : (
                    "Сохранить"
                )}
            </button>
        </form>
    );
};
