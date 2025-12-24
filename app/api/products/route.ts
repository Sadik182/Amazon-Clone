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

      console.log("[API Route] Fetching products from fakestoreapi.com");

      // Create AbortController for timeout handling
      let controller = new AbortController();
      let timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Try fakestoreapi.com first
      let res = await fetch("https://fakestoreapi.com/products", {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          Referer: "https://fakestoreapi.com/",
        },
        signal: controller.signal,
        cache: "no-store",
      });

      // If 403 on first attempt, try alternative API
      if (res.status === 403 && attempt === 1) {
        console.log(
          "[API Route] fakestoreapi.com blocked (403), trying alternative API..."
        );
        clearTimeout(timeoutId);

        const altController = new AbortController();
        const altTimeoutId = setTimeout(() => altController.abort(), 10000);

        // Try dummyjson.com as alternative (more reliable, doesn't block Vercel)
        try {
          const altRes = await fetch(
            "https://dummyjson.com/products?limit=20",
            {
              headers: {
                Accept: "application/json",
              },
              signal: altController.signal,
              cache: "no-store",
            }
          );

          clearTimeout(altTimeoutId);

          if (altRes.ok) {
            const altProducts = await altRes.json();
            // dummyjson returns { products: [...] } format
            if (altProducts.products && Array.isArray(altProducts.products)) {
              console.log(
                `[API Route] Using alternative API (dummyjson), got ${altProducts.products.length} products`
              );
              return NextResponse.json(altProducts.products, {
                status: 200,
                headers: {
                  "Cache-Control":
                    "public, s-maxage=60, stale-while-revalidate=120",
                },
              });
            }
          }
        } catch (altError) {
          console.warn("[API Route] Alternative API also failed:", altError);
        }

        // Continue with retry logic for fakestoreapi
        controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 10000);
        res = await fetch("https://fakestoreapi.com/products", {
          headers: {
            Accept: "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            Referer: "https://fakestoreapi.com/",
          },
          signal: controller.signal,
          cache: "no-store",
        });
      }

      clearTimeout(timeoutId);

      console.log(`[API Route] Response status: ${res.status}`);

      // If 403, retry (might be rate limiting)
      if (res.status === 403 && attempt < maxRetries) {
        console.warn(
          `[API Route] Got 403, will retry (attempt ${attempt}/${maxRetries})`
        );
        lastError = new Error(`403 Forbidden - attempt ${attempt}`);
        continue;
      }

      if (!res.ok) {
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

      console.log(
        `[API Route] Successfully fetched ${products.length} products`
      );

      return NextResponse.json(products, {
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
