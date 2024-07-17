import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface SignOutAlertDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SignOutAlertDialog: React.FC<SignOutAlertDialogProps> = ({
    open,
    setOpen
}) => {
    const dispatch = useAppDispatch();

    const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        dispatch(logout());
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={setOpen}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Вы действительно хотите выйти?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Нет</AlertDialogCancel>
                    <AlertDialogAction onClick={onClickHandler}>
                        Да
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
