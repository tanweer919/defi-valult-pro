import { NextRequest, NextResponse } from "next/server";

const ONEINCH_API_BASE = "https://api.1inch.dev";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ chainId: string }> },
) {
  try {
    const { chainId } = await params;
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    // Demo mode handling
    if (
      process.env.NODE_ENV === "development" ||
      searchParams.get("demo") === "true"
    ) {
      // Simulate successful cancellation
      return NextResponse.json({
        success: true,
        message: "Demo order cancelled successfully",
        orderId,
        status: "cancelled",
        cancelledAt: Math.floor(Date.now() / 1000),
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      });
    }

    // Production 1inch API integration
    const API_KEY = process.env.ONEINCH_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: "1inch API key not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `${ONEINCH_API_BASE}/orderbook/v4.0/${chainId}/order/${orderId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.description || `HTTP ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: unknown) {
    console.error("Cancel limit order API error:", error);
    return NextResponse.json(
      {
        error: "Failed to cancel limit order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
