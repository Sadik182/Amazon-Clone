import Header from "@/components/Header/Header";
import Banner from "@/components/Banner/Banner";
import ProductFeed from "@/components/ProductFeed/ProductFeed";

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = "force-dynamic"; // Force dynamic rendering to avoid build-time fetch issues

async function getProducts() {
  try {
    console.log("[Page] Fetching products from fakestoreapi.com");

    // Fetch directly from external API - this works reliably on Vercel
    const res = await fetch("https://fakestoreapi.com/products", {
      // Use revalidate for ISR (Incremental Static Regeneration)
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    console.log(`[Page] Response status: ${res.status}`);

    if (!res.ok) {
      console.error(`[Page] API returned ${res.status} ${res.statusText}`);
      return [];
    }

    const products = await res.json();

    if (!Array.isArray(products)) {
      console.error(`[Page] Response is not an array, got: ${typeof products}`);
      return [];
    }

    console.log(`[Page] Successfully fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error("[Page] Error fetching products:", error);
    if (error instanceof Error) {
      console.error("[Page] Error message:", error.message);
      console.error("[Page] Error stack:", error.stack);
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
