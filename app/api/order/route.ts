import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";
import serviceAccount from "../../../firebasePermissions.json";

// Secure Firebase Connection by checking if the app is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const email = searchParams.get("email");

    if (!sessionId || !email) {
      return NextResponse.json(
        { error: "Missing session_id or email" },
        { status: 400 }
      );
    }

    const orderDoc = await admin
      .firestore()
      .collection("users")
      .doc(email)
      .collection("orders")
      .doc(sessionId)
      .get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = orderDoc.data();

    // Convert Firestore Timestamp to simple format
    const result: Record<string, unknown> = {
      id: sessionId,
      ...orderData,
    };

    // Convert timestamp to seconds if it exists
    if (orderData?.timestamp) {
      const ts = orderData.timestamp as {
        toDate?: () => Date;
        _seconds?: number;
      };
      if (ts.toDate) {
        result.timestamp = {
          seconds: Math.floor(ts.toDate().getTime() / 1000),
        };
      } else if (ts._seconds) {
        result.timestamp = { seconds: ts._seconds };
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
