import {
    Toast,
    // ToastClose,
    ToastAction,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, ...props }) {
                return (
                    <Toast
                        key={id}
                        {...props}
                    >
                        <div className="grid gap-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description ? (
                                <ToastDescription>
                                    {description}
                                </ToastDescription>
                            ) : (
                                <ToastDescription>
                                    {new Date().toLocaleDateString([], {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                    ,
                                    {new Date().toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </ToastDescription>
                            )}
                        </div>
                        <ToastAction altText="Скрыть всплывающее окно">
                            Скрыть
                        </ToastAction>
                        {/* <ToastClosse /> */}
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
