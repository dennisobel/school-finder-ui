export type EnquiryStatus = "New" | "Responded" | "Closed";
export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: EnquiryStatus;
};

export const enquiries: Enquiry[] = [
  {
    id: "enq-1",
    name: "Sarah Mwangi",
    email: "sarah.mwangi@gmail.com",
    phone: "+254 712 445 908",
    subject: "JSS places for 2027",
    message: "Hi, I'm looking for a Junior Secondary place for my daughter starting January 2027. Do you still have day-school spots, and could you share your fee structure for that level?",
    date: "22 Sep 2026, 09:14",
    status: "New",
  },
  {
    id: "enq-2",
    name: "David Otieno",
    email: "d.otieno@outlook.com",
    phone: "+254 733 210 774",
    subject: "Boarding facilities tour",
    message: "We're relocating to Ruiru from Kisumu and would like to visit the boarding facilities before applying. Is a weekday tour possible in the next two weeks?",
    date: "21 Sep 2026, 16:40",
    status: "New",
  },
  {
    id: "enq-3",
    name: "Grace Njeri",
    email: "gracenjeri22@gmail.com",
    phone: "+254 701 558 213",
    subject: "Transport routes",
    message: "Does the school offer transport from Thika Road / Kasarani area? Trying to work out logistics before we apply.",
    date: "19 Sep 2026, 11:02",
    status: "Responded",
  },
  {
    id: "enq-4",
    name: "Peter Kamau",
    email: "peter.kamau@yahoo.com",
    phone: "+254 720 908 331",
    subject: "Scholarship enquiry",
    message: "My son has strong CBC assessment scores. Does Greenfield Academy offer any merit scholarships or fee assistance for the 2027 intake?",
    date: "16 Sep 2026, 08:27",
    status: "Responded",
  },
  {
    id: "enq-5",
    name: "Faith Achieng",
    email: "faith.achieng@gmail.com",
    phone: "+254 715 662 041",
    subject: "Special needs support",
    message: "Do you have a learning support unit for children with dyslexia? Would love to understand what support is in place before booking a visit.",
    date: "12 Sep 2026, 14:55",
    status: "Closed",
  },
];

export type ApplicationStatus = "Submitted" | "Under review" | "Offer sent" | "Accepted" | "Declined";
export type Application = {
  id: string;
  childName: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  level: string;
  intakeYear: string;
  submittedOn: string;
  status: ApplicationStatus;
  admissionFee: number;
  feeStatus: "Pending" | "Paid" | "Waived";
};

export const applications: Application[] = [
  {
    id: "app-1",
    childName: "Amani Wanjiku",
    guardianName: "Jane Wanjiku",
    guardianEmail: "jane.wanjiku@gmail.com",
    guardianPhone: "+254 722 114 908",
    level: "Grade 5",
    intakeYear: "2027",
    submittedOn: "20 Sep 2026",
    status: "Under review",
    admissionFee: 15000,
    feeStatus: "Pending",
  },
  {
    id: "app-2",
    childName: "Liam Otieno",
    guardianName: "David Otieno",
    guardianEmail: "d.otieno@outlook.com",
    guardianPhone: "+254 733 210 774",
    level: "Grade 3",
    intakeYear: "2027",
    submittedOn: "18 Sep 2026",
    status: "Offer sent",
    admissionFee: 15000,
    feeStatus: "Pending",
  },
  {
    id: "app-3",
    childName: "Zawadi Kamau",
    guardianName: "Peter Kamau",
    guardianEmail: "peter.kamau@yahoo.com",
    guardianPhone: "+254 720 908 331",
    level: "JSS 1",
    intakeYear: "2027",
    submittedOn: "10 Sep 2026",
    status: "Accepted",
    admissionFee: 18000,
    feeStatus: "Paid",
  },
  {
    id: "app-4",
    childName: "Imani Njeri",
    guardianName: "Grace Njeri",
    guardianEmail: "gracenjeri22@gmail.com",
    guardianPhone: "+254 701 558 213",
    level: "Grade 1",
    intakeYear: "2027",
    submittedOn: "05 Sep 2026",
    status: "Accepted",
    admissionFee: 15000,
    feeStatus: "Paid",
  },
  {
    id: "app-5",
    childName: "Brian Mutua",
    guardianName: "Alice Mutua",
    guardianEmail: "alice.mutua@gmail.com",
    guardianPhone: "+254 741 220 665",
    level: "Grade 6",
    intakeYear: "2027",
    submittedOn: "02 Sep 2026",
    status: "Declined",
    admissionFee: 15000,
    feeStatus: "Waived",
  },
  {
    id: "app-6",
    childName: "Faith Achieng Jr.",
    guardianName: "Faith Achieng",
    guardianEmail: "faith.achieng@gmail.com",
    guardianPhone: "+254 715 662 041",
    level: "Grade 2",
    intakeYear: "2027",
    submittedOn: "28 Aug 2026",
    status: "Submitted",
    admissionFee: 15000,
    feeStatus: "Pending",
  },
];

