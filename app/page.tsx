import Header from "@/components/Header/Header";
import Banner from "@/components/Banner/Banner";
import ProductFeed from "@/components/ProductFeed/ProductFeed";
import Footer from "@/components/Footer/Footer";

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = "force-dynamic"; // Force dynamic rendering to avoid build-time fetch issues

async function getProducts() {
  // Use dummyjson.com as primary API (works reliably with Vercel)
  try {
    console.log("[Page] Fetching products from dummyjson.com");

    const res = await fetch("https://dummyjson.com/products?limit=20", {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    console.log(`[Page] dummyjson.com response status: ${res.status}`);

    if (!res.ok) {
      console.error(`[Page] API returned ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();

    // dummyjson returns { products: [...] } format
    if (data.products && Array.isArray(data.products)) {
      // Transform dummyjson products to match our component's expected format
      // dummyjson has: images (array), thumbnail (string)
      // We need: image (string)
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
        `[Page] Successfully fetched ${transformedProducts.length} products from dummyjson`
      );
      return transformedProducts;
    }

    console.error(`[Page] Invalid response format from dummyjson`);
    return [];
  } catch (error) {
    console.error("[Page] Error fetching products:", error);
    if (error instanceof Error) {
      console.error("[Page] Error message:", error.message);
    }
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <main className="max-w-screen-2xl mx-auto flex-grow">
        {/* Banner */}
        <Banner />
        {/* Product Feed */}
        <ProductFeed products={products} />
      </main>
      <Footer />
    </div>
  );
}
