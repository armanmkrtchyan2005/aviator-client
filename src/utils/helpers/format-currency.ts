export const formatCurrency = (
    currency: number,
    minFractionDigits: number = 2
) => {
    const formatterUSD = new Intl.NumberFormat("ru-RU", {
        style: "decimal",
        minimumFractionDigits: minFractionDigits,
        maximumFractionDigits: 2
    });

    return formatterUSD.format(currency).replace(",", ".");
};
