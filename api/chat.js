import OpenAI from "openai";

export default async function handler(req, res) {
  // CORS básico (ajuda quando o site está em outro domínio)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { message, history = [] } = req.body || {};
    if (!message) return res.status(400).json({ error: "message vazio" });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Personalidade do LX CHAT (ajuste como quiser)
    const system = "Você é o LX CHAT: assistente direto, útil e claro. Responda sempre em pt-BR.";

    const input = [
      { role: "system", content: system },
      ...history,
      { role: "user", content: message }
    ];

    const r = await client.responses.create({
      model: "gpt-5-mini",
      input
    });

    return res.status(200).json({ text: r.output_text || "" });
  } catch (e) {
    return res.status(500).json({ error: "Erro no backend", detail: String(e) });
  }
}
