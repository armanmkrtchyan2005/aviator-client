import { Currency } from "@/store";
import { Table, Row, Cell } from "@/components/ui/table";

interface TotalRoundDetailsTable {
    betsAmount: number | undefined;
    totalBets: number | undefined;
    totalWinnings: number | undefined;
    currency: Currency | undefined;
}

export const TotalRoundDetailsTable: React.FC<TotalRoundDetailsTable> = ({
    betsAmount,
    totalBets,
    totalWinnings,
    currency
}) => {
    return (
        <Table
            className="table-fixed px-2.5"
            headers={["Кол-во ставок", "Сумма ставок", "Сумма выигрыша"]}
            data={[
                [
                    betsAmount,
                    `${totalBets?.toFixed(2) || "0.00"} ${currency || "USD"}`,
                    `${totalWinnings?.toFixed(2) || "0.00"} ${
                        currency || "USD"
                    }`
                ]
            ]}
            renderData={data => (
                <>
                    {data.map((row, i) => (
                        <Row key={i}>
                            {row.map((cell, j) => (
                                <Cell key={j}>{cell}</Cell>
                            ))}
                        </Row>
                    ))}
                </>
            )}
        />
    );
};
