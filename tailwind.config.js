/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./@/**/*.{ts,tsx}"
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px"
            }
        },
        extend: {
            height: {
                4.5: "18px",
                8.5: "34px"
            },
            width: {
                4.5: "18px",
                25: "100px"
            },
            padding: {
                0.25: "1px"
            },
            // opacity: { 80: "0.8" },

            translate: {
                4.5: "18px"
            },
            colors: {
                primary: {
                    //? background colors
                    100: "black", //? page background color
                    200: "#1b1c1d", //? block background color
                    300: "#000000b3", //? input background color
                    425: "#2c2d30", //? active tab
                    475: "#141516" //? unactive tab, buttons
                },
                secondary: {},
                black: {
                    DEFAULT: "black",
                    50: "#1b1c1d",
                    150: "#141516",
                    250: "#000000B3"
                },
                white: {
                    DEFAULT: "white",
                    50: "#ffffff80"
                },
                red: {
                    550: "#d0021b",
                    750: "#cB3d40"
                },
                green: {
                    50: "#b2f2a3",
                    350: "#36cb12",
                    450: "#28a909"
                },
                gray: {
                    50: "#414148"
                }
            },
            borderRadius: {
                "2.5xl": "20px"
            },
            screens: { xs: "360px", mh: { raw: "(hover: hover)" } },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" }
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 }
                },
                airplane: {
                    from: { translate: "10px 273px" },
                    to: { translate: "200px 0px" }
                },
                rotate: {
                    0: { transform: "rotate(0deg)" },
                    100: { transform: "rotate(360deg)" }
                },
                "left-appearance": {
                    from: { translate: "-52px 0px" },
                    to: { translate: "0px 0px" }
                }
            },
            animation: {
                "accordion-down": "accordion-down 3s ease-out",
                "accordion-up": "accordion-up 3s ease-out",
                airplane:
                    "airplane 10s cubic-bezier(0.25, 0.99, 0.65, 1) infinite",
                rotate: "rotate 3s linear infinite",
                "left-appearance": "left-appearance 1s linear"
            }
        }
    },
    plugins: [require("tailwindcss-animate")]
};
