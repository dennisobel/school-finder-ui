import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  CirclePlay,
  ClipboardCheck,
  Download,
  FileSpreadsheet,
  LogIn,
  MessageCircle,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Footer, Header, openModal } from "./Home";

type ResourceType = "Guide" | "Template" | "Webinar" | "Case study";

const tabs: { label: string; type: ResourceType | null }[] = [
  { label: "All resources", type: null },
  { label: "Guides", type: "Guide" },
  { label: "Templates", type: "Template" },
  { label: "Webinars", type: "Webinar" },
  { label: "Case studies", type: "Case study" },
];

const actionMessage: Record<ResourceType, string> = {
  Guide: "Guide downloads are coming soon",
  Template: "Template downloads are coming soon",
  Webinar: "Webinar registration is ready to connect",
  "Case study": "Case study reader is ready to connect",
};

const resources: { type: ResourceType; title: string; blurb: string; meta: string; action: string; icon: typeof Wallet; tone: string; live?: boolean }[] = [
  { type: "Guide", title: "Writing a fee structure parents can read", blurb: "Lay out tuition, boarding, transport and one-off costs so parents stop calling to ask what's included.", meta: "PDF · 9 pages", action: "Download", icon: Wallet, tone: "yellow" },
  { type: "Template", title: "2027 fee structure template", blurb: "A ready-to-fill sheet with per-term and annual totals, optional extras and payment deadlines.", meta: "Excel & Google Sheets", action: "Download", icon: FileSpreadsheet, tone: "green" },
  { type: "Webinar", title: "Live: setting up online applications", blurb: "A 40-minute walkthrough of application forms, required documents and status updates, with time for questions.", meta: "Wed 14 Oct · 4:00 pm EAT", action: "Reserve a seat", icon: CalendarDays, tone: "peach", live: true },
  { type: "Guide", title: "Campus photos on a phone, done well", blurb: "Light, angles and the eight shots parents look for first, from classrooms to the dining hall.", meta: "PDF · 7 pages", action: "Download", icon: Camera, tone: "blue" },
  { type: "Template", title: "Enquiry reply scripts", blurb: "Warm, quick replies to the questions parents ask most, ready to paste into email or WhatsApp.", meta: "Word & Google Docs", action: "Download", icon: MessageCircle, tone: "lilac" },
  { type: "Webinar", title: "Senior School pathways: what parents are asking", blurb: "How to present STEM, Social Sciences and Arts & Sports Science options to Grade 9 families.", meta: "On demand · 35 min", action: "Watch now", icon: CirclePlay, tone: "blue" },
  { type: "Case study", title: "How Greenfield Academy filled its JSS intake early", blurb: "What a Ruiru school changed on its profile, and how its admissions team handled the rush of enquiries.", meta: "5 min read", action: "Read the story", icon: TrendingUp, tone: "green" },
  { type: "Template", title: "Grade 10 admissions checklist", blurb: "The documents, dates and entry requirements to publish before placement season begins.", meta: "PDF checklist", action: "Download", icon: ClipboardCheck, tone: "yellow" },
  { type: "Case study", title: "Why Nyali Coast Academy publishes its full fees", blurb: "A bursar's view on transparency, fewer phone calls and applications from better-fit families.", meta: "4 min read", action: "Read the story", icon: BadgeCheck, tone: "peach" },
];

const chapters = [
  { title: "The parent's calendar", detail: "When families shortlist, visit and apply" },
  { title: "Fees without the phone calls", detail: "What to publish, and how to lay it out" },
  { title: "Photos and documents that answer questions", detail: "The shots and PDFs parents look for" },
  { title: "Enquiries in one working day", detail: "Who replies, how fast, and what to say" },
  { title: "From offer letter to first day", detail: "Keeping new families warm over the holidays" },
];

const readiness = [
  { id: "claim", title: "Claim or list your school", detail: "Verify the business so you control what parents see.", link: { href: "/claim-profile", label: "Claim a profile" } },
  { id: "fees", title: "Publish your full 2027 fee structure", detail: "Tuition, boarding, transport and one-off costs, per term." },
  { id: "photos", title: "Add at least eight campus photos", detail: "Classrooms, labs, sports, dining, and boarding if you offer it." },
  { id: "dates", title: "Set admission dates and entry requirements", detail: "Windows, assessments and the documents families need to bring." },
  { id: "docs", title: "Upload your prospectus and admissions guide", detail: "PDFs parents can download and share with family." },
  { id: "reply", title: "Reply to enquiries within one working day", detail: "Quick replies turn curious parents into campus visits." },
];

const faqs = [
  { q: "Is my school already on streamflo?", a: "Search for it on the claim page. If it's listed, claim it rather than listing it again, so the reviews and details parents have already seen carry over." },
  { q: "What do you need to verify a school?", a: "A Ministry of Education registration certificate or permit, business registration, proof of physical address and a letter of authority for the person managing the profile. Documents are reviewed by hand and never published." },
  { q: "How long does verification take?", a: "Usually one to two business days. If anything needs another look, we'll email you with exactly what's missing." },
  { q: "Can we update fees partway through the year?", a: "Yes. Changes go live as soon as you save them in the school dashboard, and the profile shows parents when fees were last updated." },
  { q: "How are parent reviews handled?", a: "Every review is checked before it's published. Schools can reply publicly and flag reviews that break the community guidelines." },
];

