import Anthropic from "@anthropic-ai/sdk";

const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.AI_MODEL || "claude-haiku-4-5-20251001";

// Only create a client if a key is present. Without one, the app still works
// using the built-in fallback answers below.
const client = KEY ? new Anthropic({ apiKey: KEY }) : null;
export const aiEnabled = !!client;

// --- built-in fallback answers (used when no API key is set) --------------
const FALLBACK = [
  [["balanc", "equation", "chemistry"],
    "Let us balance one together. Take H\u2082 + O\u2082 \u2192 H\u2082O. Oxygen: 2 on the left, 1 on the right \u2014 so put a 2 before water: H\u2082 + O\u2082 \u2192 2H\u2082O. Now hydrogen is 2 vs 4, so: 2H\u2082 + O\u2082 \u2192 2H\u2082O. Balanced! The trick is to fix one element at a time and re-check. Want to try N\u2082 + H\u2082 \u2192 NH\u2083?"],
  [["geometry", "theorem"],
    "Geometry theorems are just rules you can reuse. The angle-sum rule says the three angles in any triangle add to 180\u00b0. So if two angles are 60\u00b0 and 70\u00b0, the third is 180 \u2212 60 \u2212 70 = 50\u00b0. Which theorem is troubling you?"],
  [["fraction"],
    "Fractions get easy with a common denominator. For 1/2 + 1/3, make the bottoms match: 3/6 + 2/6 = 5/6. To multiply, go straight across: 2/3 \u00d7 3/4 = 6/12 = 1/2. Want a practice question?"],
  [["quiz", "test"],
    "Quick quiz! 1) Balance N\u2082 + H\u2082 \u2192 NH\u2083.  2) A triangle has angles 90\u00b0 and 45\u00b0 \u2014 what is the third?  3) Simplify 4/8. Type your answers and I will check them!"]
];
function fallbackReply(message) {
  const low = (message || "").toLowerCase();
  for (const [keys, ans] of FALLBACK) {
    if (keys.some((k) => low.includes(k))) return ans;
  }
  return "Good question! Break it into small steps and tackle one at a time. Tell me exactly which part is confusing and I will walk you through just that bit.";
}

// --- study buddy ----------------------------------------------------------
export async function studyBuddyReply(message, profile) {
  if (!client) return { reply: fallbackReply(message), live: false };

  const weak = (profile.skills || [])
    .filter((s) => s.level !== "strong")
    .map((s) => s.topic)
    .join(", ");

  const system = `You are a warm, encouraging study buddy for ${profile.name}, a student in ${profile.className}.
Explain concepts step by step in simple language suited to their grade. Guide them to the answer rather than just giving it. Keep replies short (2-5 sentences) and end with a small question or next step when it helps. Their current weak topics are: ${weak || "none noted"}. Be positive and never condescending.`;

  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: message }]
    });
    const reply = msg.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return { reply: reply || fallbackReply(message), live: true };
  } catch (err) {
    console.error("AI error:", err.message);
    return { reply: fallbackReply(message), live: false };
  }
}

// --- weekly insight -------------------------------------------------------
export async function weeklyInsight(profile) {
  if (!client) return { insight: profile.insight, live: false };
  const system =
    "You write a short, plain-language weekly insight for a school student. 2-3 sentences: name one thing improving, one weak area, and one specific, kind, actionable suggestion. No headings.";
  const data = {
    name: profile.name,
    overall: profile.overall,
    skills: profile.skills,
    homework: `${profile.homeworkDone}/${profile.homeworkTotal}`,
    rank: `${profile.rank}/${profile.classSize}`
  };
  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 250,
      system,
      messages: [
        { role: "user", content: "Write the insight for this student:\n" + JSON.stringify(data) }
      ]
    });
    const insight = msg.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join(" ")
      .trim();
    return { insight: insight || profile.insight, live: true };
  } catch (err) {
    console.error("AI error:", err.message);
    return { insight: profile.insight, live: false };
  }
}
