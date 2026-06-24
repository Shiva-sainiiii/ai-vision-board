// src/config/models.js
// Add or swap models here — they appear in the Dashboard dropdown automatically.
// All models listed use the ":free" suffix so no OpenRouter credits are needed.

export const AI_MODELS = [
  {
    id: "nvidia/nemotron-3-ultra-550b-a55b:free",
    name: "Nemotron 3 Ultra 550B — Best Quality",
    description: "NVIDIA's flagship ultra model. Excellent for detailed goal descriptions and affirmations.",
    badge: "⭐ Best",
  },
  {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    name: "Nemotron 3 Super 120B — Balanced",
    description: "NVIDIA's super model. Great balance of quality and speed.",
    badge: "⚡ Balanced",
  },
  {
    id: "poolside/laguna-m.1:free",
    name: "Laguna M.1 — Fast",
    description: "Poolside's efficient model. Quick responses for fast iterations.",
    badge: "🚀 Fast",
  },
];

// Default model ID used if nothing is selected
export const DEFAULT_MODEL = AI_MODELS[0].id;
