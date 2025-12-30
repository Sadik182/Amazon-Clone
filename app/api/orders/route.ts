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
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const ordersSnapshot = await admin
      .firestore()
      .collection("users")
      .doc(email)
      .collection("orders")
      .orderBy("timestamp", "desc")
      .get();

    const orders = ordersSnapshot.docs.map((doc) => {
      const data = doc.data();
      const result: Record<string, unknown> = {
        id: doc.id,
        ...data,
      };

      // Convert timestamp
      if (data.timestamp) {
        const ts = data.timestamp as {
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

      return result;
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
