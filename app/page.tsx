import Head from "next/head";
import Header from "@/components/Header/Header";
import Banner from "@/components/Banner/Banner";
import ProductFeed from "@/components/ProductFeed/ProductFeed";

export default async function Home() {
  const products = await fetch("https://fakestoreapi.com/products").then(
    (res) => res.json()
  );

  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon Clone</title>
      </Head>
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
