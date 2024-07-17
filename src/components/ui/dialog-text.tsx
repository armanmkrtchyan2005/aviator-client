import { useRef, forwardRef, useImperativeHandle } from "react";

export interface DialogElement
    extends React.DialogHTMLAttributes<HTMLDialogElement> {
    openModal: () => void;
    closeModal: () => void;
    getState: () => boolean;
}

export const Dialog = forwardRef<DialogElement>(({ ...props }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(
        ref,
        () => ({
            openModal() {
                dialogRef.current?.showModal();
                dialogRef.current?.setAttribute("data-open", "true");
            },
            closeModal() {
                dialogRef.current?.setAttribute("data-open", "false");
            },
            getState() {
                return dialogRef.current?.getAttribute("data-open") === "true";
            }
        }),
        []
    );

    const closeModal: React.AnimationEventHandler<
        HTMLDialogElement
    > = event => {
        event.stopPropagation();

        const isOpen = event.currentTarget.getAttribute("data-open") === "true";

        console.log("Animations finished", isOpen);
        if (!isOpen) event.currentTarget.close();
    };

    return (
        <dialog
            {...props}
            ref={dialogRef}
            data-open={false}
            onAnimationEnd={closeModal}
            className="data-[open=true]:animate-accordion-down data-[open=false]:animate-out data-[open=false]:fade-out-0 data-[open=true]:fade-in-0"
        >
            <button
                onClick={() => {
                    dialogRef.current?.setAttribute("data-open", "false");
                    // dialogRef.current?.close();
                }}
            >
                Close
            </button>
            Dialog content
        </dialog>
    );
});
