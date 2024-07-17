import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { MyBetsHistoryDialogTable } from "@/components/tables/";

interface MyBetsHistoryDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MyBetsHistoryDialog: React.FC<MyBetsHistoryDialogProps> = ({
    open,
    setOpen
}) => {
    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
            modal={false}
        >
            <DialogContent
                route={false}
                className="p-0"
            >
                <DialogHeader>
                    <DialogTitle className="rounded-md bg-[#2c2d30] px-4 py-2 text-lg font-bold text-gray-300">
                        История моих ставок
                    </DialogTitle>
                </DialogHeader>
                <MyBetsHistoryDialogTable />
            </DialogContent>
        </Dialog>
    );
};
