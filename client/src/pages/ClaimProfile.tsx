import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Lock,
  MapPin,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import { Footer, Header, img } from "./Home";
import { UploadSlot, type UploadedDoc } from "./ListYourSchool";
import { findSchool, profileHref, schools, type SchoolRecord } from "./schoolsData";

const steps = [
  { id: 1, label: "Find your school", hint: "Search streamflo's listings" },
  { id: 2, label: "Confirm the profile", hint: "And tell us who you are" },
  { id: 3, label: "Verify the business", hint: "KYB documents" },
  { id: 4, label: "Review & submit", hint: "Declare and send for review" },
] as const;

const roles = ["Principal / Head teacher", "School director", "Proprietor", "Admissions officer", "Marketing / communications", "Other"];

const kybDocs = [
  { id: "registration", label: "Certificate of registration / MOE permit", hint: "The official document licensing the school to operate", required: true },
  { id: "business", label: "Business registration certificate", hint: "Certificate of incorporation or business name registration", required: true },
  { id: "kra", label: "KRA PIN certificate", hint: "Recommended — speeds up review", required: false },
  { id: "address", label: "Proof of physical address", hint: "A recent utility bill, lease or county rates receipt", required: true },
  { id: "authority", label: "Letter of authority", hint: "On school letterhead, signed by a director, naming you as the profile manager", required: true },
] as const;

type DocId = (typeof kybDocs)[number]["id"];
type Claimant = { fullName: string; role: string; email: string; phone: string };
type Business = { legalName: string; moeNumber: string; kraPin: string };

const emptyDocs: Record<DocId, UploadedDoc> = { registration: null, business: null, kra: null, address: null, authority: null };

