export type JobTier = "Standard" | "Featured";
export type JobStatus = "Active" | "Expired" | "Draft";

export type JobListing = {
  id: string;
  school: string;
  schoolSlug: string | null;
  location: string;
  county: string;
  title: string;
  role: "Teacher" | "Coach" | "Support staff" | "Leadership";
  subject: string;
  level: string;
  type: "Full-time" | "Part-time" | "Contract";
  salary: string;
  postedOn: string;
  deadline: string;
  tier: JobTier;
  status: JobStatus;
  applicants: number;
  description: string;
  requirements: string[];
};

export const jobListings: JobListing[] = [
  {
    id: "job-1",
    school: "Greenfield Academy",
    schoolSlug: "greenfield-academy",
    location: "Ruiru, Kiambu",
    county: "Kiambu",
    title: "Senior School Mathematics Teacher",
    role: "Teacher",
    subject: "Mathematics",
    level: "Senior School",
    type: "Full-time",
    salary: "KES 65,000 – 85,000 / month",
    postedOn: "18 Sep 2026",
    deadline: "10 Oct 2026",
    tier: "Featured",
    status: "Active",
    applicants: 14,
    description: "We're growing our STEM pathway ahead of the 2027 Grade 10 intake and need an experienced Mathematics teacher who can also support our computer studies club.",
    requirements: ["TSC registered", "Bachelor's degree in Mathematics or Education", "3+ years teaching CBC senior school", "Experience mentoring for the STEM pathway is an advantage"],
  },
  {
    id: "job-2",
    school: "Greenfield Academy",
    schoolSlug: "greenfield-academy",
    location: "Ruiru, Kiambu",
    county: "Kiambu",
    title: "Football & Athletics Coach",
    role: "Coach",
    subject: "Sports Science",
    level: "All levels",
    type: "Part-time",
    salary: "KES 25,000 – 35,000 / month",
    postedOn: "12 Sep 2026",
    deadline: "05 Oct 2026",
    tier: "Standard",
    status: "Active",
    applicants: 6,
    description: "Lead after-school football training and represent Greenfield at county athletics meets. Afternoons only, three days a week.",
    requirements: ["Certified coaching qualification", "First aid certificate", "Available weekday afternoons"],
  },
  {
    id: "job-3",
    school: "Greenfield Academy",
    schoolSlug: "greenfield-academy",
    location: "Ruiru, Kiambu",
    county: "Kiambu",
    title: "Junior Secondary English Teacher",
    role: "Teacher",
    subject: "English",
    level: "Junior Secondary",
    type: "Full-time",
    salary: "KES 55,000 – 70,000 / month",
    postedOn: "02 Sep 2026",
    deadline: "20 Sep 2026",
    tier: "Standard",
    status: "Expired",
    applicants: 21,
    description: "Cover English and literature for JSS 1–3, with room to run the debate club.",
    requirements: ["TSC registered", "Bachelor's degree in English or Education", "2+ years teaching experience"],
  },
  {
    id: "job-4",
    school: "Amani Girls High",
    schoolSlug: null,
    location: "Kisumu, Kisumu",
    county: "Kisumu",
    title: "Performing Arts & Music Teacher",
    role: "Teacher",
    subject: "Music",
    level: "Senior School",
    type: "Full-time",
    salary: "KES 60,000 – 78,000 / month",
    postedOn: "20 Sep 2026",
    deadline: "15 Oct 2026",
    tier: "Featured",
    status: "Active",
    applicants: 9,
    description: "Build out our Arts & Sports Science pathway offering — choir, instrumental music and the termly showcase.",
    requirements: ["TSC registered", "Diploma or degree in Music or Performing Arts", "Experience directing a school choir or ensemble"],
  },
  {
    id: "job-5",
    school: "Amani Girls High",
    schoolSlug: null,
    location: "Kisumu, Kisumu",
    county: "Kisumu",
    title: "School Nurse",
    role: "Support staff",
    subject: "Health & welfare",
    level: "All levels",
    type: "Full-time",
    salary: "KES 45,000 – 55,000 / month",
    postedOn: "15 Sep 2026",
    deadline: "01 Oct 2026",
    tier: "Standard",
    status: "Active",
    applicants: 11,
    description: "Run the sick bay for our boarding school of 480 girls, with an on-call rota shared with two other staff.",
    requirements: ["Registered nurse (KRCHN)", "Boarding school or clinic experience preferred", "Willing to live on campus"],
  },
  {
    id: "job-6",
    school: "Kiambu Hills School",
    schoolSlug: null,
    location: "Limuru, Kiambu",
    county: "Kiambu",
    title: "Head of Business Studies",
    role: "Leadership",
    subject: "Business Studies",
    level: "Senior School",
    type: "Full-time",
    salary: "Competitive, based on experience",
    postedOn: "22 Sep 2026",
    deadline: "20 Oct 2026",
    tier: "Standard",
    status: "Active",
    applicants: 4,
    description: "Lead our Social Sciences pathway's business studies department, including timetabling, mock interviews and our young-entrepreneurs club.",
    requirements: ["TSC registered", "5+ years teaching, 2+ in a leadership role", "CBC senior school experience"],
  },
  {
    id: "job-7",
    school: "Kiambu Hills School",
    schoolSlug: null,
    location: "Limuru, Kiambu",
    county: "Kiambu",
    title: "Debate & Public Speaking Coach",
    role: "Coach",
    subject: "Languages & Humanities",
    level: "Junior Secondary",
    type: "Part-time",
    salary: "KES 18,000 – 24,000 / month",
    postedOn: "08 Sep 2026",
    deadline: "28 Sep 2026",
    tier: "Standard",
    status: "Draft",
    applicants: 0,
    description: "Run our Tuesday and Thursday debate club and prepare the team for the county schools tournament.",
    requirements: ["Experience coaching debate or public speaking", "Available two afternoons a week"],
  },
];
