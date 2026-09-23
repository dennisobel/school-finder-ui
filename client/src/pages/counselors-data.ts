export type CounselorCluster = "stem" | "social" | "arts";

export type Counselor = {
  id: string;
  name: string;
  title: string;
  photo: string;
  years: number;
  sessions: number;
  rating: number;
  specialties: string[];
  bio: string;
  slots: string[];
  /** Pathway this counselor is auto-matched to from a Pathway AI result. Omitted = general/fallback only. */
  matchCluster?: CounselorCluster;
};

export const counselors: Counselor[] = [
  {
    id: "grace-muthoni",
    name: "Grace Muthoni",
    title: "Certified Career Guidance Counselor",
    photo: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400",
    years: 9,
    sessions: 142,
    rating: 4.9,
    specialties: ["CBC pathways", "STEM guidance", "Close-call decisions"],
    bio: "Grace has guided over a thousand Grade 9 families through pathway selection and now trains other counselors on the CBC senior school framework.",
    slots: ["Today · 4:00 PM", "Tomorrow · 10:00 AM", "Tomorrow · 3:30 PM"],
    matchCluster: "stem",
  },
  {
    id: "daniel-otieno",
    name: "Daniel Otieno",
    title: "School Psychologist & Career Counselor",
    photo: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400",
    years: 6,
    sessions: 98,
    rating: 4.8,
    specialties: ["Arts & Sports Science", "Boarding transitions", "Motivation"],
    bio: "Daniel spent six years as a boarding-school psychologist before moving into independent career counseling for CBC families.",
    slots: ["Today · 5:30 PM", "Fri · 9:00 AM", "Fri · 1:00 PM"],
    matchCluster: "arts",
  },
  {
    id: "faith-wanjiru",
    name: "Faith Wanjiru",
    title: "Educational Psychologist",
    photo: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400",
    years: 12,
    sessions: 76,
    rating: 5.0,
    specialties: ["Special needs", "Junior Secondary transition", "Parent coaching"],
    bio: "Faith works with families navigating learning differences alongside pathway decisions, and co-authored streamflo's parent guide on CBC transitions.",
    slots: ["Tomorrow · 11:00 AM", "Tomorrow · 2:00 PM", "Sat · 10:00 AM"],
  },
  {
    id: "brian-kiptoo",
    name: "Brian Kiptoo",
    title: "Career Counselor & Life Coach",
    photo: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400",
    years: 7,
    sessions: 61,
    rating: 4.7,
    specialties: ["Social Sciences pathway", "University & course choice", "KUCCPS guidance"],
    bio: "Brian focuses on the years after Grade 12 as much as Grade 9 — helping families connect a pathway choice to real course and career options.",
    slots: ["Today · 6:00 PM", "Fri · 4:00 PM", "Sat · 9:30 AM"],
    matchCluster: "social",
  },
];

/** Picks the counselor best suited to a Pathway AI result, so parents get one specialist rather than a list to choose from. */
export function matchCounselor(cluster: CounselorCluster): Counselor {
  return counselors.find((c) => c.matchCluster === cluster) ?? counselors[0];
}
