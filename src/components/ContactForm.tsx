"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, subject, role, message }),
      });

      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="thank_you_text mt-20 text-sm text-black/70">
        Thank you for reaching out! I'll reply to you as soon as I can.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          className="rounded-xl border bg-white/60 px-3 py-2 text-sm placeholder:text-black/40"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          className="rounded-xl border bg-white/60 px-3 py-2 text-sm placeholder:text-black/40"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <input
        type="email"
        className="rounded-xl border bg-white/60 px-3 py-2 text-sm placeholder:text-black/40"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="rounded-xl border bg-white/60 px-3 py-2 text-sm placeholder:text-black/40"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <select
        className="rounded-xl border bg-white/60 px-3 py-2 text-sm"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        <option value="" disabled>What best describes your role in music?</option>
        <option value="Instrumentalist">Instrumentalist</option>
        <option value="Singer">Singer</option>
        <option value="Composer">Composer</option>
        <option value="Conductor">Conductor</option>
        <option value="Arts Administrator">Arts Administrator</option>
      </select>
      <textarea
        className="rounded-xl border bg-white/60 px-3 py-2 text-sm placeholder:text-black/40 resize-none"
        placeholder="Message"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      {status === "error" && (
        <p className="text-xs text-red-600">Something went wrong — please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="contact-btn self-start rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
