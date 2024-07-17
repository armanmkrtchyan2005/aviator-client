import { useGetUserBalanceQuery } from "@/store/api/userApi";
import {
    topBetsEntityAdapter,
    topBetsEntitySelector,
    useGetTopBetsQuery
} from "@/store/api/betApi";

import { TopBetSkeleton } from "./top-bet-skeleton";
import { TopBetsList } from "./top-bet-list";

interface TopBetsTabProps {
    dateSort: "day" | "month" | "year";
}

export const TopBetsTab: React.FC<TopBetsTabProps> = ({ dateSort }) => {
    const { data: balance } = useGetUserBalanceQuery();

    const {
        data: bets,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTopBetsQuery(
        {
            dateSort: dateSort
        },
        {
            selectFromResult: ({ data, ...otherParams }) => ({
                data: topBetsEntitySelector.selectAll(
                    data ?? topBetsEntityAdapter.getInitialState()
                ),
                ...otherParams
            })
        }
    );

    return (
        <>
            {isLoading ? (
                <div className="scrollbar max-h-64">
                    <ul className="grid grid-cols-1 grid-rows-1 gap-2 pl-1.5 pr-1.5 sm:grid-cols-2 mh:pr-0">
                        {Array(6)
                            .fill(0)
                            .map((_, index) => (
                                <TopBetSkeleton key={index} />
                            ))}
                    </ul>
                </div>
            ) : null}

            {isSuccess && bets.length !== 0 ? (
                <TopBetsList
                    bets={bets}
                    currency={balance?.currency}
                />
            ) : null}

            {isError && <pre>{error?.data?.message}</pre>}

            {isSuccess && (!bets || bets.length === 0) ? (
                <p className="py-2 text-center text-base font-semibold">
                    Пусто
                </p>
            ) : null}
        </>
    );
};
