import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-sky-500 text-white shadow-md hover:bg-sky-600 focus-visible:ring-sky-400",
                destructive:
                    "bg-red-500 text-white shadow-sm hover:bg-red-600 focus-visible:ring-red-400",
                outline:
                    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-200",
                secondary:
                    "bg-gray-800 text-white shadow-sm hover:bg-gray-700 focus-visible:ring-gray-500",
                ghost:
                    "text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-200",
                link: "text-sky-500 underline-offset-4 hover:underline focus-visible:ring-sky-400",
            },
            size: {
                default: "h-10 px-5 py-2.5",
                sm: "h-8 px-4 py-1.5 text-sm",
                lg: "h-12 px-6 py-3 text-lg",
                icon: "h-10 w-10 p-0 flex items-center justify-center",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };