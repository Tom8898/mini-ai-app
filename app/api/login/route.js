import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import {hashPassword, verifyPassword} from "@/lib/password"

export async function POST(req) {
    try {
      // get username from request
      const { username, password } = await req.json();

      // query user_info from mongodb using username
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection("user_info");
  
      const doc = await collection.findOne({"name": username});

      // 1.verify username
      if (!doc) {
        throw new Error("Username does not exist.");
      }

      // 2.verify password
      const dbPassword = doc.password;
      const result = await verifyPassword(password, dbPassword);

      if (!result) {
        throw new Error("Incorrect password.");
      }

      // 3. return
      const isProd = process.env.NODE_ENV === "production";
      const res = NextResponse.json(doc);
      res.cookies.set("sid", doc._id, { // userid
        httpOnly: false,   // 
        secure: isProd,     // 
        sameSite: "lax",  // 
        path: "/",
      });
      
      res.cookies.set("sname", doc.name, { // username
        httpOnly: false,   // 
        secure: isProd,     // 
        sameSite: "lax",  // 
        path: "/",
      });
      return res;
    } catch (err) {
      console.error("login error:", err);

      const errMessage = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { ok: false, error: errMessage }, 
        { status: 500 }
      );
    }
  }