import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/helpers/format-currency";
import Avatar from "@/assets/avatar-360w.webp";

interface TopBetItemProps {
    img: string;
    login: string;
    bet: number;
    win: number;
    rate: number;
    winRate: number;
    currency: string;
    dateTime: string;
}

export const TopBetItem: React.FC<TopBetItemProps> = ({
    img,
    login,
    bet,
    win,
    rate,
    winRate,
    currency,
    dateTime
}) => {
    const onErrorHandler: React.ReactEventHandler<HTMLImageElement> = event => {
        event.currentTarget.src = Avatar;
    };

    return (
        <>
            <div className="space-y-2">
                <img
                    src={img || Avatar}
                    alt="Аватар профиля"
                    width="40"
                    height="40"
                    loading="lazy"
                    onError={onErrorHandler}
                    className="size-10 rounded-full"
                />
                <p className="text-sm font-semibold">{`${login?.at(
                    0
                )}***${login?.at(-1)}`}</p>
            </div>
            <table className="w-full table-fixed">
                <tbody className="leading-4">
                    <tr>
                        <td className="p-1 text-right ">Ставка {currency}:</td>
                        <td className="p-1 text-left text-sm font-bold text-white">
                            {formatCurrency(bet)}
                        </td>
                    </tr>
                    <tr>
                        <td className="p-1 text-right">Коэффициент:</td>
                        <td className="p-1 text-left font-bold">
                            <Badge value={rate} />
                        </td>
                    </tr>
                    <tr>
                        <td className="p-1 text-right">Выигрыш {currency}:</td>
                        <td className="p-1 text-left text-sm font-bold text-white">
                            {formatCurrency(win)}
                        </td>
                    </tr>
                </tbody>
            </table>
            <p className="col-span-2 w-full space-x-4 bg-black py-1.5 text-start text-sm">
                <time
                    className="ml-2"
                    dateTime={dateTime}
                >
                    {new Date(dateTime).toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    })}
                </time>
                <span>
                    Раунд: <b className="text-white">{winRate?.toFixed(2)}x</b>
                </span>
            </p>
        </>
    );
};
