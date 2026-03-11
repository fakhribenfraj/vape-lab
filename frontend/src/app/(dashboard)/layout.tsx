"use client";

import { Button } from "@/components/ui/button";
import { useSession, useSignOut } from "@/hooks/use-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const signOutMutation = useSignOut();

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-background border-b border-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">VapeLab.io</h1>
              <span className="text-sm text-muted-foreground">Mixing Lab</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {session?.userId}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  signOutMutation.mutate();
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <nav className="space-y-2">
              <a
                href="/recipes"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                🍳 Recipes
              </a>
              <a
                href="/batches"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                🔥 Batches
              </a>
              <a
                href="/inventory"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                📦 Inventory
              </a>
              <a
                href="/compliance"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                📋 Compliance
              </a>
              <a
                href="/customers"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                👥 Customers
              </a>
            </nav>
          </aside>

          <main className="lg:col-span-2 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
