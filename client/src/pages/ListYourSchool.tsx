import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Fingerprint,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { Footer, Header } from "./Home";

const counties = ["Nairobi", "Kiambu", "Mombasa", "Kisumu", "Nakuru", "Machakos", "Uasin Gishu", "Kilifi", "Kajiado", "Nyeri", "Meru", "Other"];
const schoolTypes = ["Private", "Public", "Faith-based", "International", "Special needs"];
const ownershipTypes = ["Sole proprietorship", "Partnership", "Private limited company", "Trust / Foundation", "Government / public institution"];
const curricula = ["CBC", "8-4-4", "British (Cambridge)", "American", "IB", "Other"];
const levelOptions = ["Pre-primary", "Primary", "Junior secondary", "Senior secondary"];
const repRoles = ["Principal / Head teacher", "School director", "Proprietor", "Admissions officer", "Other"];

const steps = [
  { id: 1, label: "School details", hint: "The basics about the institution" },
  { id: 2, label: "Registration documents", hint: "Prove it's a licensed school" },
  { id: 3, label: "Your identity", hint: "Verify who's applying" },
  { id: 4, label: "Declarations", hint: "Confirm accuracy & consent" },
  { id: 5, label: "Review & submit", hint: "Check everything, then send" },
] as const;

export type UploadedDoc = { name: string; size: number } | null;

type SchoolDetails = {
  legalName: string;
  tradingName: string;
  schoolType: string;
  ownership: string;
  curriculum: string;
  yearEstablished: string;
  enrollment: string;
  county: string;
  town: string;
  address: string;
  website: string;
};

type Representative = { fullName: string; role: string; idNumber: string; email: string; phone: string };
type Declarations = { accuracy: boolean; authorized: boolean; consent: boolean; marketing: boolean };

const emptySchool: SchoolDetails = { legalName: "", tradingName: "", schoolType: "", ownership: "", curriculum: "", yearEstablished: "", enrollment: "", county: "", town: "", address: "", website: "" };
const emptyRep: Representative = { fullName: "", role: "", idNumber: "", email: "", phone: "" };

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadSlot({ id, label, hint, required = false, doc, onSelect }: { id: string; label: string; hint: string; required?: boolean; doc: UploadedDoc; onSelect: (file: UploadedDoc) => void }) {
  return (
    <div className="upload-slot">
      <div className="upload-slot-copy">
        <strong>{label}{required && <span className="required-mark">*</span>}</strong>
        <small>{hint}</small>
      </div>
      {doc ? (
        <div className="upload-file-chip">
          <FileText size={15} />
          <span className="upload-file-name">{doc.name}</span>
          <small>{formatSize(doc.size)}</small>
          <button type="button" onClick={() => onSelect(null)} aria-label={`Remove ${label}`}><X size={13} /></button>
        </div>
      ) : (
        <label htmlFor={id} className="upload-drop">
          <Upload size={16} />
          <span>Click or drag to upload<small>PDF, JPG or PNG · up to 8MB</small></span>
          <input
            id={id}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            required={required}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 8 * 1024 * 1024) {
                toast("File is too large — please keep it under 8MB");
                e.target.value = "";
                return;
              }
              onSelect({ name: file.name, size: file.size });
            }}
          />
        </label>
      )}
    </div>
  );
}

