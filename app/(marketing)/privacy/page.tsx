import type { Metadata } from "next";
import LegalPageShell from "@/components/marketing/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy — DearGynac",
  description:
    "How DearGynac collects, uses, stores, and protects personal data in India, including compliance with the Digital Personal Data Protection Act, 2023.",
};

const UPDATED = "15 May 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated={UPDATED}>
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">1. Who we are</h2>
        <p>
          DearGynac (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates a women&apos;s health telemedicine
          platform in India. For the purposes of the Digital Personal Data Protection Act, 2023
          (&quot;DPDP Act&quot;), we act as a <strong>Data Fiduciary</strong> in respect of digital personal
          data processed through this website and our services.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">2. What data we collect</h2>
        <p>Depending on how you use DearGynac, we may process:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Identity &amp; contact data</strong> — e.g. name, phone number, email, and where you
            choose it, an anonymous alias.
          </li>
          <li>
            <strong>Health &amp; consultation data</strong> — symptoms, intake answers, messages, prescriptions,
            and related clinical information you or your doctor add to the platform.
          </li>
          <li>
            <strong>Technical &amp; usage data</strong> — e.g. device/browser type, IP address, logs, and
            cookies strictly needed for security and core functionality.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">3. Why we use your data</h2>
        <p>We process personal data only for clear purposes, including to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>provide consultations, prescriptions, and account features you request;</li>
          <li>verify doctors, meet regulatory and audit expectations, and defend legal claims;</li>
          <li>improve security, prevent fraud, and comply with court or government orders where the law requires.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">4. Legal basis (India)</h2>
        <p>
          We process digital personal data in line with the <strong>DPDP Act</strong>, including where we rely
          on <strong>your consent</strong> (e.g. signing up, starting a consult) and where the law allows
          processing for legitimate uses compatible with the Act. You may withdraw consent for non-essential
          processing where applicable; some processing may still be required by law or to complete care you
          have already requested.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">5. We do not sell your data</h2>
        <p>
          DearGynac <strong>does not sell</strong> your personal data or health information to data brokers,
          advertisers, or third parties for their independent marketing. We do not monetise patient medical
          records. Any sharing is limited to what is needed to run the service (for example, the consulting
          doctor, hosting or email providers bound by confidentiality) or what the law compels us to disclose.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">6. Storage, transfers &amp; security</h2>
        <p>
          Data is stored using reputable cloud infrastructure with access controls and encryption in transit
          where supported. If personal data is processed outside India, we do so only where permitted under
          the DPDP Act and applicable notifications, and with appropriate safeguards as required by law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">7. How long we keep data</h2>
        <p>
          We retain personal and health-related information <strong>while your account is active</strong> and
          for a <strong>minimum of three (3) years</strong> after your last consultation or account closure
          (whichever is later), unless a longer period is required for medical records, litigation, or
          regulatory obligations under Indian law. When retention ends, we delete or irreversibly anonymise
          data where the law allows.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">8. Your rights</h2>
        <p>
          Subject to the DPDP Act and rules, you may request access, correction, or erasure of your personal
          data, withdraw consent for processing that is consent-based, and seek information about significant
          processors we use. We will respond within timelines prescribed under law once those rules are fully
          operational, and in the interim within a reasonable period (typically 30 days).
        </p>
      </section>

      <section id="grievance" className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">9. Grievance officer</h2>
        <p>
          For privacy questions or complaints under Indian law, contact:{" "}
          <strong className="text-[#3D3438]">hello@deargynac.com</strong>. Please include your registered phone
          or email and a short description of the issue. We will acknowledge receipt and work with you in good
          faith to resolve concerns.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#3D3438] font-serif">10. Changes</h2>
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top will
          change when we do; material changes will be highlighted on the platform where practicable.
        </p>
      </section>

      <p className="text-xs text-gray-500 pt-4 border-t border-rose-100">
        This policy is provided for transparency. It does not constitute legal advice; have qualified counsel
        review it for your operational setup.
      </p>
    </LegalPageShell>
  );
}
