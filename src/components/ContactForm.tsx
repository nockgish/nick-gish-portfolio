"use client";

import { useMemo, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // Generate math problem once per form mount
  const [a, b] = useMemo(() => [randomInt(2, 12), randomInt(2, 12)], []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Honeypot check
    if (honeypot) return;

    // Math CAPTCHA check
    if (parseInt(captchaAnswer, 10) !== a + b) {
      setStatus("error");
      return;
    }

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
    <>
    <p className="text-white/80 contact_intro mt-8 mb-8" style={{ fontFamily: "var(--font-paracopy)" }}>
      For commission inquiries, performance/score and parts requests, or if you just want to get in touch.
    </p>
    <form onSubmit={handleSubmit} className="mt-2 grid gap-3">
      {/* Honeypot — hidden from humans, bots fill it in */}
      <input
        type="text"
        aria-hidden="true"
        tabIndex={-1}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0, width: 0 }}
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        autoComplete="off"
      />

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

      {/* Math CAPTCHA */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-white/80 whitespace-nowrap">
          What is {a} + {b}?
        </label>
        <input
          type="number"
          className="w-24 rounded-xl border bg-white/60 px-3 py-2 text-sm placeholder:text-black/40"
          placeholder="Answer"
          value={captchaAnswer}
          onChange={(e) => setCaptchaAnswer(e.target.value)}
          required
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-600">
          {parseInt(captchaAnswer, 10) !== a + b && captchaAnswer
            ? "Incorrect answer — please try again."
            : "Something went wrong — please try again."}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="contact-btn self-start rounded-xl bg-black px-5 py-4 text-sm font-medium text-white disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === "sending" ? "Sending…" : "Send"}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="contact-btn-arrow w-5 h-5">
          <path d="M2 9 L14 9 L14 6 L22 12 L14 18 L14 15 L2 15 Z" fill="currentColor"/>
          <path d="M2 9 L4 7 L16 7 L14 9 Z" fill="currentColor" fillOpacity="0.5"/>
          <path d="M14 6 L16 4 L22 12 L22 12 Z" fill="currentColor" fillOpacity="0.3"/>
        </svg>
      </button>
    </form>
    </>
  );
}
