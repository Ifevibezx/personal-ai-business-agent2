import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generatePostDraft(input: {
  instruction: string;
  tone: string;
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await client.chat.completions.create({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You are a careful X content assistant. Return one original post of no more than 280 characters. Do not create spam, fake engagement, impersonation, harassment, deceptive claims, or unsolicited messages. Never claim that a post was published. Return only the draft text.",
      },
      {
        role: "user",
        content: `Tone: ${input.tone}\nRequest: ${input.instruction}`,
      },
    ],
  });

  const draft = response.choices[0]?.message.content?.trim();
  if (!draft) throw new Error("The AI returned an empty draft");
  return draft;
}