export type OnboardingTask = { id: string; label: string; done: boolean };
export type Student = {
  id: string;
  name: string;
  grade: string;
  guardianName: string;
  startDate: string;
  tasks: OnboardingTask[];
};

export const students: Student[] = [
  {
    id: "stu-1",
    name: "Zawadi Kamau",
    grade: "JSS 1",
    guardianName: "Peter Kamau",
    startDate: "12 Jan 2027",
    tasks: [
      { id: "t1", label: "Admission fee paid", done: true },
      { id: "t2", label: "Uniform ordered", done: true },
      { id: "t3", label: "Medical form submitted", done: true },
      { id: "t4", label: "Birth certificate verified", done: false },
      { id: "t5", label: "Orientation day attended", done: false },
      { id: "t6", label: "Welcome pack collected", done: false },
    ],
  },
  {
    id: "stu-2",
    name: "Imani Njeri",
    grade: "Grade 1",
    guardianName: "Grace Njeri",
    startDate: "12 Jan 2027",
    tasks: [
      { id: "t1", label: "Admission fee paid", done: true },
      { id: "t2", label: "Uniform ordered", done: true },
      { id: "t3", label: "Medical form submitted", done: true },
      { id: "t4", label: "Birth certificate verified", done: true },
      { id: "t5", label: "Orientation day attended", done: true },
      { id: "t6", label: "Welcome pack collected", done: false },
    ],
  },
  {
    id: "stu-3",
    name: "Ryan Kiptoo",
    grade: "Grade 4",
    guardianName: "Esther Kiptoo",
    startDate: "12 Jan 2027",
    tasks: [
      { id: "t1", label: "Admission fee paid", done: true },
      { id: "t2", label: "Uniform ordered", done: false },
      { id: "t3", label: "Medical form submitted", done: false },
      { id: "t4", label: "Birth certificate verified", done: true },
      { id: "t5", label: "Orientation day attended", done: false },
      { id: "t6", label: "Welcome pack collected", done: false },
    ],
  },
  {
    id: "stu-4",
    name: "Naomi Wafula",
    grade: "Grade 6",
    guardianName: "Samuel Wafula",
    startDate: "12 Jan 2027",
    tasks: [
      { id: "t1", label: "Admission fee paid", done: true },
      { id: "t2", label: "Uniform ordered", done: true },
      { id: "t3", label: "Medical form submitted", done: true },
      { id: "t4", label: "Birth certificate verified", done: true },
      { id: "t5", label: "Orientation day attended", done: true },
      { id: "t6", label: "Welcome pack collected", done: true },
    ],
  },
];

export function studentProgress(student: Student) {
  const done = student.tasks.filter((t) => t.done).length;
  return Math.round((done / student.tasks.length) * 100);
}

export type DocumentAsset = { id: string; name: string; category: string; updated: string; size: string };

export const documents: DocumentAsset[] = [
  { id: "doc-1", name: "2026 Fee Structure", category: "Fees", updated: "12 Aug 2026", size: "412 KB" },
  { id: "doc-2", name: "Admissions guide", category: "Admissions", updated: "04 Jul 2026", size: "1.1 MB" },
  { id: "doc-3", name: "School prospectus", category: "Marketing", updated: "18 Jun 2026", size: "3.4 MB" },
  { id: "doc-4", name: "Extracurricular activities brochure", category: "Activities", updated: "02 Jun 2026", size: "890 KB" },
  { id: "doc-5", name: "Uniform & supplies list", category: "Onboarding", updated: "18 May 2026", size: "220 KB" },
];

export type PhotoAsset = { id: string; url: string; caption: string };

export type ActivityKind = "enquiry" | "application" | "document" | "payment" | "student";
export type ActivityItem = { id: string; kind: ActivityKind; title: string; detail: string; time: string };

export const activity: ActivityItem[] = [
  { id: "a1", kind: "enquiry", title: "New enquiry from Sarah Mwangi", detail: "JSS places for 2027", time: "2h ago" },
  { id: "a2", kind: "application", title: "Application under review", detail: "Amani Wanjiku · Grade 5", time: "5h ago" },
  { id: "a3", kind: "payment", title: "Admission fee paid", detail: "Zawadi Kamau · KES 18,000", time: "1d ago" },
  { id: "a4", kind: "document", title: "Fee structure updated", detail: "2026 Fee Structure.pdf replaced", time: "2d ago" },
  { id: "a5", kind: "student", title: "Onboarding milestone reached", detail: "Naomi Wafula completed all tasks", time: "3d ago" },
  { id: "a6", kind: "enquiry", title: "Enquiry marked responded", detail: "Grace Njeri · Transport routes", time: "4d ago" },
];
