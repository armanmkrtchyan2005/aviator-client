import { useRef, useEffect } from "react";
import "./index.css";

import { throttle } from "@/utils/helpers/throttle";

interface ZoomableImageProps extends React.ComponentProps<"img"> {}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
    src,
    alt,
    className
}) => {
    const zoomableImageRef = useRef<HTMLImageElement>(null);
    const initialTouchDistance = useRef(0);

    const handleTouchStart: React.TouchEventHandler<
        HTMLImageElement
    > = event => {
        const target = event.currentTarget;
        const touches = event.touches;

        if (touches.length !== 2) return;

        const { x, y, height, width } = target.getBoundingClientRect();
        const xCenter = Math.round(
            (touches[0].clientX + touches[1].clientX) / 2
        );
        const yCenter = Math.round(
            (touches[0].clientY + touches[1].clientY) / 2
        );

        const horizontal = ((xCenter - x) / width) * 100;
        const vertical = ((yCenter - y) / height) * 100;

        zoomableImageRef.current?.style?.setProperty("--x", horizontal + "%");
        zoomableImageRef.current?.style?.setProperty("--y", vertical + "%");
        zoomableImageRef.current?.style?.setProperty("z-index", "5");

        const touchDistance = Math.round(
            ((touches[0].clientX - touches[1].clientX) ** 2 +
                (touches[0].clientY - touches[1].clientY) ** 2) **
                0.5
        );
        initialTouchDistance.current = touchDistance;
    };

    const handleTouchMove: React.TouchEventHandler<
        HTMLImageElement
    > = event => {
        const touches = event.touches;

        if (touches.length === 2 && initialTouchDistance.current > 0) {
            if (!zoomableImageRef.current) return;

            const currentTouchDistance = Math.round(
                ((touches[0].clientX - touches[1].clientX) ** 2 +
                    (touches[0].clientY - touches[1].clientY) ** 2) **
                    0.5
            );
            const scaleFactor =
                (currentTouchDistance / initialTouchDistance.current) * 1.5;

            zoomableImageRef.current.style.setProperty(
                "--zoom",
                String(scaleFactor)
            );
        }
    };

    const handleTouchEnd = () => {
        zoomableImageRef.current?.style.setProperty("--zoom", "1");
        initialTouchDistance.current = 0;
    };

    const handleTransitionEnd = () => {
        if (initialTouchDistance.current !== 0) return;

        zoomableImageRef.current?.style?.setProperty("z-index", "0");
    };

    useEffect(() => {
        const handleBodyTouchMove = (event: Event) => {
            if (zoomableImageRef.current?.contains(event.target)) {
                event.preventDefault();
            }
        };

        document.body.addEventListener("touchmove", handleBodyTouchMove, {
            passive: false
        });

        return () => {
            document.body.removeEventListener("touchmove", handleBodyTouchMove);
        };
    }, []);

    return (
        // <figure className="image-wrapper h-full">
        <img
            ref={zoomableImageRef}
            src={src}
            alt={alt}
            onTouchStart={handleTouchStart}
            onTouchMove={throttle(handleTouchMove, 50)}
            onTouchEnd={handleTouchEnd}
            onTransitionEnd={handleTransitionEnd}
            className={`zoomable-image ${className}`}
        />
        // </figure>
    );
};
