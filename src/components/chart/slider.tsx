export const Slider = () => {
    return (
        <g>
            <rect
                x="50%"
                y="50%"
                height="6"
                width="130"
                rx="3"
                className="slider-bar"
            />
            <rect
                x="50%"
                y="50%"
                rx="3"
                // cx="100%"
                width="130"
                height="6"
                fill="#e50539"
                className="slider"
            ></rect>
        </g>
    );
};
