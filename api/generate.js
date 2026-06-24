// api/generate.js
// Vercel Serverless Function — proxies requests to OpenRouter
// Env var: OPENROUTER_API_KEY (set in Vercel dashboard, NOT prefixed with REACT_APP_)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, model, systemPrompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" });
  }

  // Use provided model, fallback to Llama 3.1 free tier
  const selectedModel = model || "meta-llama/llama-3.1-8b-instruct:free";

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY is not configured on server" });
  }

  try {
    const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.VERCEL_URL || "http://localhost:3000",
        "X-Title": "AI Vision Board 3D",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: systemPrompt || "You are a motivational life coach and vision board expert. Help users articulate and visualize their goals with vivid, inspiring language.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 512,
        temperature: 0.85,
      }),
    });

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text();
      console.error("OpenRouter error:", errText);
      return res.status(openRouterRes.status).json({ error: "OpenRouter API error", details: errText });
    }

    const data = await openRouterRes.json();
    const text = data.choices?.[0]?.message?.content || "";

    return res.status(200).json({ result: text, model: selectedModel });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Internal server error", message: err.message });
  }
}