export default function SchoolResources() {
  const [tab, setTab] = useState(tabs[0]);
  const [done, setDone] = useState<string[]>([]);
  const visible = tab.type ? resources.filter((r) => r.type === tab.type) : resources;
  const progress = Math.round((done.length / readiness.length) * 100);

  function toggle(id: string) {
    setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="site-page resources-page">
      <Header active="resources" />
      <main>
        <section className="resources-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/">Home</Link><ChevronRight size={14} /><span>School resources</span></div>
            <div className="resources-hero-grid">
              <div>
                <div className="eyebrow light"><span className="eyebrow-line" />For schools</div>
                <h1>Practical help for<br /><em>admissions teams.</em></h1>
                <p>Guides, templates and live sessions to help your school show parents what they need to know, and turn more enquiries into first days.</p>
              </div>
              <div className="resources-quicklinks">
                <Link href="/list-your-school"><span><strong>New to streamflo?</strong><small>List and verify your school</small></span><ArrowUpRight size={16} /></Link>
                <Link href="/claim-profile"><span><strong>Already listed?</strong><small>Claim your school's profile</small></span><ArrowUpRight size={16} /></Link>
                <button onClick={() => openModal("schoolLogin")}><span><strong>Managing a profile?</strong><small>Sign in to your dashboard</small></span><ArrowUpRight size={16} /></button>
              </div>
            </div>
          </div>
        </section>

        <section className="resources-body">
          <div className="container">
            <div className="resource-feature">
              <div className="resource-feature-copy">
                <div className="eyebrow light"><span className="eyebrow-line" />Featured guide</div>
                <h2>The 2027<br /><em>admissions playbook.</em></h2>
                <p>A term-by-term plan for your next intake: when parents start searching, what they compare first, and how to answer before they have to ask.</p>
                <div className="resource-feature-actions">
                  <button className="cream-button" onClick={() => toast("The playbook download is coming soon")}>Download the playbook <Download size={15} /></button>
                  <span>PDF · 24 pages · Updated Sep 2026</span>
                </div>
              </div>
              <ol className="playbook-chapters">
                {chapters.map((c, i) => (
                  <li key={c.title}><span>0{i + 1}</span><div><strong>{c.title}</strong><small>{c.detail}</small></div></li>
                ))}
              </ol>
            </div>

            <div className="blog-heading">
              <div><div className="eyebrow"><span className="eyebrow-line" />The library</div><h2>Guides, templates <em>&amp; sessions.</em></h2></div>
              <span>{visible.length} resources</span>
            </div>
            <div className="topic-tabs resource-tabs">
              {tabs.map((t) => <button key={t.label} className={tab.label === t.label ? "active" : ""} onClick={() => setTab(t)}>{t.label}</button>)}
            </div>
            <div className="resource-grid">
              {visible.map(({ type, title, blurb, meta, action, icon: Icon, tone, live }) => (
                <article className="resource-card" key={title}>
                  <div className="resource-card-top">
                    <span className={`resource-icon ${tone}`}><Icon size={19} /></span>
                    <span className="resource-type">{live && <i className="live-dot" />}{live ? "Live webinar" : type}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{blurb}</p>
                  <div className="resource-card-foot">
                    <small>{meta}</small>
                    <button className="resource-action" onClick={() => toast(actionMessage[type])}>{action} <ArrowUpRight size={14} /></button>
                  </div>
                </article>
              ))}
            </div>

            <div className="readiness">
              <div className="readiness-intro">
                <div className="eyebrow"><span className="eyebrow-line" />Profile checklist</div>
                <h2>Is your profile<br /><em>parent-ready?</em></h2>
                <p>Parents shortlist on fees, photos and admission dates. Work through these six steps and your profile will answer most questions before anyone picks up the phone.</p>
                <div className="readiness-progress">
                  <div className="readiness-progress-label"><strong>{done.length} of {readiness.length} done</strong><span>{progress}%</span></div>
                  <div className="readiness-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Profile checklist progress"><span style={{ width: `${progress}%` }} /></div>
                </div>
                {done.length === readiness.length && (
                  <p className="readiness-done"><BadgeCheck size={15} /> Your profile is parent-ready. <Link href="/school-admin">Open your dashboard</Link></p>
                )}
              </div>
              <div className="readiness-list">
                {readiness.map((item, i) => {
                  const checked = done.includes(item.id);
                  return (
                    <label className={`readiness-item ${checked ? "checked" : ""}`} key={item.id}>
                      <input type="checkbox" checked={checked} onChange={() => toggle(item.id)} />
                      <span className="readiness-box">{checked ? <Check size={13} /> : <span>0{i + 1}</span>}</span>
                      <span className="readiness-copy">
                        <strong>{item.title}</strong>
                        <small>{item.detail}</small>
                        {item.link && <Link href={item.link.href} className="readiness-link">{item.link.label} <ArrowUpRight size={12} /></Link>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="resources-faq">
              <div>
                <div className="eyebrow"><span className="eyebrow-line" />Common questions</div>
                <h2>Before you <em>get started.</em></h2>
              </div>
              <div className="faq-list">
                {faqs.map((f) => (
                  <details className="faq-item" key={f.q}>
                    <summary>{f.q}<Plus size={16} /></summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="cta-inner resources-help">
              <div>
                <div className="eyebrow light"><span className="eyebrow-line" />Schools team</div>
                <h2>Rather talk it<br /><em>through?</em></h2>
                <p>Book a 20-minute call and we'll go through your profile, fees page and admissions set-up with you.</p>
              </div>
              <div className="cta-actions">
                <button className="cream-button" onClick={() => toast("Call booking is ready to connect")}>Book a call <ArrowUpRight size={17} /></button>
                <Link href="/list-your-school" className="cta-secondary-link"><Plus size={14} /> List a new school</Link>
                <Link href="/claim-profile" className="cta-secondary-link"><BadgeCheck size={14} /> Claim an existing profile</Link>
                <button className="cta-secondary-link" onClick={() => openModal("schoolLogin")}><LogIn size={14} /> School login</button>
              </div>
              <div className="cta-orbit orbit-a" /><div className="cta-orbit orbit-b" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
