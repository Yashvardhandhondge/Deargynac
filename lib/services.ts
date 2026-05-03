import type { Language } from "@/lib/translations";

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  price: number;
  featured?: boolean;
}

export interface ServiceCategory {
  id: string;
  icon: string;
  title: Record<Language, string>;
  color: string;
  bgColor: string;
  services: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "consultations",
    icon: "👩‍⚕️",
    title: {
      en: "Consultations",
      hi: "परामर्श",
      mr: "सल्लामसलत",
    },
    color: "#C2185B",
    bgColor: "#FDE8F0",
    services: [
      {
        id: "general-opd",
        title: "General Online OPD",
        desc: "Periods, discharge, pain, infections",
        price: 149,
      },
      {
        id: "second-opinion",
        title: "Second Opinion",
        desc: "Reviewing reports, surgery decisions",
        price: 299,
      },
      {
        id: "pre-surgical",
        title: "Pre-surgical Counseling",
        desc: "Before hysterectomy, myomectomy, laparoscopy",
        price: 499,
      },
      {
        id: "post-surgical",
        title: "Post-surgical Follow-up",
        desc: "Online wound/recovery monitoring",
        price: 299,
      },
      {
        id: "emergency",
        title: "Emergency Gynac Advice",
        desc: "Same-day urgent slots",
        price: 499,
      },
      {
        id: "adolescent",
        title: "Adolescent Gynac",
        desc: "First period, irregular cycles, acne in teens",
        price: 149,
      },
      {
        id: "premarital",
        title: "Pre-marital Counseling",
        desc: "Sexual health, contraception, screening",
        price: 299,
      },
    ],
  },
  {
    id: "hormone-health",
    icon: "🔄",
    title: {
      en: "Hormone & Cycle Health",
      hi: "हार्मोन स्वास्थ्य",
      mr: "हार्मोन आरोग्य",
    },
    color: "#7C3AED",
    bgColor: "#EDE9FE",
    services: [
      {
        id: "pcos-reversal",
        title: "PCOS Reversal Program",
        desc: "Flagship 3 or 6 month program",
        price: 2999,
        featured: true,
      },
      {
        id: "thyroid-gynac",
        title: "Thyroid + Gynac Combined Care",
        desc: "Integrated hormonal care",
        price: 499,
      },
      {
        id: "pms-pmdd",
        title: "PMS / PMDD Management",
        desc: "Premenstrual syndrome treatment",
        price: 299,
      },
      {
        id: "irregular-cycle",
        title: "Irregular Cycle Correction",
        desc: "Restore natural cycle rhythm",
        price: 499,
      },
      {
        id: "ovulation",
        title: "Ovulation Induction Guidance",
        desc: "Natural ovulation support",
        price: 699,
      },
      {
        id: "insulin-resistance",
        title: "Insulin Resistance Management",
        desc: "Metabolic hormonal balance",
        price: 499,
      },
      {
        id: "hormonal-acne",
        title: "Hormonal Acne & Hair Loss",
        desc: "Skin and hair hormone clinic",
        price: 299,
      },
    ],
  },
  {
    id: "fertility-pregnancy",
    icon: "🤰",
    title: {
      en: "Fertility & Pregnancy",
      hi: "प्रजनन और गर्भावस्था",
      mr: "प्रजनन आणि गर्भधारणा",
    },
    color: "#0D9488",
    bgColor: "#CCFBF1",
    services: [
      {
        id: "preconception",
        title: "Pre-conception Planning",
        desc: "Before trying to conceive",
        price: 499,
      },
      {
        id: "fertility-opt",
        title: "Fertility Optimization",
        desc: "Natural + integrative approach",
        price: 999,
      },
      {
        id: "ivf-prep",
        title: "IVF/IUI Preparation Support",
        desc: "Alongside fertility clinic",
        price: 699,
      },
      {
        id: "antenatal",
        title: "Antenatal Wellness",
        desc: "Ayurvedic Garbhasanskar",
        price: 499,
      },
      {
        id: "rpl",
        title: "Recurrent Pregnancy Loss",
        desc: "Counseling and support",
        price: 699,
      },
      {
        id: "pcos-fertility",
        title: "PCOS + Fertility Combo",
        desc: "Combined program",
        price: 1499,
      },
      {
        id: "postpartum",
        title: "Postpartum Recovery",
        desc: "Physical + hormonal + mental",
        price: 499,
      },
    ],
  },
  {
    id: "ayurvedic",
    icon: "🌿",
    title: {
      en: "Integrative & Ayurvedic",
      hi: "आयुर्वेदिक स्त्री रोग",
      mr: "आयुर्वेदिक स्त्री रोग",
    },
    color: "#16A34A",
    bgColor: "#DCFCE7",
    services: [
      {
        id: "prakriti",
        title: "Prakriti-based Assessment",
        desc: "Menstrual health by body type",
        price: 499,
      },
      {
        id: "herbal",
        title: "Herbal Supplement Protocols",
        desc: "Customized formulations",
        price: 699,
      },
      {
        id: "fertility-rituals",
        title: "Ayurvedic Fertility Rituals",
        desc: "Rutucharya, Garbhadhan Sanskar",
        price: 999,
      },
      {
        id: "panchakarma",
        title: "Panchakarma Referral",
        desc: "Coordination and guidance",
        price: 299,
      },
      {
        id: "dinacharya",
        title: "Dinacharya for Hormones",
        desc: "Daily routine for hormonal health",
        price: 299,
      },
    ],
  },
  {
    id: "programs",
    icon: "🧬",
    title: {
      en: "Specialized Programs",
      hi: "विशेष कार्यक्रम",
      mr: "विशेष कार्यक्रम",
    },
    color: "#DC2626",
    bgColor: "#FEE2E2",
    services: [
      {
        id: "pcos-program",
        title: "PCOS Reversal Program",
        desc: "3 or 6 months structured",
        price: 2999,
        featured: true,
      },
      {
        id: "endo-program",
        title: "Endometriosis Management",
        desc: "Integrative pain management",
        price: 1999,
      },
      {
        id: "perimenopause",
        title: "Perimenopause Program",
        desc: "40+ women transition",
        price: 1499,
      },
      {
        id: "menopause",
        title: "Menopause Wellness",
        desc: "HRT + Ayurvedic support",
        price: 1999,
      },
      {
        id: "fibroids",
        title: "Fibroids Watch & Shrink",
        desc: "Non-surgical management",
        price: 1499,
      },
      {
        id: "infections-clinic",
        title: "Recurrent Infections Clinic",
        desc: "UTI, BV, candida cycle breaking",
        price: 999,
      },
      {
        id: "weight-hormones",
        title: "Weight + Hormones Reset",
        desc: "PCOS/thyroid/metabolic",
        price: 1499,
      },
    ],
  },
  {
    id: "reports",
    icon: "📋",
    title: {
      en: "Reports & Testing",
      hi: "रिपोर्ट और परीक्षण",
      mr: "अहवाल आणि चाचणी",
    },
    color: "#D97706",
    bgColor: "#FEF3C7",
    services: [
      {
        id: "hormone-panel",
        title: "Hormone Panel Interpretation",
        desc: "Upload & get explained",
        price: 299,
      },
      {
        id: "scan-review",
        title: "Ultrasound / Scan Review",
        desc: "Expert radiology review",
        price: 499,
      },
      {
        id: "pap-smear",
        title: "Pap Smear Guidance",
        desc: "Reporting explanation",
        price: 199,
      },
      {
        id: "amh",
        title: "AMH & Ovarian Reserve",
        desc: "Fertility potential counseling",
        price: 399,
      },
      {
        id: "lab-reco",
        title: "Lab Test Recommendations",
        desc: "Customized test list",
        price: 199,
      },
    ],
  },
  {
    id: "mental-sexual",
    icon: "🧠",
    title: {
      en: "Mental & Sexual Health",
      hi: "मानसिक और यौन स्वास्थ्य",
      mr: "मानसिक आणि लैंगिक आरोग्य",
    },
    color: "#7C3AED",
    bgColor: "#EDE9FE",
    services: [
      {
        id: "gynac-mental",
        title: "Gynac + Mental Health",
        desc: "Anxiety with hormones",
        price: 499,
      },
      {
        id: "libido",
        title: "Low Libido & Sexual Wellness",
        desc: "Sexual health clinic",
        price: 499,
      },
      {
        id: "vaginismus",
        title: "Vaginismus Support",
        desc: "Painful intercourse treatment",
        price: 499,
      },
      {
        id: "body-image",
        title: "Body Image & PCOS Healing",
        desc: "Emotional healing program",
        price: 299,
      },
      {
        id: "ppd",
        title: "Postpartum Depression",
        desc: "Gynac-side support",
        price: 399,
      },
    ],
  },
];

export function categoryTitle(cat: ServiceCategory, lang: Language): string {
  return cat.title[lang] ?? cat.title.en;
}
