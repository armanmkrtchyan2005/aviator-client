// import { useRef } from "react";
import { Outlet } from "react-router-dom";

// import { Header } from "./header/header";
import { Toaster } from "@/components/ui/toaster";

// import { Dialog, DialogElement } from "@/components/ui/dialog-text";

export const Layout = () => {
    // const dialogRef = useRef<DialogElement>(null);

    return (
        <>
            {/* <Header /> */}
            <main className="content-wrapper flex flex-auto flex-col">
                <Outlet />
            </main>
            <Toaster />
            {/* <Dialog ref={dialogRef} /> */}
            {/* <button
                onClick={() => {
                    const isOpen = dialogRef.current?.getState();
                    if (isOpen) {
                        console.log("Open modal dialog");

                        dialogRef.current?.closeModal();
                    } else {
                        console.log("Close modal dialog");

                        dialogRef.current?.openModal();
                    }
                }}
            >
                Open dialog
            </button> */}
        </>
    );
};
