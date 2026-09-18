import { NextResponse } from "next/server";
import { generatePostDraft } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { instruction?: unknown; tone?: unknown };
    const instruction = typeof body.instruction === "string" ? body.instruction.trim() : "";
    const tone = typeof body.tone === "string" ? body.tone : "professional";

    if (!instruction) {
      return NextResponse.json({ error: "instruction is required" }, { status: 400 });
    }
    if (instruction.length > 2000) {
      return NextResponse.json({ error: "instruction is too long" }, { status: 400 });
    }

    const draft = await generatePostDraft({ instruction, tone });
    return NextResponse.json({ draft, requiresApproval: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate draft";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
