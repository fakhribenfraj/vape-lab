"use client";

import * as React from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "../Logo";
import { is } from "zod/v4/locales";

interface SidebarItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface SidebarGroup {
  title?: string;
  items: SidebarItem[];
}

interface CollapsibleSidebarProps {
  items?: SidebarItem[];
  groups?: SidebarGroup[];
  defaultCollapsed?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  activeItem?: string;
  onNavigate?: (href: string) => void;
  onNewSale?: () => void;
}

export function CollapsibleSidebar({
  items,
  groups: groupsProp,
  defaultCollapsed = false,
  isCollapsed,
  setIsCollapsed,
  className,
  activeItem,
  onNavigate,
  onNewSale,
}: CollapsibleSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] =
    React.useState(defaultCollapsed);
  const isCollapsedState = isCollapsed ?? internalCollapsed;
  const setCollapsedState = setIsCollapsed ?? setInternalCollapsed;

  const expandedWidth = "w-64";
  const collapsedWidth = "w-16";

  const groups =
    groupsProp ??
    (items
      ? [
          {
            items,
          },
        ]
      : []);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen border-r border-glass-border bg-surface-card/95 backdrop-blur-md transition-all duration-300",
        isCollapsedState ? collapsedWidth : expandedWidth,
        className,
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div
          className={cn(
            "flex h-16 items-center  border-glass-border  transition-all duration-300",
            isCollapsedState ? "justify-center pr-4" : "justify-between px-4",
          )}
        >
          <div className="flex items-center gap-2">
            <Logo variant={isCollapsedState ? "icon" : "default"} />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsedState((prev) => !prev)}
            className={cn(
              "h-8 w-8",
              isCollapsedState &&
                "absolute -right-4 top-4 bg-surface-elevated shadow-tactile",
            )}
            aria-label={
              isCollapsedState ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <ChevronLeft
              size={16}
              className={cn(
                "transition-transform duration-300",
                isCollapsedState && "rotate-180",
              )}
            />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {onNewSale && (
            <Button
              variant="default"
              size={isCollapsedState ? "icon" : "sm"}
              onClick={onNewSale}
              className={cn(isCollapsedState ? "mb-4" : " mb-2 w-full")}
              aria-label="New sale"
            >
              <Plus size={16} className={cn(!isCollapsedState && "mr-2")} />
              {!isCollapsedState && "New Sale"}
            </Button>
          )}
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {group.title && !isCollapsedState && (
                <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.title}
                </div>
              )}

              {group.items.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size={isCollapsedState ? "icon" : "sm"}
                  onClick={() => onNavigate?.(item.href)}
                  className={cn(
                    "group w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isCollapsedState ? "justify-center" : "justify-start",
                    activeItem === item.href
                      ? "border border-mint/20 bg-mint/10 text-foreground"
                      : "text-muted-foreground hover:bg-glass-light hover:text-foreground",
                  )}
                  title={isCollapsedState ? item.title : undefined}
                >
                  {item.icon && (
                    <span className="flex-shrink-0">{item.icon}</span>
                  )}

                  {!isCollapsedState && (
                    <>
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge !== undefined && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-semibold",
                            activeItem === item.href
                              ? "bg-mint text-obsidian"
                              : "bg-surface-elevated text-muted-foreground",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Button>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "border-t border-glass-border p-4 transition-all duration-300",
            isCollapsedState
              ? "flex justify-center"
              : "flex items-center justify-between",
          )}
        >
          {!isCollapsedState && (
            <span className="text-xs text-muted-foreground">v1.0.0</span>
          )}
        </div>
      </div>
    </aside>
  );
}
