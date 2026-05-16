import type { Metadata } from "next";
import LegalPageShell from "@/components/marketing/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service — DearGynac",
  description:
    "Terms governing use of the DearGynac telemedicine platform in India, including eligibility, telehealth limits, and governing law.",
};

const UPDATED = "15 May 2026";

export default function TermsOfServicePage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated={UPDATED}>
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">1. Agreement</h2>
        <p>
          By accessing or using DearGynac&apos;s website, app, or services (&quot;Platform&quot;), you agree
          to these Terms of Service and our Privacy Policy. If you do not agree, do not use the Platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">2. Nature of the service</h2>
        <p>
          DearGynac facilitates <strong>telemedicine consultations</strong> with registered medical practitioners
          in India. The Platform is not a substitute for in-person emergency care, physical examination when
          required, or hospital treatment.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">3. Not for emergencies</h2>
        <p>
          If you have a medical emergency, call <strong>112</strong> or your local emergency services, or go to
          the nearest hospital. Do not rely on the Platform for urgent or life-threatening conditions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">4. Eligibility &amp; accounts</h2>
        <p>
          You must be at least <strong>18 years</strong> old to create an account, or use the Platform through a
          parent or legal guardian as applicable law allows. You agree to provide accurate information and to
          keep login credentials confidential. You are responsible for activity under your account.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">5. Clinical responsibility</h2>
        <p>
          Licensed clinicians are responsible for clinical decisions made during consultations, subject to
          National Medical Commission (&quot;NMC&quot;) telemedicine and professional conduct rules. DearGynac
          provides technology and operations support and does not practise medicine itself.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">6. Payments</h2>
        <p>
          Consultation fees, refunds, and promotional pricing (including complimentary first consultations where
          offered) are as displayed at booking or in separate notices. Payment partners may have their own terms
          when online payments are enabled.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">7. Acceptable use</h2>
        <p>
          You will not misuse the Platform (for example: harassment, impersonation, scraping, introducing
          malware, or circumventing security). We may suspend or terminate access for breach or risk to other
          users.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">8. Intellectual property</h2>
        <p>
          DearGynac name, logo, UI, and content we create are protected by applicable intellectual property laws.
          You receive a limited, non-exclusive licence to use the Platform for personal, non-commercial health
          purposes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">9. Limitation of liability</h2>
        <p>
          To the <strong>maximum extent permitted by applicable law in India</strong> (including the Consumer
          Protection Act, 2019, where it applies), DearGynac and its affiliates are not liable for indirect,
          incidental, or consequential damages arising from use of the Platform. Nothing in these terms excludes
          liability that cannot legally be excluded.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">10. Governing law &amp; disputes</h2>
        <p>
          These Terms are governed by the laws of <strong>India</strong>. Courts at{" "}
          <strong>Pune, Maharashtra</strong> shall have exclusive jurisdiction, subject to any mandatory
          consumer protections where you reside.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">11. Contact</h2>
        <p>
          Questions about these Terms: <strong className="text-[#3D3438]">hello@deargynac.com</strong>
        </p>
      </section>

      <p className="text-xs text-gray-500 pt-4 border-t border-rose-100">
        Have qualified legal counsel review these Terms for your regulated launch.
      </p>
    </LegalPageShell>
  );
}
