import { db } from "@/app/api/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Validate required fields
  const { userId, designConfig } = body;
  if (!userId || !designConfig) {
    return NextResponse.json({ error: "Missing userId or designConfig" }, { status: 400 });
  }
  const designId = uuidv4();
  try {
    await db.collection("users").doc(userId).collection("uidesing").doc(designId).set({
      ...designConfig,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ designId });
  } catch (err) {
    return NextResponse.json({ error: "Error saving design", details: String(err) }, { status: 500 });
  }
}
