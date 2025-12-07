"use client";
import Header from "@/components/Header/Header";
import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems } from "@/slices/basketSlice";
import CheckOutProduct from "@/components/CheckOutProduct/CheckOutProduct";
import { useSession } from "next-auth/react";

function Checkout() {
  const { data: session } = useSession();
  const items = useSelector(selectItems);
  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(items.reduce((acc, item) => acc + item.price, 0));
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
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0
                ? "Your Amazon Basket is empty"
                : "Shopping Items"}
            </h1>
            {items.map((item, index) => (
              <CheckOutProduct
                key={item.basketId || `${item.id}-${index}`}
                id={item.id}
                basketId={item.basketId}
                title={item.title}
                price={item.price}
                description={item.description}
                category={item.category}
                image={item.image}
                hasPrime={item.hasPrime}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        {/* Right */}
        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):
                <span className="font-bold">{formattedTotal}</span>
              </h2>
              <button
                disabled={!session}
                className={`button mt-2 ${
                  !session
                    ? "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                    : ""
                }`}
              >
                {!session ? "Sign in to checkout" : "Proceed to Checkout"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
export default Checkout;
