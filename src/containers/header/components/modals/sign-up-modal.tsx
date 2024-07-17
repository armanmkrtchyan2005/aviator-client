import {
    // DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { SignUpForm } from "../form/sign-up-form/sign-up-form";

export const SignUpModal = () => {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Регистрация</DialogTitle>
            </DialogHeader>
            <SignUpForm />
        </>
    );
};
