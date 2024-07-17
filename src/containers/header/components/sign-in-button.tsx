import { useState, Suspense } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const SignInButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                if (open) sessionStorage.removeItem("email");
                setOpen(open => !open);
            }}
        >
            <DialogTrigger asChild>
                <Link
                    to="/main/sign-in"
                    style={{ textShadow: "0 4px 8px rgba(0, 0, 0, .1)" }}
                    className="w-5/12 rounded-lg bg-[linear-gradient(90.77deg,#0095ff_.96%,#0855c4_99.87%)] px-4 py-1.5 font-bold shadow-[0_6px_18px_#1178df4d] transition-all duration-300 mh:hover:opacity-80"
                >
                    Вход
                </Link>
            </DialogTrigger>
            <Suspense>
                <DialogContent className="w-80" />
            </Suspense>
        </Dialog>
    );
};
