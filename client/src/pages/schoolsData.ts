import type { img } from "@/lib/images";

export type ImageKey = keyof typeof img;

export const facilities = [
  "Science labs",
  "Computer lab",
  "Library",
  "Swimming pool",
  "Sports fields",
  "Music & art studios",
  "Boarding houses",
  "School bus",
  "Special needs support",
] as const;

export type Facility = (typeof facilities)[number];

export type SchoolRecord = {
  slug: string;
  name: string;
  town: string;
  county: string;
  image: ImageKey;
  type: "Private" | "Public" | "International";
  gender: "Mixed" | "Girls" | "Boys";
  mode: "Day" | "Boarding" | "Day & Boarding";
  curriculum: string;
  levels: string;
  established: number;
  learners: number;
  fees: { tuition: number; boarding: number | null; transport: number | null; admission: number };
  classSize: number;
  ratio: string;
  languages: string[];
  seniorOffer: string;
  facilities: Facility[];
  admissions: { status: "Open" | "Closing soon" | "Waitlist"; closes: string; assessment: string; openDay: string };
  rating: number;
  reviews: number;
  quote: string;
  claim: "unclaimed" | "claimed";
};

export const schools: SchoolRecord[] = [
  {
    slug: "greenfield-academy",
    name: "Greenfield Academy",
    town: "Ruiru",
    county: "Kiambu",
    image: "campus",
    type: "Private",
    gender: "Mixed",
    mode: "Day & Boarding",
    curriculum: "CBC",
    levels: "Primary · JSS",
    established: 2008,
    learners: 640,
    fees: { tuition: 85000, boarding: 25000, transport: 12000, admission: 15000 },
    classSize: 24,
    ratio: "1 : 16",
    languages: ["English", "Kiswahili", "French"],
    seniorOffer: "Not offered (ends at Grade 9)",
    facilities: ["Science labs", "Computer lab", "Library", "Swimming pool", "Sports fields", "Music & art studios", "Boarding houses", "School bus"],
    admissions: { status: "Open", closes: "30 Nov 2026", assessment: "Grade-level assessment + family interview", openDay: "Sat 17 Oct 2026" },
    rating: 4.8,
    reviews: 32,
    quote: "Teachers actually know my son, and the weekly updates mean I'm never guessing.",
    claim: "unclaimed",
  },
  {
    slug: "kiambu-hills-school",
    name: "Kiambu Hills School",
    town: "Limuru",
    county: "Kiambu",
    image: "sports",
    type: "Private",
    gender: "Mixed",
    mode: "Day",
    curriculum: "CBC",
    levels: "Pre-primary · Primary",
    established: 2013,
    learners: 410,
    fees: { tuition: 48000, boarding: null, transport: 9500, admission: 10000 },
    classSize: 22,
    ratio: "1 : 15",
    languages: ["English", "Kiswahili"],
    seniorOffer: "Not offered (ends at Grade 6)",
    facilities: ["Computer lab", "Library", "Sports fields", "Music & art studios", "School bus", "Special needs support"],
    admissions: { status: "Open", closes: "15 Dec 2026", assessment: "Play-based readiness session", openDay: "Sat 24 Oct 2026" },
    rating: 4.5,
    reviews: 18,
    quote: "Small, calm and outdoorsy. Our daughter settled in within a week.",
    claim: "unclaimed",
  },
  {
    slug: "st-hannahs-academy",
    name: "St. Hannah's Academy",
    town: "Thika",
    county: "Kiambu",
    image: "courtyard",
    type: "Private",
    gender: "Girls",
    mode: "Boarding",
    curriculum: "CBC",
    levels: "JSS · Senior School",
    established: 1998,
    learners: 820,
    fees: { tuition: 50000, boarding: 22000, transport: null, admission: 18000 },
    classSize: 32,
    ratio: "1 : 19",
    languages: ["English", "Kiswahili", "German"],
    seniorOffer: "STEM · Social Sciences · Arts & Sports Science",
    facilities: ["Science labs", "Computer lab", "Library", "Sports fields", "Music & art studios", "Boarding houses"],
    admissions: { status: "Closing soon", closes: "10 Oct 2026", assessment: "Written assessment + interview", openDay: "Sat 03 Oct 2026" },
    rating: 4.6,
    reviews: 24,
    quote: "Structured without being harsh. The boarding mistresses are wonderful.",
    claim: "claimed",
  },
  {
    slug: "amani-girls-high",
    name: "Amani Girls High",
    town: "Kisumu",
    county: "Kisumu",
    image: "courtyard",
    type: "Private",
    gender: "Girls",
    mode: "Boarding",
    curriculum: "CBC",
    levels: "Senior School",
    established: 2004,
    learners: 560,
    fees: { tuition: 44000, boarding: 18000, transport: null, admission: 12000 },
    classSize: 35,
    ratio: "1 : 21",
    languages: ["English", "Kiswahili", "French"],
    seniorOffer: "STEM · Social Sciences",
    facilities: ["Science labs", "Computer lab", "Library", "Sports fields", "Boarding houses"],
    admissions: { status: "Open", closes: "20 Jan 2027", assessment: "Grade 9 results + interview", openDay: "Sat 07 Nov 2026" },
    rating: 4.6,
    reviews: 21,
    quote: "Strong in the sciences, and they push the girls to lead.",
    claim: "unclaimed",
  },
  {
    slug: "jacaranda-international",
    name: "Jacaranda International School",
    town: "Runda",
    county: "Nairobi",
    image: "classroom",
    type: "International",
    gender: "Mixed",
    mode: "Day",
    curriculum: "British (Cambridge)",
    levels: "Primary · IGCSE · A-Level",
    established: 2011,
    learners: 530,
    fees: { tuition: 215000, boarding: null, transport: 22000, admission: 50000 },
    classSize: 18,
    ratio: "1 : 10",
    languages: ["English", "Kiswahili", "French", "Mandarin"],
    seniorOffer: "A-Level: Sciences, Humanities, Arts",
    facilities: ["Science labs", "Computer lab", "Library", "Swimming pool", "Sports fields", "Music & art studios", "School bus", "Special needs support"],
    admissions: { status: "Waitlist", closes: "Rolling", assessment: "Cambridge entrance test + interview", openDay: "By appointment" },
    rating: 4.7,
    reviews: 41,
    quote: "Expensive, but the learning support team changed everything for us.",
    claim: "claimed",
  },
  {
    slug: "nyali-coast-academy",
    name: "Nyali Coast Academy",
    town: "Nyali",
    county: "Mombasa",
    image: "sports",
    type: "Private",
    gender: "Mixed",
    mode: "Day & Boarding",
    curriculum: "CBC",
    levels: "Primary · JSS · Senior School",
    established: 2001,
    learners: 910,
    fees: { tuition: 58000, boarding: 21000, transport: 8000, admission: 12000 },
    classSize: 30,
    ratio: "1 : 20",
    languages: ["English", "Kiswahili", "Arabic", "French"],
    seniorOffer: "STEM · Social Sciences · Arts & Sports Science",
    facilities: ["Science labs", "Computer lab", "Library", "Swimming pool", "Sports fields", "Boarding houses", "School bus"],
    admissions: { status: "Open", closes: "05 Dec 2026", assessment: "Entry assessment (Grades 4 and up)", openDay: "Sat 31 Oct 2026" },
    rating: 4.4,
    reviews: 27,
    quote: "Great sports and swimming. Fees are clear, with no surprises mid-term.",
    claim: "unclaimed",
  },
];

export function findSchool(slug: string | null | undefined) {
  return schools.find((school) => school.slug === slug);
}

// Every card in this prototype links to the one fully built profile page.
export const profileHref = "/schools/greenfield-academy";

export function formatKes(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function formatKesShort(amount: number) {
  return `KES ${Math.round(amount / 1000)}k`;
}

// Three terms of tuition (plus boarding where it's compulsory) and the one-off admission fee.
export function firstYearCost(school: SchoolRecord) {
  const requiredBoarding = school.mode === "Boarding" ? school.fees.boarding ?? 0 : 0;
  return 3 * (school.fees.tuition + requiredBoarding) + school.fees.admission;
}
