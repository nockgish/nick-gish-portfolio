"use client";

console.log("SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);


import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Work } from "@/components/WorkCard";
import AdminWorkForm, { WorkDraft } from "@/components/AdminWorkForm";

function allowedEmail(email: string | null | undefined) {
  if (!email) return false;
  const allow = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allow.includes(email.toLowerCase());
}

export default function AdminPage() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<WorkDraft | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMsg, setAuthMsg] = useState<string | null>(null);

  const canEdit = useMemo(() => allowedEmail(sessionEmail), [sessionEmail]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("year", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error && data) setWorks(data as Work[]);
    setLoading(false);
  }

  useEffect(() => {
    if (sessionEmail) refresh();
  }, [sessionEmail]);

  async function doAuth() {
  setAuthMsg(null);

  if (authMode === "login") {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthMsg(error.message);
    return;
  }

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    setAuthMsg(error.message);
    return;
  }

  setAuthMsg("Check your email to confirm your account (if confirmations are enabled).");
}


  async function signOut() {
    await supabase.auth.signOut();
    setWorks([]);
    setForm(null);
  }

  async function saveWork(draft: WorkDraft) {
    if (!canEdit) throw new Error("Not authorized.");

    const payload = {
  title: draft.title,
  year: draft.year,
  instrumentation: draft.instrumentation || null,
  duration: draft.duration || null,
  description: draft.description || null,
  premiere: draft.premiere || null,
  pdf_url: draft.pdf_url || null,
  audio_url: draft.audio_url || null,
  video_url: draft.video_url || null,
  score_cover_url: draft.score_cover_url ? draft.score_cover_url : null,
  category: draft.category ?? "solo",
  tags: draft.tags ?? [],
  sort_order: draft.sort_order ?? 0,
  is_published: !!draft.is_published,
};

    if (draft.id) {
      const { error } = await supabase.from("works").update(payload).eq("id", draft.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("works").insert(payload);
      if (error) throw error;
    }

    await refresh();
  }

  async function deleteWork(id: string) {
    if (!canEdit) return;
    const ok = confirm("Delete this work? This cannot be undone.");
    if (!ok) return;

    const { error } = await supabase.from("works").delete().eq("id", id);
    if (error) alert(error.message);
    await refresh();
  }

  if (!sessionEmail) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="mt-2 text-sm text-black/70">Sign in to update your catalog.</p>

        <div className="mt-4 flex gap-2 text-sm">
          <button
            className={`rounded-xl border px-3 py-2 ${authMode === "login" ? "bg-black text-white" : "bg-white"}`}
            onClick={() => setAuthMode("login")}
          >
            Log in
          </button>
          <button
            className={`rounded-xl border px-3 py-2 ${authMode === "signup" ? "bg-black text-white" : "bg-white"}`}
            onClick={() => setAuthMode("signup")}
          >
            Sign up
          </button>
        </div>

        {authMsg ? <p className="mt-3 text-sm text-red-600">{authMsg}</p> : null}

        <div className="mt-4 grid gap-3">
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={doAuth}
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
          >
            {authMode === "login" ? "Log in" : "Create account"}
          </button>
        </div>

        <p className="mt-4 text-xs text-black/60">
          Only allowlisted emails can edit (NEXT_PUBLIC_ADMIN_EMAILS).
        </p>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="mt-2 text-sm text-black/70">
          Signed in as <span className="font-semibold">{sessionEmail}</span>, but this email is not allowlisted.
        </p>
        <button className="mt-4 rounded-xl border px-4 py-2 text-sm" onClick={signOut}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="text-sm text-black/70">Signed in as {sessionEmail}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
            onClick={() => setForm({ title: "", year: null, instrumentation: "", duration: "", description: "", premiere: "", pdf_url: "", audio_url: "", video_url: "", tags: [], sort_order: 0, is_published: true })}
          >
            New work
          </button>
          <button className="rounded-xl border px-4 py-2 text-sm" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {form ? <AdminWorkForm initial={form} onSave={saveWork} onCancel={() => setForm(null)} /> : null}

      <section className="grid gap-3">
        <h2 className="text-base font-semibold">All works</h2>
        {loading ? (
          <p className="text-sm text-black/70">Loading…</p>
        ) : works.length ? (
          <div className="grid gap-3">
            {works.map((w) => (
              <div key={w.id} className="flex flex-col gap-2 rounded-2xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{w.title}</span>
                    {!w.is_published ? (
                      <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs text-black/70">Draft</span>
                    ) : null}
                  </div>
                  <div className="text-sm text-black/60">
                    {[w.year ?? undefined, w.instrumentation ?? undefined].filter(Boolean).join(" • ")}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="rounded-xl border px-3 py-2 text-sm"
                    onClick={() => setForm({ ...w })}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-xl border px-3 py-2 text-sm"
                    onClick={() => deleteWork(w.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-black/70">No works yet. Click “New work.”</p>
        )}
      </section>
    </div>
  );
}