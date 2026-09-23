import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Building2,
  Bus,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock3,
  Download,
  FileText,
  Filter,
  Globe2,
  GraduationCap,
  Heart,
  LayoutGrid,
  LogIn,
  Mail,
  Map,
  MapPin,
  MapPinned,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  Scale,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Wallet,
  X,
} from "lucide-react";

import Admissions from "./backoffice/Admissions";
import Enquiries from "./backoffice/Enquiries";
import Jobs from "./backoffice/Jobs";
import Media from "./backoffice/Media";
import Onboarding from "./backoffice/Onboarding";
import Overview from "./backoffice/Overview";
import Profile from "./backoffice/Profile";
import ProgressReports from "./backoffice/ProgressReports";
import Promote from "./backoffice/Promote";
import { toggleCompare, useCompare } from "@/lib/compare";
import { img } from "@/lib/images";
import Careers from "./Careers";
import ClaimProfile from "./ClaimProfile";
import Compare, { CompareTray } from "./Compare";
import Counselors from "./Counselors";
import ListYourSchool from "./ListYourSchool";
import PathwayAI from "./PathwayAI";
import SchoolResources from "./SchoolResources";

const featuredSchools = [
  {
    name: "Greenfield Academy",
    location: "Ruiru, Kiambu",
    type: "Private · Mixed",
    mode: "Day & Boarding",
    curriculum: "CBC",
    fees: "KES 85k",
    admissionFee: "KES 15k",
    rating: "4.8",
    image: img.campus,
    tone: "gold",
  },
  {
    name: "Brookhouse School",
    location: "Karen, Nairobi",
    type: "Private · Mixed",
    mode: "Day",
    curriculum: "British",
    fees: "KES 180k",
    admissionFee: "KES 35k",
    rating: "4.7",
    image: img.classroom,
    tone: "green",
  },
  {
    name: "Amani Girls High",
    location: "Kisumu, Kisumu",
    type: "Private · Girls",
    mode: "Boarding",
    curriculum: "CBC",
    fees: "KES 62k",
    admissionFee: "KES 10k",
    rating: "4.6",
    image: img.courtyard,
    tone: "peach",
  },
];

const searchSchools = [
  {
    slug: "greenfield-academy",
    name: "Greenfield Academy",
    location: "Ruiru, Kiambu County",
    type: "Private",
    gender: "Mixed",
    mode: "Day & Boarding",
    curriculum: "CBC",
    level: "Primary · JSS",
    fees: "From KES 85,000 / term",
    admissionFee: "KES 15,000",
    rating: "4.8",
    reviews: "32 reviews",
    status: "Admissions open",
    image: img.campus,
  },
  {
    slug: "kiambu-hills-school",
    name: "Kiambu Hills School",
    location: "Limuru, Kiambu County",
    type: "Private",
    gender: "Mixed",
    mode: "Day",
    curriculum: "CBC",
    level: "Pre-primary · Primary",
    fees: "From KES 48,000 / term",
    admissionFee: "KES 8,000",
    rating: "4.5",
    reviews: "18 reviews",
    status: "Verified profile",
    image: img.sports,
  },
  {
    slug: "st-hannahs-academy",
    name: "St. Hannah's Academy",
    location: "Thika, Kiambu County",
    type: "Private",
    gender: "Girls",
    mode: "Boarding",
    curriculum: "CBC",
    level: "JSS · Senior secondary",
    fees: "From KES 72,000 / term",
    admissionFee: "KES 12,000",
    rating: "4.6",
    reviews: "24 reviews",
    status: "Admissions open",
    image: img.courtyard,
  },
];

function Logo() {
  return (
    <Link href="/" className="brand-mark" aria-label="streamflo home">
      <img src="/streamflo-logo.png" alt="streamflo" className="brand-logo" />
      <span>streamflo</span>
    </Link>
  );
}

export type ModalKind = "application" | "signin" | "signup" | "schoolLogin";

export function openModal(kind: ModalKind) {
  window.dispatchEvent(new CustomEvent("streamflo:modal", { detail: kind }));
}

export function ModalFrame({ title, eyebrow, onClose, children, wide = false }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className={`flow-modal ${wide ? "wide" : ""}`} role="dialog" aria-modal="true" aria-label={title}><button className="modal-close" onClick={onClose} aria-label="Close dialog"><X size={18} /></button><div className="modal-eyebrow">{eyebrow}</div><h2>{title}</h2>{children}</div></div>;
}

function ApplicationModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  if (done) return <ModalFrame title="You're on your way." eyebrow="Application saved" onClose={onClose}><div className="modal-success"><span><CircleCheck size={24} /></span><p>Your Greenfield Academy application has been saved as a draft. Create an account to return to it anytime.</p><button className="primary-action" onClick={() => { onClose(); openModal("signup"); }}>Create a free account <ArrowUpRight size={16} /></button></div></ModalFrame>;
  return <ModalFrame title="Start an application" eyebrow="Greenfield Academy · 2027 intake" onClose={onClose} wide><div className="flow-progress"><span className="active">01 <small>Child</small></span><i /><span className={step > 1 ? "active" : ""}>02 <small>Guardian</small></span><i /><span className={step > 2 ? "active" : ""}>03 <small>Review</small></span></div>{step === 1 && <div className="flow-form"><p className="modal-copy">Tell the school who you're applying for. You can save and finish this later.</p><div className="form-grid"><label>Child's full name<input placeholder="e.g. Amani Wanjiku" /></label><label>Year of entry<select defaultValue=""><option value="" disabled>Select year</option><option>2027</option><option>2028</option></select></label><label>Current level<select defaultValue=""><option value="" disabled>Select level</option><option>Grade 4</option><option>Grade 5</option><option>Grade 6</option></select></label><label>Date of birth<input type="date" /></label></div><button className="primary-action flow-next" onClick={() => setStep(2)}>Continue <ArrowRight size={16} /></button></div>}{step === 2 && <div className="flow-form"><p className="modal-copy">We'll use these details to keep you updated about the application.</p><div className="form-grid"><label>Your full name<input placeholder="e.g. Jane Wanjiku" /></label><label>Relationship<select defaultValue=""><option value="" disabled>Select relationship</option><option>Parent</option><option>Guardian</option><option>Other</option></select></label><label>Email address<input type="email" placeholder="you@example.com" /></label><label>Phone number<input placeholder="+254 7XX XXX XXX" /></label></div><div className="flow-button-row"><button className="back-button" onClick={() => setStep(1)}><ArrowLeft size={15} /> Back</button><button className="primary-action" onClick={() => setStep(3)}>Review details <ArrowRight size={16} /></button></div></div>}{step === 3 && <div className="flow-form"><p className="modal-copy">Review the basics below. Your application stays private until you submit it to the school.</p><div className="review-card"><div><small>School</small><strong>Greenfield Academy</strong></div><div><small>Intake</small><strong>2027 · Day & Boarding</strong></div><div><small>Status</small><strong className="draft-status">Draft · Not submitted</strong></div></div><div className="flow-button-row"><button className="back-button" onClick={() => setStep(2)}><ArrowLeft size={15} /> Back</button><button className="primary-action" onClick={() => setDone(true)}>Save application <Check size={16} /></button></div></div>}</ModalFrame>;
}

function AccountModal({ kind, onClose }: { kind: "signin" | "signup"; onClose: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">(kind);
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <ModalFrame title="Welcome to streamflo." eyebrow="You're all set" onClose={onClose}><div className="modal-success"><span><CircleCheck size={24} /></span><p>This is a UI preview, so no account was created. The form and flow are ready to connect to authentication.</p><button className="primary-action" onClick={onClose}>Continue exploring <ArrowRight size={16} /></button></div></ModalFrame>;
  return <ModalFrame title={mode === "signin" ? "Welcome back." : "Join streamflo."} eyebrow={mode === "signin" ? "Sign in to your account" : "Save schools and applications"} onClose={onClose}><div className="account-tabs"><button className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>Sign in</button><button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</button></div><form className="flow-form account-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><p className="modal-copy">{mode === "signin" ? "Sign in to save schools, compare options and pick up applications where you left off." : "Create a free account to save schools and manage applications in one place."}</p>{mode === "signup" && <label>Your name<input required placeholder="e.g. Jane Wanjiku" /></label>}<label>Email address<input required type="email" placeholder="you@example.com" /></label><label>{mode === "signin" ? "Password" : "Phone number"}<input required type={mode === "signin" ? "password" : "tel"} placeholder={mode === "signin" ? "Enter your password" : "+254 7XX XXX XXX"} /></label>{mode === "signin" && <button className="forgot-link" type="button" onClick={() => toast("Password reset is ready to connect")}>Forgot password?</button>}<button className="primary-action full-flow-button" type="submit">{mode === "signin" ? "Sign in" : "Create account"} <ArrowUpRight size={16} /></button></form></ModalFrame>;
}

function SchoolLoginModal({ onClose }: { onClose: () => void }) {
  const [, navigate] = useLocation();
  return (
    <ModalFrame title="School login" eyebrow="For school administrators" onClose={onClose}>
      <form
        className="flow-form account-form"
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
          navigate("/school-admin");
        }}
      >
        <p className="modal-copy">Sign in to manage your profile, admissions, enquiries and student onboarding.</p>
        <label>Email address<input required type="email" placeholder="you@school.ac.ke" /></label>
        <label>Password<input required type="password" placeholder="Enter your password" /></label>
        <button className="forgot-link" type="button" onClick={() => toast("Password reset is ready to connect")}>Forgot password?</button>
        <button className="primary-action full-flow-button" type="submit">Sign in to dashboard <ArrowUpRight size={16} /></button>
      </form>
      <p className="modal-copy" style={{ margin: "16px 0 0" }}>New to streamflo? <Link href="/list-your-school" onClick={onClose} style={{ color: "var(--coral)", fontWeight: 800 }}>List your school</Link>, or <Link href="/claim-profile" onClick={onClose} style={{ color: "var(--coral)", fontWeight: 800 }}>claim its profile</Link> if it's already listed.</p>
    </ModalFrame>
  );
}

function ModalHost() {
  const [kind, setKind] = useState<ModalKind | null>(null);
  useEffect(() => { const listener = (event: Event) => setKind((event as CustomEvent<ModalKind>).detail); window.addEventListener("streamflo:modal", listener); return () => window.removeEventListener("streamflo:modal", listener); }, []);
  if (!kind) return null;
  const close = () => setKind(null);
  if (kind === "application") return <ApplicationModal onClose={close} />;
  if (kind === "schoolLogin") return <SchoolLoginModal onClose={close} />;
  return <AccountModal kind={kind} onClose={close} />;
}

