import { useAppDispatch, useStateSelector } from "@/store/hooks";
import {
    userApi,
    useGetUserPromoQuery,
    useGetUserBalanceQuery
} from "@/store/api/userApi";
import { selectCurrentGameTab, activateBonus } from "@/store/slices/gameSlice";

import { Table, Row, Cell } from "@/components/ui/table";
import { toast } from "@/components/toasts/toast";

import { formatDate, formatTime } from "@/utils/helpers";

interface BonusTableProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BonusTable: React.FC<BonusTableProps> = ({ setOpen }) => {
    const { data: balance } = useGetUserBalanceQuery();
    const { data: promo } = useGetUserPromoQuery({ type: "promo" });
    const dispatch = useAppDispatch();
    const bonusTab = useStateSelector(state => selectCurrentGameTab(state, 1));

    const onClickHandler = (
        bonusId: string | undefined,
        bonusQuantity: number | undefined,
        bonusCoefficient: number | undefined
    ) => {
        if (
            bonusId === undefined ||
            bonusQuantity === undefined ||
            bonusCoefficient === undefined ||
            bonusTab.betState !== "init"
        )
            return;

        dispatch(
            activateBonus({
                bonusId,
                bonusQuantity,
                bonusCoefficient
            })
        );

        toast.notify("Промокод на одноразовую ставку успешно активирован");

        setOpen(false);
    };

    return (
        <div className="scrollbar max-h-[25dvh]">
            <Table
                className="px-1.5 text-center"
                headers={[
                    `Сумма бонуса, ${balance?.currency}`,
                    "Коэфф., при котором можно забрать выигрыш",
                    "Действует до"
                ]}
                data={promo || []}
                renderData={data => (
                    <>
                        {data.map(promo => (
                            <Row key={promo?._id}>
                                <Cell className="text-white">
                                    {promo?.amount?.toFixed(2)}
                                </Cell>
                                <Cell>
                                    <span className="rounded-full bg-black/80 px-3 py-0.5 text-xs font-bold text-white">
                                        {promo?.coef}x
                                    </span>
                                </Cell>
                                <Cell className="grid grid-cols-[1fr_auto] grid-rows-2 gap-x-2 px-2 py-1 text-left text-[10px] leading-none">
                                    <time
                                        dateTime={promo?.will_finish}
                                        className="block"
                                    >
                                        {formatTime(promo?.will_finish)}
                                    </time>
                                    <time
                                        dateTime={promo?.will_finish}
                                        className="block"
                                    >
                                        {formatDate(promo?.will_finish)}
                                    </time>
                                    <button
                                        onClick={() =>
                                            onClickHandler(
                                                promo?._id,
                                                promo?.amount,
                                                promo?.coef
                                            )
                                        }
                                        disabled={bonusTab.betState !== "init"}
                                        className="col-start-2 col-end-3 row-start-1 row-end-3 w-full rounded border border-green-50 bg-green-450 px-1.5 py-1 text-white shadow-[inset_0_1px_1px_#ffffff80] transition-all duration-150 active:translate-y-[1px] active:border-[#1c7430] disabled:pointer-events-none disabled:opacity-50 mh:hover:bg-green-350"
                                    >
                                        Активировать
                                    </button>
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
