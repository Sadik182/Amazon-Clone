import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { BasketItem } from "@/slices/basketSlice";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { items, email } = await request.json();
    const transformedItems = items.map((item: BasketItem) => ({
      quantity: 1,
      price_data: {
        currency: "aud",
        product_data: {
          name: item.title,
          description: item.description || "",
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Ensure integer
      },
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_options: [
        {
          shipping_rate: "shr_1SihDaBRSj7610OAtEDWeQSE",
        },
      ],
      shipping_address_collection: {
        allowed_countries: ["US", "AU", "BD"],
      },
      line_items: transformedItems,
      mode: "payment",
      success_url: `${process.env.HOST}/success`,
      cancel_url: `${process.env.HOST}/checkout`,
      metadata: {
        email,
        images: JSON.stringify(items.map((item: BasketItem) => item.image)),
      },
    });

    return NextResponse.json(
      { id: session.id, url: session.url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
