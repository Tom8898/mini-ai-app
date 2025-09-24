import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
      const body = await req.json();
      const name = body.name;
      

      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection("user_info");
  
      const doc = await collection.findOne({"name": name});
  
      return NextResponse.json(doc);
    } catch (err) {
      console.error("saveSpec error:", err);
      return NextResponse.json({ ok: false, error: "Failed to query user" }, { status: 500 });
    }
  }