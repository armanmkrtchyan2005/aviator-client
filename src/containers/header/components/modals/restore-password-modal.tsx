import { Link, useNavigate } from "react-router-dom";

import { useGetServiceLinkQuery } from "@/store/api/authApi";

import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";

import { IoMdArrowRoundBack } from "react-icons/io";
import { Button } from "@/components/ui/button";

// export const RestorePasswordModal = () => {
//     const navigate = useNavigate();

//     const { data } = useGetSupportServiceLinkQuery();

//     return (
//         <>
//             <DialogHeader>
//                 <DialogTitle>
//                     <Button
//                         // to=""
//                         onClick={() => navigate(-1)}
//                         className="absolute left-4 top-4 p-0 text-2xl text-white-50 transition-colors mh:hover:text-slate-300"
//                     >
//                         <IoMdArrowRoundBack />
//                     </Button>
//                     Восстановление
//                 </DialogTitle>
//                 <DialogDescription>
//                     Добро пожаловать в игру Aviator
//                 </DialogDescription>
//             </DialogHeader>

//             <DialogFooter className="grid grid-cols-2 gap-x-5">
//                 <p className="text-center text-sm">
//                     <span className="text-xs">Ещё нет аккаунта?</span>
//                     <br />
//                     <Link
//                         to="/main/sign-up"
//                         className="text-xs text-blue-500"
//                     >
//                         Зарегистрироваться
//                     </Link>
//                 </p>
//                 <p className="text-center text-sm">
//                     <span className="text-xs">Не привязана почта?</span>
//                     <br />
//                     <a
//                         href={data?.link}
//                         target="_blank"
//                         className="text-xs text-blue-500"
//                     >
//                         Восстановить без почты
//                     </a>
//                 </p>
//             </DialogFooter>
//         </>
//     );
// };

export const RestorePasswordDialogHeader = () => {
    const navigate = useNavigate();

    return (
        <DialogHeader>
            <DialogTitle>
                <Button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 top-4 p-0 text-2xl text-white-50 transition-colors mh:hover:text-slate-300"
                >
                    <IoMdArrowRoundBack />
                </Button>
                Восстановление
            </DialogTitle>
            <DialogDescription>
                Добро пожаловать в игру Aviator
            </DialogDescription>
        </DialogHeader>
    );
};

export const RestorePasswordDialogFooter = () => {
    const { data: links } = useGetServiceLinkQuery();

    return (
        <DialogFooter className="grid grid-cols-2 gap-x-5">
            <p className="text-center text-sm">
                <span className="text-xs">Ещё нет аккаунта?</span>
                <br />
                <Link
                    to="/main/sign-up"
                    className="text-xs text-blue-500"
                >
                    Зарегистрироваться
                </Link>
            </p>
            <p className="text-center text-sm">
                <span className="text-xs">Не привязана почта?</span>
                <br />
                <a
                    href={links?.support}
                    target="_blank"
                    className="text-xs text-blue-500"
                >
                    Восстановить без почты
                </a>
            </p>
        </DialogFooter>
    );
};
