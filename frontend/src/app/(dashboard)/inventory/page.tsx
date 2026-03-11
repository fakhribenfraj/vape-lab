"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Track raw materials, products, and stock levels.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}