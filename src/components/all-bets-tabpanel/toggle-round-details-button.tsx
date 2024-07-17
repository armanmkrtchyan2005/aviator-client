interface ToggleRoundDetailsButtonProps
    extends React.ComponentProps<"button"> {}

export const ToggleRoundDetailsButton: React.FC<
    ToggleRoundDetailsButtonProps
> = ({ children, ...props }) => {
    return (
        <button
            {...props}
            className="ml-auto mr-2.5 flex items-center gap-x-1.5 rounded-full border border-[#414148] bg-[#252528] px-2 py-1 text-xs leading-none text-[#767b85] mh:hover:text-[#e50539]"
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
            <span className="text-[#9ea0a3]">{children}</span>
        </button>
    );
};
