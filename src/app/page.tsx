"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PortfolioDashboard } from "@/components/features/PortfolioDashboard";
import { useWalletState } from "@/lib/hooks/useWalletState";
import { useDemoMode } from "@/lib/hooks/useDemoMode";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { TrendingUp, Zap, Shield, BarChart3, Wallet, Eye } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { isConnected } = useWalletState();
  const { isDemoMode, enableDemoMode, isDemoAvailable } = useDemoMode();
  const { openConnectModal } = useConnectModal();

  const handleEnableDemo = () => {
    enableDemoMode();
  };

  const handleConnectWallet = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: "Portfolio Tracking",
      description:
        "Monitor your DeFi investments across multiple chains with real-time data and comprehensive analytics",
    },
    {
      icon: Zap,
      title: "Smart Swaps",
      description:
        "Get the best rates across all DEXs using 1inch aggregation technology for optimal token exchanges",
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description:
        "Non-custodial solution with full transaction transparency and complete control over your assets",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Your DeFi
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "}
            Portfolio
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Track, swap, and analyze your DeFi investments with powerful tools
          powered by 1inch APIs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isConnected || isDemoMode ? (
            <Link href="/portfolio">
              <Button size="lg" className="px-8">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Portfolio
              </Button>
            </Link>
          ) : (
            <Button size="lg" className="px-8" onClick={handleConnectWallet}>
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </Button>
          )}
          <Link href="/swap">
            <Button variant="outline" size="lg" className="px-8">
              <Zap className="w-5 h-5 mr-2" />
              Start Swapping
            </Button>
          </Link>
          {!isConnected && !isDemoMode && isDemoAvailable && (
            <Button
              variant="secondary"
              size="lg"
              className="px-8"
              onClick={handleEnableDemo}
            >
              <Eye className="w-5 h-5 mr-2" />
              Try Demo
            </Button>
          )}
        </div>
      </motion.section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <Card
              className="p-6 text-center h-full flex flex-col"
              hover
              gradient
            >
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 flex-1">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Portfolio Preview - Show if wallet is connected OR demo mode is enabled */}
      {(isConnected || isDemoMode) && <PortfolioDashboard />}
    </div>
  );
}
