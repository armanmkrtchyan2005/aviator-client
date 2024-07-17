import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { DailyStatisticsTable } from "@/components/tables/";

interface DailyStatisticsDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DailyStatisticsDialog: React.FC<DailyStatisticsDialogProps> = ({
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
                onInteractOutside={event => event.preventDefault()}
                className="p-0"
            >
                <DialogHeader>
                    <DialogTitle className="rounded-md bg-[#2c2d30] px-4 py-2 text-lg font-bold text-gray-300">
                        Подробный список по дням
                    </DialogTitle>
                </DialogHeader>
                <DailyStatisticsTable />
            </DialogContent>
        </Dialog>
    );
};
