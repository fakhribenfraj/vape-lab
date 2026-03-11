"use client";

import Link from "next/link";
import {
  RefreshCcw as ArrowPath,
  AlertTriangle,
  Clock,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Metric = {
  id: string;
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  positive?: boolean;
};

const initialMetrics: Metric[] = [
  {
    id: "sales-today",
    title: "Sales Today",
    value: "$1,243",
    subtext: "vs yesterday",
    icon: <ShoppingBag size={16} className="text-white" />,
    positive: true,
  },
  {
    id: "inventory-value",
    title: "Inventory Value",
    value: "$4,892",
    subtext: "vs last week",
    icon: <Package size={16} className="text-white" />,
  },
  {
    id: "active-batches",
    title: "Active Batches",
    value: "7",
    subtext: "Steeping in progress",
    icon: <Clock size={16} className="text-white" />,
  },
  {
    id: "low-stock",
    title: "Low Stock",
    value: "3",
    subtext: "Items need restocking",
    icon: <AlertTriangle size={16} className="text-white" />,
  },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const recentSales = [
  { id: "1", product: "Blueberry Muffin 12mg", qty: 3, total: 45.0 },
  { id: "2", product: "Strawberry Custard 6mg", qty: 1, total: 15.0 },
  { id: "3", product: "Vanilla Custard 3mg", qty: 2, total: 30.0 },
];

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
  const [lastRefreshed, setLastRefreshed] = useState<string>(() =>
    new Date().toISOString(),
  );

  const today = useMemo(() => formatDate(new Date()), []);

  function refresh() {
    setMetrics((prev) =>
      prev.map((metric) => ({
        ...metric,
        value:
          metric.id === "sales-today"
            ? `$${(Math.random() * 3500 + 500).toFixed(0)}`
            : metric.value,
      })),
    );
    setLastRefreshed(new Date().toISOString());
  }

  useEffect(() => {
    const interval = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const lastRefreshedLabel = useMemo(() => {
    const date = new Date(lastRefreshed);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [lastRefreshed]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, VapeLab
          </h1>
          <p className="text-sm text-slate-400">{today}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={refresh}
            aria-label="Refresh dashboard"
          >
            <ArrowPath className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card
            key={metric.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">
                  {metric.title}
                </h3>
                <div
                  className={
                    metric.id === "low-stock"
                      ? "p-2 bg-amber-500 rounded-xl"
                      : "p-2 bg-electricMint rounded-xl"
                  }
                >
                  {metric.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-2">
                {metric.value}
              </p>
              <div className="flex items-center text-sm text-slate-400">
                <span
                  className={
                    metric.positive
                      ? "text-green-400 flex items-center space-x-1"
                      : "text-slate-200"
                  }
                >
                  {metric.positive ? (
                    <>
                      <span>↑</span>
                      <span>8.7%</span>
                    </>
                  ) : (
                    <span className="text-slate-200">&nbsp;</span>
                  )}
                </span>
                <span className="ml-1">{metric.subtext}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-white">Recent Sales</CardTitle>
            <p className="text-sm text-slate-400">
              Updated at {lastRefreshedLabel}
            </p>
          </div>
          <Link
            href="/sales"
            className="text-electricMint hover:text-white text-sm"
          >
            View All
          </Link>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.map((sale) => (
                <TableRow
                  key={sale.id}
                  className="hover:bg-slate-800 cursor-pointer"
                >
                  <TableCell className="text-white py-3">
                    {sale.product}
                  </TableCell>
                  <TableCell className="text-right text-slate-400 pr-4">
                    {sale.qty}
                  </TableCell>
                  <TableCell className="text-right text-white pr-4">
                    ${sale.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
