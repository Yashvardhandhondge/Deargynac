import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DearGynac \u2014 India's Most Trusted Women's Health Platform",
  description:
    "Private, expert-led gynecology consultations. Anonymous consultations, period tracking, pregnancy care, and diagnostics. DPDP compliant, NMC verified doctors.",
  keywords:
    "gynecologist online, women health India, PCOS doctor, anonymous consultation, period tracker",
  openGraph: {
    title: "DearGynac \u2014 Your Health. Your Privacy. Our Promise.",
    description: "India\u2019s most trusted women\u2019s health ecosystem.",
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
