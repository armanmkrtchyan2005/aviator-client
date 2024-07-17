interface VirtualListItemProps extends React.ComponentPropsWithoutRef<"li"> {}

export const VirtualListItem: React.FC<VirtualListItemProps> = ({
    children,
    ...props
}) => {
    return (
        <li
            {...props}
            className="grid grid-cols-[1fr_4fr] grid-rows-[auto_auto] place-items-center overflow-hidden rounded-md bg-[#101112] text-xs text-[#9ea0a3] sm:grid-cols-[3fr_7fr]"
        >
            {children}
        </li>
    );
};
