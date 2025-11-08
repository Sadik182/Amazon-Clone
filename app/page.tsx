import Head from "next/head";
import Header from "@/components/Header/Header";
import Banner from "@/components/Banner/Banner";
export default function Home() {
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
      </main>
    </div>
  );
}
