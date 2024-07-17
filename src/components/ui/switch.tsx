import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/utils";

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            "p-0.25 data-[state=unchecked]:border-white/50 inline-flex h-4.5 w-9 shrink-0 cursor-pointer select-none items-center rounded-full border border-[#60ae05] transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#229607] data-[state=unchecked]:bg-none",
            className
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb className="bg-white pointer-events-none block aspect-square h-full rounded-full border-2 border-[#a3b98a] shadow-[inset_0_0_7px_#00000029] transition-transform data-[state=checked]:translate-x-4.5 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
