"use client";

import { useState } from "react";
import type { Work } from "./WorkCard";

export type WorkDraft = Omit<Work, "id"> & { id?: string };

const empty: WorkDraft = {
  title: "",
  year: null,
  instrumentation: "",
  duration: "",
  description: "",
  premiere: "",
  pdf_url: "",
  audio_url: "",
  video_url: "",
  score_cover_url: "",
  category: "solo",
  tags: [],
  sort_order: 0,
  is_published: true,
};

export default function AdminWorkForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: WorkDraft;
  onSave: (draft: WorkDraft) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<WorkDraft>({ ...empty, ...(initial ?? {}) });
  // Keep a raw, editable tags string so typing `foo,` doesn't immediately collapse back to `foo`
  const [tagInput, setTagInput] = useState<string>((initial?.tags ?? []).join(", "));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof WorkDraft>(key: K, value: WorkDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function submit() {
    setError(null);
    if (!draft.title.trim()) {
      setError("Title is required.");
      return;
    }
    setBusy(true);
    try {
      await onSave({
        ...draft,
        title: draft.title.trim(),
        tags: tagInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      onCancel();
    } catch (e: any) {
      setError(e?.message ?? "Failed to save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{draft.id ? "Edit work" : "New work"}</h2>
        <button className="text-sm underline underline-offset-4" onClick={onCancel}>
          Close
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Title *</span>
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Year</span>
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            inputMode="numeric"
            value={draft.year ?? ""}
            onChange={(e) => set("year", e.target.value ? Number(e.target.value) : null)}
          />
        </label>

        <label className="grid gap-1 md:col-span-2">
          <span className="text-sm font-medium">Category</span>
          <select
            className="rounded-xl border px-3 py-2 text-sm"
            value={draft.category}
            onChange={(e) => set("category", e.target.value as any)}
          >
            <option value="solo">Solo</option>
            <option value="chamber">Chamber</option>
            <option value="large_ensemble">Large Ensemble</option>
            <option value="chorus">Chorus</option>
          </select>
        </label>

        <label className="grid gap-1 md:col-span-2">
          <span className="text-sm font-medium">Instrumentation</span>
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            value={draft.instrumentation ?? ""}
            onChange={(e) => set("instrumentation", e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Duration</span>
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            value={draft.duration ?? ""}
            onChange={(e) => set("duration", e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Sort order</span>
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            inputMode="numeric"
            value={draft.sort_order ?? 0}
            onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
          />
        </label>

        <label className="grid gap-1 md:col-span-2">
          <span className="text-sm font-medium">Description</span>
          <textarea
            className="min-h-[96px] rounded-xl border px-3 py-2 text-sm"
            value={draft.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
          />
        </label>

        <label className="grid gap-1 md:col-span-2">
          <span className="text-sm font-medium">Premiere</span>
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            value={draft.premiere ?? ""}
            onChange={(e) => set("premiere", e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">PDF URL</span>
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            value={draft.pdf_url ?? ""}
            onChange={(e) => set("pdf_url", e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Score cover image URL</span>
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            placeholder="https://… (jpg/png/webp)"
            value={draft.score_cover_url ?? ""}
            onChange={(e) => set("score_cover_url", e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Audio URL</span>
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            value={draft.audio_url ?? ""}
            onChange={(e) => set("audio_url", e.target.value)}
          />
        </label>

        <label className="grid gap-1 md:col-span-2">
          <span className="text-sm font-medium">Video URL</span>
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            value={draft.video_url ?? ""}
            onChange={(e) => set("video_url", e.target.value)}
          />
        </label>

        <label className="grid gap-1 md:col-span-2">
          <span className="text-sm font-medium">Tags (comma-separated)</span>
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            placeholder="e.g. solo, flute, 2024"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onBlur={() =>
              set(
                "tags",
                tagInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean) as any
              )
            }
          />
        </label>

        <label className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            checked={draft.is_published}
            onChange={(e) => set("is_published", e.target.checked)}
          />
          <span className="text-sm">Published (visible on public Works page)</span>
        </label>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={submit}
          disabled={busy}
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl border px-4 py-2 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}