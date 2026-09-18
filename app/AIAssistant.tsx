"use client";

import { FormEvent, useState } from "react";

export default function AIAssistant() {
  const [instruction, setInstruction] = useState("");
  const [tone, setTone] = useState("professional");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction, tone }),
      });
      const data = (await response.json()) as { draft?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Generation failed");
      setDraft(data.draft || "");
      setMessage("Draft generated. Review and edit it before publishing.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  function saveDraft() {
    setMessage("Draft is ready. Database saving and X publishing will be added after OAuth setup.");
  }

  return (
    <main className="container">
      <section className="card" aria-labelledby="page-title">
        <p className="eyebrow">AI content assistant</p>
        <h1 id="page-title">Prepare your next X post</h1>
        <p className="muted">Generate an editable draft. Nothing is published automatically.</p>

        <form onSubmit={generate}>
          <label htmlFor="instruction">What should the post say?</label>
          <textarea
            id="instruction"
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            placeholder="Announce our new productivity feature to startup founders"
            maxLength={2000}
            required
          />

          <label htmlFor="tone">Tone</label>
          <select id="tone" value={tone} onChange={(event) => setTone(event.target.value)}>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="educational">Educational</option>
            <option value="humorous">Humorous</option>
          </select>

          <button type="submit" disabled={loading || !instruction.trim()}>
            {loading ? "Generating…" : "Generate draft"}
          </button>
        </form>

        {draft && (
          <section aria-labelledby="draft-title">
            <label id="draft-title" htmlFor="draft">Review and edit</label>
            <textarea
              id="draft"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={280}
              aria-describedby="character-count"
            />
            <div className="row">
              <span id="character-count" className="muted">{draft.length}/280 characters</span>
              <button type="button" onClick={saveDraft}>Save draft</button>
            </div>
          </section>
        )}

        {message && <p className="notice" role="status">{message}</p>}
        {error && <p className="error" role="alert">{error}</p>}
      </section>
    </main>
  );
}
