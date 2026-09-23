import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock3,
  Compass,
  Download,
  FileText,
  Filter,
  Globe2,
  GraduationCap,
  Heart,
  LayoutGrid,
  Mail,
  Map,
  MapPin,
  MapPinned,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";

const img = {
  campus: "/manus-storage/campus_fa432354.webp",
  classroom: "/manus-storage/classroom_c217fafd.jpg",
  courtyard: "/manus-storage/courtyard_37b33c84.jpg",
  sports: "/manus-storage/sports_f2c1403e.jpg",
};

const featuredSchools = [
  {
    name: "Greenfield Academy",
    location: "Ruiru, Kiambu",
    type: "Private · Mixed",
    mode: "Day & Boarding",
    curriculum: "CBC",
    fees: "KES 85k",
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
    rating: "4.6",
    image: img.courtyard,
    tone: "peach",
  },
];

const searchSchools = [
  {
    name: "Greenfield Academy",
    location: "Ruiru, Kiambu County",
    type: "Private",
    gender: "Mixed",
    mode: "Day & Boarding",
    curriculum: "CBC",
    level: "Primary · JSS",
    fees: "From KES 85,000 / term",
    rating: "4.8",
    reviews: "32 reviews",
    status: "Admissions open",
    image: img.campus,
  },
  {
    name: "Kiambu Hills School",
    location: "Limuru, Kiambu County",
    type: "Private",
    gender: "Mixed",
    mode: "Day",
    curriculum: "CBC",
    level: "Pre-primary · Primary",
    fees: "From KES 48,000 / term",
    rating: "4.5",
    reviews: "18 reviews",
    status: "Verified profile",
    image: img.sports,
  },
  {
    name: "St. Hannah's Academy",
    location: "Thika, Kiambu County",
    type: "Private",
    gender: "Girls",
    mode: "Boarding",
    curriculum: "CBC",
    level: "JSS · Senior secondary",
    fees: "From KES 72,000 / term",
    rating: "4.6",
    reviews: "24 reviews",
    status: "Admissions open",
    image: img.courtyard,
  },
];

function Logo() {
  return (
    <Link href="/" className="brand-mark" aria-label="streamflo home">
      <img src="/manus-storage/streamflo-logo_9e00dda4.png" alt="streamflo" className="brand-logo" />
      <span>streamflo</span>
    </Link>
  );
}

function Header({ active = "home" }: { active?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          <Link href="/schools" className={active === "schools" ? "active" : ""}>Find a school</Link>
          <a href="#categories" onClick={() => setOpen(false)}>Explore categories</a>
          <a href="#how-it-works" onClick={() => setOpen(false)}>How it works</a>
          <a href="#for-schools" onClick={() => setOpen(false)}>For schools</a>
        </nav>
        <div className="header-actions">
          <button className="text-button desktop-only" onClick={() => toast("Sign in is coming soon")}>Sign in</button>
          <button className="outline-button desktop-only" onClick={() => toast("School registration is coming soon")}>List your school <ArrowUpRight size={15} /></button>
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
          placeholder="Search by school, area or county"
          aria-label="Search by school, area or county"
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

function SectionIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy?: string; action?: React.ReactNode }) {
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
        <div className="school-card-footer"><span className="fee-label">Fees from <strong>{school.fees}</strong><small> / term</small></span><Link href="/schools/greenfield-academy" className="arrow-link" aria-label={`View ${school.name}`}><ArrowUpRight size={17} /></Link></div>
      </div>
    </article>
  );
}

