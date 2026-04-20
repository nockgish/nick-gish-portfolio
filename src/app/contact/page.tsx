import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="grid gap-6 max-w-xl">
      <header>
        <h1 className="text-5xl font-semibold tracking-loose">Contact</h1>
      </header>
      <p className="text-white/80 contact_intro mt-8 mb-8" style={{ fontFamily: "var(--font-paracopy)" }}>
        For commission inquiries, performance/score and parts requests, or if you just want to get in touch.
      </p>
      <ContactForm />
    </div>
  );
}
