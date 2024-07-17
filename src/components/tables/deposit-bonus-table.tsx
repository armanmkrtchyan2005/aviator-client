import { Table, Row, Cell } from "@/components/ui/table";

import { formatCurrency, formatDate, formatTime } from "@/utils/helpers";

import { useGetUserBalanceQuery, useGetUserPromoQuery } from "@/store";

export const DepositBonusTable = () => {
    const { data: balance } = useGetUserBalanceQuery();
    const { data: promo } = useGetUserPromoQuery({ type: "add_balance" });

    return (
        <div className="scrollbar max-h-[25dvh]">
            <Table
                className="table-fixed px-1.5 text-center"
                headers={[
                    `Лимит бонуса, ${balance?.currency}`,
                    "Скидка, %",
                    "Действует до"
                ]}
                data={promo || []}
                renderData={data => (
                    <>
                        {data.map(code => (
                            <Row key={code?._id}>
                                <Cell className="text-white">
                                    {formatCurrency(code?.limit ?? 0)}
                                </Cell>
                                <Cell className="text-white">
                                    {code?.amount}
                                </Cell>
                                <Cell className="px-2 py-1 text-[10px] leading-none">
                                    <time
                                        dateTime={formatTime(code?.will_finish)}
                                    >
                                        {formatTime(code?.will_finish)}
                                    </time>{" "}
                                    <time
                                        dateTime={formatDate(code?.will_finish)}
                                    >
                                        {formatDate(code?.will_finish)}
                                    </time>
                                </Cell>
                            </Row>
                        ))}
                    </>
                )}
            />
            {!promo || promo.length === 0 ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </div>
    );
};
