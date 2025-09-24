import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB); //  .env.local 
    const collection = db.collection("ai_code");

    // query
    const docs = await collection.find({}).limit(10).toArray();

    return NextResponse.json(docs);
  } catch (err) {
    console.error("getSpecs error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req) {
    try {
      const body = await req.json();
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection("ai_code");
  
      const doc = {
        ...body,
        createdAt: new Date(),
      };
  
      const result = await collection.insertOne(doc);
      return NextResponse.json({ ok: true, id: result.insertedId });
    } catch (err) {
      console.error("saveSpec error:", err);
      return NextResponse.json({ ok: false, error: "Failed to save" }, { status: 500 });
    }
  }