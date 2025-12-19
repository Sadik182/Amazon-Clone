import Header from "@/components/Header/Header";
import Banner from "@/components/Banner/Banner";
import ProductFeed from "@/components/ProductFeed/ProductFeed";

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = "force-dynamic"; // Force dynamic rendering to avoid build-time fetch issues

async function getProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products", {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      // Log error with details for Vercel logs
      console.error(
        `[Products API] Failed with status ${res.status} ${res.statusText}`
      );
      console.error(`[Products API] Response URL: ${res.url}`);
      return [];
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`[Products API] Invalid content-type: ${contentType}`);
      return [];
    }

    const products = await res.json();

    if (!Array.isArray(products)) {
      console.error(
        `[Products API] Response is not an array, got: ${typeof products}`
      );
      return [];
    }

    console.log(
      `[Products API] Successfully fetched ${products.length} products`
    );
    return products;
  } catch (error) {
    // Log the actual error for debugging in Vercel logs
    console.error("[Products API] Error fetching products:", error);
    if (error instanceof Error) {
      console.error("[Products API] Error message:", error.message);
      console.error("[Products API] Error stack:", error.stack);
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