export function Header({ active = "home" }: { active?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          <Link href="/schools" className={active === "schools" ? "active" : ""}>Find a school</Link>
          <a href="#categories" onClick={() => setOpen(false)}>Explore categories</a>
          <a href="#how-it-works" onClick={() => setOpen(false)}>How it works</a>
          <Link href="/pathway-ai" className={`nav-ai-link ${active === "pathway" ? "active" : ""}`} onClick={() => setOpen(false)}>Pathway AI<span className="nav-ai-pill">AI</span></Link>
          <a href="#for-schools" onClick={() => setOpen(false)}>For schools</a>
        </nav>
        <div className="header-actions">
          <button className="text-button desktop-only" onClick={() => openModal("signin")}>Sign in</button>
          <button className="text-button desktop-only" onClick={() => openModal("schoolLogin")}>School login</button>
          <Link href="/list-your-school" className="outline-button desktop-only">List your school <ArrowUpRight size={15} /></Link>
          <button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchBar({ compact = false, initial = "" }: { compact?: boolean; initial?: string }) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState(initial);
  const [place, setPlace] = useState("Any location");
  return (
    <div className={`search-shell ${compact ? "compact" : ""}`}>
      <div className="search-field search-query">
        <Search size={19} strokeWidth={2.2} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && navigate(`/schools${query ? `?q=${encodeURIComponent(query)}` : ""}`)}
          placeholder="School, estate or town"
          aria-label="Search by school name, estate or town"
        />
      </div>
      <div className="search-divider" />
      <button className="search-field search-location" onClick={() => setPlace(place === "Any location" ? "Near me" : "Any location")}>
        <MapPin size={18} />
        <span>{place}</span>
        <ChevronDown size={16} className="search-chevron" />
      </button>
      <button className="search-submit" onClick={() => navigate(`/schools${query ? `?q=${encodeURIComponent(query)}` : ""}`)}>
        <Search size={18} /> <span>Search schools</span>
      </button>
    </div>
  );
}

export function SectionIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: React.ReactNode; copy?: string; action?: React.ReactNode }) {
  return (
    <div className="section-intro">
      <div>
        <div className="eyebrow"><span className="eyebrow-line" />{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {copy && <p>{copy}</p>}
      {action}
    </div>
  );
}

function SchoolCard({ school, compact = false }: { school: typeof featuredSchools[number]; compact?: boolean }) {
  const [saved, setSaved] = useState(false);
  return (
    <article className={`school-card ${compact ? "compact-card" : ""}`}>
      <Link href="/schools/greenfield-academy" className="school-image-wrap">
        <img src={school.image} alt={`${school.name} campus`} className="school-image" />
        <div className="image-overlay" />
        <span className={`card-status ${school.tone}`}>{school.name === "Greenfield Academy" ? "Featured" : "Verified"}</span>
        <button className={`save-button ${saved ? "saved" : ""}`} onClick={(e) => { e.preventDefault(); setSaved(!saved); toast(saved ? "Removed from saved schools" : "Saved for later"); }} aria-label={saved ? "Unsave school" : "Save school"}>
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </Link>
      <div className="school-card-body">
        <div className="school-card-heading">
          <div>
            <Link href="/schools/greenfield-academy" className="school-name">{school.name}</Link>
            <div className="school-location"><MapPin size={14} />{school.location}</div>
          </div>
          <div className="rating"><Star size={14} fill="currentColor" /> {school.rating}</div>
        </div>
        <div className="school-tags"><span>{school.type}</span><span>{school.mode}</span><span>{school.curriculum}</span></div>
        <div className="school-card-footer"><div className="fee-label"><span className="fee-main">Fees from <strong>{school.fees}</strong><small> / term</small></span><span className="admission-fee">+ {school.admissionFee} admission fee</span></div><Link href="/schools/greenfield-academy" className="arrow-link" aria-label={`View ${school.name}`}><ArrowUpRight size={17} /></Link></div>
      </div>
    </article>
  );
}

function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="trust-item"><Wallet size={19} /><span><strong>Fees up front</strong><small>Tuition, boarding and transport, before you visit</small></span></div>
      <div className="trust-item"><ShieldCheck size={19} /><span><strong>Checked, not hearsay</strong><small>Details verified with each school</small></span></div>
      <div className="trust-item"><CircleCheck size={19} /><span><strong>Free to search and compare</strong><small>No sign-up needed to get started</small></span></div>
    </div>
  );
}

const parentQuestions = [
  { q: "What will it really cost per term?", a: "Tuition, boarding, transport and one-off fees on every profile, plus the full fee structure to download.", icon: Wallet },
  { q: "CBC, British or IB — which suits my child?", a: "Filter by curriculum, then read our plain-English guides on where each one leads.", icon: Globe2 },
  { q: "How long will the school run take?", a: "Search by estate or town and check bus routes before you fall for a campus across the city.", icon: Bus },
  { q: "Which Senior School pathway is right for them?", a: "Pathway AI reads your Grade 9 child's report cards and suggests STEM, Social Sciences or Arts & Sports Science.", icon: Sparkles, href: "/pathway-ai", cta: "Try Pathway AI" },
  { q: "When are interviews — and have we missed them?", a: "Admission windows, entry assessments and required documents for the 2027 intake, clearly listed.", icon: CalendarDays },
  { q: "What do other parents honestly think?", a: "Reviews on every profile from families whose children are already there.", icon: MessageCircle },
];

