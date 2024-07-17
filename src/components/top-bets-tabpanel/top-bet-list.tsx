import { useLayoutEffect, useRef } from "react";
import { VirtuosoGrid } from "react-virtuoso";

import { TopBetItem } from "./top-bet-list-item";
import { VirtualList } from "./virtual-list";
import { VirtualListItem } from "./virtual-list-item";
import { Bet, Currency } from "@/store/api/types";

interface TopBetsListProps {
    bets: Bet[];
    currency: Currency | undefined;
}

export const TopBetsList: React.FC<TopBetsListProps> = ({ bets, currency }) => {
    const divRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        divRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, []);

    return (
        <div ref={divRef}>
            <VirtuosoGrid
                data={bets}
                components={{ List: VirtualList, Item: VirtualListItem }}
                itemContent={(_, bet) => (
                    <TopBetItem
                        key={bet?._id}
                        img={bet?.profileImage}
                        login={bet?.playerLogin}
                        bet={bet?.bet?.[currency || "USD"]}
                        win={bet?.win?.[currency || "USD"]}
                        currency={currency || "USD"}
                        rate={bet?.coeff}
                        winRate={bet?.game_coeff}
                        dateTime={bet?.time}
                    />
                )}
                className={`scrollbar ${bets?.length <= 2 ? "!h-32" : "!h-64"}`}
            />
        </div>
    );
};
