"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Currency from "@/components/Currency/Currency";
import Link from "next/link";

interface OrderData {
  id: string;
  amount: number;
  amount_shipping: number;
  images: string[];
  timestamp?: {
    seconds: number;
    nanoseconds: number;
  };
}

function Success() {
  const { data: session, status: sessionStatus } = useSession();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Wait for session to load
    if (sessionStatus === "loading") {
      console.log("Waiting for session to load...");
      return;
    }

    const fetchOrder = async (retry = 0) => {
      console.log("Fetching order:", {
        sessionId,
        email: session?.user?.email,
        retry,
      });

      // Check if we have required information
      if (!sessionId) {
        console.error("Missing session ID in URL");
        setError("Missing session ID. Please check the URL.");
        setLoading(false);
        return;
      }

      if (!session?.user?.email) {
        console.error("User not signed in");
        setError("Please sign in to view your order.");
        setLoading(false);
        return;
      }

      try {
        console.log(
          `Fetching order from API: session_id=${sessionId}, email=${session.user.email}`
        );
        const response = await fetch(
          `/api/order?session_id=${sessionId}&email=${session.user.email}`
        );

        console.log(`API response status: ${response.status}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // If order not found and we haven't retried too many times, retry
          // (webhook might still be processing)
          if (response.status === 404 && retry < 3) {
            console.log(`Order not found, retrying... (${retry + 1}/3)`);
            setTimeout(() => {
              setRetryCount(retry + 1);
              fetchOrder(retry + 1);
            }, 2000); // Wait 2 seconds before retry
            return;
          }

          // After all retries exhausted or other error
          setLoading(false);
          throw new Error(errorData.error || "Failed to fetch order");
        }

        const orderData = await response.json();
        setOrder(orderData);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        if (retry < 3) {
          // Retry on error
          setTimeout(() => {
            setRetryCount(retry + 1);
            fetchOrder(retry + 1);
          }, 2000);
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to load order details"
          );
          setLoading(false);
        }
      }
    };

    fetchOrder(retryCount);
  }, [sessionId, session?.user?.email, sessionStatus, retryCount]);

  const formatDate = (timestamp?: { seconds: number }) => {
    if (!timestamp?.seconds) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto p-5">
        <div className="flex flex-col p-10 bg-white shadow-md">
          {loading ? (
            <div className="text-center py-10">
              <p className="text-lg">Loading order details...</p>
              {retryCount > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Waiting for order to be processed... (Attempt {retryCount + 1}
                  )
                </p>
              )}
            </div>
          ) : error || !order ? (
            <div className="text-center py-10">
              <p className="text-lg text-red-500">
                {error || "Order not found"}
              </p>
              <Link
                href="/"
                className="text-blue-500 hover:underline mt-4 inline-block"
              >
                Return to home
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 mb-5">
                <CheckCircleIcon className="text-green-500 h-10" />
                <h1 className="text-3xl font-semibold">
                  Thank you, your order has been confirmed!
                </h1>
              </div>

              <p className="mb-5">
                Thank you for shopping with us. We&apos;ll send a confirmation
                email to{" "}
                <span className="font-semibold">{session?.user?.email}</span>{" "}
                once your order has shipped.
              </p>

              {order.timestamp && (
                <p className="text-sm text-gray-600 mb-8">
                  Order placed on {formatDate(order.timestamp)}
                </p>
              )}

              <div className="border-t pt-5">
                <h2 className="text-xl font-semibold mb-4">
                  Order #{order.id}
                </h2>

                <div className="space-y-4 mb-6">
                  {order.images && order.images.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">
                        Items in your order:
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        {order.images.map((image, index) => (
                          <div key={index} className="relative w-24 h-24">
                            <Image
                              src={image}
                              alt={`Order item ${index + 1}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal:</span>
                    <Currency
                      amount={order.amount - (order.amount_shipping || 0)}
                    />
                  </div>
                  {order.amount_shipping > 0 && (
                    <div className="flex justify-between text-lg">
                      <span>Shipping:</span>
                      <Currency amount={order.amount_shipping} />
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                    <span>Total:</span>
                    <Currency amount={order.amount} />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t">
                <Link href="/" className="button w-full text-center block">
                  Return to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Success;
