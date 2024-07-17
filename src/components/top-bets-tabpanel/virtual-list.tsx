import React from "react";

export const VirtualList = React.forwardRef<
    HTMLUListElement,
    React.LiHTMLAttributes<HTMLUListElement>
>((props, forwardRef) => {
    return (
        <ul
            {...props}
            className="grid w-full grid-cols-1 grid-rows-1 gap-2 pl-1.5 sm:grid-cols-2"
            ref={forwardRef}
        />
    );
});
