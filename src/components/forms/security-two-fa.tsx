import { useRef, useId } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import {
    useTurnOff2FAMutation,
    useTurnOn2FAMutation,
    useSend2FAConfirmationCodeMutation
} from "@/api/securityApi";
import { handleErrorResponse } from "@/store/services";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/toasts/toast";
import {
    ResendCodeButton,
    ResendCodeElement
} from "@/components/ui/resend-code-button";
import { PreviousRouteLink } from "@/components/previous-route-link";
import { EmailTooltip } from "@/components/tooltips/email-tooltip";

export const SecurityTwoFAForm = () => {
    const buttonRef = useRef<ResendCodeElement>(null);
    const codeId = useId();

    const location = useLocation();
    const navigate = useNavigate();

    const [turnOn2FA, { isLoading: is2FATurningOn }] = useTurnOn2FAMutation();
    const [turnOff2FA, { isLoading: is2FATurningOff }] =
        useTurnOff2FAMutation();
    const [verifyUser, { isLoading: isUserVerifying }] =
        useSend2FAConfirmationCodeMutation();

    const onSubmitHandler: React.FormEventHandler<
        HTMLFormElement & { code: HTMLInputElement }
    > = async event => {
        event.preventDefault();

        const { code } = event.currentTarget;

        try {
            const { message } = await verifyUser({
                code: Number(code.value)
            }).unwrap();
            toast.notify(message);
            navigate("/main/security");
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
            if (location?.state?.twoFA) {
                await turnOff2FA().unwrap();
            } else {
                await turnOn2FA().unwrap();
            }
            buttonRef.current?.show();
            buttonRef.current?.disable();
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

            <h3 className="text-center">Двойная проверка</h3>

            <Label>
                <span>На ваш Email отправлен код</span>
                <Input
                    defaultValue={location?.state?.email}
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
                    disabled={is2FATurningOn || is2FATurningOff}
                    onClick={onClickHandler}
                    ref={buttonRef}
                />
            </div>
            <button
                disabled={isUserVerifying}
                className="mt-2 border border-gray-50 bg-[#2c2d30] py-2 disabled:cursor-wait disabled:opacity-80"
            >
                Подтвердить
            </button>
        </form>
    );
};
