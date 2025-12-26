"use client";
import Header from "@/components/Header/Header";
import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "@/slices/basketSlice";
import CheckOutProduct from "@/components/CheckOutProduct/CheckOutProduct";
import { useSession } from "next-auth/react";
import Currency from "@/components/Currency/Currency";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.stripe_public_key || "");

function Checkout() {
  const { data: session } = useSession();
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const createCheckoutSession = async () => {
    try {
      // Create checkout session
      const checkoutSession = await axios.post("/api/create-checkout-session", {
        items,
        email: session?.user?.email,
      });
      // Redirect to checkout session using session URL
      if (checkoutSession.data.url) {
        window.location.href = checkoutSession.data.url;
      } else {
        alert("Checkout session URL is missing");
      }
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        ("error" in error.response.data || "details" in error.response.data)
          ? (error.response.data as { error?: string; details?: string })
              .details ||
            (error.response.data as { error?: string; details?: string }).error
          : "Failed to create checkout session";
      alert(`Error: ${errorMessage}`);
    }
  };
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
                Subtotal ({items.length} items):{" "}
                <span className="font-bold">
                  <Currency amount={total} />
                </span>
              </h2>
              <button
                role="link"
                onClick={createCheckoutSession}
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