export default function ClaimProfile() {
  const [preselected] = useState(() => findSchool(new URLSearchParams(window.location.search).get("school")));
  const claimable = preselected?.claim === "unclaimed" ? preselected : undefined;

  const [step, setStep] = useState(claimable ? 2 : 1);
  const [school, setSchool] = useState<SchoolRecord | undefined>(claimable);
  const [query, setQuery] = useState(preselected && !claimable ? preselected.name : "");
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const [claimant, setClaimant] = useState<Claimant>({ fullName: "", role: "", email: "", phone: "" });
  const [business, setBusiness] = useState<Business>({ legalName: "", moeNumber: "", kraPin: "" });
  const [docs, setDocs] = useState(emptyDocs);
  const [declarations, setDeclarations] = useState({ accuracy: false, authorized: false, consent: false });
  const [signature, setSignature] = useState("");

  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function updateClaimant(key: keyof Claimant) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setClaimant((c) => ({ ...c, [key]: e.target.value }));
  }
  function updateBusiness(key: keyof Business) {
    return (e: ChangeEvent<HTMLInputElement>) => setBusiness((b) => ({ ...b, [key]: e.target.value }));
  }
  function goToStep(e: FormEvent<HTMLFormElement>, next: number) {
    e.preventDefault();
    setStep(next);
  }
  function choose(next: SchoolRecord) {
    setSchool(next);
    setStep(2);
  }
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setReferenceId(`CLM-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const q = query.trim().toLowerCase();
  const results = schools.filter((s) => !q || `${s.name} ${s.town} ${s.county}`.toLowerCase().includes(q));
  const unclaimedCount = results.filter((s) => s.claim === "unclaimed").length;
  // Later steps need a chosen school; fall back to search if there isn't one.
  const activeStep = school ? step : 1;

  if (submitted && school) {
    return (
      <div className="site-page onboarding-page">
        <Header active="claim" />
        <main>
          <section className="onboarding-confirmation">
            <div className="container onboarding-confirmation-inner">
              <span className="confirmation-icon"><CheckCircle2 size={30} /></span>
              <div className="eyebrow light"><span className="eyebrow-line" />Claim submitted</div>
              <h1>We've got your claim.</h1>
              <p>Thanks, {claimant.fullName.split(" ")[0] || "there"}. Our team will check the business documents for {school.name} by hand. Once they're approved, we'll email {claimant.email || "you"} with access to the school dashboard.</p>
              <div className="reference-box"><small>Your claim reference</small><strong>{referenceId}</strong></div>
              <div className="status-timeline">
                <div className="status-step done"><span><Check size={13} /></span><div><strong>Claim submitted</strong><small>Just now</small></div></div>
                <div className="status-step active"><span><Clock3 size={13} /></span><div><strong>KYB review</strong><small>Typically 1–2 business days</small></div></div>
                <div className="status-step"><span><ShieldCheck size={13} /></span><div><strong>Profile handed over</strong><small>You manage what families see</small></div></div>
              </div>
              <div className="confirmation-actions">
                <Link href="/school-admin" className="cream-button">Preview the school dashboard <ArrowUpRight size={16} /></Link>
                <Link href={profileHref} className="onboarding-secondary-link">Back to the {school.name} profile</Link>
                <Link href="/school-resources" className="onboarding-secondary-link">Get your profile parent-ready <ArrowUpRight size={14} /></Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-page onboarding-page claim-page">
      <Header active="claim" />
      <main>
        <section className="onboarding-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/">Home</Link><ChevronRight size={14} /><Link href="/school-resources">For schools</Link><ChevronRight size={14} /><span>Claim a profile</span></div>
            <div className="onboarding-hero-grid">
              <div>
                <div className="eyebrow light"><span className="eyebrow-line" />For school administrators</div>
                <h1>Claim your<br />school's <em>profile.</em></h1>
                <p>If families can already find your school on streamflo, there's no need to list it again. Find the profile, verify the business behind it, and take charge of the fees, photos and admission dates parents see.</p>
              </div>
              <div className="onboarding-trust">
                <div><BadgeCheck size={18} /><span><strong>Keep what's there</strong><small>Reviews and details carry over</small></span></div>
                <div><Clock3 size={18} /><span><strong>~1–2 business days</strong><small>Typical KYB review time</small></span></div>
                <div><Lock size={18} /><span><strong>Documents stay private</strong><small>Never shown on your public profile</small></span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="onboarding-body" ref={mainRef}>
          <div className="container onboarding-layout">
            <aside className="onboarding-steps">
              <div className="steps-card">
                {steps.map((s) => (
                  <div key={s.id} className={`onboarding-step ${activeStep === s.id ? "active" : ""} ${activeStep > s.id ? "done" : ""}`}>
                    <span className="step-index">{activeStep > s.id ? <Check size={12} /> : s.id}</span>
                    <div><strong>{s.label}</strong><small>{s.hint}</small></div>
                  </div>
                ))}
              </div>
              <div className="claim-benefits">
                <strong>Once it's yours, you can</strong>
                <ul>
                  <li><Check size={13} /> Keep fees and admission dates current</li>
                  <li><Check size={13} /> Add photos, documents and a prospectus</li>
                  <li><Check size={13} /> Reply to parent enquiries</li>
                  <li><Check size={13} /> Receive applications online</li>
                </ul>
              </div>
              <div className="onboarding-help">
                <ShieldCheck size={18} />
                <strong>Why we check every claim</strong>
                <p>A claimed profile controls what families see about a real school. We verify the business and your authority first, so no one else can take over your listing.</p>
              </div>
            </aside>

            <div className="onboarding-main">
              {activeStep === 1 && (
                <div className="flow-form kyc-form">
                  <div className="kyc-step-head">
                    <div className="eyebrow"><span className="eyebrow-line" />Step 1 of 4</div>
                    <h2>Find your school's profile.</h2>
                    <p className="modal-copy">Search by school name, town or county. If parents can already find you on streamflo, your profile is in this list.</p>
                  </div>
                  <div className="claim-search">
                    <Search size={17} />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Greenfield Academy or Ruiru" aria-label="Search for your school" />
                    {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}
                  </div>
                  <div>
                    <div className="claim-results-meta">
                      <span>{q ? `${results.length} ${results.length === 1 ? "match" : "matches"} for “${query.trim()}”` : "Schools listed on streamflo"}</span>
                      <span>{unclaimedCount} unclaimed</span>
                    </div>
                    <div className="claim-results">
                      {results.map((s) => (
                        <div className="claim-result" key={s.slug}>
                          <img src={img[s.image]} alt="" />
                          <div className="claim-result-copy">
                            <strong>{s.name}</strong>
                            <small><MapPin size={12} /> {s.town}, {s.county} · {s.curriculum} · {s.levels}</small>
                          </div>
                          <div className="claim-result-action">
                            {s.claim === "unclaimed" ? (
                              <>
                                <span className="claim-pill unclaimed">Unclaimed</span>
                                <button type="button" className="primary-action" onClick={() => choose(s)}>Claim this profile <ArrowRight size={14} /></button>
                              </>
                            ) : (
                              <>
                                <span className="claim-pill claimed"><BadgeCheck size={12} /> Managed by the school</span>
                                <button type="button" className="claim-dispute" onClick={() => toast("Ownership disputes are reviewed by our team — ready to connect")}>Think this is wrong?</button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                      {results.length === 0 && <p className="claim-no-results">No listed schools match “{query.trim()}”. Check the spelling, or try the town instead.</p>}
                    </div>
                  </div>
                  <div className="claim-not-found">
                    <div><strong>Can't find your school?</strong><small>It may not be listed yet. You can add it, with the same verification.</small></div>
                    <Link href="/list-your-school" className="outline-button">List your school <ArrowUpRight size={14} /></Link>
                  </div>
                </div>
              )}

              {activeStep === 2 && school && (
                <form className="flow-form kyc-form" onSubmit={(e) => goToStep(e, 3)}>
                  <div className="kyc-step-head">
                    <div className="eyebrow"><span className="eyebrow-line" />Step 2 of 4</div>
                    <h2>Is this your school?</h2>
                    <p className="modal-copy">Check it's the right profile, then tell us who's claiming it. We'll use these details to contact you about the review.</p>
                  </div>
                  <div className="claim-selected">
                    <img src={img[school.image]} alt={`${school.name} campus`} />
                    <div>
                      <span className="claim-pill unclaimed">Unclaimed profile</span>
                      <h3>{school.name}</h3>
                      <span className="school-location"><MapPin size={13} />{school.town}, {school.county}</span>
                      <div className="school-tags"><span>{school.type}</span><span>{school.gender}</span><span>{school.mode}</span><span>{school.curriculum}</span></div>
                      <button type="button" className="text-link" onClick={() => setStep(1)}>Not your school? Search again</button>
                    </div>
                  </div>
                  <div className="form-grid">
                    <label>Your full name<input required placeholder="e.g. Jane Wanjiku Mwangi" value={claimant.fullName} onChange={updateClaimant("fullName")} /></label>
                    <label>Your role at the school<select required value={claimant.role} onChange={updateClaimant("role")}><option value="" disabled>Select role</option>{roles.map((r) => <option key={r}>{r}</option>)}</select></label>
                    <label>Work email<input required type="email" placeholder="you@school.ac.ke" value={claimant.email} onChange={updateClaimant("email")} /></label>
                    <label>Phone number<input required type="tel" placeholder="+254 7XX XXX XXX" value={claimant.phone} onChange={updateClaimant("phone")} /></label>
                  </div>
                  <p className="field-hint">Using an email address on the school's own domain helps us confirm your connection faster.</p>
                  <div className="flow-button-row"><button className="back-button" type="button" onClick={() => setStep(1)}><ArrowLeft size={15} /> Back</button><button className="primary-action" type="submit">Continue <ArrowRight size={16} /></button></div>
                </form>
              )}

              {activeStep === 3 && school && (
                <form className="flow-form kyc-form" onSubmit={(e) => goToStep(e, 4)}>
                  <div className="kyc-step-head">
                    <div className="eyebrow"><span className="eyebrow-line" />Step 3 of 4</div>
                    <h2>Verify the business behind it.</h2>
                    <p className="modal-copy">This is the KYB (Know Your Business) check. It confirms {school.name} is a registered institution and that you're authorised to manage its profile.</p>
                  </div>
                  <div className="form-grid">
                    <label>Registered legal name<input required placeholder={`e.g. ${school.name} Ltd`} value={business.legalName} onChange={updateBusiness("legalName")} /></label>
                    <label>MOE registration / permit number<input required placeholder="e.g. MOE/PVT/2014/0456" value={business.moeNumber} onChange={updateBusiness("moeNumber")} /></label>
                    <label>KRA PIN (tax ID)<input required placeholder="e.g. P051234567X" value={business.kraPin} onChange={updateBusiness("kraPin")} /></label>
                  </div>
                  <div className="form-grid upload-grid">
                    {kybDocs.map((doc) => (
                      <UploadSlot key={doc.id} id={`claim-doc-${doc.id}`} label={doc.label} hint={doc.hint} required={doc.required} doc={docs[doc.id]} onSelect={(file) => setDocs((d) => ({ ...d, [doc.id]: file }))} />
                    ))}
                  </div>
                  <div className="flow-button-row"><button className="back-button" type="button" onClick={() => setStep(2)}><ArrowLeft size={15} /> Back</button><button className="primary-action" type="submit">Review claim <ArrowRight size={16} /></button></div>
                </form>
              )}

              {activeStep === 4 && school && (
                <form className="flow-form kyc-form" onSubmit={handleSubmit}>
                  <div className="kyc-step-head">
                    <div className="eyebrow"><span className="eyebrow-line" />Step 4 of 4</div>
                    <h2>Review and send for verification.</h2>
                    <p className="modal-copy">Nothing changes on the public profile until our team approves the claim.</p>
                  </div>

                  <div className="review-groups">
                    <div className="review-group">
                      <div className="review-group-head"><h3>Profile being claimed</h3><button type="button" className="text-link" onClick={() => setStep(1)}>Change</button></div>
                      <div className="review-card">
                        <div><small>School</small><strong>{school.name}</strong></div>
                        <div><small>Location</small><strong>{school.town}, {school.county}</strong></div>
                        <div><small>Curriculum</small><strong>{school.curriculum} · {school.levels}</strong></div>
                      </div>
                    </div>

                    <div className="review-group">
                      <div className="review-group-head"><h3>Your details</h3><button type="button" className="text-link" onClick={() => setStep(2)}>Edit</button></div>
                      <div className="review-card">
                        <div><small>Name</small><strong>{claimant.fullName || "—"}</strong></div>
                        <div><small>Role</small><strong>{claimant.role || "—"}</strong></div>
                        <div><small>Contact</small><strong>{[claimant.email, claimant.phone].filter(Boolean).join(" · ") || "—"}</strong></div>
                      </div>
                    </div>

                    <div className="review-group">
                      <div className="review-group-head"><h3>Business verification</h3><button type="button" className="text-link" onClick={() => setStep(3)}>Edit</button></div>
                      <div className="review-card">
                        <div><small>Legal name</small><strong>{business.legalName || "—"}</strong></div>
                        <div><small>MOE number</small><strong>{business.moeNumber || "—"}</strong></div>
                        <div><small>KRA PIN</small><strong>{business.kraPin || "—"}</strong></div>
                      </div>
                      <div className="document-list">
                        {kybDocs.map((doc) => (
                          <div className="document-row" key={doc.id}>
                            <span className="document-icon">{docs[doc.id] ? <CheckCircle2 size={17} /> : <FileText size={17} />}</span>
                            <span><strong>{doc.label}</strong><small>{docs[doc.id]?.name ?? "Not uploaded"}</small></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="declaration-list">
                    <label className="declaration-row">
                      <input required type="checkbox" checked={declarations.accuracy} onChange={(e) => setDeclarations((d) => ({ ...d, accuracy: e.target.checked }))} />
                      <span>I confirm the information and documents provided are accurate and complete to the best of my knowledge.</span>
                    </label>
                    <label className="declaration-row">
                      <input required type="checkbox" checked={declarations.authorized} onChange={(e) => setDeclarations((d) => ({ ...d, authorized: e.target.checked }))} />
                      <span>I'm authorised to manage {school.name}'s profile on streamflo on the school's behalf.</span>
                    </label>
                    <label className="declaration-row">
                      <input required type="checkbox" checked={declarations.consent} onChange={(e) => setDeclarations((d) => ({ ...d, consent: e.target.checked }))} />
                      <span>I agree to streamflo's Terms of Service and Privacy Policy, and consent to verification of the details and documents I've provided.</span>
                    </label>
                  </div>
                  <label className="signature-label">
                    Type your full name to sign
                    <input required className="signature-field" placeholder="Your full name" value={signature} onChange={(e) => setSignature(e.target.value)} />
                    <small className="field-hint">Signed on {new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</small>
                  </label>
                  <div className="flow-button-row"><button className="back-button" type="button" onClick={() => setStep(3)}><ArrowLeft size={15} /> Back</button><button className="primary-action" type="submit"><ShieldCheck size={15} /> Submit claim</button></div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
