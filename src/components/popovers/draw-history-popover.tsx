import {
    // useAppDispatch,
    // userApi,
    useGetUserBalanceQuery
} from "@/store/api/userApi";
import { handleErrorResponse } from "@/store/services";

import {
    useFetchAllWithdrawsQuery,
    useCancelWithdrawByIdMutation,
    Withdraw
} from "@/api/withdraw";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardCopy } from "@/components/ui/clipboard-copy";
import { toast } from "@/components/toasts/toast";

import { cn } from "@/utils";
import { formatDate, formatTime } from "@/utils/helpers";

interface DrawHistoryPopoverProps extends React.HTMLAttributes<HTMLElement> {}

export const DrawHistoryPopover: React.FC<DrawHistoryPopoverProps> = ({
    className,
    ...props
}) => {
    const { data: withdrawals, isSuccess } =
        useFetchAllWithdrawsQuery(undefined);

    return (
        <section
            {...props}
            className={cn(
                "rounded-lg border border-green-50 bg-[#36ca12] px-0 py-4 shadow-md",
                className
            )}
        >
            <ScrollArea
                className={
                    withdrawals && withdrawals?.length >= 2 ? "h-64" : "h-auto"
                }
            >
                {isSuccess ? (
                    withdrawals && withdrawals.length !== 0 ? (
                        withdrawals.map((withdrawal, index) => (
                            <div key={withdrawal?._id}>
                                <PaymentDetails withdrawal={withdrawal} />
                                {index !== withdrawals.length - 1 ? (
                                    <hr
                                        key={index}
                                        className="h-2"
                                    />
                                ) : null}
                            </div>
                        ))
                    ) : (
                        <PaymentDetails />
                    )
                ) : null}
            </ScrollArea>
        </section>
    );
};

interface DrawDetailsProps {
    withdrawal?: Withdraw;
}

const PaymentDetails: React.FC<DrawDetailsProps> = ({ withdrawal }) => {
    const { data: balance } = useGetUserBalanceQuery();
    const [cancelDraw] = useCancelWithdrawByIdMutation();

    const abortDraw = async (id: string | undefined) => {
        if (!id) return;

        try {
            const response = await cancelDraw({ id }).unwrap();
            toast.notify(response?.message);
        } catch (error) {
            handleErrorResponse(error, message => toast.error(message));
        }
    };

    return (
        <table className="w-full bg-slate-100 text-left text-sm ">
            <tbody>
                <tr>
                    <td className="w-5/12 px-1.5 py-0.5">Дата создания</td>
                    <td className="w-6/12 py-0.5 pl-1.5 pr-2.5">
                        {withdrawal?.createdAt
                            ? `${formatDate(
                                  withdrawal?.createdAt
                              )} ${formatTime(withdrawal?.createdAt)}`
                            : null}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Дата потверждения</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {withdrawal?.completedDate
                            ? `${formatDate(
                                  withdrawal?.completedDate
                              )} ${formatTime(withdrawal?.completedDate)}`
                            : ""}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Метод</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {withdrawal?.requisite?.name}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Сумма</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {withdrawal?.amount?.[balance?.currency || "USD"]
                            ? `${withdrawal?.amount?.[
                                  balance?.currency || "USD"
                              ].toFixed(2)} ${balance?.currency}`
                            : null}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Реквизит</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        <ClipboardCopy
                            textToCopy={withdrawal?.userRequisite}
                            toastMessage="Реквизиты скопированы в буфер обмена"
                            className="text-nowrap transition-colors mh:hover:text-slate-600"
                        >
                            {withdrawal?.userRequisite}
                        </ClipboardCopy>
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Статус</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {withdrawal?.status}
                    </td>
                </tr>
                {withdrawal?.statusMessage ? (
                    <tr>
                        <td className="px-1.5 py-0.5">Причина отмены</td>
                        <td className="py-0.5 pl-1.5 pr-2.5">
                            {withdrawal?.statusMessage}
                        </td>
                    </tr>
                ) : null}
                <tr>
                    <td className="px-1.5 py-0.5">
                        <p className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={withdrawal?.uid}
                                className="inline-block max-w-[14ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {withdrawal?.uid || ""}
                            </ClipboardCopy>
                        </p>
                    </td>
                    {withdrawal?.status === "Ожидает оплаты" ? (
                        <td className="w-6/12 py-0.5 pl-1.5 pr-2.5">
                            <button
                                onClick={() => {
                                    abortDraw(withdrawal?._id);
                                }}
                                className="text-right text-blue-500"
                            >
                                Отменить
                            </button>
                        </td>
                    ) : null}
                </tr>
            </tbody>
        </table>
    );
};
