import { useState, useRef, useEffect, useLayoutEffect } from "react";

import { useStateSelector } from "@/store/hooks";
import { selectAirplaneState } from "@/store/slices/test.slice";
import { selectAnimationSettings } from "@/store/slices/settingsSlice";

import "./chart.css";
import { Airplane } from "./airplane";
import { Propeller } from "./propeller";
import { Slider } from "./slider";
import { RateCoefficient } from "./rate-coefficient";
import { SoundEffects } from "../sound-effects/sound-effects";

export const Chart = () => {
    const [isSliderVisible, setIsSliderVisible] = useState(false);
    const [startScreen, setStartScreen] = useState(false);
    const airplaneRef = useRef<SVGUseElement>(null);
    // const rateRef = useRef<RateElement>(null);
    const containerRef = useRef<SVGSVGElement>(null);
    const animationRef = useRef<Animation>();

    const airplaneState = useStateSelector(state => selectAirplaneState(state));
    const gameStatus = useStateSelector(state => state.test.gameStatus);

    const animationEnabled = useStateSelector(state =>
        selectAnimationSettings(state)
    );

    useEffect(() => {
        if (animationEnabled) {
            airplaneRef.current?.classList.remove("opacity-0");
        } else {
            airplaneRef.current?.classList.add("opacity-0");
        }
    }, [animationEnabled]);

    useLayoutEffect(() => {
        const crash = () => {
            if (!airplaneRef.current) return;

            animationRef.current = airplaneRef.current.animate(
                [
                    {
                        translate: "800px 0px"
                    }
                ],
                { duration: 500, iterations: 1, fill: "forwards" }
            );
            setTimeout(() => {
                animationRef.current?.cancel();
                airplaneRef.current?.classList.remove("fly");
                airplaneRef.current?.classList.add("hidden");
            }, 1000);

            containerRef.current?.setAttribute("data-active", "false");
            if (startScreen) setStartScreen(false);
            if (isSliderVisible) setIsSliderVisible(false);
        };

        const loading = () => {
            if (!airplaneRef.current) return;

            containerRef.current?.setAttribute("data-active", "true");

            setStartScreen(true);

            if (airplaneRef.current.classList.contains("hidden"))
                airplaneRef.current?.classList.remove("hidden");
        };

        const game = () => {
            setStartScreen(false);
            airplaneRef.current?.classList.add("fly");
        };

        if (gameStatus.status === "inactive") {
            airplaneRef.current?.classList.add("hidden");
            containerRef.current?.setAttribute("data-active", "false");
            if (startScreen) setStartScreen(false);
            if (isSliderVisible) setIsSliderVisible(false);
            return;
        }

        if (airplaneState === "loading") {
            loading();
            setIsSliderVisible(true);
        } else if (airplaneState === "crash") {
            crash();
        } else if (airplaneState === "start" || airplaneState === "game") {
            game();
        }
    }, [airplaneState, gameStatus.status]);

    return (
        <section>
            <figure className="chart-container rounded-2.5xl">
                <svg
                    width="100%"
                    viewBox="0 0 557 253"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    ref={containerRef}
                    data-active={true}
                    className="svg-container aspect-video rounded-2.5xl border border-gray-50"
                >
                    <defs>
                        <Propeller />
                        {/* <Slider /> */}
                        <Airplane />
                    </defs>

                    <use
                        id="use-airplane"
                        width="170"
                        height="72"
                        href="#airplane"
                        className="airplane origin-top-left"
                        ref={airplaneRef}
                    />

                    {startScreen ? (
                        <g
                            onTransitionEnd={event => {
                                event.stopPropagation();
                                // airplaneRef.current?.classList.add("fly");

                                // rateRef.current?.startAnimation();
                                // setStartScreen(false);
                            }}
                            className="opacity-100 transition-all duration-500"
                        >
                            <use
                                id="use-propeller"
                                href="#propeller"
                                className="origin-center -translate-x-6 -translate-y-6"
                                x="50%"
                                y="50%"
                                onAnimationEnd={event => {
                                    event.currentTarget.parentElement?.classList.replace(
                                        "opacity-100",
                                        "opacity-0"
                                    );
                                    setIsSliderVisible(false);
                                }}
                            />
                            <text
                                transform="translate(0, -40)"
                                fill="#fff"
                                textAnchor="middle"
                                x="50%"
                                y="50%"
                                fontSize="1.5rem"
                                className="text-center font-semibold uppercase"
                            >
                                Ожидаем новый раунд
                            </text>
                            <Slider />
                        </g>
                    ) : null}

                    <RateCoefficient gameStatus={gameStatus} />

                    <svg
                        height="10"
                        x="30"
                        y="270"
                    >
                        <g>
                            {Array(10)
                                .fill(0)
                                .map((_, i) => (
                                    <g key={i}>
                                        <circle
                                            cx={
                                                animationEnabled
                                                    ? "10"
                                                    : `${i * 10 + 0.5}%`
                                            }
                                            cy="5"
                                            r="2"
                                            fill="white"
                                        >
                                            {animationEnabled ? (
                                                <animate
                                                    attributeName="cx"
                                                    values={`${
                                                        (i + 1) * 10
                                                    }%; ${i * 10}%`}
                                                    dur="3s"
                                                    begin="1.5s"
                                                    repeatCount="indefinite"
                                                />
                                            ) : null}
                                        </circle>
                                    </g>
                                ))}
                        </g>
                    </svg>
                    <svg
                        height="275"
                        x="0"
                        y="-25"
                    >
                        {Array(10)
                            .fill(0)
                            .map((_, i) => (
                                <g key={i}>
                                    <circle
                                        cx="10"
                                        cy={
                                            animationEnabled
                                                ? "0"
                                                : `${(i + 1) * 10 - 1}%`
                                        }
                                        r="2"
                                        fill="red"
                                    >
                                        {animationEnabled ? (
                                            <animate
                                                attributeName="cy"
                                                values={`${i * 10}%; ${
                                                    (i + 1) * 10
                                                }%`}
                                                dur="3s"
                                                begin="0s"
                                                repeatCount="indefinite"
                                            />
                                        ) : null}
                                    </circle>
                                </g>
                            ))}
                    </svg>
                </svg>
            </figure>
            <SoundEffects />
        </section>
    );
};
