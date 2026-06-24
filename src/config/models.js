// src/config/models.js
// Add or swap models here — they appear in the Dashboard dropdown automatically.
// All models listed use the ":free" suffix so no OpenRouter credits are needed.

export const AI_MODELS = [
  {
    id: "meta-llama/llama-3.1-8b-instruct:free",
    name: "Llama 3.1 8B — Best Quality",
    description: "Meta's flagship open model. Great for rich, detailed goal descriptions.",
    badge: "⭐ Best",
  },
  {
    id: "google/gemma-2-9b-it:free",
    name: "Gemma 2 9B — Fastest",
    description: "Google's fast instruction-tuned model. Low latency responses.",
    badge: "⚡ Fast",
  },
  {
    id: "mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B — Backup",
    description: "Reliable European model. Good fallback if others are busy.",
    badge: "🔄 Backup",
  },
];

// Default model ID used if nothing is selected
export const DEFAULT_MODEL = AI_MODELS[0].id;
