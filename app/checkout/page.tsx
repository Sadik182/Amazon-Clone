import Header from "@/components/Header/Header";
import React from "react";
import Image from "next/image";

function Checkout() {
  return (
    <div className="bg-gray-100">
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* Left */}
        <div className="grow m-5 shadow-sm">
          <Image
            src="https://links.papareact.com/ikj"
            alt="checkout"
            width={1020}
            height={250}
            objectFit="contain"
          />
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">Your Shopping Basket</h1>
          </div>
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h2 className="whitespace-nowrap">Your Amazon Basket Items</h2>
          </div>
        </div>
        {/* Right */}
        <div></div>
      </main>
    </div>
  );
}

export default Checkout;
