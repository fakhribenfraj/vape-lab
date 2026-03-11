"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type LineItem = {
  id: string;
  product: string;
  qty: number;
  unitPrice: number;
};

export default function SalePage() {
  const { toast } = useToast();
  const [customer, setCustomer] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { id: "item-1", product: "Blueberry Muffin 12mg", qty: 1, unitPrice: 15.0 },
  ]);

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.qty * item.unitPrice, 0),
    [items]
  );

  function handleAddItem() {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${prev.length + 1}`,
        product: "New Product",
        qty: 1,
        unitPrice: 12.0,
      },
    ]);
  }

  function handleSave() {
    toast({
      title: "Sale saved",
      description: "This is a dummy sale record (no backend connected).",
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <Link
            href="/sales"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Link>
          <h1 className="text-3xl font-bold text-white">Create New Sale</h1>
        </div>

        <Button size="lg" onClick={handleSave} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          Save Sale
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sale Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Customer</label>
                <Input
                  placeholder="Customer name"
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Notes</label>
                <Input
                  placeholder="Optional notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Line items</p>
              <Button variant="secondary" size="sm" onClick={handleAddItem}>
                Add item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border border-glass-border bg-surface-card/60 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <Input
                      className="flex-1"
                      value={item.product}
                      onChange={(event) => {
                        const value = event.target.value;
                        setItems((prev) =>
                          prev.map((i) =>
                            i.id === item.id ? { ...i, product: value } : i
                          )
                        );
                      }}
                    />
                    <div className="grid w-full max-w-xs gap-2 sm:grid-cols-2 lg:w-auto">
                      <Input
                        type="number"
                        value={item.qty}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          setItems((prev) =>
                            prev.map((i) =>
                              i.id === item.id ? { ...i, qty: Math.max(1, value) } : i
                            )
                          );
                        }}
                        placeholder="Qty"
                      />
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          setItems((prev) =>
                            prev.map((i) =>
                              i.id === item.id
                                ? { ...i, unitPrice: Math.max(0, value) }
                                : i
                            )
                          );
                        }}
                        placeholder="Unit price"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">
                    Subtotal: ${ (item.qty * item.unitPrice).toFixed(2) }
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-sm font-medium text-slate-400">Total</span>
              <span className="text-xl font-semibold text-white">
                ${total.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">
              This is a dummy sale form for UI preview. In a full implementation, the
              sale would be persisted and inventory deducted automatically.
            </p>
            <div className="rounded-xl border border-glass-border bg-surface-card/60 p-4">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Items</span>
                <span>{items.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Estimated Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
