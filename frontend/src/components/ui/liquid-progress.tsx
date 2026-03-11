"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LiquidProgressProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  label?: string
  color?: "mint" | "amber" | "info" | "error"
  isAnimated?: boolean
  className?: string
}

const sizeConfig = {
  sm: { height: 8, radius: 4 },
  md: { height: 16, radius: 8 },
  lg: { height: 24, radius: 12 },
}

const colorMap = {
  mint: {
    base: "bg-mint/30",
    fill: "bg-gradient-to-r from-mint/80 to-mint",
    glow: "shadow-[0_0_10px_rgba(0,255,194,0.3)]",
  },
  amber: {
    base: "bg-amber/30",
    fill: "bg-gradient-to-r from-amber/80 to-amber",
    glow: "shadow-[0_0_10px_rgba(255,184,0,0.3)]",
  },
  info: {
    base: "bg-state-info/30",
    fill: "bg-gradient-to-r from-state-info/80 to-state-info",
    glow: "shadow-[0_0_10px_rgba(77,171,247,0.3)]",
  },
  error: {
    base: "bg-state-error/30",
    fill: "bg-gradient-to-r from-state-error/80 to-state-error",
    glow: "shadow-[0_0_10px_rgba(255,71,87,0.3)]",
  },
}

export function LiquidProgress({
  value,
  max = 100,
  size = "md",
  showLabel = true,
  label,
  color = "mint",
  isAnimated = true,
  className,
}: LiquidProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const config = sizeConfig[size]
  const colors = colorMap[color]

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="mb-2 flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-muted-foreground">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-sm font-semibold text-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full",
          colors.base,
          "h-[var(--progress-height)]"
        )}
        style={{ "--progress-height": `${config.height}px` } as React.CSSProperties}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {/* Liquid fill */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out",
            colors.fill,
            colors.glow,
            isAnimated && percentage > 0 && "liquid-animation"
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Wave effect */}
          {isAnimated && percentage > 0 && (
            <div className="absolute inset-0 overflow-hidden">
              <div
                className={cn(
                  "absolute -left-full h-full w-[200%] animate-wave",
                  "bg-gradient-to-r from-transparent via-white/20 to-transparent"
                )}
              />
            </div>
          )}
        </div>
        
        {/* Shine effect */}
        {percentage > 0 && (
          <div
            className={cn(
              "absolute inset-y-0 left-0 w-[20%] rounded-full",
              "bg-gradient-to-r from-white/20 to-transparent"
            )}
            style={{ width: `${Math.min(percentage, 20)}%` }}
          />
        )}
      </div>
    </div>
  )
}

interface LiquidProgressCircleProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  color?: "mint" | "amber" | "info" | "error"
  isAnimated?: boolean
  className?: string
}

export function LiquidProgressCircle({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  showLabel = true,
  color = "mint",
  isAnimated = true,
  className,
}: LiquidProgressCircleProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const colors = colorMap[color]
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg]"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-elevated"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-all duration-500 ease-out",
            colors.fill.replace("bg-gradient-to-r ", ""),
            "stroke-mint"
          )}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      
      {/* Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}
