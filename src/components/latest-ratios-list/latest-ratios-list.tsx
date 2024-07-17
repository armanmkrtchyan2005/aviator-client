import { useState, useEffect, useId } from "react";

import { selectLastRate } from "@/store/slices/test.slice";
import { useStateSelector, useAppDispatch } from "@/store/hooks";
import { betApi, useGetLastThirtyCoefficientsQuery } from "@/store/api/betApi";

import { Badge } from "@/components/ui/badge";

export const LatestRatiosList = () => {
    const [key, setKey] = useState(0);

    const lastRate = useStateSelector(state => selectLastRate(state));

    const dropdownMenuId = useId();

    const dispatch = useAppDispatch();
    const { data: coefficients, isSuccess } =
        useGetLastThirtyCoefficientsQuery();

    useEffect(() => {
        if (!isSuccess) return;

        dispatch(
            betApi.util.updateQueryData(
                "getLastThirtyCoefficients",
                undefined,
                draft => {
                    draft.length = draft.length - 1;
                    draft.unshift({
                        _id: new Date().toISOString(),
                        game_coeff: lastRate
                        // createdAt: new Date().toISOString()
                    });
                }
            )
        );

        setKey(key => key + 1);
    }, [lastRate]);

    const onClickHandler: React.MouseEventHandler<
        HTMLButtonElement
    > = event => {
        const ariaExpanded =
            event.currentTarget.getAttribute("aria-expanded") === "true";

        event.currentTarget.setAttribute(
            "aria-expanded",
            String(!ariaExpanded)
        );
    };

    return (
        <div className="content-wrapper relative mt-1.5 flex items-center gap-2 px-1.5 py-2.5">
            {isSuccess ? (
                <div className="flex flex-auto gap-2 overflow-x-hidden">
                    {coefficients?.slice(0, 16)?.map((coefficient, i) => (
                        <Badge
                            key={`${coefficient?._id} - ${key}`}
                            value={coefficient?.game_coeff}
                            className={generateClassName(i)}
                        />
                    ))}
                </div>
            ) : null}
            <button
                aria-controls={dropdownMenuId}
                aria-haspopup={true}
                aria-expanded={false}
                onClick={onClickHandler}
                className="group peer flex shrink-0 items-center gap-x-1.5 rounded-full border border-[#414148] bg-[#252528] px-2 py-1 text-xs leading-none text-[#767b85] aria-expanded:z-10 aria-expanded:text-[#e50539] mh:hover:text-[#e50539]"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                >
                    <path
                        d="M7.688.27a6.615 6.615 0 0 0-5.809 3.4L.25 2.043v4.604h4.604L2.871 4.662c.92-1.77 2.692-2.974 4.816-2.974C10.592 1.688 13 4.095 13 7c0 2.904-2.408 5.313-5.313 5.313-2.337 0-4.25-1.488-5.029-3.542H1.171c.779 2.833 3.4 4.958 6.517 4.958 3.754 0 6.729-3.046 6.729-6.729 0-3.683-3.046-6.73-6.73-6.73zM6.625 3.813v3.613l3.33 1.983.566-.92-2.834-1.7V3.811H6.625z"
                        fill="currentColor"
                        fillRule="nonzero"
                    />
                </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="10px"
                    height="8px"
                    viewBox="0 0 10 8"
                    version="1.1"
                    className="duration-300 group-aria-expanded:rotate-180"
                >
                    <g
                        id="Page-2"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                        opacity="0.600000024"
                    >
                        <g
                            id="Styleguide"
                            transform="translate(-554.000000, -425.000000)"
                            fill="currentColor"
                        >
                            <path
                                d="M556.849422,424.622293 L560.777597,424.360414 C561.87972,424.286939 562.832731,425.120823 562.906205,426.222946 C562.912112,426.31154 562.912112,426.400429 562.906205,426.489023 L562.644327,430.417198 C562.570852,431.519321 561.617842,432.353205 560.515719,432.27973 C560.032345,432.247505 559.577098,432.040929 559.234543,431.698374 L555.568246,428.032076 C554.787197,427.251028 554.787197,425.984698 555.568246,425.203649 C555.910801,424.861094 556.366048,424.654517 556.849422,424.622293 Z"
                                id="dd"
                                transform="translate(559.133295, 428.133295) rotate(-225.000000) translate(-559.133295, -428.133295) "
                            />
                        </g>
                    </g>
                </svg>
            </button>

            <section
                id={dropdownMenuId}
                className="absolute left-0 top-0 hidden w-full overflow-hidden rounded-2xl bg-[#1f2128] pt-2.5 peer-aria-expanded:z-[5] peer-aria-expanded:block"
            >
                <h2 className="px-2.5 pb-2.5 text-left font-bold uppercase">
                    История раундов
                </h2>
                <div className="flex flex-wrap gap-2 bg-[#262830] px-1.5 py-1.5">
                    {coefficients?.map((coefficient, i) => (
                        <Badge
                            key={i}
                            value={coefficient?.game_coeff}
                            className=""
                        />
                    ))}
                </div>
            </section>
            {/* <button onClick={add}>dadas</button> */}
        </div>
    );
};

const generateClassName = (index: number): string => {
    const _ = "opacity-80";
    const baseClassName =
        "shrink-0 animate-left-appearance mh:hover:opacity-100 ";

    const className = [
        "opacity-100",
        "opacity-100",
        "opacity-90",
        "opacity-90",
        "opacity-80",
        "opacity-80",
        "opacity-70",
        "opacity-70",
        "opacity-60",
        "opacity-60",
        "opacity-50",
        "opacity-50",
        "opacity-40",
        "opacity-40",
        "opacity-30",
        "opacity-30",
        "opacity-20",
        "opacity-20"
    ];

    return baseClassName + className[index];
};
