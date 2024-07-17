import { Row, Cell, TableHeaderCell } from "@/components/ui/table";
import { Currency, Player } from "@/store/api/types";
import { Badge } from "@/components/ui/badge";

import Avatar from "@/assets/avatar-360w.webp";
import { TableVirtuoso } from "react-virtuoso";

interface PlayersListProps {
    players: Player[];
    currency: Currency;
}

export const PlayersList: React.FC<PlayersListProps> = ({
    players,
    currency
}) => {
    const onErrorHandler: React.ReactEventHandler<HTMLImageElement> = event => {
        event.currentTarget.src = Avatar;
    };

    return (
        // <Table
        //     headers={["Игрок", "Ставка", "Коэф.", "Выигрыш"]}
        //     data={players}
        //     renderData={data => (
        //         <>
        //             {data.map((player, i) => (
        //                 <Row
        //                     key={i}
        //                     className={`[&>td:nth-child(even)]:font-bold [&>td:nth-child(even)]:text-white ${
        //                         isNaN(player?.win?.[currency] as number)
        //                             ? ""
        //                             : "[&>td:first-child]:border-l-2 [&>td:last-child]:border-r-2 [&>td]:border-y-2 [&>td]:border-[#427f00] [&>td]:bg-[#123405]"
        //                     }`}
        //                 >
        //                     <Cell className="flex items-center gap-x-2">
        //                         <img
        //                             src={player.profileImage || Avatar}
        //                             onError={onErrorHandler}
        //                             alt="User avatar image"
        //                             height="30"
        //                             width="30"
        //                             loading="lazy"
        //                             className="rounded-full"
        //                         />
        //                         <span className="text-[#9ea0a3]">
        //                             {`${player?.playerLogin?.at(
        //                                 0
        //                             )}***${player?.playerLogin?.at(-1)}`}
        //                         </span>
        //                     </Cell>
        //                     <Cell>{`${player?.bet?.[currency]?.toFixed(
        //                         2
        //                     )} ${currency}`}</Cell>
        //                     <Cell>
        //                         <Badge value={player?.coeff} />
        //                     </Cell>
        //                     <Cell>
        //                         {!isNaN(player?.win?.[currency] as number)
        //                             ? `${player?.win?.[currency]?.toFixed(
        //                                   2
        //                               )} ${currency}`
        //                             : "-"}
        //                     </Cell>
        //                 </Row>
        //             ))}
        //         </>
        //     )}
        // />
        <TableVirtuoso
            data={players}
            style={{ height: `${Math.min(players.length * 46, 384) + 24}px` }}
            className="scrollbar"
            itemContent={(_, player) => (
                <>
                    <Cell
                        className={`flex items-center gap-x-2 border-y-2 border-l-2 px-2 py-1 text-left text-[10px] leading-none ${
                            player?.win
                                ? isNaN(player?.win?.["USD"])
                                    ? "border-transparent"
                                    : "border-[#427f00] bg-[#123405]"
                                : "border-transparent"
                        }`}
                    >
                        <img
                            src={player.profileImage || Avatar}
                            onError={onErrorHandler}
                            alt="Фото профиля пользователя"
                            height="30"
                            width="30"
                            loading="lazy"
                            className="rounded-full"
                        />
                        <span className="text-sm font-medium text-[#9ea0a3]">
                            {`${player?.playerLogin?.at(
                                0
                            )}***${player?.playerLogin?.at(-1)}`}
                        </span>
                    </Cell>
                    <Cell
                        className={`border-y-2 font-bold text-white ${
                            player?.win
                                ? isNaN(player?.win?.["USD"])
                                    ? "border-transparent"
                                    : "border-[#427f00] bg-[#123405]"
                                : "border-transparent"
                        }`}
                    >
                        {player?.bet?.[currency]?.toFixed(2)}
                    </Cell>
                    <Cell
                        className={`border-y-2
                ${
                    player?.win
                        ? isNaN(player?.win?.["USD"])
                            ? "border-transparent"
                            : "border-[#427f00] bg-[#123405]"
                        : "border-transparent"
                }`}
                    >
                        <Badge value={player?.coeff} />
                    </Cell>
                    <Cell
                        className={`border-y-2 border-r-2 font-bold text-white ${
                            player?.win
                                ? isNaN(player?.win?.["USD"])
                                    ? "border-transparent"
                                    : "border-[#427f00] bg-[#123405]"
                                : "border-transparent"
                        }`}
                    >
                        {player?.win
                            ? !isNaN(player?.win?.[currency])
                                ? player?.win?.[currency]?.toFixed(2)
                                : "-"
                            : "-"}
                    </Cell>
                </>
            )}
            components={{
                Table: props => {
                    return (
                        <table
                            {...props}
                            className="w-full table-fixed !border-separate !border-spacing-x-0 !border-spacing-y-1 pl-2.5 pr-1.5 text-base leading-none mh:pr-0"
                        />
                    );
                },
                TableRow: props => {
                    return (
                        <Row
                            {...props}
                            // className="mx-1.5"
                        />
                    );
                }
            }}
            fixedHeaderContent={() => (
                <tr>
                    <TableHeaderCell className="bg-black-50">
                        Игрок
                    </TableHeaderCell>
                    <TableHeaderCell className="bg-black-50">
                        {`Ставка, ${currency}`}
                    </TableHeaderCell>
                    <TableHeaderCell className="bg-black-50">
                        Коэф.
                    </TableHeaderCell>
                    <TableHeaderCell className="bg-black-50">
                        {`Выигрыш, ${currency}`}
                    </TableHeaderCell>
                </tr>
            )}
        />
    );
};