function ParentQuestions() {
  return (
    <section className="section questions-section">
      <div className="container">
        <SectionIntro eyebrow="Sound familiar?" title={<>Questions you've asked <em>the WhatsApp group.</em></>} copy="Every streamflo profile is built to answer them clearly, before you take a day off for a school tour." />
        <div className="question-grid">
          {parentQuestions.map(({ q, a, icon: Icon, href, cta }) => (
            <article className={`question-card ${href ? "highlighted" : ""}`} key={q}>
              <span className="question-icon"><Icon size={18} /></span>
              <h3>“{q}”</h3>
              <p>{a}</p>
              {href && <Link href={href} className="question-link">{cta} <ArrowUpRight size={14} /></Link>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <div className="site-page home-page">
      <Header />
      <main>
        <section className="hero-section">
          <div className="hero-grain" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow light"><span className="eyebrow-line" />Planning for the 2027 intake? Start here.</div>
              <h1>Choose their school with <em>the full picture.</em></h1>
              <p className="hero-lede">Real fee structures, curricula, admission dates and parent reviews for schools across Kenya, side by side. Shortlist, compare and apply without chasing admissions offices for answers.</p>
              <SearchBar />
              <div className="hero-links"><span>Popular searches</span><button onClick={() => toast("Showing British curriculum schools in Nairobi")}>British curriculum, Nairobi</button><button onClick={() => toast("Showing boarding schools for Grade 10")}>Boarding for Grade 10</button><button onClick={() => toast("Showing schools under KES 100k a term")}>Under KES 100k a term</button></div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo-frame"><img src={img.campus} alt="Aerial view of a bright school campus" /><div className="photo-wash" /></div>
              <div className="hero-caption"><span className="caption-index">01</span><span>See the campus<br />before you visit</span><ArrowUpRight size={17} /></div>
              <div className="hero-stamp"><span className="stamp-star">✦</span><span>No more<br />“call for fees”</span></div>
              <div className="hero-shape hero-shape-one" /><div className="hero-shape hero-shape-two" />
            </div>
          </div>
          <div className="container hero-bottom"><span>Now listing schools in</span><div className="county-ticker"><span>Nairobi</span><span>Kiambu</span><span>Kajiado</span><span>Mombasa</span><span>Nakuru</span><span>Kisumu</span></div></div>
        </section>

        <div className="container"><TrustStrip /></div>

        <ParentQuestions />

        <section className="section section-featured">
          <div className="container">
            <SectionIntro eyebrow="Verified profiles" title={<>Schools worth a <em>closer look.</em></>} copy="Each profile shows the fee structure, curriculum and admission dates, so your shortlist is built on facts, not forwarded messages." action={<Link href="/schools" className="text-link">Browse all schools <ArrowUpRight size={16} /></Link>} />
            <div className="school-grid">{featuredSchools.map((school) => <SchoolCard key={school.name} school={school} />)}</div>
          </div>
        </section>

        <section className="section location-section">
          <div className="container location-grid">
            <div className="location-copy"><div className="eyebrow"><span className="eyebrow-line" />Start with the school run</div><h2>Closer to home.<br /><em>Calmer mornings.</em></h2><p>No child should be up at 5 a.m. to beat the traffic on Thika Road. Start with schools near home or work, and check bus routes before you commit.</p><Link href="/schools" className="dark-button">Find schools near you <ArrowUpRight size={17} /></Link></div>
            <div className="county-grid">
              {[{n:"Nairobi",c:"1,248 schools",i:img.classroom},{n:"Kiambu",c:"486 schools",i:img.campus},{n:"Mombasa",c:"302 schools",i:img.courtyard},{n:"Kisumu",c:"217 schools",i:img.sports}].map((county) => <Link href="/schools" className="county-card" key={county.n}><img src={county.i} alt="" /><div className="county-card-overlay" /><div className="county-card-copy"><span>{county.c}</span><strong>{county.n}</strong></div><ArrowUpRight size={17} /></Link>)}
            </div>
          </div>
        </section>

        <section className="section categories-section" id="categories">
          <div className="container"><SectionIntro eyebrow="Find your fit" title={<>Start with what <em>matters most.</em></>} copy="Some parents start with curriculum. Others start with boarding, or the support their child needs. Wherever you begin, we'll help you narrow it down." />
            <div className="category-grid">
              {[{t:"CBC schools",d:"PP1 through Senior School",icon:BookOpen,color:"yellow"},{t:"Boarding schools",d:"Welfare, dorms & visiting days",icon:Building2,color:"green"},{t:"British & IB",d:"IGCSE, A-Level & the IB Diploma",icon:Globe2,color:"blue"},{t:"Senior School",d:"Grade 10 pathways, explained",icon:GraduationCap,color:"peach"},{t:"Special needs",d:"Trained staff, smaller classes",icon:Heart,color:"lilac"}].map(({t,d,icon: Icon,color}) => <button key={t} className={`category-tile ${color}`} onClick={() => toast(`${t} browse view is coming soon`)}><span className="category-icon"><Icon size={23} /></span><span><strong>{t}</strong><small>{d}</small></span><ArrowUpRight size={17} /></button>)}
            </div>
          </div>
        </section>

        <section className="section how-section" id="how-it-works">
          <div className="container how-grid">
            <div className="how-image"><img src={img.classroom} alt="Students learning together in a classroom" /><div className="how-image-label"><span>01 / 03</span><strong>From first search<br />to first day.</strong></div></div>
            <div className="how-copy"><div className="eyebrow"><span className="eyebrow-line" />How streamflo works</div><h2>Less running around.<br />More <em>certainty.</em></h2><p>Most parents spend weeks phoning admissions offices, taking leave for school tours and comparing notes with friends. streamflo puts the answers in one place, so the schools you visit are the ones already worth visiting.</p><div className="steps"><div className="step active"><span className="step-number">01</span><div><strong>Shortlist in an evening</strong><p>Filter by fees, curriculum, location and boarding, and save the schools that fit.</p></div></div><div className="step"><span className="step-number">02</span><div><strong>Compare side by side</strong><p>Fees, curriculum, facilities and parent reviews on one screen. No spreadsheet required.</p></div></div><div className="step"><span className="step-number">03</span><div><strong>Visit or apply with confidence</strong><p>Call, WhatsApp or start your application online, straight from the school's profile.</p></div></div></div></div>
          </div>
        </section>

        <section className="section cta-section" id="for-schools"><div className="container cta-inner"><div><div className="eyebrow light"><span className="eyebrow-line" />For schools</div><h2>Parents are comparing.<br /><em>Be easy to choose.</em></h2><p>Show families your real fees, facilities and admission dates, and hear from parents who already know you're the right fit.</p></div><div className="cta-actions"><Link href="/list-your-school" className="cream-button">List your school <ArrowUpRight size={17} /></Link><button className="cta-secondary-link" onClick={() => openModal("schoolLogin")}><LogIn size={14} /> Already listed? School login</button><Link href="/claim-profile" className="cta-secondary-link"><BadgeCheck size={14} /> Found your school here? Claim its profile</Link><Link href="/pathway-ai?school=1" className="cta-secondary-link"><Sparkles size={14} /> Preview Pathway AI for your students</Link></div><div className="cta-orbit orbit-a" /><div className="cta-orbit orbit-b" /></div></section>
      </main>
      <Footer />
    </div>
  );
}

function FilterChip({ children, active = false, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return <button className={`filter-chip ${active ? "active" : ""}`} onClick={onClick}>{children}<ChevronDown size={14} /></button>;
}

function SearchResultCard({ school, index }: { school: typeof searchSchools[number]; index: number }) {
  const [saved, setSaved] = useState(false);
  const compared = useCompare().includes(school.slug);
  return <article className="result-card">
    <Link href="/schools/greenfield-academy" className="result-image"><img src={school.image} alt={`${school.name} campus`} /><span className={school.status.includes("Admissions") ? "admission-pill" : "verified-pill"}>{school.status.includes("Admissions") ? <CircleCheck size={13} /> : <BadgeCheck size={13} />}{school.status}</span></Link>
    <div className="result-card-main"><div className="result-topline"><div><Link href="/schools/greenfield-academy" className="result-name">{school.name}</Link><div className="school-location"><MapPin size={14} />{school.location}</div></div><button className={`result-heart ${saved ? "saved" : ""}`} onClick={() => {setSaved(!saved); toast(saved ? "Removed from saved schools" : "Saved for later")}}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button></div><div className="result-details"><span>{school.type}</span><span>{school.gender}</span><span>{school.mode}</span><span>{school.curriculum}</span><span>{school.level}</span></div><div className="result-meta"><div className="fee-label"><span className="fee-main">{school.fees}</span><span className="admission-fee">+ {school.admissionFee} admission fee</span></div><span className="result-rating"><Star size={14} fill="currentColor" /> {school.rating} <small>({school.reviews})</small></span></div><div className="result-actions"><Link href="/schools/greenfield-academy" className="small-dark-button">View school <ArrowUpRight size={15} /></Link><button className={`compare-button ${compared ? "active" : ""}`} aria-pressed={compared} onClick={() => toggleCompare(school.slug, school.name)}><Check size={15} /> {compared ? "Added to compare" : "Compare"}</button></div></div>
  </article>;
}

function MapPanel() {
  return <div className="map-panel"><div className="map-toolbar"><span><Map size={16} /> Map view</span><button onClick={() => toast("Map controls are coming soon")}>+ −</button></div><div className="map-surface"><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><div className="map-water" /><div className="map-neighborhood n-one" /><div className="map-neighborhood n-two" /><div className="map-neighborhood n-three" /><div className="map-neighborhood n-four" />{["p-a","p-b","p-c","p-d","p-e"].map((p, i) => <div className={`map-pin ${p}`} key={p}><span>{i + 1}</span></div>)}<div className="map-label label-ruiru">Ruiru</div><div className="map-label label-kiambu">Kiambu</div><div className="map-label label-thika">Thika Road</div></div><div className="map-legend"><span><i className="legend-dot" /> 5 schools in this area</span><button onClick={() => toast("Location access is not enabled in this demo")}> <MapPinned size={14} /> Use my location</button></div></div>;
}

function SearchPage() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  const [view, setView] = useState<"list" | "map">("list");
  const [openFilters, setOpenFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Kiambu");
  const filterLabels = ["County", "School type", "Education level", "Curriculum", "Fees"];
  return <div className="site-page search-page"><Header active="schools" /><main><section className="results-hero"><div className="container"><div className="breadcrumb"><Link href="/">Home</Link><ChevronRight size={14} /><span>Find a school</span></div><h1>Find a school <em>that fits.</em></h1><SearchBar compact initial={query} /><div className="quick-filter-row"><span>Popular near you</span><button className="quick-filter active">Kiambu</button><button className="quick-filter">Nairobi</button><button className="quick-filter">Mombasa</button><button className="quick-filter">Boarding</button><button className="quick-filter">CBC</button></div></div></section><section className="results-body"><div className="container results-layout"><aside className={`filters-panel ${openFilters ? "is-open" : ""}`}><div className="filters-heading"><div><span className="eyebrow"><span className="eyebrow-line" />Refine results</span><h3>Search filters</h3></div><button className="icon-button mobile-only" onClick={() => setOpenFilters(false)}><X size={18} /></button></div><div className="filter-group"><label>Location</label><button className="select-filter">Kiambu County <ChevronDown size={15} /></button><button className="select-filter muted">Any town or area <ChevronDown size={15} /></button></div><div className="filter-group"><label>School type</label>{["Any school type","Private","Public","International"].map((x, i) => <button className={`check-filter ${i === 1 ? "checked" : ""}`} key={x} onClick={() => toast(`${x} filter selected`)}><span className="fake-check">{i === 1 && <Check size={12} />}</span>{x}<small>{["124","86","31","7"][i]}</small></button>)}</div><div className="filter-group"><label>School mode</label><div className="pill-options"><button className="selected">All</button><button>Day</button><button>Boarding</button></div></div><div className="filter-group"><label>Fee range <span>per term</span></label><div className="range-track"><span /><i /><i /><i /></div><div className="range-labels"><span>KES 20k</span><span>KES 200k+</span></div></div><button className="clear-filters" onClick={() => {setActiveFilter("Any location"); toast("Filters reset")}}>Reset all filters</button></aside><div className="results-content"><div className="results-toolbar"><div><button className="mobile-filter-button" onClick={() => setOpenFilters(true)}><SlidersHorizontal size={16} /> Filters</button><p><strong>{searchSchools.length + 121} schools</strong> found in Kiambu</p></div><div className="view-toggle"><button className={view === "list" ? "active" : ""} onClick={() => setView("list")}><LayoutGrid size={16} /> List</button><button className={view === "map" ? "active" : ""} onClick={() => setView("map")}><Map size={16} /> Map</button></div></div><div className="active-filters"><span>Showing</span><FilterChip active onClick={() => setActiveFilter(activeFilter === "Kiambu" ? "Any location" : "Kiambu")}>{activeFilter}</FilterChip>{filterLabels.slice(1, 3).map((x) => <FilterChip key={x}>{x}</FilterChip>)}<button className="clear-link" onClick={() => toast("Filters cleared")}>Clear all</button></div>{view === "list" ? <div className="result-list">{searchSchools.map((school, i) => <SearchResultCard key={school.name} school={school} index={i} />)}<button className="load-more" onClick={() => toast("More schools are coming soon")}>Load more schools <ChevronDown size={16} /></button></div> : <MapPanel />}</div></div></section></main><Footer /></div>;
}

function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const compared = useCompare().includes("greenfield-academy");
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Academics", "Fees", "Admissions", "Documents"];
  return <div className="site-page profile-page"><Header active="schools" /><main><div className="container profile-breadcrumb"><Link href="/schools"><ArrowLeft size={15} /> Back to schools</Link><span>Kiambu / Ruiru / Greenfield Academy</span></div><section className="profile-hero"><div className="container profile-hero-grid"><div className="profile-cover"><img src={img.campus} alt="Greenfield Academy campus" /><div className="profile-cover-gradient" /><div className="profile-cover-caption"><span>Greenfield Academy</span><small>Ruiru, Kiambu County</small></div><div className="cover-dots"><span className="active" /><span /><span /><span /></div></div><div className="profile-summary"><div className="verified-line"><BadgeCheck size={16} /> Verified school profile <span>·</span> Updated 12 Aug 2026</div><h1>Greenfield<br /><em>Academy</em></h1><p className="profile-location"><MapPin size={17} /> Ruiru, Kiambu County</p><div className="profile-tags"><span>Private</span><span>Mixed</span><span>Day & Boarding</span><span>CBC</span></div><div className="profile-rating"><span className="stars"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></span><strong>4.8</strong><span>32 parent reviews</span></div><div className="profile-actions"><button className="primary-action" onClick={() => openModal("application")}>Start an application <ArrowUpRight size={17} /></button><button className={`save-profile ${saved ? "saved" : ""}`} onClick={() => {setSaved(!saved); toast(saved ? "Removed from saved schools" : "School saved for later")}}><Heart size={17} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save school"}</button><button className={`save-profile ${compared ? "saved" : ""}`} aria-pressed={compared} onClick={() => toggleCompare("greenfield-academy", "Greenfield Academy")}>{compared ? <Check size={17} /> : <Scale size={17} />} {compared ? "Added to compare" : "Compare"}</button></div></div></div></section><div className="container profile-tabs"><div className="tabs-scroll">{tabs.map((tab) => <button className={activeTab === tab ? "active" : ""} key={tab} onClick={() => {setActiveTab(tab); document.getElementById(`profile-${tab.toLowerCase()}`)?.scrollIntoView({behavior: "smooth", block: "start"})}}>{tab}</button>)}</div><div className="profile-quick-actions"><button onClick={() => toast("Opening phone app…")}><Phone size={15} /> Call</button><button onClick={() => toast("WhatsApp is coming soon")}><MessageCircle size={15} /> WhatsApp</button><button onClick={() => toast("Directions are coming soon")}><Navigation size={15} /> Directions</button></div></div><section className="container profile-content"><div className="profile-main"><section id="profile-overview" className="profile-section first"><div className="eyebrow"><span className="eyebrow-line" />About the school</div><h2>A place to grow <em>curious.</em></h2><p className="large-copy">Greenfield Academy is a private co-educational day and boarding school located in Ruiru, Kiambu. We create a warm, ambitious environment where every learner is known, challenged and encouraged to find their own way forward.</p><div className="info-grid"><div className="info-card"><span className="info-icon"><GraduationCap size={19} /></span><span><small>Education levels</small><strong>Primary, JSS</strong></span></div><div className="info-card"><span className="info-icon"><CalendarDays size={19} /></span><span><small>Established</small><strong>2008</strong></span></div><div className="info-card"><span className="info-icon"><Building2 size={19} /></span><span><small>School size</small><strong>640 learners</strong></span></div><div className="info-card"><span className="info-icon"><MapPin size={19} /></span><span><small>Campus</small><strong>14 acres</strong></span></div></div></section><section id="profile-academics" className="profile-section"><div className="section-heading-row"><div><div className="eyebrow"><span className="eyebrow-line" />Learning at Greenfield</div><h2>Built for <em>full lives.</em></h2></div><button className="text-link" onClick={() => toast("Full academics details are coming soon")}>View academics <ArrowUpRight size={16} /></button></div><div className="academics-grid"><div className="academic-panel"><span className="academic-number">01</span><h3>CBC curriculum</h3><p>Learning that balances strong foundations with the confidence to think, make and contribute.</p><div className="academic-tags"><span>Competency based</span><span>Project learning</span></div></div><div className="academic-panel highlighted"><span className="academic-number">02</span><h3>Beyond the classroom</h3><p>From swimming to robotics, every learner has space to find the thing that lights them up.</p><div className="academic-tags"><span>12 activities</span><span>3 sports fields</span></div></div></div></section><section id="profile-fees" className="profile-section fee-section"><div className="section-heading-row"><div><div className="eyebrow"><span className="eyebrow-line" />Transparent by design</div><h2>Fees at a <em>glance.</em></h2></div><span className="updated-badge"><Clock3 size={14} /> Updated 12 Aug 2026</span></div><div className="fees-table"><div className="fee-row fee-header"><span>2026 school fees</span><span>Per term</span><span>Notes</span></div><div className="fee-row"><strong>Tuition fees</strong><strong>KES 85,000</strong><span>All learners</span></div><div className="fee-row"><span>Boarding</span><strong>KES 25,000</strong><span>Optional</span></div><div className="fee-row"><span>Transport</span><strong>From KES 12,000</strong><span>By route</span></div><div className="fee-row"><span>Admission fee<sup className="fee-note">One-time</sup></span><strong>KES 15,000</strong><span>New learners only</span></div></div><button className="download-button" onClick={() => toast("Fee structure download is coming soon")}><Download size={16} /> Download full fee structure <ArrowUpRight size={15} /></button></section><section id="profile-admissions" className="profile-section admissions-section"><div className="admission-callout"><div><div className="eyebrow light"><span className="eyebrow-line" />Admissions 2027</div><h2>Ready when<br /><em>you are.</em></h2><p>Applications for the 2027 academic year are now open. Start online or speak to the admissions team.</p></div><button className="cream-button" onClick={() => openModal("application")}>Start application <ArrowUpRight size={17} /></button></div></section><section id="profile-documents" className="profile-section documents-section"><div className="section-heading-row"><div><div className="eyebrow"><span className="eyebrow-line" />Useful documents</div><h2>Take it with <em>you.</em></h2></div></div><div className="document-list">{[{name:"2026 Fee Structure",detail:"PDF · Updated 12 Aug 2026"},{name:"Admissions guide",detail:"PDF · Updated 04 Jul 2026"},{name:"School prospectus",detail:"PDF · Updated 18 Jun 2026"}].map((doc) => <div className="document-row" key={doc.name}><span className="document-icon"><FileText size={19} /></span><span><strong>{doc.name}</strong><small>{doc.detail}</small></span><button onClick={() => toast(`${doc.name} download is coming soon`)}><Download size={16} /></button></div>)}</div></section></div><aside className="profile-aside"><div className="contact-card"><div className="eyebrow"><span className="eyebrow-line" />Get in touch</div><h3>Questions?<br /><em>Let's talk.</em></h3><p>The admissions team usually replies within one working day.</p><button className="full-dark-button" onClick={() => toast("Enquiry form is coming soon")}>Contact the school <ArrowUpRight size={16} /></button><div className="contact-links"><button onClick={() => toast("Opening phone app…")}><Phone size={15} /> +254 709 123 456</button><button onClick={() => toast("Opening email…")}><Mail size={15} /> admissions@greenfield.sc.ke</button><button onClick={() => toast("Directions are coming soon")}><MapPin size={15} /> Eastern Bypass, Ruiru</button></div></div><div className="mini-map"><div className="mini-map-grid" /><div className="mini-map-pin"><MapPin size={22} fill="currentColor" /></div><span>Greenfield Academy</span><button onClick={() => toast("Map view is coming soon")}>Open in maps <ArrowUpRight size={14} /></button></div><div className="claim-card"><Sparkles size={17} /><div><strong>Are you from this school?</strong><p>Claim this profile to keep information up to date.</p><Link href="/claim-profile?school=greenfield-academy">Claim this profile <ArrowUpRight size={14} /></Link></div></div></aside></section></main><Footer /></div>;
}

const blogPosts = [
  { category: "Education news", date: "18 Sep 2026", title: "What the next CBC season means for families", excerpt: "A clear, parent-friendly look at the changes schools are preparing for and the questions worth asking.", image: img.classroom, tone: "yellow" },
  { category: "School news", date: "12 Sep 2026", title: "Inside Greenfield's new creative learning studio", excerpt: "A first look at the space where design, robotics and big ideas come together.", image: img.campus, tone: "green" },
  { category: "Parent guides", date: "04 Sep 2026", title: "How to compare schools without losing the plot", excerpt: "The five details that help turn a longlist into a confident shortlist.", image: img.courtyard, tone: "peach" },
  { category: "School news", date: "28 Aug 2026", title: "Why school visits still matter in a digital age", excerpt: "The small signals you can only notice when you spend time on campus.", image: img.sports, tone: "blue" },
];

function BlogPage() {
  const [topic, setTopic] = useState("All stories");
  const topics = ["All stories", "Education news", "School news", "Parent guides"];
  const visiblePosts = topic === "All stories" ? blogPosts : blogPosts.filter((post) => post.category === topic);
  return <div className="site-page blog-page"><Header active="blog" /><main><section className="blog-hero"><div className="container"><div className="breadcrumb"><Link href="/">Home</Link><ChevronRight size={14} /><span>Blog</span></div><div className="blog-hero-grid"><div><div className="eyebrow light"><span className="eyebrow-line" />The streamflo journal</div><h1>Good questions<br />make <em>good choices.</em></h1></div><p>Education news, school stories and practical ideas for families finding their way from first search to first day.</p></div></div></section><section className="blog-body"><div className="container"><div className="topic-tabs">{topics.map((item) => <button key={item} className={topic === item ? "active" : ""} onClick={() => setTopic(item)}>{item}</button>)}</div><div className="blog-feature"><img src={img.classroom} alt="Students learning together" /><div className="blog-feature-copy"><span className="article-category">{blogPosts[0].category} <i /> {blogPosts[0].date}</span><h2>{blogPosts[0].title}</h2><p>{blogPosts[0].excerpt}</p><button className="dark-button" onClick={() => toast("Article reader is ready to connect")}>Read the story <ArrowUpRight size={16} /></button></div></div><div className="blog-heading"><div><div className="eyebrow"><span className="eyebrow-line" />From the journal</div><h2>More to <em>explore.</em></h2></div><span>{visiblePosts.length} stories</span></div><div className="blog-grid">{visiblePosts.map((post) => <article className="blog-card" key={post.title}><div className="blog-card-image"><img src={post.image} alt="" /><span className={`blog-tone ${post.tone}`}>{post.category}</span></div><div className="blog-card-copy"><span className="article-date">{post.date}</span><h3>{post.title}</h3><p>{post.excerpt}</p><button onClick={() => toast("Article reader is ready to connect")}>Read more <ArrowUpRight size={15} /></button></div></article>)}</div><div className="journal-signup"><div><div className="eyebrow light"><span className="eyebrow-line" />A note for your inbox</div><h2>Useful things,<br /><em>occasionally.</em></h2></div><form onSubmit={(event) => { event.preventDefault(); toast("You're on the journal list"); }}><input required type="email" placeholder="Your email address" aria-label="Your email address" /><button type="submit">Subscribe <ArrowUpRight size={16} /></button><small>No noise. Just thoughtful school and education stories.</small></form></div></div></section></main><Footer /></div>;
}

export function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div><Logo /><p>Helping Kenyan parents choose<br />schools with confidence.</p><div className="footer-socials"><button aria-label="Instagram" onClick={() => toast("Social links are coming soon")}>ig</button><button aria-label="Facebook" onClick={() => toast("Social links are coming soon")}>f</button><button aria-label="X" onClick={() => toast("Social links are coming soon")}>x</button></div></div><div className="footer-links"><div><strong>Discover</strong><Link href="/schools">Find a school</Link><a href="#categories">Explore categories</a><a href="#how-it-works">How it works</a><Link href="/pathway-ai">Pathway AI advisor</Link><Link href="/counselors">Book a counselor</Link><Link href="/compare">Compare schools</Link><Link href="/blog">Blog</Link><Link href="/jobs">Jobs</Link></div><div><strong>For schools</strong><Link href="/list-your-school">List your school</Link><button onClick={() => openModal("schoolLogin")}>School login</button><Link href="/pathway-ai?school=1">Pathway AI for schools</Link><Link href="/jobs">Post a teaching job</Link><Link href="/school-resources">School resources</Link><Link href="/claim-profile">Claim a profile</Link></div><div><strong>Company</strong><button onClick={() => toast("About page is coming soon")}>About streamflo</button><button onClick={() => toast("Privacy page is coming soon")}>Privacy</button><button onClick={() => toast("Terms page is coming soon")}>Terms</button></div></div></div><div className="container footer-bottom"><span>© 2026 streamflo. Made for families in Kenya.</span><span>From first search to first day.</span></div></footer>;
}

export default function Home() {
  const [location] = useLocation();
  // Client-side navigation keeps the old scroll position; footer links would otherwise land mid-page.
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [location]);
  const page = useMemo(() => {
    if (location.startsWith("/schools/greenfield-academy")) return <ProfilePage />;
    if (location.startsWith("/schools")) return <SearchPage />;
    if (location.startsWith("/compare")) return <Compare />;
    if (location.startsWith("/claim-profile")) return <ClaimProfile />;
    if (location.startsWith("/school-resources")) return <SchoolResources />;
    if (location.startsWith("/blog")) return <BlogPage />;
    if (location.startsWith("/list-your-school")) return <ListYourSchool />;
    if (location.startsWith("/pathway-ai")) return <PathwayAI />;
    if (location.startsWith("/counselors")) return <Counselors />;
    if (location.startsWith("/jobs")) return <Careers />;
    if (location.startsWith("/school-admin/profile")) return <Profile />;
    if (location.startsWith("/school-admin/media")) return <Media />;
    if (location.startsWith("/school-admin/enquiries")) return <Enquiries />;
    if (location.startsWith("/school-admin/admissions")) return <Admissions />;
    if (location.startsWith("/school-admin/onboarding")) return <Onboarding />;
    if (location.startsWith("/school-admin/reports")) return <ProgressReports />;
    if (location.startsWith("/school-admin/promote")) return <Promote />;
    if (location.startsWith("/school-admin/jobs")) return <Jobs />;
    if (location.startsWith("/school-admin")) return <Overview />;
    return <HomePage />;
  }, [location]);
  return <><ModalHost />{page}{location.startsWith("/schools") && <CompareTray />}</>;
}
