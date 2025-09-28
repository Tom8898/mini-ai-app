import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// query code
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB); //  .env.local 
    const collection = db.collection("ai_code");

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username")?.trim();
    const appname = searchParams.get("appname")?.trim();

    const filter = {};
    if (username) filter.user_name = username;
    if (appname) filter.app_name = appname;

    const docs = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json(docs);
  } catch (err) {
    console.error("get history error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// save code
export async function POST(req) {
    try {
      const body = await req.json();
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection("ai_code");

      // user info
      const cookieStore = await cookies();
      const userId = cookieStore.get("sid")?.value;
      const userName = cookieStore.get("sname")?.value;
      // const username = 
  
      const doc = {
        user_id: userId,
        user_name: userName,
        ...body,
        createdAt: new Date(),
      };
  
      const result = await collection.insertOne(doc);
      return NextResponse.json({ ok: true, id: result.insertedId });
    } catch (err) {
      console.error("save code error:", err);
      return NextResponse.json({ ok: false, message: "Failed to save code" }, { status: 500 });
    }
  }