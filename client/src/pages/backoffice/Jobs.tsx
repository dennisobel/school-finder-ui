import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Briefcase,
  Check,
  Clock3,
  Plus,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";

import { MpesaPaymentModal } from "@/components/MpesaPaymentModal";
import BackofficeShell from "./Shell";
import { jobListings as seedListings, type JobListing, type JobTier } from "../jobs-data";

const SCHOOL_NAME = "Greenfield Academy";

const roleOptions: JobListing["role"][] = ["Teacher", "Coach", "Support staff", "Leadership"];
const typeOptions: JobListing["type"][] = ["Full-time", "Part-time", "Contract"];

type Package = { id: JobTier; name: string; price: string; amount: string; duration: string; features: string[] };

const packages: Package[] = [
  { id: "Standard", name: "Standard listing", price: "KES 1,500", amount: "KES 1,500", duration: "30 days", features: ["Listed on the public jobs board", "Applicant details in your dashboard", "Live for 30 days"] },
  { id: "Featured", name: "Featured listing", price: "KES 3,500", amount: "KES 3,500", duration: "30 days", features: ["Everything in Standard", "Pinned above Standard listings", "Featured badge on the board", "Included in the weekly teacher digest"] },
];

const statusTone: Record<JobListing["status"], string> = { Active: "tone-accepted", Expired: "tone-closed", Draft: "tone-new" };

type Draft = { title: string; role: JobListing["role"]; subject: string; level: string; type: JobListing["type"]; salary: string; description: string };
const emptyDraft: Draft = { title: "", role: "Teacher", subject: "", level: "", type: "Full-time", salary: "", description: "" };

function PostJobModal({ onClose, onPublish }: { onClose: () => void; onPublish: (draft: Draft, pkg: Package) => void }) {
  const [step, setStep] = useState<"details" | "package" | "pay">("details");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [pkg, setPkg] = useState<Package>(packages[0]);

  if (step === "pay") {
    return (
      <MpesaPaymentModal
        eyebrow={`Pay ${pkg.amount} to publish`}
        title={`Post as a ${pkg.name.toLowerCase()}.`}
        amount={pkg.amount}
        amountLabel={`${pkg.name} · ${pkg.duration}`}
        payNote="This is a UI preview, so no real payment is taken. In production this charges your school's M-Pesa or invoiced account."
        successTitle="Vacancy published."
        successBody={`"${draft.title || "Your listing"}" is now live on the streamflo jobs board for ${pkg.duration}.`}
        ctaLabel="View my listing"
        onClose={onClose}
        onSuccess={() => onPublish(draft, pkg)}
      />
    );
  }

  if (step === "package") {
    return (
      <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <div className="flow-modal wide" role="dialog" aria-modal="true" aria-label="Choose a package">
          <button className="modal-close" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
          <div className="modal-eyebrow">Step 2 of 2 · Choose a package</div>
          <h2>How visible should this be?</h2>
          <div className="package-grid">
            {packages.map((p) => (
              <button type="button" key={p.id} className={`package-card ${pkg.id === p.id ? "active" : ""}`} onClick={() => setPkg(p)}>
                {p.id === "Featured" && <span className="package-recommended"><Star size={11} fill="currentColor" /> Most reach</span>}
                <strong className="package-name">{p.name}</strong>
                <div className="package-price">{p.price}<small>/ {p.duration}</small></div>
                <ul className="unlock-features package-features">
                  {p.features.map((f) => <li key={f}><Check size={13} /> {f}</li>)}
                </ul>
              </button>
            ))}
          </div>
          <div className="flow-button-row"><button className="back-button" onClick={() => setStep("details")}><ArrowLeft size={15} /> Back</button><button className="primary-action flow-next" onClick={() => setStep("pay")}>Continue to payment <ArrowRight size={16} /></button></div>
        </div>
      </div>
    );
  }

  const valid = draft.title && draft.subject && draft.level && draft.salary;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flow-modal wide" role="dialog" aria-modal="true" aria-label="Post a vacancy">
        <button className="modal-close" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        <div className="modal-eyebrow">Step 1 of 2 · Role details</div>
        <h2>Post a vacancy</h2>
        <div className="flow-form">
          <div className="form-grid">
            <label>Job title<input required placeholder="e.g. Senior School Physics Teacher" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} /></label>
            <label>Role type<select value={draft.role} onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value as JobListing["role"] }))}>{roleOptions.map((r) => <option key={r}>{r}</option>)}</select></label>
            <label>Subject / focus area<input required placeholder="e.g. Physics" value={draft.subject} onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))} /></label>
            <label>Level<input required placeholder="e.g. Senior School" value={draft.level} onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))} /></label>
            <label>Employment type<select value={draft.type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as JobListing["type"] }))}>{typeOptions.map((t) => <option key={t}>{t}</option>)}</select></label>
            <label>Salary range<input required placeholder="e.g. KES 60,000 – 80,000 / month" value={draft.salary} onChange={(e) => setDraft((d) => ({ ...d, salary: e.target.value }))} /></label>
          </div>
          <label>Role description<textarea rows={3} placeholder="What will they be responsible for?" value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} /></label>
          <div className="flow-button-row solo"><button className="primary-action flow-next" disabled={!valid} onClick={() => setStep("package")}>Choose a package <ArrowRight size={16} /></button></div>
        </div>
      </div>
    </div>
  );
}

