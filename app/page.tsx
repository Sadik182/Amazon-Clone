import Header from "@/components/Header/Header";
import Banner from "@/components/Banner/Banner";
import ProductFeed from "@/components/ProductFeed/ProductFeed";

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = "force-dynamic"; // Force dynamic rendering to avoid build-time fetch issues

async function getProducts() {
  // Try internal API route first (more reliable on Vercel)
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.VERCEL_BRANCH_URL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const apiUrl = `${baseUrl}/api/products`;
    console.log(`[Page] Attempting to fetch from API route: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    if (res.ok) {
      const products = await res.json();
      const productArray = Array.isArray(products)
        ? products
        : products?.products || [];

      if (Array.isArray(productArray) && productArray.length > 0) {
        console.log(
          `[Page] Successfully received ${productArray.length} products from API route`
        );
        return productArray;
      }
    }

    console.warn(
      `[Page] API route failed or returned empty, trying direct fetch`
    );
  } catch (apiRouteError) {
    console.warn(
      `[Page] API route error, falling back to direct fetch:`,
      apiRouteError
    );
  }

  // Fallback: Direct fetch from external API
  try {
    console.log(`[Page] Fetching directly from fakestoreapi.com`);
    const res = await fetch("https://fakestoreapi.com/products", {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(
        `[Page] Direct API returned ${res.status} ${res.statusText}`
      );
      return [];
    }

    const products = await res.json();

    if (!Array.isArray(products)) {
      console.error(`[Page] Direct API response is not an array`);
      return [];
    }

    console.log(
      `[Page] Successfully received ${products.length} products from direct API`
    );
    return products;
  } catch (error) {
    console.error(
      "[Page] Error fetching products (both methods failed):",
      error
    );
    if (error instanceof Error) {
      console.error("[Page] Error message:", error.message);
    }
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
