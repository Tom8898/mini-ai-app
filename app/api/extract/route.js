import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { text } = await req.json();

    // 保护：空输入直接兜底
    if (!text || !String(text).trim()) {
      return NextResponse.json({
        appName: "My App",
        entities: ["Item"],
        roles: ["User"],
        features: ["View dashboard"],
      });
    }

    // 提示词：要求只返回 JSON，且字段固定
    const prompt = `
You are an assistant that extracts structured software requirements from one short sentence.

Return ONLY valid JSON with this exact schema:
{
  "appName": "string",
  "entities": ["string", "string", ...],
  "roles": ["string", "string", ...],
  "features": ["string", "string", ...]
}

Rules:
- Use concise English nouns for entities and roles (singular form).
- Use short verb phrases for features (e.g., "Add course", "View reports").
- If uncertain, make the best reasonable guess, but never add unrelated items.
- Do NOT include any text outside of the JSON. No comments, no markdown.

User input:
"${String(text).replaceAll(`"`, `\\"`)}"
`.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // 体积小、价格低、支持 JSON 输出的家族模型
      messages: [
        { role: "system", content: "Return only JSON. No extra text." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" }, // JSON 模式（只输出可解析 JSON）
      temperature: 0.2,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "{}";
    // 解析与最小校验
    const parsed = JSON.parse(raw);

    // 轻量规范化：去重、首字母大写
    const normList = (arr) =>
      Array.from(
        new Set((arr || []).map((s) => String(s).trim()))
      )
        .filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

    const result = {
      appName: String(parsed.appName || "My App").trim(),
      entities: normList(parsed.entities),
      roles: normList(parsed.roles),
      features: normList(parsed.features),
    };

    // 保底：字段缺失时提供默认值，避免前端渲染报错
    if (!result.entities.length) result.entities = ["Item"];
    if (!result.roles.length) result.roles = ["User"];
    if (!result.features.length) result.features = ["View dashboard"];

    return NextResponse.json(result);
  } catch (err) {
    console.error("extract error:", err);
    // 兜底：AI 失败也返回一个最小可用结构
    return NextResponse.json({
      appName: "My App",
      entities: ["Item"],
      roles: ["User"],
      features: ["View dashboard"],
    });
  }
}