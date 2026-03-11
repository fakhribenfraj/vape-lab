import * as React from "react"
import { cn } from "@/lib/utils"

type StatusType = "steeping" | "ready" | "mixing" | "pending" | "completed" | "cancelled" | "error"

interface StatusIndicatorProps {
  status: StatusType
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
  pulse?: boolean
}

const statusConfig: Record<StatusType, { color: string; bg: string; label: string }> = {
  steeping: {
    color: "text-amber",
    bg: "bg-amber",
    label: "Steeping",
  },
  ready: {
    color: "text-state-success",
    bg: "bg-state-success",
    label: "Ready",
  },
  mixing: {
    color: "text-state-info",
    bg: "bg-state-info",
    label: "Mixing",
  },
  pending: {
    color: "text-muted-foreground",
    bg: "bg-muted-foreground",
    label: "Pending",
  },
  completed: {
    color: "text-state-success",
    bg: "bg-state-success",
    label: "Completed",
  },
  cancelled: {
    color: "text-state-error",
    bg: "bg-state-error",
    label: "Cancelled",
  },
  error: {
    color: "text-state-error",
    bg: "bg-state-error",
    label: "Error",
  },
}

const sizeClasses = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
}

export function StatusIndicator({
  status,
  size = "md",
  showLabel = true,
  className,
  pulse = true,
}: StatusIndicatorProps) {
  const config = statusConfig[status]
  const shouldPulse = pulse && (status === "steeping" || status === "mixing")

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "rounded-full",
            sizeClasses[size],
            config.bg,
            shouldPulse && "glow-pulse"
          )}
        />
        {shouldPulse && (
          <div
            className={cn(
              "absolute rounded-full",
              size === "sm" && "w-4 h-4",
              size === "md" && "w-6 h-6",
              size === "lg" && "w-8 h-8",
              config.bg,
              "opacity-30 blur-md animate-ping"
            )}
          />
        )}
      </div>
      {showLabel && (
        <span className={cn("text-sm font-medium", config.color)}>
          {config.label}
        </span>
      )}
    </div>
  )
}
