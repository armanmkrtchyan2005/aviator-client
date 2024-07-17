import * as z from "zod";

export const validateBet = (bet: string | number, min: number, max: number) => {
    if (min >= max) return min;

    let result;

    try {
        result = z.coerce.number().gte(min).parse(bet);
    } catch (error) {
        return min;
    }

    try {
        result = z.coerce.number().lte(max).parse(bet);
    } catch (error) {
        return max;
    }

    return result;
};

export const decimal = (n: string | number) => {
    return z
        .string()
        .regex(/^(\d+(\.\d{0,2})?)?$/)
        .parse(n);
};
