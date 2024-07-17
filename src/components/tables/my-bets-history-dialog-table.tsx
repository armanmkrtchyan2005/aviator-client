import { useState } from "react";

import {
    useGetUserBetsQuery,
    // useGetTopBetsQuery,
    useGetUserBalanceQuery,
    userBetsEntitySelector,
    userBetsEntityAdapter
} from "@/store";

import { Table, TableHeaderCell, Row, Cell } from "@/components/ui/table";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Badge } from "@/components/ui/badge";

import { formatCurrency, formatDate, formatTime } from "@/utils/helpers";

export const MyBetsHistoryDialogTable = () => {
    const [open, setOpen] = useState(false);
    const [queryParams, setQueryParams] = useState({ skip: 0, limit: 6 });

    const { data: balance } = useGetUserBalanceQuery();
    const {
        data: bets,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserBetsQuery(
        {
            skip: queryParams.skip,
            limit: queryParams.limit
        },
        {
            selectFromResult: ({ data, ...otherParams }) => ({
                data: userBetsEntitySelector.selectAll(
                    data ?? userBetsEntityAdapter.getInitialState()
                ),
                ...otherParams
            })
        }
    );

    const renderData = open ? bets : bets?.slice(0, queryParams.limit);

    return (
        <>
            <InfiniteScroll
                skip={queryParams.skip === bets.length || !open}
                callback={() => {
                    // if (!hasNextPage || !open) return;

                    setQueryParams(queryParams => ({
                        ...queryParams,
                        skip: bets?.length ?? 0
                    }));
                }}
                className="scrollbar max-h-[50dvh]"
            >
                {isError && <pre>{error?.data?.message}</pre>}
                {!isError ? (
                    <Table
                        className="px-1.5 text-center"
                        headers={[
                            "Время",
                            `Ставка, ${balance?.currency || "USD"}`,
                            "Коэфф.",
                            `Выигрыш, ${balance?.currency || "USD"}`
                        ]}
                        data={renderData || []}
                        renderHeader={headers => (
                            <Row>
                                {headers.map(header => (
                                    <TableHeaderCell
                                        key={header}
                                        className="sticky -top-0.5 bg-black-50"
                                    >
                                        {header}
                                    </TableHeaderCell>
                                ))}
                            </Row>
                        )}
                        renderData={data => (
                            <>
                                {data.map(bet => (
                                    <Row
                                        key={bet?._id}
                                        className={`[&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white ${
                                            isNaN(bet?.win?.[balance?.currency])
                                                ? ""
                                                : "[&>td:first-child]:border-l-2 [&>td:last-child]:border-r-2 [&>td]:border-y-2 [&>td]:border-[#427f00] [&>td]:bg-[#123405]"
                                        }`}
                                    >
                                        <Cell className="px-2 py-1 text-left text-[10px] leading-none">
                                            <time
                                                dateTime={formatTime(bet?.time)}
                                                className="block"
                                            >
                                                {formatTime(bet?.time)}
                                            </time>
                                            <time
                                                dateTime={formatTime(bet?.time)}
                                                className="block"
                                            >
                                                {formatDate(bet?.time)}
                                            </time>
                                        </Cell>
                                        <Cell>
                                            {formatCurrency(
                                                bet?.bet?.[balance?.currency]
                                            )}
                                        </Cell>
                                        <Cell>
                                            <Badge value={bet?.coeff} />
                                        </Cell>
                                        <Cell>
                                            {!isNaN(
                                                bet?.win?.[balance?.currency]
                                            )
                                                ? formatCurrency(
                                                      bet?.win?.[
                                                          balance?.currency
                                                      ]
                                                  )
                                                : "-"}
                                        </Cell>
                                    </Row>
                                ))}
                            </>
                        )}
                    />
                ) : null}
                {isSuccess && (!bets || bets.length === 0) ? (
                    <p className="py-2 text-center font-semibold">Пусто</p>
                ) : null}
            </InfiniteScroll>

            {/* {bets && bets.length > queryParams?.limit ? ( */}
            <button
                disabled={
                    isLoading || (isSuccess && (!bets || bets.length === 0))
                }
                onClick={() => setOpen(open => !open)}
                className="w-full rounded-t-none bg-[#252528] py-2 font-bold focus-visible:outline-none focus-visible:ring-0"
            >
                {open ? "Скрыть" : "Показать ещё"}
            </button>
            {/* ) : null} */}
        </>
    );
};
