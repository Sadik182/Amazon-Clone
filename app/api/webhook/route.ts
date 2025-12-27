import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";
import serviceAccount from "../../../firebasePermissions.json";
import Stripe from "stripe";

// Secure Firebase Connection by checking if the app is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// Establish Firebase Connection to Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const endpointSecret = process.env.STRIPE_SIGNING_SECRET || "";

const fulfillOrder = async (session: Stripe.Checkout.Session) => {
  const email = session.metadata?.email;
  if (!email) {
    throw new Error("Email not found in session metadata");
  }

  return admin
    .firestore()
    .collection("users")
    .doc(email)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: (session.amount_total || 0) / 100,
      amount_shipping: (session.total_details?.amount_shipping || 0) / 100,
      images: JSON.parse(session.metadata?.images || "[]"),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`Order ${session.id} has been added to the database`);
    });
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") || "";
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  // Handle the event here (e.g., update order status in Firebase)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await fulfillOrder(session);
    } catch (error) {
      console.error("Error fulfilling order:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
