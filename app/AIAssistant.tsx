"use client";

import { FormEvent, useEffect, useState } from "react";

type SavedDraft = {
  id: string;
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "personal-ai-business-agent:drafts";

export default function AIAssistant() {
  const [instruction, setInstruction] = useState("");
  const [tone, setTone] = useState("professional");
  const [draft, setDraft] = useState("");
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setSavedDrafts(JSON.parse(stored) as SavedDraft[]);
    } catch {
      setError("Saved drafts could not be loaded");
    }
  }, []);

  function persistDrafts(nextDrafts: SavedDraft[]) {
    setSavedDrafts(nextDrafts);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDrafts));
  }

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
    const content = draft.trim();
    if (!content) return;

    const nextDrafts = [
      { id: crypto.randomUUID(), content, createdAt: new Date().toISOString() },
      ...savedDrafts,
    ].slice(0, 20);
    persistDrafts(nextDrafts);
    setMessage("Draft saved on this device. Publishing is not connected yet.");
  }

  function deleteDraft(id: string) {
    persistDrafts(savedDrafts.filter((item) => item.id !== id));
  }

  return (
    <main className="container">
      <section className="card" aria-labelledby="page-title">
        <p className="eyebrow">AI content assistant</p>
        <h1 id="page-title">Prepare your next X post</h1>
        <p className="muted">Generate an editable draft. Nothing is published automatically.</p>

        <form onSubmit={generate}>
          <label htmlFor="instruction">What should the post say?</label>
          <textarea id="instruction" value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="Announce our new productivity feature to startup founders" maxLength={2000} required />
          <label htmlFor="tone">Tone</label>
          <select id="tone" value={tone} onChange={(event) => setTone(event.target.value)}>
            <option value="professional">Professional</option><option value="casual">Casual</option><option value="educational">Educational</option><option value="humorous">Humorous</option>
          </select>
          <button type="submit" disabled={loading || !instruction.trim()}>{loading ? "Generating…" : "Generate draft"}</button>
        </form>

        {draft && (
          <section aria-labelledby="draft-title">
            <label id="draft-title" htmlFor="draft">Review and edit</label>
            <textarea id="draft" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={280} aria-describedby="character-count" />
            <div className="row"><span id="character-count" className="muted">{draft.length}/280 characters</span><button type="button" onClick={saveDraft}>Save draft</button></div>
          </section>
        )}

        {savedDrafts.length > 0 && (
          <section className="saved" aria-labelledby="saved-title">
            <h2 id="saved-title">Saved drafts</h2>
            {savedDrafts.map((item) => (
              <article className="saved-item" key={item.id}>
                <p>{item.content}</p>
                <div className="row"><small className="muted">{new Date(item.createdAt).toLocaleString()}</small><div className="actions"><button type="button" onClick={() => setDraft(item.content)}>Edit</button><button type="button" className="secondary" onClick={() => deleteDraft(item.id)}>Delete</button></div></div>
              </article>
            ))}
          </section>
        )}

        {message && <p className="notice" role="status">{message}</p>}
        {error && <p className="error" role="alert">{error}</p>}
      </section>
    </main>
  );
}
