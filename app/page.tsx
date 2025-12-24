import Header from "@/components/Header/Header";
import Banner from "@/components/Banner/Banner";
import ProductFeed from "@/components/ProductFeed/ProductFeed";

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = "force-dynamic"; // Force dynamic rendering to avoid build-time fetch issues

async function getProducts() {
  // Fetch directly from external API with fallback to alternative API
  // This avoids server-to-server authentication issues on Vercel
  const maxRetries = 2;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`[Page] Retry attempt ${attempt}/${maxRetries}`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }

      // Try fakestoreapi.com first
      console.log("[Page] Fetching products from fakestoreapi.com");
      const res = await fetch("https://fakestoreapi.com/products", {
        next: { revalidate: 60 },
        headers: {
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
        },
        cache: "no-store",
      });

      console.log(`[Page] fakestoreapi.com response status: ${res.status}`);

      // If 403 or 401, try alternative API immediately
      if ((res.status === 403 || res.status === 401) && attempt === 1) {
        console.log(
          "[Page] fakestoreapi.com blocked, trying alternative API..."
        );

        // Try dummyjson.com as alternative (more reliable, doesn't block Vercel)
        const altRes = await fetch("https://dummyjson.com/products?limit=20", {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (altRes.ok) {
          const altProducts = await altRes.json();
          // dummyjson returns { products: [...] } format
          if (altProducts.products && Array.isArray(altProducts.products)) {
            console.log(
              `[Page] Using alternative API (dummyjson), got ${altProducts.products.length} products`
            );
            return altProducts.products;
          }
        }

        // If alternative also fails, continue to retry fakestoreapi
        console.warn(
          "[Page] Alternative API also failed, retrying fakestoreapi..."
        );
        continue;
      }

      if (!res.ok) {
        if (attempt < maxRetries) {
          console.warn(`[Page] API returned ${res.status}, will retry`);
          continue;
        }
        console.error(`[Page] API returned ${res.status} ${res.statusText}`);
        return [];
      }

      const products = await res.json();

      if (!Array.isArray(products)) {
        console.error(
          `[Page] Response is not an array, got: ${typeof products}`
        );
        return [];
      }

      console.log(`[Page] Successfully fetched ${products.length} products`);
      return products;
    } catch (error) {
      if (attempt < maxRetries) {
        console.warn(`[Page] Error on attempt ${attempt}, will retry:`, error);
        continue;
      }
      console.error("[Page] Error fetching products:", error);
      if (error instanceof Error) {
        console.error("[Page] Error message:", error.message);
      }
      return [];
    }
  }

  return [];
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
