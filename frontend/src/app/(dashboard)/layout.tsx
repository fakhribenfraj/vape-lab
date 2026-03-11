"use client";

import { usePathname } from "next/navigation";
import { Home, ShoppingBag, CreditCard, Box, Users, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleSidebar } from "@/components/ui/collapsible-sidebar";
import { useSession, useSignOut } from "@/hooks/use-auth";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const navGroups = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", href: "/", icon: <Home size={20} /> },
      { title: "Sales", href: "/sale", icon: <ShoppingBag size={20} /> },
      { title: "Purchases", href: "/purchase", icon: <CreditCard size={20} /> },
      { title: "Inventory", href: "/inventory", icon: <Box size={20} /> },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Customers", href: "/customer", icon: <Users size={20} /> },
      { title: "Suppliers", href: "/supplier", icon: <Truck size={20} /> },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const signOutMutation = useSignOut();

  return (
    <div className="min-h-screen bg-obsidian">
      <CollapsibleSidebar
        groups={navGroups}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeItem={pathname}
        onNavigate={(href) => {
          window.location.href = href;
        }}
        onNewSale={() => {
          window.location.href = "/sale/new";
        }}
      />

      <div
        className={twMerge(
          isCollapsed ? "pl-16" : "pl-64",
          "transition-all duration-300",
        )}
      >
        {/* Header */}
        <header className="sticky w-full top-0 z-sticky border-b border-glass-border bg-surface-card/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Mixing Lab</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  signOutMutation.mutate();
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
