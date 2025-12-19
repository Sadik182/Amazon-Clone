import { NextResponse } from "next/server";

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("[API Route] Fetching products from fakestoreapi.com");

    const res = await fetch("https://fakestoreapi.com/products", {
      headers: {
        Accept: "application/json",
      },
      // Add cache control
      cache: "no-store", // Force fresh fetch each time
    });

    console.log(`[API Route] Response status: ${res.status}`);

    if (!res.ok) {
      console.error(`[API Route] API returned ${res.status} ${res.statusText}`);
      return NextResponse.json(
        { error: `API returned ${res.status}`, products: [] },
        { status: res.status }
      );
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`[API Route] Invalid content-type: ${contentType}`);
      return NextResponse.json(
        { error: "Invalid content type", products: [] },
        { status: 500 }
      );
    }

    const products = await res.json();

    if (!Array.isArray(products)) {
      console.error(
        `[API Route] Response is not an array, got: ${typeof products}`
      );
      return NextResponse.json(
        { error: "Invalid response format", products: [] },
        { status: 500 }
      );
    }

    console.log(`[API Route] Successfully fetched ${products.length} products`);

    return NextResponse.json(products, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("[API Route] Error fetching products:", error);
    if (error instanceof Error) {
      console.error("[API Route] Error message:", error.message);
      console.error("[API Route] Error stack:", error.stack);
    }

    return NextResponse.json(
      { error: "Failed to fetch products", products: [] },
      { status: 500 }
    );
  }
}
