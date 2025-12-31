"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Currency from "@/components/Currency/Currency";
import Link from "next/link";
import Footer from "@/components/Footer/Footer";

interface Order {
  id: string;
  amount: number;
  amount_shipping: number;
  images: string[];
  timestamp?: { seconds: number };
}

function Orders() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (status === "loading") return;

      if (!session?.user?.email) {
        setError("Please sign in to view your orders");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders?email=${session.user.email}`);

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const ordersData = await response.json();
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, status]);

  const formatDate = (timestamp?: { seconds: number }) => {
    if (!timestamp?.seconds) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto p-5">
          <div className="text-center py-10">
            <p className="text-lg">Loading orders...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto p-5">
          <div className="text-center py-10">
            <p className="text-lg text-red-500">
              Please sign in to view your orders
            </p>
            <Link
              href="/"
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Return to home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto p-5">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold border-b">Your Orders</h1>
          {orders.length > 0 && (
            <p className="text-gray-600 mt-1">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </p>
          )}
        </div>

        {error ? (
          <div className="bg-white p-10 shadow-md text-center">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 shadow-md text-center">
            <p className="text-lg mb-4">
              You haven&apos;t placed any orders yet.
            </p>
            <Link href="/" className="button inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 p-5 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex justify-between w-full bg-gray-100 text-gray-600 p-4 rounded-md">
                    <div className="flex items-center gap-4 mb-2">
                      <div>
                        <p className="text-sm text-gray-600 font-bold">
                          Order Placed
                        </p>
                        <p className="text-sm font-medium">
                          {formatDate(order.timestamp)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-bold">Total</p>
                        <p className="text-sm font-semibold">
                          <Currency amount={order.amount} />
                        </p>
                      </div>
                      {order.amount_shipping > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 font-bold">
                            Shipping
                          </p>
                          <p className="text-sm">
                            Next Day Delivery{" "}
                            <Currency amount={order.amount_shipping} />
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-4 items-end">
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold"> Order ID:</span> #
                        {order.id.slice(0, 25)}...
                      </p>
                      {order.images && order.images.length > 0 && (
                        <p className="text-sm text-blue-600">
                          {order.images.length}{" "}
                          {order.images.length === 1 ? "item" : "items"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {order.images && order.images.length > 0 && (
                  <div className="flex gap-3 mt-4">
                    {order.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-24 h-24 bg-white border border-gray-200 rounded"
                      >
                        <Image
                          src={image}
                          alt={`Order item ${index + 1}`}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Orders;
