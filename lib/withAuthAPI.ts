import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 高阶函数：只负责拦截
export function withAuthAPI(
  handler: (req: Request) => Promise<Response> | Response
) {
  return async (req: Request) => {
    try {
      const cookieStore = await cookies();
      const userId = cookieStore.get("sid")?.value;

      // 没有 userId，就拦截
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // 有 userId，就放行
      return handler(req);
    } catch (e) {
      console.error("withAuthAPI error:", e);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  };
}
