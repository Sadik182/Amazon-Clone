"use client";
import Header from "@/components/Header/Header";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearBasket } from "@/slices/basketSlice";
import { useEffect } from "react";

function Success() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Clear basket when success page loads (order confirmed)
  useEffect(() => {
    dispatch(clearBasket());
  }, [dispatch]);

  return (
    <div className="bg-gray-100 h-screen">
      <Header />
      <main className="max-w-screen-lg mx-auto">
        <div className="flex flex-col p-10 bg-white">
          <div className="flex items-center space-x-2 mb-5">
            <CheckCircleIcon className="text-green-500 h-10" />
            <h1 className="text-3xl">
              Thank you, your order has been confirmed!
            </h1>
          </div>
          <p>
            Thank you for shopping with us. We&apos;ll send a confirmation once
            your item has shipped. If you would like to check the status of your
            order(s) please press the link below.
          </p>
          <button
            className="button mt-8 cursor-pointer hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all duration-300"
            onClick={() => router.push("/orders")}
          >
            Go to my orders
          </button>
        </div>
      </main>
    </div>
  );
}

export default Success;
