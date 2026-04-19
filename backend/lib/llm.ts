import "dotenv/config";
import OpenAI from "openai";

export interface LocationForRecommendation {
  id: string;
  name: string;
  description?: string | null;
  activity?: { name: string } | null;
  location_review?: { status: number; review_text?: string | null }[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askAIForLocationRecommendation(
  user1Bio: string | null | undefined,
  user2Bio: string | null | undefined,
  locations: LocationForRecommendation[],
  activityName?: string
): Promise<string[]> {
  if (locations.length === 0) return [];
  if (locations.length <= 3) return locations.map((l) => l.id);

  const locationSummary = locations
    .map((loc, idx) => {
      const reviews = loc.location_review || [];
      const positiveCount = reviews.filter((r) => r.status === 1).length;
      const negativeCount = reviews.filter((r) => r.status === 0).length;
      const reviewTexts = reviews
        .filter((r) => r.review_text)
        .slice(0, 15)
        .map((r) => `- ${r.review_text}`)
        .join("\n");

      return `[${idx + 1}] ID: ${loc.id}
Name: ${loc.name}
Description: ${loc.description || "ไม่มี"}
Reviews: 👍 ${positiveCount} / 👎 ${negativeCount}${reviewTexts ? `\nReview texts:\n${reviewTexts}` : ""}`;
    })
    .join("\n\n");

  const safeBio1 = (user1Bio || "ไม่มีข้อมูล").slice(0, 300).replace(/[`"\\]/g, "");
  const safeBio2 = (user2Bio || "ไม่มีข้อมูล").slice(0, 300).replace(/[`"\\]/g, "");

  const userMessage = `
You are helping match two people find the best meeting location for their shared activity.

Shared activity: ${activityName || "Unknown"}
User 1 bio: ${safeBio1}
User 2 bio: ${safeBio2}

Available locations (all matching the activity):
${locationSummary}

Based on the users' bios and location reviews, pick the 3 most suitable locations.
Return ONLY a JSON array of exactly 3 location IDs (strings), ordered best to worst. Example: ["id1","id2","id3"]
No explanation, no extra text.
  `.trim();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 256,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.choices[0]?.message?.content || "";

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const ids = JSON.parse(clean) as string[];
    const validIds = ids.filter((id) => locations.some((l) => l.id === id));
    return validIds.slice(0, 3);
  } catch {
    return locations.slice(0, 3).map((l) => l.id);
  }
}