import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Alacritas, Nueva's nutrition estimate engine.
The user may send a photo of food, a short meal description, or both.
Identify each likely food item, estimate portion size from visual and text cues, and estimate calories and macros.

Respond with ONLY valid JSON, no markdown fences, no prose, in exactly this shape:
{
  "isFood": true,
  "mealName": "short descriptive name",
  "items": [
    { "name": "string", "portion": "string", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }
  ],
  "totalCalories": 0,
  "confidence": "low" | "medium" | "high",
  "notes": "one sentence on what most affects the estimate"
}

If there is no food and no usable meal description, return {"isFood": false}.
Be realistic: portion estimates from photos are approximate. Do not present the result as medical advice.`;

function extractText(response: any) {
  const content = Array.isArray(response?.content) ? response.content : [];
  return content
    .filter((block: any) => block?.type === "text")
    .map((block: any) => block?.text || "")
    .join("\n")
    .trim();
}

function safeJsonParse(text: string) {
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is missing. Add it to .env.local or your hosting environment." },
        { status: 500 }
      );
    }

    const { image, mediaType, mealText } = await request.json();
    const note = typeof mealText === "string" ? mealText.trim() : "";

    if (!image && !note) {
      return NextResponse.json(
        { error: "Add a food photo or describe the meal first." },
        { status: 400 }
      );
    }

    const content: any[] = [];

    if (image) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mediaType || "image/jpeg",
          data: image,
        },
      });
    }

    content.push({
      type: "text",
      text: note
        ? `Analyze this meal. Extra user notes: ${note}`
        : "Analyze this meal from the photo.",
    });

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ALACRITAS_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content,
          },
        ],
      }),
    });

    const responseJson = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      console.error("Anthropic error:", responseJson);
      return NextResponse.json(
        { error: responseJson?.error?.message || "Analysis failed. Check your API key and model access." },
        { status: anthropicResponse.status }
      );
    }

    const text = extractText(responseJson);
    const result = safeJsonParse(text);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Check your API key, model access, and image size, then try again." },
      { status: 500 }
    );
  }
}
