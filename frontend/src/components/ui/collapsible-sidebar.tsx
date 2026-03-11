"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarItem {
  title: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
}

interface CollapsibleSidebarProps {
  items: SidebarItem[]
  defaultCollapsed?: boolean
  className?: string
  activeItem?: string
  onNavigate?: (href: string) => void
}

export function CollapsibleSidebar({
  items,
  defaultCollapsed = false,
  className,
  activeItem,
  onNavigate,
}: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [isHovered, setIsHovered] = React.useState(false)

  const expandedWidth = "w-64"
  const collapsedWidth = "w-16"

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-sticky h-screen border-r border-glass-border bg-surface-card/95 backdrop-blur-md transition-all duration-300",
        isCollapsed && !isHovered ? collapsedWidth : expandedWidth,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div className={cn(
          "flex h-16 items-center border-b border-glass-border px-4 transition-all duration-300",
          isCollapsed && !isHovered ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed || isHovered ? (
            <span className="text-lg font-bold text-mint glow-text-mint">
              VapeLab
            </span>
          ) : (
            <span className="text-lg font-bold text-mint">V</span>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "h-8 w-8",
              isCollapsed && !isHovered && "absolute -right-4 top-4 bg-surface-elevated shadow-tactile"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
              className={cn("transition-transform duration-300", isCollapsed && "rotate-180")}
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {items.map((item) => (
            <button
              key={item.href}
              onClick={() => onNavigate?.(item.href)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isCollapsed && !isHovered 
                  ? "justify-center" 
                  : "justify-start",
                activeItem === item.href
                  ? "bg-mint/10 text-mint border border-mint/20"
                  : "text-muted-foreground hover:bg-glass-light hover:text-foreground"
              )}
              title={isCollapsed && !isHovered ? item.title : undefined}
            >
              {item.icon && (
                <span className="flex-shrink-0">
                  {item.icon}
                </span>
              )}
              
              {(!isCollapsed || isHovered) && (
                <>
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.badge !== undefined && (
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      activeItem === item.href
                        ? "bg-mint text-obsidian"
                        : "bg-surface-elevated text-muted-foreground"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={cn(
          "border-t border-glass-border p-4 transition-all duration-300",
          isCollapsed && !isHovered ? "flex justify-center" : "flex items-center justify-between"
        )}>
          {(!isCollapsed || isHovered) && (
            <span className="text-xs text-muted-foreground">
              v1.0.0
            </span>
          )}
        </div>
      </div>
    </aside>
  )
}
