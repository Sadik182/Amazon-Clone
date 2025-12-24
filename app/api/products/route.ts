import { NextResponse } from "next/server";

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = "force-dynamic";

export async function GET() {
  // Retry logic for handling 403 errors (rate limiting)
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`[API Route] Retry attempt ${attempt}/${maxRetries}`);
        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }

      console.log("[API Route] Fetching products from dummyjson.com");

      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Use dummyjson.com as primary API (works reliably with Vercel)
      const res = await fetch("https://dummyjson.com/products?limit=20", {
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      console.log(`[API Route] Response status: ${res.status}`);

      if (!res.ok) {
        if (attempt < maxRetries) {
          console.warn(
            `[API Route] Got ${res.status}, will retry (attempt ${attempt}/${maxRetries})`
          );
          lastError = new Error(`API returned ${res.status}`);
          continue;
        }
        console.error(
          `[API Route] API returned ${res.status} ${res.statusText}`
        );
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

      const data = await res.json();

      // dummyjson returns { products: [...] } format
      if (!data.products || !Array.isArray(data.products)) {
        console.error(
          `[API Route] Response is not in expected format, got: ${typeof data}`
        );
        return NextResponse.json(
          { error: "Invalid response format", products: [] },
          { status: 500 }
        );
      }

      // Transform dummyjson products to match our component's expected format
      const transformedProducts = data.products.map(
        (product: {
          thumbnail?: string;
          images?: string[];
          [key: string]: unknown;
        }) => ({
          ...product,
          // Use thumbnail if available, otherwise use first image from images array
          image:
            product.thumbnail || (product.images && product.images[0]) || "",
        })
      );

      console.log(
        `[API Route] Successfully fetched ${transformedProducts.length} products from dummyjson`
      );

      return NextResponse.json(transformedProducts, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      });
    } catch (error) {
      // If it's a timeout and we have retries left, continue
      if (
        error instanceof Error &&
        error.name === "AbortError" &&
        attempt < maxRetries
      ) {
        console.warn(`[API Route] Timeout, will retry (attempt ${attempt})`);
        lastError = error;
        continue;
      }
      // If it's a network error and we have retries left, continue
      if (attempt < maxRetries) {
        console.warn(
          `[API Route] Network error, will retry (attempt ${attempt})`
        );
        lastError = error instanceof Error ? error : new Error(String(error));
        continue;
      }
      // Otherwise, log and break
      console.error("[API Route] Error fetching products:", error);
      if (error instanceof Error) {
        console.error("[API Route] Error message:", error.message);
        console.error("[API Route] Error stack:", error.stack);
      }
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  // If we exhausted all retries
  if (lastError) {
    console.error(
      `[API Route] Failed after ${maxRetries} attempts:`,
      lastError
    );
    return NextResponse.json(
      {
        error: "Failed to fetch products after retries",
        products: [],
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { error: "Unexpected error", products: [] },
    { status: 500 }
  );
}
