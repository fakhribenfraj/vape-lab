"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface BeakerWidgetProps {
  currentFill: number
  targetFill: number
  unit?: string
  ingredientName?: string
  isAnimating?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeConfig = {
  sm: { width: 60, height: 80, bottleWidth: 40 },
  md: { width: 80, height: 120, bottleWidth: 56 },
  lg: { width: 100, height: 160, bottleWidth: 72 },
}

const bubblePositions = [
  { left: 25, duration: 1.2 },
  { left: 45, duration: 1.5 },
  { left: 60, duration: 1.3 },
  { left: 35, duration: 1.7 },
  { left: 55, duration: 1.4 },
]

export function BeakerWidget({
  currentFill,
  targetFill,
  unit = "ml",
  ingredientName,
  isAnimating = false,
  size = "md",
  className,
}: BeakerWidgetProps) {
  const config = sizeConfig[size]
  const fillPercentage = Math.min((currentFill / targetFill) * 100, 100)
  const isComplete = fillPercentage >= 100

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className="relative"
        style={{ width: config.width, height: config.height }}
        role="progressbar"
        aria-valuenow={currentFill}
        aria-valuemin={0}
        aria-valuemax={targetFill}
        aria-label={`${ingredientName || 'Fill level'}: ${currentFill}${unit} of ${targetFill}${unit}`}
      >
        {/* Bottle outline */}
        <svg
          width={config.width}
          height={config.height}
          viewBox="0 0 100 160"
          className="absolute inset-0"
        >
          {/* Bottle neck */}
          <rect
            x="35"
            y="0"
            width="30"
            height="25"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-glass-border"
          />
          
          {/* Bottle body */}
          <path
            d={`
              M 35 25 
              L 20 45 
              Q 10 60 10 80 
              L 10 150 
              Q 10 155 15 155 
              L 85 155 
              Q 90 155 90 150 
              L 90 80 
              Q 90 60 80 45 
              L 65 25 
              Z
            `}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-glass-border"
          />
          
          {/* Measurement lines */}
          {[25, 50, 75, 100, 125].map((y, i) => (
            <line
              key={i}
              x1="20"
              y1={y}
              x2="35"
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-glass-border/50"
            />
          ))}
        </svg>
        
        {/* Liquid fill */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-lg transition-all duration-500",
            isAnimating && "liquid-animation"
          )}
          style={{
            height: `${(fillPercentage / 100) * (config.height - 25)}px`,
            transition: "height 0.5s ease-out",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 80 135"
            preserveAspectRatio="none"
            className={cn(
              "absolute bottom-0 left-0",
              isComplete ? "bg-mint" : "bg-gradient-to-t from-mint/80 to-mint/40"
            )}
          >
            <path
              d={`
                M 0 135 
                Q 20 130 40 135 
                Q 60 130 80 135 
                L 80 0 
                L 0 0 
                Z
              `}
              fill={isComplete ? "#00FFC2" : "url(#liquidGradient)"}
            />
            <defs>
              <linearGradient id="liquidGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#00FFC2" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00FFC2" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Bubbles animation */}
          {isAnimating && (
            <div className="absolute inset-0 overflow-hidden">
              {bubblePositions.map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-white/30 animate-bubble"
                  style={{
                    left: `${pos.left}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${pos.duration}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Fill percentage overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "font-mono text-sm font-bold",
            fillPercentage > 50 ? "text-obsidian" : "text-foreground"
          )}>
            {Math.round(fillPercentage)}%
          </span>
        </div>
      </div>
      
      {/* Labels */}
      <div className="text-center">
        {ingredientName && (
          <p className="text-xs text-muted-foreground">{ingredientName}</p>
        )}
        <p className="text-sm font-semibold text-foreground">
          {currentFill} / {targetFill} {unit}
        </p>
      </div>
    </div>
  )
}
