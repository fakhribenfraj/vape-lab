import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-obsidian",
  {
    variants: {
      variant: {
        default:
          "bg-mint/20 text-mint border border-mint/30",
        secondary:
          "bg-surface-elevated text-muted-foreground border border-glass-border",
        destructive:
          "bg-state-error/20 text-state-error border border-state-error/30",
        outline: "text-foreground border border-glass-border bg-glass-light",
        success: "bg-state-success/20 text-state-success border border-state-success/30 glow-mint-sm",
        warning: "bg-amber/20 text-amber border border-amber/30 glow-amber-sm",
        info: "bg-state-info/20 text-state-info border border-state-info/30",
        steeping: "bg-amber/20 text-amber border border-amber/30 glow-amber-sm",
        ready: "bg-state-success/20 text-state-success border border-state-success/30 glow-mint-sm",
        mixing: "bg-state-info/20 text-state-info border border-state-info/30",
        pending: "bg-surface-elevated text-muted-foreground border border-glass-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
