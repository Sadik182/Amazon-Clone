import Header from "@/components/Header/Header";
import Banner from "@/components/Banner/Banner";
import ProductFeed from "@/components/ProductFeed/ProductFeed";

export const revalidate = 60; // Revalidate every 60 seconds

async function getProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products", {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      // Log but don't throw - return empty array to allow build to succeed
      console.warn(`API returned ${res.status}, using empty products array`);
      return [];
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Response is not JSON, using empty products array");
      return [];
    }

    const products = await res.json();
    return Array.isArray(products) ? products : [];
  } catch {
    // Silently fail during build - return empty array
    // This prevents build failures when API is unavailable
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
