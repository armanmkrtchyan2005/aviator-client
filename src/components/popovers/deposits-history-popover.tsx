import { Link } from "react-router-dom";

import { useGetUserBalanceQuery } from "@/store/api/userApi";
import {
    useFetchAllReplenishmentsQuery,
    Replenishment
} from "@/api/replenishment";

import { ScrollArea } from "@/components/ui/scroll-area";

import { formatDate, formatTime } from "@/utils/helpers";
import { usePopoverContext } from "@/components/ui/popover/use-popover-context";
import { ClipboardCopy } from "@/components/ui/clipboard-copy";

export const DepositsHistoryPopover = () => {
    const { data: replenishments, isSuccess } =
        useFetchAllReplenishmentsQuery();

    return (
        <section className="w-72 rounded-lg border border-green-50 bg-[#36ca12] px-0 py-4 shadow-md">
            <ScrollArea
                className={
                    replenishments && replenishments?.length >= 2
                        ? "h-64"
                        : "h-auto"
                }
            >
                {isSuccess ? (
                    replenishments && replenishments.length !== 0 ? (
                        replenishments.map((replenishment, index) => (
                            <div key={replenishment?._id}>
                                <PaymentDetails replenishment={replenishment} />
                                {index !== replenishments.length - 1 ? (
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

interface PaymentDetailsProps {
    replenishment?: Replenishment;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ replenishment }) => {
    const { dialogRef } = usePopoverContext();
    const { data: balance } = useGetUserBalanceQuery();

    return (
        <table className="w-full bg-slate-100 text-left text-sm">
            <tbody>
                <tr>
                    <td className="w-5/12 px-1.5 py-0.5">Дата создания</td>
                    <td className="w-6/12 py-0.5 pl-1.5 pr-2.5">
                        {replenishment?.createdAt
                            ? `${formatDate(
                                  replenishment?.createdAt
                              )} ${formatTime(replenishment?.createdAt)}`
                            : null}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Дата потверждения</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {replenishment?.completedDate
                            ? `${formatDate(
                                  replenishment?.completedDate
                              )} ${formatTime(replenishment?.completedDate)}`
                            : null}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Метод</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {replenishment?.method?.name}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Сумма</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {replenishment?.amount?.[balance?.currency || "USD"]
                            ? `${replenishment?.amount?.[
                                  balance?.currency || "USD"
                              ].toFixed(2)} ${balance?.currency}`
                            : null}
                    </td>
                </tr>
                <tr>
                    <td className="px-1.5 py-0.5">Статус</td>
                    <td className="py-0.5 pl-1.5 pr-2.5">
                        {replenishment?.status}
                    </td>
                </tr>

                {replenishment?.statusMessage ? (
                    <tr>
                        <td className="px-1.5 py-0.5">Причина отмены</td>
                        <td className="py-0.5 pl-1.5 pr-2.5">
                            {replenishment?.statusMessage}
                        </td>
                    </tr>
                ) : null}
                <tr>
                    <td className="px-1.5 py-0.5 align-middle">
                        <p className="justify-self-start text-nowrap text-sm leading-5 text-slate-400">
                            <span>ID</span>{" "}
                            <ClipboardCopy
                                textToCopy={String(replenishment?.uid)}
                                className="inline-block max-w-[14ch] overflow-hidden text-ellipsis whitespace-nowrap transition-colors mh:hover:text-slate-600"
                            >
                                {replenishment?.uid || ""}
                            </ClipboardCopy>
                        </p>
                    </td>
                    {replenishment?.status === "Ожидает оплаты" ||
                    replenishment?.status === "В обработке..." ? (
                        <td className="py-0.5 pl-1.5 pr-2.5">
                            {replenishment?.paymentUrl ? (
                                <a
                                    href={replenishment?.paymentUrl}
                                    target="_blank"
                                    className="text-right text-blue-500"
                                    onClick={() => dialogRef?.current?.close()}
                                >
                                    Открыть
                                </a>
                            ) : (
                                <Link
                                    to={`/payment/replenishment/${replenishment?._id}/requisite/${replenishment?.requisite?._id}`}
                                    onClick={() => dialogRef?.current?.close()}
                                    className="text-right text-blue-500"
                                >
                                    Открыть
                                </Link>
                            )}
                        </td>
                    ) : null}
                </tr>
            </tbody>
        </table>
    );
};
