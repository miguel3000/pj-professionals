import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function WlzZorg() {
  return (
    <>
      <PageHero
        badge="WLZ"
        title="Wet langdurige zorg"
        subtitle="Informatie over onze WLZ volgt binnenkort."
        image="/images/wlz.jpg"
      />
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Wij werken aan een uitgebreide beschrijving van onze WLZ.
            Heeft u nu al vragen? Neem gerust contact met ons op.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-teal-dark text-white font-semibold rounded-xl hover:bg-teal-dark/90 transition-all"
          >
            Contact opnemen
          </Link>
        </div>
      </section>
    </>
  );
}