function BoostJobModal({ job, onClose, onBoosted }: { job: JobListing; onClose: () => void; onBoosted: (id: string) => void }) {
  const featured = packages[1];
  return (
    <MpesaPaymentModal
      eyebrow={`Pay ${featured.amount} to feature this listing`}
      title="Boost to featured."
      amount={featured.amount}
      amountLabel={`Featured upgrade · ${featured.duration}`}
      payNote={`Pin "${job.title}" to the top of the board and add it to this week's teacher digest.`}
      successTitle="Listing boosted."
      successBody={`"${job.title}" is now a featured listing for the next ${featured.duration}.`}
      ctaLabel="Done"
      onClose={onClose}
      onSuccess={() => onBoosted(job.id)}
    />
  );
}

export default function Jobs() {
  const [listings, setListings] = useState<JobListing[]>(seedListings.filter((j) => j.school === SCHOOL_NAME));
  const [posting, setPosting] = useState(false);
  const [boosting, setBoosting] = useState<JobListing | null>(null);

  const active = listings.filter((j) => j.status === "Active").length;
  const featured = listings.filter((j) => j.tier === "Featured" && j.status === "Active").length;
  const totalApplicants = listings.reduce((sum, j) => sum + j.applicants, 0);

  function publish(draft: Draft, pkg: Package) {
    const id = `job-new-${Date.now()}`;
    const listing: JobListing = {
      id,
      school: SCHOOL_NAME,
      schoolSlug: "greenfield-academy",
      location: "Ruiru, Kiambu",
      county: "Kiambu",
      title: draft.title,
      role: draft.role,
      subject: draft.subject,
      level: draft.level,
      type: draft.type,
      salary: draft.salary,
      postedOn: "Just now",
      deadline: `${pkg.duration} from today`,
      tier: pkg.id,
      status: "Active",
      applicants: 0,
      description: draft.description || "No description provided.",
      requirements: [],
    };
    setListings((prev) => [listing, ...prev]);
    setPosting(false);
    toast(`"${draft.title}" is live on the jobs board`);
  }

  function boost(id: string) {
    setListings((prev) => prev.map((j) => (j.id === id ? { ...j, tier: "Featured" } : j)));
    setBoosting(null);
    toast("Listing boosted to Featured");
  }

  function closeListing(id: string) {
    setListings((prev) => prev.map((j) => (j.id === id ? { ...j, status: "Expired" } : j)));
    toast("Listing closed");
  }

  return (
    <BackofficeShell active="jobs" eyebrow="Jobs" title="Teaching & coaching jobs" actions={<button className="primary-action" onClick={() => setPosting(true)}><Plus size={15} /> Post a vacancy</button>}>
      <div className="bo-stat-grid">
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Active listings</span><span className="bo-stat-icon"><Briefcase size={15} /></span></div>
          <div className="bo-stat-value">{active}</div>
          <div className="bo-stat-delta">Out of {listings.length} posted</div>
        </div>
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Featured</span><span className="bo-stat-icon"><Star size={15} /></span></div>
          <div className="bo-stat-value">{featured}</div>
          <div className="bo-stat-delta">Pinned to the top of the board</div>
        </div>
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Applicants</span><span className="bo-stat-icon"><Users size={15} /></span></div>
          <div className="bo-stat-value">{totalApplicants}</div>
          <div className="bo-stat-delta up">Across all listings</div>
        </div>
      </div>

      <div className="bo-panel">
        <div className="bo-panel-head"><div><h2>Your listings</h2><p>Manage what teachers and coaches see on the public jobs board</p></div></div>
        <div className="job-manage-list">
          {listings.map((job) => (
            <div className="job-manage-row" key={job.id}>
              <div className="job-manage-main">
                <div className="job-manage-title-row">
                  <strong>{job.title}</strong>
                  <span className={`bo-status-pill ${statusTone[job.status]}`}>{job.status}</span>
                  {job.tier === "Featured" && <span className="bo-status-pill tone-offer"><Star size={11} /> Featured</span>}
                </div>
                <p>{job.role} · {job.level} · {job.type}</p>
                <div className="job-manage-meta">
                  <span><Banknote size={11} /> {job.salary}</span>
                  <span><Clock3 size={11} /> Posted {job.postedOn}</span>
                  <span><Users size={11} /> {job.applicants} applicant{job.applicants === 1 ? "" : "s"}</span>
                </div>
              </div>
              <div className="job-manage-actions">
                {job.tier === "Standard" && job.status === "Active" && <button className="outline-button" onClick={() => setBoosting(job)}><Sparkles size={13} /> Boost to featured</button>}
                {job.status === "Active" && <button className="back-button" onClick={() => closeListing(job.id)}>Close listing</button>}
                {job.status !== "Active" && <span className="job-manage-note">{job.status === "Draft" ? "Not yet published" : "No longer accepting applicants"}</span>}
              </div>
            </div>
          ))}
          {listings.length === 0 && <div style={{ padding: 24, color: "#8b968f", fontSize: 11, textAlign: "center" }}>No listings yet — post your first vacancy.</div>}
        </div>
      </div>

      {posting && <PostJobModal onClose={() => setPosting(false)} onPublish={publish} />}
      {boosting && <BoostJobModal job={boosting} onClose={() => setBoosting(null)} onBoosted={boost} />}
    </BackofficeShell>
  );
}
