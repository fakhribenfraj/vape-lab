import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target",
  {
    variants: {
      variant: {
        default: "bg-mint text-obsidian hover:bg-mint/90 shadow-tactile hover:shadow-tactile-md active:shadow-tactile-sm active:translate-y-px",
        destructive:
          "bg-state-error text-white hover:bg-state-error/90 shadow-tactile hover:shadow-tactile-md",
        outline:
          "border border-glass-border bg-glass-light hover:bg-glass-medium text-foreground backdrop-blur-md",
        secondary:
          "bg-surface-elevated text-foreground hover:bg-slate-80 border border-glass-border shadow-tactile-sm",
        ghost: "hover:bg-glass-light hover:text-mint text-foreground",
        link: "text-mint underline-offset-4 hover:underline",
        success: "bg-state-success text-obsidian hover:bg-state-success/90 shadow-tactile hover:shadow-tactile-md glow-mint-sm",
        warning: "bg-amber text-obsidian hover:bg-amber/90 shadow-tactile hover:shadow-tactile-md glow-amber-sm",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
