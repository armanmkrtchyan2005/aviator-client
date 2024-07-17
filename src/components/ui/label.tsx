import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";

const labelVariants = cva(
    "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    {
        variants: {
            direction: {
                column: "space-y-2",
                row: "flex items-center gap-x-2",
                default: ""
            }
        },
        defaultVariants: {
            direction: "column"
        }
    }
);

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
        VariantProps<typeof labelVariants>
>(({ className, direction, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants({ direction }), className)}
        {...props}
    />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
