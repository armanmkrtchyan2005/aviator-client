import { Cell, Table } from "@/components/ui/table";

interface SkeletonProps {
    currency: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ currency }) => {
    return (
        <>
            <Table
                className="table-fixed px-2.5"
                headers={["Кол-во ставок", "Сумма ставок", "Сумма выигрыша"]}
                data={[]}
                renderData={() => (
                    <tr>
                        <Cell className="h-7 rounded-l-lg">
                            <div className="mx-auto h-3 w-10 animate-pulse rounded-full bg-slate-400"></div>
                        </Cell>
                        <Cell className="h-7 ">
                            <div className="mx-auto h-3 w-10 animate-pulse rounded-full bg-slate-400"></div>
                        </Cell>
                        <Cell className="h-7 rounded-r-lg">
                            <div className="mx-auto h-3 w-10 animate-pulse rounded-full bg-slate-400"></div>
                        </Cell>
                    </tr>
                )}
            />
            <Table
                className="table-fixed px-2.5"
                data={[]}
                headers={[
                    "Игрок",
                    `Ставка, ${currency}`,
                    "Коэф.",
                    `Выигрыш, ${currency}`
                ]}
                renderData={() => (
                    <>
                        {Array(6)
                            .fill(0)
                            .map((_, i) => (
                                <tr
                                    key={i}
                                    className="h-7"
                                >
                                    <Cell className="flex items-center gap-x-2 rounded-l-lg px-2 py-1.5">
                                        <div className="size-[30px] shrink-0 animate-pulse rounded-full bg-slate-400"></div>
                                        <div className="h-3 w-10 animate-pulse rounded-full bg-slate-400"></div>
                                    </Cell>
                                    <Cell>
                                        <div className="mx-auto h-3 w-10 animate-pulse rounded-full bg-slate-400"></div>
                                    </Cell>
                                    <Cell>
                                        <div className="mx-auto h-3 w-10 animate-pulse rounded-full bg-slate-400"></div>
                                    </Cell>
                                    <Cell className="rounded-r-lg">
                                        <div className="mx-auto h-3 w-10 animate-pulse rounded-full bg-slate-400"></div>
                                    </Cell>
                                </tr>
                            ))}
                    </>
                )}
            />
        </>
    );
};
