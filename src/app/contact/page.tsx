import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="grid gap-6 max-w-xl mx-auto w-full">
      <header>
        <h1 className="text-5xl font-semibold tracking-loose">Contact</h1>
      </header>
      <ContactForm />
    </div>
  );
}
