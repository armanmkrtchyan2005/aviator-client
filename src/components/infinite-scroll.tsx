import { useInView } from "react-intersection-observer";

interface InfiniteScrollProps {
    className?: string;
    skip: boolean;
    callback?: () => void;
    children: React.ReactNode;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
    className,
    skip,
    callback,
    children
}) => {
    const { ref } = useInView({
        threshold: 0.75,
        skip,
        initialInView: true,
        onChange(inView) {
            if (!inView) return;

            callback?.();
        }
    });

    return (
        <div className={className}>
            {children}

            <div
                ref={ref}
                className="invisible h-3"
            />
        </div>
    );
};
