import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  try {
    res.cookies.delete("sid");
    res.cookies.delete("sname");
  } catch (e) {
    // noop - ensure response still returns
  }
  return res;
}


