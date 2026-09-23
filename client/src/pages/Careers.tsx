import { useMemo, useState, type ChangeEvent } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Sparkles,
  Star,
  Upload,
  X,
} from "lucide-react";

import { Footer, Header, ModalFrame, openModal } from "./Home";
import { img } from "@/lib/images";
import { jobListings, type JobListing } from "./jobs-data";

const schoolThumb: Record<string, string> = {
  "Greenfield Academy": img.campus,
  "Amani Girls High": img.courtyard,
  "Kiambu Hills School": img.sports,
};

const roleFilters: ("All roles" | JobListing["role"])[] = ["All roles", "Teacher", "Coach", "Support staff", "Leadership"];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ApplyModal({ job, onClose }: { job: JobListing; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [cv, setCv] = useState<{ name: string; size: number } | null>(null);

  if (submitted) {
    return (
      <ModalFrame title="Application sent." eyebrow={`${job.school} · ${job.title}`} onClose={onClose}>
        <div className="modal-success">
          <span><CheckCircle2 size={24} /></span>
          <p>Your application has been sent to {job.school}'s hiring team. This is a UI preview, so nothing was actually delivered — the form is ready to connect to a real inbox.</p>
          <button className="primary-action" onClick={onClose}>Done</button>
        </div>
      </ModalFrame>
    );
  }

  return (
    <ModalFrame title="Apply for this role" eyebrow={`${job.school} · ${job.title}`} onClose={onClose}>
      <form
        className="flow-form"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <p className="modal-copy">Tell {job.school} a little about yourself. They typically reply within a week.</p>
        <div className="form-grid">
          <label>Full name<input required placeholder="e.g. John Mwangi" /></label>
          <label>Email address<input required type="email" placeholder="you@example.com" /></label>
          <label>Phone number<input required type="tel" placeholder="+254 7XX XXX XXX" /></label>
          <label>TSC number <span className="optional-tag">optional</span><input placeholder="e.g. 456789" /></label>
        </div>
        <div className="upload-slot">
          <div className="upload-slot-copy"><strong>CV / resume</strong><small>PDF or Word · up to 8MB</small></div>
          {cv ? (
            <div className="upload-file-chip">
              <FileText size={15} />
              <span className="upload-file-name">{cv.name}</span>
              <small>{formatSize(cv.size)}</small>
              <button type="button" onClick={() => setCv(null)} aria-label="Remove file"><X size={13} /></button>
            </div>
          ) : (
            <label htmlFor="cv-upload" className="upload-drop">
              <Upload size={16} />
              <span>Click or drag to upload<small>We'll attach it to your application</small></span>
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 8 * 1024 * 1024) { toast("File is too large — keep it under 8MB"); e.target.value = ""; return; }
                  setCv({ name: file.name, size: file.size });
                }}
              />
            </label>
          )}
        </div>
        <label>A short note <span className="optional-tag">optional</span><textarea rows={3} placeholder="Why you'd be a good fit…" /></label>
        <button className="primary-action full-flow-button" type="submit">Send application <ArrowUpRight size={16} /></button>
      </form>
    </ModalFrame>
  );
}

function JobCard({ job, onApply }: { job: JobListing; onApply: (job: JobListing) => void }) {
  const expired = job.status === "Expired";
  return (
    <article className={`job-card ${job.tier === "Featured" ? "featured" : ""} ${expired ? "expired" : ""}`}>
      {job.tier === "Featured" && !expired && <span className="job-featured-badge"><Star size={11} fill="currentColor" /> Featured</span>}
      <div className="job-card-head">
        <img src={schoolThumb[job.school] || img.campus} alt="" className="job-school-thumb" />
        <div>
          <strong className="job-title">{job.title}</strong>
          <span className="job-school-line">{job.school} · <MapPin size={11} />{job.location}</span>
        </div>
      </div>
      <div className="job-tags"><span>{job.role}</span><span>{job.type}</span><span>{job.level}</span></div>
      <p className="job-description">{job.description}</p>
      <div className="job-meta-row">
        <span><Banknote size={12} /> {job.salary}</span>
        <span><Clock3 size={12} /> {expired ? "Applications closed" : `Apply by ${job.deadline}`}</span>
      </div>
      <div className="job-card-foot">
        <span className="job-applicant-count">{job.applicants} applicant{job.applicants === 1 ? "" : "s"} so far</span>
        {expired ? <span className="job-expired-tag">Closed</span> : <button className="small-dark-button" onClick={() => onApply(job)}>Apply now <ArrowUpRight size={14} /></button>}
      </div>
    </article>
  );
}

export default function Careers() {
  const [role, setRole] = useState<(typeof roleFilters)[number]>("All roles");
  const [applyTo, setApplyTo] = useState<JobListing | null>(null);

  const visible = useMemo(() => {
    const active = jobListings.filter((j) => j.status !== "Draft");
    const filtered = role === "All roles" ? active : active.filter((j) => j.role === role);
    return [...filtered].sort((a, b) => {
      if (a.status !== b.status) return a.status === "Expired" ? 1 : -1;
      if (a.tier !== b.tier) return a.tier === "Featured" ? -1 : 1;
      return 0;
    });
  }, [role]);

  const openCount = jobListings.filter((j) => j.status === "Active").length;

  return (
    <div className="site-page careers-page">
      <Header active="jobs" />
      <main>
        <section className="resources-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/">Home</Link><ChevronRight size={14} /><span>Teaching jobs</span></div>
            <div className="resources-hero-grid">
              <div>
                <div className="eyebrow light"><span className="eyebrow-line" />For teachers &amp; coaches</div>
                <h1>Open roles at schools<br /><em>worth teaching at.</em></h1>
                <p>{openCount} open positions from verified schools on streamflo — teaching, coaching and support roles, updated as schools post them.</p>
              </div>
              <div className="resources-quicklinks">
                <button onClick={() => openModal("schoolLogin")}><span><strong>Hiring at your school?</strong><small>Sign in to post a vacancy</small></span><ArrowUpRight size={16} /></button>
                <Link href="/list-your-school"><span><strong>New to streamflo?</strong><small>List &amp; verify your school first</small></span><ArrowUpRight size={16} /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section jobs-body">
          <div className="container">
            <div className="job-filter-row">
              <span>Filter by role</span>
              {roleFilters.map((r) => (
                <button key={r} className={`filter-chip ${role === r ? "active" : ""}`} onClick={() => setRole(r)}>{r}</button>
              ))}
            </div>
            <div className="job-grid">
              {visible.map((job) => <JobCard key={job.id} job={job} onApply={setApplyTo} />)}
            </div>
            {visible.length === 0 && <p className="modal-copy">No open roles match that filter right now.</p>}

            <div className="cta-inner resources-help jobs-cta">
              <div>
                <div className="eyebrow light"><span className="eyebrow-line" />For schools</div>
                <h2>Hiring for<br /><em>next term?</em></h2>
                <p>Post a vacancy from your school dashboard and reach teachers and coaches actively browsing streamflo. Featured listings sit at the top of the board.</p>
              </div>
              <div className="cta-actions">
                <button className="cream-button" onClick={() => openModal("schoolLogin")}><Sparkles size={15} /> Post a vacancy</button>
                <Link href="/school-resources" className="cta-secondary-link">Not listed yet? Start here <ArrowUpRight size={14} /></Link>
              </div>
              <div className="cta-orbit orbit-a" /><div className="cta-orbit orbit-b" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      {applyTo && <ApplyModal job={applyTo} onClose={() => setApplyTo(null)} />}
    </div>
  );
}
