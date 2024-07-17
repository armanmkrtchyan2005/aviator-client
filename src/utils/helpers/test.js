import * as z from "zod";

const test = z.coerce.number().gte(0.1).parse("");

console.log(test);
