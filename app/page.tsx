import Header from "@/components/Header/Header";
import Banner from "@/components/Banner/Banner";
import ProductFeed from "@/components/ProductFeed/ProductFeed";

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = "force-dynamic"; // Force dynamic rendering to avoid build-time fetch issues

async function getProducts() {
  // Use internal API route to avoid 403 errors from external API
  // The API route runs on Vercel serverless functions which are less likely to be blocked
  try {
    // Get the base URL - use Vercel's automatic environment variables
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.VERCEL_BRANCH_URL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : "http://localhost:3000";

    const apiUrl = `${baseUrl}/api/products`;
    console.log(`[Page] Fetching products from API route: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // Don't cache the API route call
    });

    console.log(`[Page] API route response status: ${res.status}`);

    if (!res.ok) {
      console.error(
        `[Page] API route returned ${res.status} ${res.statusText}`
      );
      // Don't fallback - API route should handle retries
      // If it still fails, return empty array
      return [];
    }

    const products = await res.json();

    // Handle both array response and error response
    if (Array.isArray(products)) {
      console.log(`[Page] Successfully received ${products.length} products`);
      return products;
    }

    // If API route returned an error object, log it but don't fallback
    if (products.error) {
      console.error(`[Page] API route error: ${products.error}`);
      return [];
    }

    return [];
  } catch (error) {
    console.error("[Page] Error fetching from API route:", error);
    if (error instanceof Error) {
      console.error("[Page] Error details:", error.message);
    }
    // Don't fallback to direct fetch - it will also get 403
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="bg-gray-100">
      <Header />
      <main className="max-w-screen-2xl mx-auto">
        {/* Banner */}
        <Banner />
        {/* Product Feed */}
        <ProductFeed products={products} />
      </main>
    </div>
  );
}
