"use client";
import Header from "@/components/Header/Header";
import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems } from "@/slices/basketSlice";
import CheckOutProduct from "@/components/CheckOutProduct/CheckOutProduct";

function Checkout() {
  const items = useSelector(selectItems);
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
        <div>
          <h2 className="whitespace-nowrap"></h2>
        </div>
      </main>
    </div>
  );
}

export default Checkout;
