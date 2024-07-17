import { Suspense } from "react";
import { Link } from "react-router-dom";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export const SignUpButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Link
                    to="/main/sign-up"
                    className="w-7/12 rounded-lg bg-[linear-gradient(70deg,#31bc69_-8%,#089e4e_96%)] px-4 py-1.5 font-bold transition-all duration-300 mh:hover:opacity-80"
                >
                    Регистрация
                </Link>
            </DialogTrigger>

            <Suspense>
                <DialogContent className="w-80 bg-black-50" />
            </Suspense>
        </Dialog>
    );
};