export default function ListYourSchool() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  const [school, setSchool] = useState<SchoolDetails>(emptySchool);
  const [levels, setLevels] = useState<string[]>([]);
  const [rep, setRep] = useState<Representative>(emptyRep);
  const [declarations, setDeclarations] = useState<Declarations>({ accuracy: false, authorized: false, consent: false, marketing: false });
  const [signature, setSignature] = useState("");
  const [moeNumber, setMoeNumber] = useState("");
  const [kraPin, setKraPin] = useState("");

  const [regCertificate, setRegCertificate] = useState<UploadedDoc>(null);
  const [businessCert, setBusinessCert] = useState<UploadedDoc>(null);
  const [kraCertificate, setKraCertificate] = useState<UploadedDoc>(null);
  const [addressProof, setAddressProof] = useState<UploadedDoc>(null);
  const [idFront, setIdFront] = useState<UploadedDoc>(null);
  const [idBack, setIdBack] = useState<UploadedDoc>(null);
  const [selfie, setSelfie] = useState<UploadedDoc>(null);
  const [authLetter, setAuthLetter] = useState<UploadedDoc>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function updateSchool(key: keyof SchoolDetails) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setSchool((s) => ({ ...s, [key]: e.target.value }));
  }
  function updateRep(key: keyof Representative) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setRep((r) => ({ ...r, [key]: e.target.value }));
  }
  function toggleLevel(level: string) {
    setLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]));
  }
  function goToStep(e: FormEvent<HTMLFormElement>, next: number) {
    e.preventDefault();
    setStep(next);
  }
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ref = `SCH-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setReferenceId(ref);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="site-page onboarding-page">
        <Header active="list-school" />
        <main>
          <section className="onboarding-confirmation">
            <div className="container onboarding-confirmation-inner">
              <span className="confirmation-icon"><CheckCircle2 size={30} /></span>
              <div className="eyebrow light"><span className="eyebrow-line" />Verification submitted</div>
              <h1>We've got it from here.</h1>
              <p>Thanks for listing {school.legalName || "your school"} on streamflo. Our verification team reviews every KYC/KYB submission by hand — you'll hear from us by email once it's checked.</p>
              <div className="reference-box"><small>Your reference number</small><strong>{referenceId}</strong></div>
              <div className="status-timeline">
                <div className="status-step done"><span><Check size={13} /></span><div><strong>Submitted</strong><small>Just now</small></div></div>
                <div className="status-step active"><span><Clock3 size={13} /></span><div><strong>Under review</strong><small>Typically 1–2 business days</small></div></div>
                <div className="status-step"><span><ShieldCheck size={13} /></span><div><strong>Verified & live</strong><small>We'll email your admissions team</small></div></div>
              </div>
              <div className="confirmation-actions">
                <Link href="/school-admin" className="cream-button">Preview your school dashboard <ArrowUpRight size={16} /></Link>
                <Link href="/" className="onboarding-secondary-link">Back to homepage</Link>
                <Link href="/pathway-ai?school=1" className="onboarding-secondary-link"><Sparkles size={14} /> Preview Pathway AI for your students <ArrowUpRight size={14} /></Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-page onboarding-page">
      <Header active="list-school" />
      <main>
        <section className="onboarding-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/">Home</Link><ChevronRight size={14} /><span>List your school</span></div>
            <div className="onboarding-hero-grid">
              <div>
                <div className="eyebrow light"><span className="eyebrow-line" />For school administrators</div>
                <h1>Verify your school<br />to get <em>listed.</em></h1>
                <p>Every school on streamflo goes through identity and business verification (KYC/KYB) before it goes live — so families can trust what they find.</p>
              </div>
              <div className="onboarding-trust">
                <div><ShieldCheck size={18} /><span><strong>Reviewed by our team</strong><small>Every document checked by hand</small></span></div>
                <div><Clock3 size={18} /><span><strong>~1–2 business days</strong><small>Typical verification time</small></span></div>
                <div><Fingerprint size={18} /><span><strong>Kept private</strong><small>Never shown on your public profile</small></span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="onboarding-body" ref={mainRef}>
          <div className="container onboarding-layout">
            <aside className="onboarding-steps">
              <div className="steps-card">
                {steps.map((s) => (
                  <div key={s.id} className={`onboarding-step ${step === s.id ? "active" : ""} ${step > s.id ? "done" : ""}`}>
                    <span className="step-index">{step > s.id ? <Check size={12} /> : s.id}</span>
                    <div><strong>{s.label}</strong><small>{s.hint}</small></div>
                  </div>
                ))}
              </div>
              <div className="onboarding-help">
                <ShieldCheck size={18} />
                <strong>Why we verify schools</strong>
                <p>Verification protects families from fake listings and keeps streamflo trustworthy. Documents are reviewed by our team and never published on your profile.</p>
              </div>
            </aside>

            <div className="onboarding-main">
              {step === 1 && (
                <form className="flow-form kyc-form" onSubmit={(e) => goToStep(e, 2)}>
                  <div className="kyc-step-head">
                    <div className="eyebrow"><span className="eyebrow-line" />Step 1 of 5</div>
                    <h2>Tell us about the school.</h2>
                    <p className="modal-copy">This becomes the foundation of the public profile once you're verified.</p>
                  </div>
                  <div className="form-grid">
                    <label>Legal school name<input required placeholder="e.g. Greenfield Academy Ltd" value={school.legalName} onChange={updateSchool("legalName")} /></label>
                    <label>Display name <span className="optional-tag">optional</span><input placeholder="e.g. Greenfield Academy" value={school.tradingName} onChange={updateSchool("tradingName")} /></label>
                    <label>School type<select required value={school.schoolType} onChange={updateSchool("schoolType")}><option value="" disabled>Select type</option>{schoolTypes.map((t) => <option key={t}>{t}</option>)}</select></label>
                    <label>Ownership structure<select required value={school.ownership} onChange={updateSchool("ownership")}><option value="" disabled>Select structure</option>{ownershipTypes.map((t) => <option key={t}>{t}</option>)}</select></label>
                    <label>Primary curriculum<select required value={school.curriculum} onChange={updateSchool("curriculum")}><option value="" disabled>Select curriculum</option>{curricula.map((t) => <option key={t}>{t}</option>)}</select></label>
                    <label>Year established<input required type="number" min="1900" max={new Date().getFullYear()} placeholder="e.g. 2008" value={school.yearEstablished} onChange={updateSchool("yearEstablished")} /></label>
                    <label>County<select required value={school.county} onChange={updateSchool("county")}><option value="" disabled>Select county</option>{counties.map((c) => <option key={c}>{c}</option>)}</select></label>
                    <label>Town / area<input required placeholder="e.g. Ruiru" value={school.town} onChange={updateSchool("town")} /></label>
                    <label>Physical address<input required placeholder="e.g. Eastern Bypass, off Kamiti Road" value={school.address} onChange={updateSchool("address")} /></label>
                    <label>Current enrollment <span className="optional-tag">optional</span><input type="number" min="0" placeholder="e.g. 640" value={school.enrollment} onChange={updateSchool("enrollment")} /></label>
                    <label>School website <span className="optional-tag">optional</span><input type="url" placeholder="https://" value={school.website} onChange={updateSchool("website")} /></label>
                  </div>
                  <label className="levels-label">Education levels offered</label>
                  <div className="level-toggle">
                    {levelOptions.map((l) => (
                      <button type="button" key={l} className={levels.includes(l) ? "active" : ""} onClick={() => toggleLevel(l)}>
                        {levels.includes(l) && <Check size={12} />}{l}
                      </button>
                    ))}
                  </div>
                  <div className="flow-button-row solo"><button className="primary-action" type="submit">Continue <ArrowRight size={16} /></button></div>
                </form>
              )}

              {step === 2 && (
                <form className="flow-form kyc-form" onSubmit={(e) => goToStep(e, 3)}>
                  <div className="kyc-step-head">
                    <div className="eyebrow"><span className="eyebrow-line" />Step 2 of 5</div>
                    <h2>Prove it's licensed.</h2>
                    <p className="modal-copy">This is the KYB (Know Your Business) part — it confirms {school.legalName || "the school"} is a real, registered institution.</p>
                  </div>
                  <div className="form-grid">
                    <label>Ministry of Education registration / permit number<input required placeholder="e.g. MOE/PVT/2014/0456" value={moeNumber} onChange={(e) => setMoeNumber(e.target.value)} /></label>
                    <label>KRA PIN (tax ID)<input required placeholder="e.g. P051234567X" value={kraPin} onChange={(e) => setKraPin(e.target.value)} /></label>
                  </div>
                  <div className="form-grid upload-grid">
                    <UploadSlot id="doc-reg" label="Certificate of registration / MOE permit" hint="The official document licensing the school to operate" required doc={regCertificate} onSelect={setRegCertificate} />
                    <UploadSlot id="doc-business" label="Business registration certificate" hint="Certificate of incorporation or business name registration" required doc={businessCert} onSelect={setBusinessCert} />
                    <UploadSlot id="doc-kra" label="KRA PIN certificate" hint="Recommended — speeds up review" doc={kraCertificate} onSelect={setKraCertificate} />
                    <UploadSlot id="doc-address" label="Proof of physical address" hint="A recent utility bill, lease or county rates receipt" required doc={addressProof} onSelect={setAddressProof} />
                  </div>
                  <div className="flow-button-row"><button className="back-button" type="button" onClick={() => setStep(1)}><ArrowLeft size={15} /> Back</button><button className="primary-action" type="submit">Continue <ArrowRight size={16} /></button></div>
                </form>
              )}

              {step === 3 && (
                <form className="flow-form kyc-form" onSubmit={(e) => goToStep(e, 4)}>
                  <div className="kyc-step-head">
                    <div className="eyebrow"><span className="eyebrow-line" />Step 3 of 5</div>
                    <h2>Verify it's really you.</h2>
                    <p className="modal-copy">The KYC (Know Your Customer) part — we confirm the identity of the person submitting this listing.</p>
                  </div>
                  <div className="form-grid">
                    <label>Full legal name (as on your ID)<input required placeholder="e.g. Jane Wanjiku Mwangi" value={rep.fullName} onChange={updateRep("fullName")} /></label>
                    <label>Your role at the school<select required value={rep.role} onChange={updateRep("role")}><option value="" disabled>Select role</option>{repRoles.map((r) => <option key={r}>{r}</option>)}</select></label>
                    <label>National ID or passport number<input required placeholder="e.g. 30112233" value={rep.idNumber} onChange={updateRep("idNumber")} /></label>
                    <label>Email address<input required type="email" placeholder="you@example.com" value={rep.email} onChange={updateRep("email")} /></label>
                    <label>Phone number<input required type="tel" placeholder="+254 7XX XXX XXX" value={rep.phone} onChange={updateRep("phone")} /></label>
                  </div>
                  <div className="form-grid upload-grid">
                    <UploadSlot id="doc-id-front" label="Government-issued ID (front)" hint="National ID, passport bio page or driving license" required doc={idFront} onSelect={setIdFront} />
                    <UploadSlot id="doc-id-back" label="Government-issued ID (back)" hint="Skip this if you uploaded a passport" doc={idBack} onSelect={setIdBack} />
                    <UploadSlot id="doc-selfie" label="A selfie holding your ID" hint="Optional — adds an extra layer of trust and can speed up review" doc={selfie} onSelect={setSelfie} />
                    <UploadSlot id="doc-auth" label="Letter of authorization" hint="Only needed if you're not the school's legal owner or director" doc={authLetter} onSelect={setAuthLetter} />
                  </div>
                  <div className="flow-button-row"><button className="back-button" type="button" onClick={() => setStep(2)}><ArrowLeft size={15} /> Back</button><button className="primary-action" type="submit">Continue <ArrowRight size={16} /></button></div>
                </form>
              )}

              {step === 4 && (
                <form className="flow-form kyc-form" onSubmit={(e) => goToStep(e, 5)}>
                  <div className="kyc-step-head">
                    <div className="eyebrow"><span className="eyebrow-line" />Step 4 of 5</div>
                    <h2>A few confirmations.</h2>
                    <p className="modal-copy">Standard declarations before we send this for review.</p>
                  </div>
                  <div className="declaration-list">
                    <label className="declaration-row">
                      <input required type="checkbox" checked={declarations.accuracy} onChange={(e) => setDeclarations((d) => ({ ...d, accuracy: e.target.checked }))} />
                      <span>I confirm the information and documents provided are accurate and complete to the best of my knowledge.</span>
                    </label>
                    <label className="declaration-row">
                      <input required type="checkbox" checked={declarations.authorized} onChange={(e) => setDeclarations((d) => ({ ...d, authorized: e.target.checked }))} />
                      <span>I confirm I am authorized to list {school.legalName || "this school"} on streamflo on its behalf.</span>
                    </label>
                    <label className="declaration-row">
                      <input required type="checkbox" checked={declarations.consent} onChange={(e) => setDeclarations((d) => ({ ...d, consent: e.target.checked }))} />
                      <span>I agree to streamflo's Terms of Service and Privacy Policy, and consent to verification of the details and documents I've provided.</span>
                    </label>
                    <label className="declaration-row">
                      <input type="checkbox" checked={declarations.marketing} onChange={(e) => setDeclarations((d) => ({ ...d, marketing: e.target.checked }))} />
                      <span>Keep me updated about admissions tools and Pathway AI for my school. <span className="optional-tag">optional</span></span>
                    </label>
                  </div>
                  <label className="signature-label">
                    Type your full name to sign
                    <input required className="signature-field" placeholder="Your full name" value={signature} onChange={(e) => setSignature(e.target.value)} />
                    <small className="field-hint">Signed on {new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</small>
                  </label>
                  <div className="flow-button-row"><button className="back-button" type="button" onClick={() => setStep(3)}><ArrowLeft size={15} /> Back</button><button className="primary-action" type="submit">Review details <ArrowRight size={16} /></button></div>
                </form>
              )}

              {step === 5 && (
                <form className="flow-form kyc-form" onSubmit={handleSubmit}>
                  <div className="kyc-step-head">
                    <div className="eyebrow"><span className="eyebrow-line" />Step 5 of 5</div>
                    <h2>Review before you send it.</h2>
                    <p className="modal-copy">This stays private until our team completes verification.</p>
                  </div>

                  <div className="review-groups">
                    <div className="review-group">
                      <div className="review-group-head"><h3>School details</h3><button type="button" className="text-link" onClick={() => setStep(1)}>Edit</button></div>
                      <div className="review-card">
                        <div><small>Legal name</small><strong>{school.legalName || "—"}</strong></div>
                        <div><small>Type</small><strong>{school.schoolType || "—"} · {school.ownership || "—"}</strong></div>
                        <div><small>Curriculum</small><strong>{school.curriculum || "—"}</strong></div>
                        <div><small>Location</small><strong>{[school.town, school.county].filter(Boolean).join(", ") || "—"}</strong></div>
                        <div><small>Levels offered</small><strong>{levels.length ? levels.join(", ") : "—"}</strong></div>
                      </div>
                    </div>

                    <div className="review-group">
                      <div className="review-group-head"><h3>Registration documents</h3><button type="button" className="text-link" onClick={() => setStep(2)}>Edit</button></div>
                      <div className="document-list">
                        {[
                          { name: "Certificate of registration / MOE permit", doc: regCertificate },
                          { name: "Business registration certificate", doc: businessCert },
                          { name: "KRA PIN certificate", doc: kraCertificate },
                          { name: "Proof of physical address", doc: addressProof },
                        ].map((row) => (
                          <div className="document-row" key={row.name}>
                            <span className="document-icon">{row.doc ? <CheckCircle2 size={17} /> : <FileText size={17} />}</span>
                            <span><strong>{row.name}</strong><small>{row.doc ? row.doc.name : "Not uploaded"}</small></span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="review-group">
                      <div className="review-group-head"><h3>Your identity</h3><button type="button" className="text-link" onClick={() => setStep(3)}>Edit</button></div>
                      <div className="review-card">
                        <div><small>Name</small><strong>{rep.fullName || "—"}</strong></div>
                        <div><small>Role</small><strong>{rep.role || "—"}</strong></div>
                        <div><small>ID number</small><strong>{rep.idNumber || "—"}</strong></div>
                        <div><small>Contact</small><strong>{rep.email || "—"}</strong></div>
                      </div>
                      <div className="document-list">
                        {[
                          { name: "Government ID (front)", doc: idFront },
                          { name: "Government ID (back)", doc: idBack },
                          { name: "Selfie with ID", doc: selfie },
                          { name: "Letter of authorization", doc: authLetter },
                        ].map((row) => (
                          <div className="document-row" key={row.name}>
                            <span className="document-icon">{row.doc ? <CheckCircle2 size={17} /> : <FileText size={17} />}</span>
                            <span><strong>{row.name}</strong><small>{row.doc ? row.doc.name : "Not provided"}</small></span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="review-group">
                      <div className="review-group-head"><h3>Declarations</h3><button type="button" className="text-link" onClick={() => setStep(4)}>Edit</button></div>
                      <div className="review-card">
                        <div><small>Signed by</small><strong>{signature || "—"}</strong></div>
                        <div><small>Accuracy confirmed</small><strong>{declarations.accuracy ? "Yes" : "No"}</strong></div>
                        <div><small>Authorization confirmed</small><strong>{declarations.authorized ? "Yes" : "No"}</strong></div>
                        <div><small>Terms accepted</small><strong>{declarations.consent ? "Yes" : "No"}</strong></div>
                      </div>
                    </div>
                  </div>

                  <div className="flow-button-row"><button className="back-button" type="button" onClick={() => setStep(4)}><ArrowLeft size={15} /> Back</button><button className="primary-action" type="submit"><ShieldCheck size={15} /> Submit for verification</button></div>
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
