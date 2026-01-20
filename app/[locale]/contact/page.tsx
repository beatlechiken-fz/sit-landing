"use client";

import AppBar from "@/core/components/app-bar/AppBar";
import FooterBar from "@/core/components/footer-bar/FooterBar";
import ContactHero from "@/modules/contact/presentation/components/ContactHero";
import ContactSocials from "@/modules/contact/presentation/components/ContactSocials";
import ContactForm from "@/modules/contact/presentation/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden">
      <AppBar />

      <section className="relative flex justify-center pt-28">
        <ContactHero />
      </section>

      <section className="relative flex justify-center py-24">
        <div className="w-[90%] max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16">
          <ContactSocials />
          <ContactForm />
        </div>
      </section>

      <FooterBar />
    </main>
  );
}
