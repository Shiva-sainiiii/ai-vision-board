// src/services/ai.service.js
// Calls the Vercel serverless /api/generate endpoint.
// Always passes the selected model so the backend stays dynamic.

import { DEFAULT_MODEL } from "../config/models";

/**
 * Generate AI content for a vision board goal.
 * @param {string} prompt     - User's goal or idea
 * @param {string} [model]    - OpenRouter model ID (from AI_MODELS)
 * @param {string} [systemPrompt] - Override system prompt
 * @returns {Promise<{result: string, model: string}>}
 */
export async function generateGoalContent(prompt, model = DEFAULT_MODEL, systemPrompt = null) {
  const body = { prompt, model };
  if (systemPrompt) body.systemPrompt = systemPrompt;

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json(); // { result: string, model: string }
}

/**
 * Generate a vivid affirmation for a goal card.
 */
export async function generateAffirmation(goal, model) {
  return generateGoalContent(
    `Create a short, powerful affirmation (2–3 sentences, present tense) for this goal: "${goal}". Make it personal, vivid, and emotionally resonant.`,
    model,
    "You are a vision board coach. Write affirmations in present tense as if the goal is already achieved. Be vivid and emotionally inspiring."
  );
}

/**
 * Generate action steps for a goal.
 */
export async function generateActionSteps(goal, model) {
  return generateGoalContent(
    `List 5 concrete action steps to achieve this goal: "${goal}". Format as a numbered list, each step short and actionable.`,
    model,
    "You are a productivity coach. Give practical, specific action steps. Be concise and motivating."
  );
}

/**
 * Generate a visual description for a goal (for future image generation).
 */
export async function generateVisualDescription(goal, model) {
  return generateGoalContent(
    `Describe a vivid visual scene that represents achieving this goal: "${goal}". 2-3 sentences, rich imagery, positive and aspirational.`,
    model,
    "You are a creative director. Describe scenes with sensory detail — colors, light, atmosphere, emotion."
  );
}
