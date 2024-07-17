import { useNavigate } from "react-router-dom";

import * as Dialog from "@radix-ui/react-dialog";
import { CreateReplenishmentForm } from "@/components/forms/create-replenishment-form";
import { X } from "lucide-react";

export const CreateReplenishmentDialog = () => {
    const navigate = useNavigate();

    return (
        <Dialog.Root
            modal={false}
            defaultOpen={true}
        >
            <Dialog.Portal>
                <Dialog.Content
                    onInteractOutside={event => {
                        if ((event.target as HTMLElement).closest("li.toast")) {
                            event.preventDefault();
                            return;
                        }
                        navigate("/payment/replenishment", { replace: true });
                    }}
                    onEscapeKeyDown={() => {
                        navigate("/payment/replenishment", { replace: true });
                    }}
                    className="fixed left-[50%] top-[50%] isolate z-30 grid w-80 max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2.5xl border border-slate-200 bg-slate-100 p-6 text-black-50 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
                >
                    <CreateReplenishmentForm />
                    <Dialog.Close
                        onClick={() =>
                            navigate("/payment/replenishment", {
                                replace: true
                            })
                        }
                        className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-white transition-opacity focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 mh:hover:opacity-100"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Закрыть</span>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
