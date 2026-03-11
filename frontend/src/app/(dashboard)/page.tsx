"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to VapeLab.io</CardTitle>
            <CardDescription>
              Your mixing lab and inventory management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Recipes</h3>
                <p className="text-sm text-muted-foreground">
                  Create and manage e-liquid recipes with precise measurements
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Batches</h3>
                <p className="text-sm text-muted-foreground">
                  Execute recipes and track production batches
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Inventory</h3>
                <p className="text-sm text-muted-foreground">
                  Track raw materials and receive stock
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Generate compliance reports and traceability
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <a href="/recipes/create" className="w-full">
              <Button className="w-full">Create Recipe</Button>
            </a>
            <a href="/batches/create" className="w-full">
              <Button className="w-full">Create Batch</Button>
            </a>
            <a href="/batches/create" className="w-full">
              <Button className="w-full">Start Batch</Button>
            </a>
            <a href="/inventory/create" className="w-full">
              <Button className="w-full">Add to Inventory</Button>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent activity yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Database</span>
                <span className="badge bg-success">Connected</span>
              </div>
              <div className="flex justify-between">
                <span>Auth</span>
                <span className="badge bg-success">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
