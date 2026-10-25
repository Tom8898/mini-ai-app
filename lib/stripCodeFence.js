// remove markdown code fences (```html ... ```) that the model sometimes wraps around its output
export function stripCodeFence(text) {
  if (typeof text !== "string") return text;
  const match = text.trim().match(/^```[\w-]*\s*\n([\s\S]*?)\n?```$/);
  return match ? match[1].trim() : text.trim();
}