function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="trust-item"><ShieldCheck size={19} /><span><strong>Verified information</strong><small>Updated by schools and our team</small></span></div>
      <div className="trust-item"><Compass size={19} /><span><strong>Built for Kenya</strong><small>Counties, curricula and context</small></span></div>
      <div className="trust-item"><CircleCheck size={19} /><span><strong>Always free to browse</strong><small>Compare without the pressure</small></span></div>
    </div>
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
              <div className="eyebrow light"><span className="eyebrow-line" />School search, made human</div>
              <h1>Find a school where <em>they'll thrive.</em></h1>
              <p className="hero-lede">Explore trusted schools across Kenya by location, curriculum, fees and the things that matter most to your family.</p>
              <SearchBar />
              <div className="hero-links"><span>Popular searches</span><button onClick={() => toast("Showing schools in Nairobi")}>Schools in Nairobi</button><button onClick={() => toast("Showing boarding schools")}>Boarding schools</button><button onClick={() => toast("Showing CBC schools")}>CBC schools</button></div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo-frame"><img src={img.campus} alt="Aerial view of a bright school campus" /><div className="photo-wash" /></div>
              <div className="hero-caption"><span className="caption-index">01</span><span>Spaces that make<br />room for possibility</span><ArrowUpRight size={17} /></div>
              <div className="hero-stamp"><span className="stamp-star">✦</span><span>Discover<br />with ease</span></div>
              <div className="hero-shape hero-shape-one" /><div className="hero-shape hero-shape-two" />
            </div>
          </div>
          <div className="container hero-bottom"><span>Trusted by families across</span><div className="county-ticker"><span>Nairobi</span><span>Kiambu</span><span>Mombasa</span><span>Kisumu</span><span>Nakuru</span><span>Machakos</span></div></div>
        </section>

        <div className="container"><TrustStrip /></div>

        <section className="section section-featured">
          <div className="container">
            <SectionIntro eyebrow="A considered starting point" title="Schools worth a closer look" copy="A handpicked selection of verified schools to help you start your search with confidence." action={<Link href="/schools" className="text-link">View all schools <ArrowUpRight size={16} /></Link>} />
            <div className="school-grid">{featuredSchools.map((school) => <SchoolCard key={school.name} school={school} />)}</div>
          </div>
        </section>

        <section className="section location-section">
          <div className="container location-grid">
            <div className="location-copy"><div className="eyebrow"><span className="eyebrow-line" />Start close to home</div><h2>Where are you<br /><em>looking?</em></h2><p>From a school around the corner to a new city entirely, begin with the places that shape your family's everyday.</p><Link href="/schools" className="dark-button">Explore by location <ArrowUpRight size={17} /></Link></div>
            <div className="county-grid">
              {[{n:"Nairobi",c:"1,248 schools",i:img.classroom},{n:"Kiambu",c:"486 schools",i:img.campus},{n:"Mombasa",c:"302 schools",i:img.courtyard},{n:"Kisumu",c:"217 schools",i:img.sports}].map((county) => <Link href="/schools" className="county-card" key={county.n}><img src={county.i} alt="" /><div className="county-card-overlay" /><div className="county-card-copy"><span>{county.c}</span><strong>{county.n}</strong></div><ArrowUpRight size={17} /></Link>)}
            </div>
          </div>
        </section>

        <section className="section categories-section" id="categories">
          <div className="container"><SectionIntro eyebrow="Find your fit" title="Explore by what matters" copy="Every family has a different definition of the right fit. Start with yours." />
            <div className="category-grid">
              {[{t:"Primary schools",d:"Ages 4–13",icon:BookOpen,color:"yellow"},{t:"Boarding schools",d:"Live & learn",icon:Building2,color:"green"},{t:"International",d:"A world of curricula",icon:Globe2,color:"blue"},{t:"Girls' schools",d:"Learning with confidence",icon:GraduationCap,color:"peach"},{t:"Special needs",d:"Every learner belongs",icon:Heart,color:"lilac"}].map(({t,d,icon: Icon,color}) => <button key={t} className={`category-tile ${color}`} onClick={() => toast(`${t} browse view is coming soon`)}><span className="category-icon"><Icon size={23} /></span><span><strong>{t}</strong><small>{d}</small></span><ArrowUpRight size={17} /></button>)}
            </div>
          </div>
        </section>

        <section className="section how-section" id="how-it-works">
          <div className="container how-grid">
            <div className="how-image"><img src={img.classroom} alt="Students learning together in a classroom" /><div className="how-image-label"><span>01 / 03</span><strong>From first search<br />to first day.</strong></div></div>
            <div className="how-copy"><div className="eyebrow"><span className="eyebrow-line" />The streamflo way</div><h2>A little less <em>searching.</em><br />A lot more certainty.</h2><p>We bring the details families need into one clear place, so you can spend less time chasing information and more time picturing your child there.</p><div className="steps"><div className="step active"><span className="step-number">01</span><div><strong>Find schools that fit</strong><p>Browse with filters designed around real family decisions.</p></div></div><div className="step"><span className="step-number">02</span><div><strong>Compare with clarity</strong><p>See fees, facilities and curriculum side by side.</p></div></div><div className="step"><span className="step-number">03</span><div><strong>Take the next step</strong><p>Contact or apply directly when you're ready.</p></div></div></div></div>
          </div>
        </section>

        <section className="section cta-section" id="for-schools"><div className="container cta-inner"><div><div className="eyebrow light"><span className="eyebrow-line" />For schools</div><h2>Let the right families<br /><em>find you.</em></h2><p>Claim your profile and share the details that make your school special.</p></div><button className="cream-button" onClick={() => toast("School onboarding is coming soon")}>List your school <ArrowUpRight size={17} /></button><div className="cta-orbit orbit-a" /><div className="cta-orbit orbit-b" /></div></section>
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
  const [compared, setCompared] = useState(false);
  return <article className="result-card">
    <Link href="/schools/greenfield-academy" className="result-image"><img src={school.image} alt={`${school.name} campus`} /><span className={school.status.includes("Admissions") ? "admission-pill" : "verified-pill"}>{school.status.includes("Admissions") ? <CircleCheck size={13} /> : <BadgeCheck size={13} />}{school.status}</span></Link>
    <div className="result-card-main"><div className="result-topline"><div><Link href="/schools/greenfield-academy" className="result-name">{school.name}</Link><div className="school-location"><MapPin size={14} />{school.location}</div></div><button className={`result-heart ${saved ? "saved" : ""}`} onClick={() => {setSaved(!saved); toast(saved ? "Removed from saved schools" : "Saved for later")}}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button></div><div className="result-details"><span>{school.type}</span><span>{school.gender}</span><span>{school.mode}</span><span>{school.curriculum}</span><span>{school.level}</span></div><div className="result-meta"><span className="fee-label">{school.fees}</span><span className="result-rating"><Star size={14} fill="currentColor" /> {school.rating} <small>({school.reviews})</small></span></div><div className="result-actions"><Link href="/schools/greenfield-academy" className="small-dark-button">View school <ArrowUpRight size={15} /></Link><button className={`compare-button ${compared ? "active" : ""}`} onClick={() => {setCompared(!compared); toast(compared ? "Removed from comparison" : `${school.name} added to comparison`)}}><Check size={15} /> {compared ? "Added" : "Compare"}</button></div></div>
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
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Academics", "Fees", "Admissions", "Documents"];
  return <div className="site-page profile-page"><Header active="schools" /><main><div className="container profile-breadcrumb"><Link href="/schools"><ArrowLeft size={15} /> Back to schools</Link><span>Kiambu / Ruiru / Greenfield Academy</span></div><section className="profile-hero"><div className="container profile-hero-grid"><div className="profile-cover"><img src={img.campus} alt="Greenfield Academy campus" /><div className="profile-cover-gradient" /><div className="profile-cover-caption"><span>Greenfield Academy</span><small>Ruiru, Kiambu County</small></div><div className="cover-dots"><span className="active" /><span /><span /><span /></div></div><div className="profile-summary"><div className="verified-line"><BadgeCheck size={16} /> Verified school profile <span>·</span> Updated 12 Aug 2026</div><h1>Greenfield<br /><em>Academy</em></h1><p className="profile-location"><MapPin size={17} /> Ruiru, Kiambu County</p><div className="profile-tags"><span>Private</span><span>Mixed</span><span>Day & Boarding</span><span>CBC</span></div><div className="profile-rating"><span className="stars"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></span><strong>4.8</strong><span>32 parent reviews</span></div><div className="profile-actions"><button className="primary-action" onClick={() => toast("Application flow is coming soon")}>Start an application <ArrowUpRight size={17} /></button><button className={`save-profile ${saved ? "saved" : ""}`} onClick={() => {setSaved(!saved); toast(saved ? "Removed from saved schools" : "School saved for later")}}><Heart size={17} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save school"}</button></div></div></div></section><div className="container profile-tabs"><div className="tabs-scroll">{tabs.map((tab) => <button className={activeTab === tab ? "active" : ""} key={tab} onClick={() => {setActiveTab(tab); document.getElementById(`profile-${tab.toLowerCase()}`)?.scrollIntoView({behavior: "smooth", block: "start"})}}>{tab}</button>)}</div><div className="profile-quick-actions"><button onClick={() => toast("Opening phone app…")}><Phone size={15} /> Call</button><button onClick={() => toast("WhatsApp is coming soon")}><MessageCircle size={15} /> WhatsApp</button><button onClick={() => toast("Directions are coming soon")}><Navigation size={15} /> Directions</button></div></div><section className="container profile-content"><div className="profile-main"><section id="profile-overview" className="profile-section first"><div className="eyebrow"><span className="eyebrow-line" />About the school</div><h2>A place to grow <em>curious.</em></h2><p className="large-copy">Greenfield Academy is a private co-educational day and boarding school located in Ruiru, Kiambu. We create a warm, ambitious environment where every learner is known, challenged and encouraged to find their own way forward.</p><div className="info-grid"><div className="info-card"><span className="info-icon"><GraduationCap size={19} /></span><span><small>Education levels</small><strong>Primary, JSS</strong></span></div><div className="info-card"><span className="info-icon"><CalendarDays size={19} /></span><span><small>Established</small><strong>2008</strong></span></div><div className="info-card"><span className="info-icon"><Building2 size={19} /></span><span><small>School size</small><strong>640 learners</strong></span></div><div className="info-card"><span className="info-icon"><MapPin size={19} /></span><span><small>Campus</small><strong>14 acres</strong></span></div></div></section><section id="profile-academics" className="profile-section"><div className="section-heading-row"><div><div className="eyebrow"><span className="eyebrow-line" />Learning at Greenfield</div><h2>Built for <em>full lives.</em></h2></div><button className="text-link" onClick={() => toast("Full academics details are coming soon")}>View academics <ArrowUpRight size={16} /></button></div><div className="academics-grid"><div className="academic-panel"><span className="academic-number">01</span><h3>CBC curriculum</h3><p>Learning that balances strong foundations with the confidence to think, make and contribute.</p><div className="academic-tags"><span>Competency based</span><span>Project learning</span></div></div><div className="academic-panel highlighted"><span className="academic-number">02</span><h3>Beyond the classroom</h3><p>From swimming to robotics, every learner has space to find the thing that lights them up.</p><div className="academic-tags"><span>12 activities</span><span>3 sports fields</span></div></div></div></section><section id="profile-fees" className="profile-section fee-section"><div className="section-heading-row"><div><div className="eyebrow"><span className="eyebrow-line" />Transparent by design</div><h2>Fees at a <em>glance.</em></h2></div><span className="updated-badge"><Clock3 size={14} /> Updated 12 Aug 2026</span></div><div className="fees-table"><div className="fee-row fee-header"><span>2026 school fees</span><span>Per term</span><span>Notes</span></div><div className="fee-row"><strong>Tuition fees</strong><strong>KES 85,000</strong><span>All learners</span></div><div className="fee-row"><span>Boarding</span><strong>KES 25,000</strong><span>Optional</span></div><div className="fee-row"><span>Transport</span><strong>From KES 12,000</strong><span>By route</span></div></div><button className="download-button" onClick={() => toast("Fee structure download is coming soon")}><Download size={16} /> Download full fee structure <ArrowUpRight size={15} /></button></section><section id="profile-admissions" className="profile-section admissions-section"><div className="admission-callout"><div><div className="eyebrow light"><span className="eyebrow-line" />Admissions 2027</div><h2>Ready when<br /><em>you are.</em></h2><p>Applications for the 2027 academic year are now open. Start online or speak to the admissions team.</p></div><button className="cream-button" onClick={() => toast("Application flow is coming soon")}>Start application <ArrowUpRight size={17} /></button></div></section><section id="profile-documents" className="profile-section documents-section"><div className="section-heading-row"><div><div className="eyebrow"><span className="eyebrow-line" />Useful documents</div><h2>Take it with <em>you.</em></h2></div></div><div className="document-list">{[{name:"2026 Fee Structure",detail:"PDF · Updated 12 Aug 2026"},{name:"Admissions guide",detail:"PDF · Updated 04 Jul 2026"},{name:"School prospectus",detail:"PDF · Updated 18 Jun 2026"}].map((doc) => <div className="document-row" key={doc.name}><span className="document-icon"><FileText size={19} /></span><span><strong>{doc.name}</strong><small>{doc.detail}</small></span><button onClick={() => toast(`${doc.name} download is coming soon`)}><Download size={16} /></button></div>)}</div></section></div><aside className="profile-aside"><div className="contact-card"><div className="eyebrow"><span className="eyebrow-line" />Get in touch</div><h3>Questions?<br /><em>Let's talk.</em></h3><p>The admissions team usually replies within one working day.</p><button className="full-dark-button" onClick={() => toast("Enquiry form is coming soon")}>Contact the school <ArrowUpRight size={16} /></button><div className="contact-links"><button onClick={() => toast("Opening phone app…")}><Phone size={15} /> +254 709 123 456</button><button onClick={() => toast("Opening email…")}><Mail size={15} /> admissions@greenfield.sc.ke</button><button onClick={() => toast("Directions are coming soon")}><MapPin size={15} /> Eastern Bypass, Ruiru</button></div></div><div className="mini-map"><div className="mini-map-grid" /><div className="mini-map-pin"><MapPin size={22} fill="currentColor" /></div><span>Greenfield Academy</span><button onClick={() => toast("Map view is coming soon")}>Open in maps <ArrowUpRight size={14} /></button></div><div className="claim-card"><Sparkles size={17} /><div><strong>Are you from this school?</strong><p>Claim this profile to keep information up to date.</p><button onClick={() => toast("Claim flow is coming soon")}>Claim this profile <ArrowUpRight size={14} /></button></div></div></aside></section></main><Footer /></div>;
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div><Logo /><p>Helping families find<br />the right place to grow.</p><div className="footer-socials"><button aria-label="Instagram" onClick={() => toast("Social links are coming soon")}>ig</button><button aria-label="Facebook" onClick={() => toast("Social links are coming soon")}>f</button><button aria-label="X" onClick={() => toast("Social links are coming soon")}>x</button></div></div><div className="footer-links"><div><strong>Discover</strong><Link href="/schools">Find a school</Link><a href="#categories">Explore categories</a><a href="#how-it-works">How it works</a><button onClick={() => toast("Compare is coming soon")}>Compare schools</button></div><div><strong>For schools</strong><button onClick={() => toast("School onboarding is coming soon")}>List your school</button><button onClick={() => toast("Resources are coming soon")}>School resources</button><button onClick={() => toast("Claim flow is coming soon")}>Claim a profile</button><button onClick={() => toast("Contact is coming soon")}>Contact us</button></div><div><strong>Company</strong><button onClick={() => toast("About page is coming soon")}>About streamflo</button><button onClick={() => toast("Privacy page is coming soon")}>Privacy</button><button onClick={() => toast("Terms page is coming soon")}>Terms</button></div></div></div><div className="container footer-bottom"><span>© 2026 streamflo. Made for families in Kenya.</span><span>From first search to first day.</span></div></footer>;
}

export default function Home() {
  const [location] = useLocation();
  return useMemo(() => {
    if (location.startsWith("/schools/greenfield-academy")) return <ProfilePage />;
    if (location.startsWith("/schools")) return <SearchPage />;
    return <HomePage />;
  }, [location]);
}
