import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const spec = await req.json(); // { appName, entities, roles, features }

    const prompt = `
You are a coding assistant.
Generate a static HTML page with TailwindCSS.
The page should represent a mock UI for the following app spec:
App Name: ${spec.appName}
Entities: ${spec.entities.join(", ")}
Roles: ${spec.roles.join(", ")}
Features: ${spec.features.join(", ")}

Rules:
- Return ONLY the HTML code (including <html>, <head>, and <body>).
- Use TailwindCSS classes for styling.
- Keep it simple but structured: title, a menu for roles/features, and a form for each entity.
- Do not include any extra explanation.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI that outputs only code." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const code = completion.choices?.[0]?.message?.content ?? "";

    // return
    return NextResponse.json({ code });
  } catch (err) {
    console.error("generateCode error:", err);
    return NextResponse.json({ code: "<!-- generation failed -->" });
  }
}