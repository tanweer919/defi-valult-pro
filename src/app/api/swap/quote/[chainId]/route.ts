import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chainId: string }> },
) {
  try {
    const { chainId } = await params;
    const { searchParams } = request.nextUrl;

    // Validate required parameters
    const src = searchParams.get("src");
    const dst = searchParams.get("dst");
    const amount = searchParams.get("amount");
    const from = searchParams.get("from");

    if (!src || !dst || !amount || !from) {
      return NextResponse.json(
        { error: "Missing required parameters: src, dst, amount, from" },
        { status: 400 },
      );
    }

    // Build query string for 1inch Fusion Plus API
    const queryParams = new URLSearchParams({
      src,
      dst,
      amount,
      from,
      ...Object.fromEntries(searchParams.entries()),
    });

    const response = await fetch(
      `https://api.1inch.dev/fusion/quote/v1.0/${chainId}?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ONEINCH_API_KEY}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 10 }, // Cache for 10 seconds
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("1inch API error:", errorData);
      throw new Error(
        `1inch API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Format the response for the frontend
    const formattedResponse = {
      fromToken: {
        address: data.src,
        symbol: data.srcSymbol,
        decimals: data.srcDecimals,
      },
      toToken: {
        address: data.dst,
        symbol: data.dstSymbol,
        decimals: data.dstDecimals,
      },
      fromAmount: data.srcAmount,
      toAmount: data.dstAmount,
      protocols: data.protocols || [],
      estimatedGas: data.estimatedGas,
      priceImpact: data.priceImpact,
      minimumReceived: data.dstAmount, // Will be calculated with slippage
      route: data.route || [],
      quoteId: data.quoteId,
    };

    return NextResponse.json(formattedResponse);
  } catch (error: unknown) {
    console.error("Swap quote API error:", error);

    // Return mock data in development
    if (process.env.NODE_ENV === "development") {
      const { searchParams } = request.nextUrl;
      const src = searchParams.get("src");
      const dst = searchParams.get("dst");
      const amount = searchParams.get("amount");

      return NextResponse.json({
        fromToken: {
          address: src,
          symbol: "ETH",
          decimals: 18,
        },
        toToken: {
          address: dst,
          symbol: "USDC",
          decimals: 6,
        },
        fromAmount: amount,
        toAmount: (parseFloat(amount || "0") * 1800).toString(), // Mock rate
        protocols: [
          {
            name: "Uniswap V3",
            part: 100,
            fromTokenAddress: src,
            toTokenAddress: dst,
          },
        ],
        estimatedGas: "150000",
        priceImpact: 0.1,
        minimumReceived: (parseFloat(amount || "0") * 1800 * 0.99).toString(),
        route: [],
        quoteId: "mock-quote-id",
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch swap quote" },
      { status: 500 },
    );
  }
}
