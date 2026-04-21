import ContactForm from "@/components/ContactForm";
import FadeIn from "@/components/FadeIn";

export default function ContactPage() {
  return (
    <div className="grid gap-6 max-w-xl mx-auto w-full">
      <FadeIn>
        <header>
          <h1 className="text-5xl font-semibold tracking-loose">Contact</h1>
        </header>
      </FadeIn>
      <FadeIn delay={150}>
        <ContactForm />
      </FadeIn>
    </div>
  );
}
