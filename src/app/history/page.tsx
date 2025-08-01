"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TransactionHistory } from "@/components/features/TransactionHistory";
import { Calendar, Filter, Search, Download } from "lucide-react";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [tokenFilter, setTokenFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create sample CSV content
      const csvContent = `Date,Type,Token,Amount,Hash,Status
2024-01-15,Swap,ETH,1.5,0x123...abc,Completed
2024-01-14,Transfer,USDC,1000,0x456...def,Completed
2024-01-13,Swap,WBTC,0.05,0x789...ghi,Completed`;

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transaction_history_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Transaction history exported successfully!");
    } catch (error) {
      toast.error("Failed to export transaction history");
    } finally {
      setIsExporting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateRange({ from: "", to: "" });
    setTokenFilter("all");
    toast.success("Filters cleared");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Transaction History
          </h1>
          <p className="text-gray-600 mt-2">
            Track all your DeFi activities and swaps
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            loading={isExporting}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <Card className="p-6" gradient>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={tokenFilter}
            onChange={(e) => setTokenFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Tokens</option>
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
            <option value="WBTC">WBTC</option>
          </select>

          <Input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
            placeholder="From date"
          />

          <Input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            placeholder="To date"
          />
        </div>
      </Card>

      <TransactionHistory
        searchTerm={searchTerm}
        dateRange={dateRange}
        tokenFilter={tokenFilter}
      />
    </div>
  );
}
