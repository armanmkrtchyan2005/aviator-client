import { useState } from "react";

import {
    useGetUserReferralByDaysQuery,
    useGetUserBalanceQuery,
    referralEntitySelector,
    referralEntityAdapter
    // fetchReferralByDays
} from "@/store";

import { Table, TableHeaderCell, Row, Cell } from "@/components/ui/table";
import { InfiniteScroll } from "@/components/infinite-scroll";

import { formatDate, formatCurrency } from "@/utils/helpers";

export const DailyStatisticsTable = () => {
    const [open, setOpen] = useState(false);
    const [queryParams, setQueryParams] = useState({ skip: 0, limit: 6 });

    const { data: balance } = useGetUserBalanceQuery();
    // const {
    //     data: referrals,
    //     hasNextPage,
    //     isSuccess,
    //     isLoading,
    //     isError,
    //     error
    // } = useGetUserReferralByDaysQuery(
    //     {
    //         skip: queryParams.skip,
    //         limit: queryParams.limit
    //     },
    //     {
    //         selectFromResult: ({ data, ...otherParams }) => ({
    //             data: data?.data,
    //             hasNextPage: data?.hasNextPage,
    //             ...otherParams
    //         })
    //         // refetchOnMountOrArgChange: true
    //     }
    // );

    const {
        data: referrals,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserReferralByDaysQuery(
        {
            skip: queryParams.skip,
            limit: queryParams.limit
        },
        {
            selectFromResult: ({ data, ...otherParams }) => ({
                data: referralEntitySelector.selectAll(
                    data ?? referralEntityAdapter.getInitialState()
                ),
                ...otherParams
            })
        }
    );
    const renderData = open
        ? referrals
        : referrals?.slice(0, queryParams.limit);

    return (
        <>
            <InfiniteScroll
                skip={queryParams.skip === referrals.length || !open}
                callback={() => {
                    // if (!hasNextPage || !open) return;

                    setQueryParams(queryParams => ({
                        ...queryParams,
                        skip: referrals?.length ?? 0
                    }));
                }}
                className="scrollbar max-h-[50dvh]"
            >
                {isError && <pre>{error?.data?.message}</pre>}

                {!isError ? (
                    <Table
                        className="px-1.5 text-center"
                        headers={["Дата", "Заработано"]}
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
                        renderData={descendants => (
                            <>
                                {descendants.map(descendant => (
                                    <Row key={descendant?._id}>
                                        <Cell className="px-2 py-1 text-center leading-none text-white">
                                            <time dateTime={descendant?.date}>
                                                {formatDate(descendant?.date)}
                                            </time>
                                        </Cell>

                                        <Cell>
                                            {formatCurrency(
                                                descendant?.totalEarned
                                            )}{" "}
                                            {balance?.currency}
                                        </Cell>
                                    </Row>
                                ))}
                            </>
                        )}
                    />
                ) : null}
                {isSuccess && (!referrals || referrals.length === 0) ? (
                    <p className="py-2 text-center font-semibold">Пусто</p>
                ) : null}
            </InfiniteScroll>

            <button
                disabled={
                    isLoading ||
                    (isSuccess && (!referrals || referrals.length === 0))
                }
                onClick={() => setOpen(open => !open)}
                className="w-full rounded-t-none bg-[#252528] py-2 font-bold focus-visible:outline-none focus-visible:ring-0"
            >
                {open ? "Скрыть" : "Показать ещё"}
            </button>
        </>
    );
};
