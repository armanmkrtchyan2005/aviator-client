import { useId, useRef } from "react";

import { useConfirmNewUserEmailMutation } from "@/store/api/authApi";

import { EmailTooltip } from "@/components/tooltips/email-tooltip";
import { Input } from "@/components/ui/input";
import {
    ResendCodeButton,
    ResendCodeElement
} from "@/components/ui/resend-code-button";

export const VerifyEmailCode = () => {
    const codeId = useId();
    const resendCodeButtonRef = useRef<ResendCodeElement>(null);

    return (
        <form className="space-y-2">
            <p className="flex items-center justify-between">
                <label htmlFor={codeId}>Код из Email</label>
                <EmailTooltip />
            </p>
            <Input
                id={codeId}
                inputMode="numeric"
                required
                name="code"
            />
            <ResendCodeButton
                type="submit"
                // form={loginFormId}
                disabled={isVerifying}
                ref={resendCodeButtonRef}
            />
        </form>
    );
};
