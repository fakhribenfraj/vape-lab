"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FocusModeProps {
  isActive: boolean
  onToggle: () => void
  children: React.ReactNode
  className?: string
}

export function FocusMode({
  isActive,
  onToggle,
  children,
  className,
}: FocusModeProps) {
  React.useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    
    return () => {
      document.body.style.overflow = ""
    }
  }, [isActive])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isActive) {
        onToggle()
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isActive, onToggle])

  if (!isActive) {
    return (
      <div className={className}>
        {children}
      </div>
    )
  }

  return (
    <div className={cn("fixed inset-0 z-modal bg-obsidian/98 backdrop-blur-xl", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-glass-border bg-surface-card/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-state-success glow-pulse" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Focus Mode Active
          </h2>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          Exit Focus (Esc)
        </Button>
      </div>
      
      {/* Content */}
      <div className="h-[calc(100vh-80px)] overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </div>
      
      {/* Ambient glow effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-mint/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-amber/5 blur-3xl" />
      </div>
    </div>
  )
}

interface FocusModeToggleProps {
  isActive: boolean
  onToggle: () => void
  label?: string
  className?: string
}

export function FocusModeToggle({
  isActive,
  onToggle,
  label = "Focus Mode",
  className,
}: FocusModeToggleProps) {
  return (
    <Button
      variant={isActive ? "default" : "secondary"}
      size="sm"
      onClick={onToggle}
      className={cn("gap-2", isActive && "glow-mint-sm", className)}
      aria-pressed={isActive}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {label}
    </Button>
  )
}
