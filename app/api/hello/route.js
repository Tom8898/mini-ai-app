import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 从环境变量读取
});

export async function GET() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // 模型名，可换
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello, ChatGPT! Say hello world." },
      ],
    });

    const text = response.choices[0].message.content;
    return new Response(JSON.stringify({ result: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}