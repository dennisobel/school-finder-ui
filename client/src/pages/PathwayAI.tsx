import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Cpu,
  Feather,
  FileText,
  Loader2,
  Lock,
  Minus,
  Palette,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Upload,
  Users,
  X,
} from "lucide-react";
import { Footer, Header, ModalFrame, SectionIntro, img } from "./Home";

type Cluster = "stem" | "social" | "arts";

const pathways: { id: Cluster; name: string; full: string; tone: string; icon: typeof Cpu; blurb: string; subjects: string[]; careers: string[] }[] = [
  {
    id: "stem",
    name: "STEM",
    full: "Science, Technology, Engineering & Mathematics",
    tone: "blue",
    icon: Cpu,
    blurb: "For learners who enjoy solving problems, working with numbers and figuring out how things work.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Studies"],
    careers: ["Engineering", "Medicine", "Data science", "Architecture"],
  },
  {
    id: "social",
    name: "Social Sciences",
    full: "Languages, Humanities & Business Studies",
    tone: "yellow",
    icon: Feather,
    blurb: "For learners who enjoy reading, discussing ideas and understanding people and society.",
    subjects: ["English", "Kiswahili", "History", "Geography", "Business Studies"],
    careers: ["Law", "Journalism", "Diplomacy", "Business & finance"],
  },
  {
    id: "arts",
    name: "Arts & Sports Science",
    full: "Performing Arts, Visual Arts & Sports Science",
    tone: "peach",
    icon: Palette,
    blurb: "For learners who enjoy creating, performing, designing or moving.",
    subjects: ["Music", "Fine Art", "Physical Education", "Sports Science", "Theatre Arts"],
    careers: ["Design", "Sports medicine", "Media & film", "Performing arts"],
  },
];

const learningAreas: { key: string; label: string; cluster: Cluster }[] = [
  { key: "math", label: "Mathematics", cluster: "stem" },
  { key: "science", label: "Integrated Science", cluster: "stem" },
  { key: "english", label: "English", cluster: "social" },
  { key: "kiswahili", label: "Kiswahili", cluster: "social" },
  { key: "socialstudies", label: "Social Studies", cluster: "social" },
  { key: "creative", label: "Creative Arts & Sports", cluster: "arts" },
];

const terms = ["2025 · Term 3", "2026 · Term 1", "2026 · Term 2"];

const interestOptions: { label: string; cluster: Cluster }[] = [
  { label: "Solving problems & numbers", cluster: "stem" },
  { label: "Building & experimenting", cluster: "stem" },
  { label: "Reading & debating", cluster: "social" },
  { label: "Understanding people & society", cluster: "social" },
  { label: "Art & design", cluster: "arts" },
  { label: "Sport & movement", cluster: "arts" },
];

const counties = ["Nairobi", "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira"];

const processingSteps = ["Reviewing academic performance", "Comparing subject strengths", "Weighing county & interest signals", "Matching pathway fit"];

type Marks = Record<string, string[]>;

const emptyMarks: Marks = Object.fromEntries(learningAreas.map((a) => [a.key, ["", "", ""]]));

type ScoreResult = { cluster: Cluster; score: number; trend: "up" | "down" | "steady" };

type ReportCardUpload = { id: string; name: string; size: number; status: "extracting" | "done"; termIndex: number };

function average(values: number[]) {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function cellKey(areaKey: string, termIndex: number) {
  return `${areaKey}-${termIndex}`;
}

function trendFromValues(values: number[]): "up" | "down" | "steady" {
  if (values.length < 2) return "steady";
  const delta = values[values.length - 1] - values[0];
  if (delta >= 4) return "up";
  if (delta <= -4) return "down";
  return "steady";
}

function clusterTrend(marks: Marks, cluster: Cluster): "up" | "down" | "steady" {
  const rows = learningAreas.filter((a) => a.cluster === cluster);
  const first: number[] = [];
  const last: number[] = [];
  rows.forEach((row) => {
    const filled = marks[row.key].filter((v) => v !== "").map(Number);
    if (filled.length >= 2) {
      first.push(filled[0]);
      last.push(filled[filled.length - 1]);
    }
  });
  if (!first.length) return "steady";
  return trendFromValues([average(first), average(last)]);
}

// Subject averages naturally cluster in a narrow 55-90 band, so converting
// them to shares in direct proportion to their raw size (rather than to how
// far apart they are) makes every result read as a muddy near-tie. Softmax
// instead scores clusters by their relative edge over one another, so a
// genuine lean (higher scores, matching interests) reads as a clear result
// while truly similar clusters still land close together.
const SCORE_TEMPERATURE = 9;

function computeResults(marks: Marks, interests: string[]): ScoreResult[] {
  const raw = pathways.map(({ id }) => {
    const rows = learningAreas.filter((a) => a.cluster === id);
    const values = rows.flatMap((row) => marks[row.key].filter((v) => v !== "").map(Number));
    const base = values.length ? average(values) : 55;
    const bonus = interests.filter((label) => interestOptions.find((o) => o.label === label)?.cluster === id).length * 6;
    return { cluster: id, raw: base + bonus };
  });
  const weights = raw.map((r) => Math.exp(r.raw / SCORE_TEMPERATURE));
  const total = weights.reduce((sum, w) => sum + w, 0);
  const scores = raw.map((r, i) => ({ cluster: r.cluster, score: Math.round((weights[i] / total) * 100), trend: clusterTrend(marks, r.cluster) }));
  const diff = 100 - scores.reduce((sum, r) => sum + r.score, 0);
  scores[scores.length - 1].score += diff;
  return scores.sort((a, b) => b.score - a.score);
}

function buildReasons(top: ScoreResult, marks: Marks, interests: string[], county: string): string[] {
  const pathway = pathways.find((p) => p.id === top.cluster)!;
  const rows = learningAreas.filter((a) => a.cluster === top.cluster);
  const filledLabels = rows.filter((r) => marks[r.key].some((v) => v !== "")).map((r) => r.label);
  const reasons: string[] = [];
  if (filledLabels.length) {
    const trendWord = top.trend === "up" ? "Improving" : top.trend === "down" ? "Recovering" : "Consistent";
    reasons.push(`${trendWord} performance in ${filledLabels.join(" and ")} across the last three terms.`);
  }
  const matchedInterests = interests.filter((label) => interestOptions.find((o) => o.label === label)?.cluster === top.cluster);
  if (matchedInterests.length) reasons.push(`Stated interests line up with this pathway: ${matchedInterests.join(", ")}.`);
  reasons.push(`${pathway.full} keeps doors open for ${pathway.careers.slice(0, 3).join(", ")} and related careers.`);
  if (county) reasons.push(`We've flagged schools in ${county} County with strong ${pathway.name} programmes.`);
  return reasons;
}

function TrendBadge({ values }: { values: string[] }) {
  const filled = values.filter((v) => v !== "").map(Number);
  const trend = trendFromValues(filled);
  if (filled.length < 2) return <span className="trend-badge muted"><Minus size={12} /></span>;
  if (trend === "up") return <span className="trend-badge up"><TrendingUp size={12} /> +{filled[filled.length - 1] - filled[0]}</span>;
  if (trend === "down") return <span className="trend-badge down"><TrendingDown size={12} /> {filled[filled.length - 1] - filled[0]}</span>;
  return <span className="trend-badge steady"><Minus size={12} /> Steady</span>;
}

function PaymentModal({ price, schoolContext, onClose, onSuccess }: { price: string; schoolContext: boolean; onClose: () => void; onSuccess: () => void }) {
  const [phase, setPhase] = useState<"details" | "waiting" | "success">("details");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (phase !== "waiting") return;
    const timer = setTimeout(() => setPhase("success"), 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "success") {
    return (
      <ModalFrame title="Payment received." eyebrow="M-Pesa confirmation" onClose={onClose}>
        <div className="modal-success">
          <span><CheckCircle2 size={24} /></span>
          <p>Your payment of {price} was confirmed. Your full pathway report is ready to view.</p>
          <button className="primary-action" onClick={onSuccess}>View my report <ArrowRight size={16} /></button>
        </div>
      </ModalFrame>
    );
  }
  if (phase === "waiting") {
    return (
      <ModalFrame title="Check your phone." eyebrow="M-Pesa payment request sent" onClose={onClose}>
        <div className="payment-waiting">
          <Loader2 size={28} className="spin" />
          <p className="modal-copy">We've sent a payment prompt to {phone || "your phone"}. Enter your M-Pesa PIN to complete the {price} payment.</p>
        </div>
      </ModalFrame>
    );
  }
  return (
    <ModalFrame title="Unlock your report." eyebrow={`Pay ${price} with M-Pesa`} onClose={onClose}>
      <p className="modal-copy">This is a UI preview, so no real payment is taken. In production this connects to the M-Pesa STK push API{schoolContext ? " and can be billed to your school account instead." : "."}</p>
      <div className="flow-form">
        <label>M-Pesa phone number
          <input required placeholder="+254 7XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <div className="payment-price-row"><span>Amount due</span><strong>{price}</strong></div>
        <button className="primary-action full-flow-button" onClick={() => setPhase("waiting")}><Smartphone size={16} /> Send M-Pesa request</button>
      </div>
    </ModalFrame>
  );
}

export default function PathwayAI() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const schoolContext = params.get("school") === "1";
  const price = schoolContext ? "KES 150" : "KES 300";
  const priceNote = schoolContext ? "KES 150 per learner · billed to your school account" : `${price} to unlock the full report`;

  // Resolved inside the component (not at module scope) so this only reads
  // `img` from ./Home after that module has fully initialised — Home.tsx and
  // this file import each other, and `img` is a const (TDZ) rather than a
  // hoisted function declaration.
  const suggestedSchools = useMemo((): { name: string; slug: string | null; image: string; cluster: Cluster; note: string }[] => [
    { name: "Greenfield Academy", slug: "greenfield-academy", image: img.campus, cluster: "stem", note: "Strong sciences & computer studies track" },
    { name: "Amani Girls High", slug: null, image: img.courtyard, cluster: "arts", note: "Performing arts & sports science programme" },
    { name: "Kiambu Hills School", slug: null, image: img.sports, cluster: "social", note: "Languages, business studies & debate club" },
  ], []);

  const [stage, setStage] = useState<"landing" | "assessment" | "processing" | "locked" | "unlocked">("landing");
  const [step, setStep] = useState(1);
  const [studentName, setStudentName] = useState("");
  const [county, setCounty] = useState("");
  const [gender, setGender] = useState("");
  const [grade, setGrade] = useState("");
  const [marks, setMarks] = useState<Marks>(emptyMarks);
  const [extractedCells, setExtractedCells] = useState<Set<string>>(new Set());
  const [uploads, setUploads] = useState<ReportCardUpload[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);

  const results = useMemo(() => computeResults(marks, interests), [marks, interests]);
  const top = results[0];
  const topPathway = pathways.find((p) => p.id === top.cluster)!;
  const reasons = useMemo(() => buildReasons(top, marks, interests, county), [top, marks, interests, county]);
  const closeCall = top.score - results[1].score < 10;

  useEffect(() => {
    if (stage !== "processing") return;
    setVisibleSteps(0);
    const timers = processingSteps.map((_, i) => setTimeout(() => setVisibleSteps(i + 1), 450 * (i + 1)));
    const done = setTimeout(() => setStage("locked"), 450 * processingSteps.length + 550);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [stage]);

  function updateMark(key: string, index: number, raw: string) {
    const clean = raw === "" ? "" : String(Math.max(0, Math.min(100, Math.round(Number(raw)))));
    setMarks((prev) => ({ ...prev, [key]: prev[key].map((v, i) => (i === index ? clean : v)) }));
    setExtractedCells((prev) => { if (!prev.has(cellKey(key, index))) return prev; const next = new Set(prev); next.delete(cellKey(key, index)); return next; });
  }

  function fillSampleRecord() {
    setMarks({ math: ["68", "74", "81"], science: ["70", "76", "83"], english: ["72", "70", "69"], kiswahili: ["65", "63", "64"], socialstudies: ["70", "68", "66"], creative: ["75", "77", "76"] });
    setInterests(["Solving problems & numbers", "Building & experimenting"]);
    setExtractedCells(new Set());
    toast("Sample academic record filled in");
  }

  function nextAvailableTermIndex(currentUploads: ReportCardUpload[]) {
    for (let i = 0; i < terms.length; i++) {
      if (!currentUploads.some((u) => u.termIndex === i)) return i;
    }
    return -1;
  }

  function applyExtractedTerm(termIndex: number) {
    setMarks((prev) => {
      const next = { ...prev };
      learningAreas.forEach((area) => {
        const priorRaw = termIndex > 0 ? prev[area.key][termIndex - 1] : "";
        const prior = priorRaw === "" ? 0 : Number(priorRaw);
        const value = prior > 0 ? clamp(prior + Math.round(Math.random() * 16 - 5), 40, 98) : Math.round(58 + Math.random() * 30);
        next[area.key] = prev[area.key].map((v, i) => (i === termIndex ? String(value) : v));
      });
      return next;
    });
    setExtractedCells((prev) => {
      const next = new Set(prev);
      learningAreas.forEach((area) => next.add(cellKey(area.key, termIndex)));
      return next;
    });
  }

  function handleReportCardUpload(files: FileList | null) {
    if (!files || !files.length) return;
    let working = uploads;
    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) { toast(`${file.name} is too large — keep it under 8MB`); return; }
      const termIndex = nextAvailableTermIndex(working);
      if (termIndex === -1) { toast("You can upload up to 3 report cards — one per term"); return; }
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const entry: ReportCardUpload = { id, name: file.name, size: file.size, status: "extracting", termIndex };
      working = [...working, entry];
      setUploads(working);
      setTimeout(() => {
        applyExtractedTerm(termIndex);
        setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, status: "done" } : u)));
        toast(`Extracted ${terms[termIndex]} results from ${file.name}`);
      }, 1300 + Math.random() * 900);
    });
  }

  function removeUpload(id: string) {
    const target = uploads.find((u) => u.id === id);
    if (!target) return;
    setUploads((prev) => prev.filter((u) => u.id !== id));
    setMarks((prev) => {
      const next = { ...prev };
      learningAreas.forEach((area) => { next[area.key] = prev[area.key].map((v, i) => (i === target.termIndex ? "" : v)); });
      return next;
    });
    setExtractedCells((prev) => {
      const next = new Set(prev);
      learningAreas.forEach((area) => next.delete(cellKey(area.key, target.termIndex)));
      return next;
    });
  }

  function toggleInterest(label: string) {
    setInterests((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  }

  const step1Valid = county !== "" && gender !== "" && grade !== "";
  const step2Valid = learningAreas.every((a) => marks[a.key][2] !== "");

  function resetAll() {
    setStage("landing");
    setStep(1);
    setStudentName("");
    setCounty("");
    setGender("");
    setGrade("");
    setMarks(emptyMarks);
    setExtractedCells(new Set());
    setUploads([]);
    setInterests([]);
    setNote("");
    setConsent(false);
  }

  return (
    <div className="site-page pathway-page">
      <Header active="pathway" />
      <main>
        {stage === "landing" && (
          <>
            <section className="pathway-hero">
              <div className="hero-grain" />
              <div className="container pathway-hero-grid">
                <div className="pathway-hero-copy">
                  {schoolContext && <div className="pathway-school-banner"><Sparkles size={14} /> Previewing as a registered school · school pricing applied</div>}
                  <div className="eyebrow light"><span className="eyebrow-line" />AI pathway advisor</div>
                  <h1>Find the right <em>CBC pathway,</em> with confidence.</h1>
                  <p className="pathway-lede">Answer a few questions about academic performance, interests and county, and get a personalised STEM, Social Sciences or Arts &amp; Sports Science recommendation for CBC senior school.</p>
                  <div className="pathway-hero-actions">
                    <button className="primary-action" onClick={() => { setStage("assessment"); setStep(1); }}>Start free assessment <ArrowRight size={16} /></button>
                    <span className="pathway-hero-meta">~5 minutes · {priceNote}</span>
                  </div>
                  <div className="pathway-trust-row">
                    <span><ShieldCheck size={14} /> Guidance, not a guarantee</span>
                    <span><Users size={14} /> Built around the CBC senior school pathways</span>
                  </div>
                </div>
                <div className="pathway-hero-visual">
                  <div className="pathway-preview-card">
                    <div className="pathway-preview-lock"><Lock size={12} /> Sample preview</div>
                    <strong>Recommended pathway</strong>
                    <div className="pathway-preview-bars">
                      <div className="preview-bar"><span>STEM</span><div className="preview-bar-track"><div className="preview-bar-fill stem" style={{ width: "71%" }} /></div><em>71%</em></div>
                      <div className="preview-bar"><span>Social Sciences</span><div className="preview-bar-track"><div className="preview-bar-fill social" style={{ width: "18%" }} /></div><em>18%</em></div>
                      <div className="preview-bar"><span>Arts &amp; Sports</span><div className="preview-bar-track"><div className="preview-bar-fill arts" style={{ width: "11%" }} /></div><em>11%</em></div>
                    </div>
                    <span className="pathway-preview-caption">Full report unlocks reasoning, subject combinations &amp; matching schools</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="section pathway-pillars">
              <div className="container">
                <SectionIntro eyebrow="The three pathways" title="Where CBC senior school leads" copy="Every learner moves into one of three broad pathways from Grade 10. Here's what each one covers." />
                <div className="pathway-grid">
                  {pathways.map((p) => (
                    <div className={`pathway-card ${p.tone}`} key={p.id}>
                      <span className="pathway-card-icon"><p.icon size={20} /></span>
                      <h3>{p.name}</h3>
                      <p className="pathway-card-full">{p.full}</p>
                      <p className="pathway-card-blurb">{p.blurb}</p>
                      <div className="pathway-card-subjects">{p.subjects.slice(0, 4).map((s) => <span key={s}>{s}</span>)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="section pathway-how">
              <div className="container">
                <SectionIntro eyebrow="How it works" title="Three simple steps" />
                <div className="pathway-steps-grid">
                  <div className="pathway-step-card"><span className="pathway-step-index">01</span><strong>Tell us about the learner</strong><p>County, gender, grade and academic performance over the last three terms.</p></div>
                  <div className="pathway-step-card"><span className="pathway-step-index">02</span><strong>We weigh the signals</strong><p>Performance trends and interests are compared against each pathway's demands.</p></div>
                  <div className="pathway-step-card"><span className="pathway-step-index">03</span><strong>Unlock the full report</strong><p>Pay a small fee to reveal the full ranking, reasoning and matching schools.</p></div>
                </div>
              </div>
            </section>
          </>
        )}

        {stage === "assessment" && (
          <section className="section pathway-assessment-section">
            <div className="container">
              <div className="pathway-form-card">
                <div className="modal-eyebrow">Pathway assessment · Step {step} of 4</div>
                <div className="flow-progress">
                  <span className={step >= 1 ? "active" : ""}>01 <small>Learner</small></span><i />
                  <span className={step >= 2 ? "active" : ""}>02 <small>Performance</small></span><i />
                  <span className={step >= 3 ? "active" : ""}>03 <small>Interests</small></span><i />
                  <span className={step >= 4 ? "active" : ""}>04 <small>Review</small></span>
                </div>

                {step === 1 && (
                  <div className="flow-form">
                    <h2 className="pathway-step-title">Tell us about the learner</h2>
                    <p className="modal-copy">{schoolContext ? "These details stay attached to the student record for this report only." : "We use these to tailor the recommendation and suggest nearby schools."}</p>
                    <div className="form-grid">
                      <label>{schoolContext ? "Student's full name" : "Student's first name (optional)"}<input required={schoolContext} value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g. Amani Wanjiku" /></label>
                      <label>Current grade
                        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                          <option value="" disabled>Select grade</option>
                          <option>Grade 8</option>
                          <option>Grade 9 (choosing pathway now)</option>
                          <option>Grade 10 (reviewing pathway fit)</option>
                        </select>
                      </label>
                      <label>County of residence / preference
                        <select value={county} onChange={(e) => setCounty(e.target.value)}>
                          <option value="" disabled>Select county</option>
                          {counties.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </label>
                      <label>Gender
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                          <option value="" disabled>Select gender</option>
                          <option>Female</option>
                          <option>Male</option>
                          <option>Prefer not to say</option>
                        </select>
                      </label>
                    </div>
                    <p className="field-hint">Gender is used only to match relevant mentorship &amp; scholarship programmes — never to influence the pathway recommendation itself.</p>
                    <div className="pathway-curriculum-chip"><Check size={13} /> Curriculum: CBC (Competency-Based Curriculum)</div>
                    <div className="flow-button-row pathway-first-row"><button className="back-button" onClick={() => setStage("landing")}><ArrowLeft size={15} /> Back</button><button className="primary-action flow-next" disabled={!step1Valid} onClick={() => setStep(2)}>Continue <ArrowRight size={16} /></button></div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flow-form">
                    <h2 className="pathway-step-title">Academic performance, over time</h2>
                    <p className="modal-copy">Upload a report card for each of the last three terms and we'll pull the scores in automatically — or enter them manually below.</p>

                    <div className="report-upload-block">
                      <div className="report-upload-head">
                        <strong><Upload size={14} /> Upload report card</strong>
                        <span className="field-hint">JPG, PNG, a screenshot or PDF · up to 8MB · one file per term, up to 3</span>
                      </div>
                      {uploads.length < 3 && (
                        <label htmlFor="report-card-upload" className="upload-drop report-upload-drop">
                          <Upload size={16} />
                          <span>Click or drag to upload<small>We'll extract the scores for you — review anything before continuing</small></span>
                          <input id="report-card-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={(e) => { handleReportCardUpload(e.target.files); e.target.value = ""; }} />
                        </label>
                      )}
                      {uploads.length > 0 && (
                        <div className="report-upload-list">
                          {uploads.map((u) => (
                            <div className="report-upload-chip" key={u.id}>
                              <FileText size={15} />
                              <span className="upload-file-name">{u.name}</span>
                              <small>{formatFileSize(u.size)}</small>
                              {u.status === "extracting" ? (
                                <span className="report-upload-status extracting"><Loader2 size={13} className="spin" /> Extracting {terms[u.termIndex]}…</span>
                              ) : (
                                <span className="report-upload-status done"><Check size={13} /> Applied to {terms[u.termIndex]}</span>
                              )}
                              <button type="button" onClick={() => removeUpload(u.id)} aria-label={`Remove ${u.name}`}><X size={13} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pathway-step-heading-row table-heading-row"><span className="field-hint">Scores out of 100 — edit anything an upload got wrong. At least the latest term is required.</span><button type="button" className="text-link" onClick={fillSampleRecord}>Fill sample record</button></div>
                    <div className="score-table">
                      <div className="score-table-row score-table-head"><span>Learning area</span>{terms.map((t) => <span key={t}>{t}</span>)}<span>Trend</span></div>
                      {learningAreas.map((area) => (
                        <div className="score-table-row" key={area.key}>
                          <span className="score-row-label">{area.label}</span>
                          {terms.map((t, i) => (
                            <input key={t} type="number" min={0} max={100} inputMode="numeric" placeholder="–" className={`score-cell ${extractedCells.has(cellKey(area.key, i)) ? "extracted" : ""}`} value={marks[area.key][i]} onChange={(e) => updateMark(area.key, i, e.target.value)} aria-label={`${area.label} ${t} score`} />
                          ))}
                          <TrendBadge values={marks[area.key]} />
                        </div>
                      ))}
                    </div>
                    <div className="flow-button-row"><button className="back-button" onClick={() => setStep(1)}><ArrowLeft size={15} /> Back</button><button className="primary-action flow-next" disabled={!step2Valid} onClick={() => setStep(3)}>Continue <ArrowRight size={16} /></button></div>
                  </div>
                )}

                {step === 3 && (
                  <div className="flow-form">
                    <h2 className="pathway-step-title">What does the learner enjoy?</h2>
                    <p className="modal-copy">Select all that apply. This is optional but sharpens the recommendation.</p>
                    <div className="interest-grid">
                      {interestOptions.map((o) => (
                        <button type="button" key={o.label} className={`interest-chip ${interests.includes(o.label) ? "active" : ""}`} onClick={() => toggleInterest(o.label)}>{interests.includes(o.label) && <Check size={13} />}{o.label}</button>
                      ))}
                    </div>
                    <label className="pathway-note-label">Anything else worth knowing? (optional)<textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Loves science fairs, plays county-level football…" /></label>
                    <div className="flow-button-row"><button className="back-button" onClick={() => setStep(2)}><ArrowLeft size={15} /> Back</button><button className="primary-action flow-next" onClick={() => setStep(4)}>Continue <ArrowRight size={16} /></button></div>
                  </div>
                )}

                {step === 4 && (
                  <div className="flow-form">
                    <h2 className="pathway-step-title">Review &amp; generate recommendation</h2>
                    <p className="modal-copy">Check the details below before we analyse this record.</p>
                    <div className="review-card">
                      <div><small>Learner</small><strong>{studentName || "Not provided"}</strong></div>
                      <div><small>Grade</small><strong>{grade}</strong></div>
                      <div><small>County</small><strong>{county}</strong></div>
                      <div><small>Gender</small><strong>{gender}</strong></div>
                      <div><small>Interests noted</small><strong>{interests.length || "0"}</strong></div>
                    </div>
                    <label className="consent-row"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>I confirm these details are accurate to the best of my knowledge.</span></label>
                    <div className="flow-button-row"><button className="back-button" onClick={() => setStep(3)}><ArrowLeft size={15} /> Back</button><button className="primary-action flow-next" disabled={!consent} onClick={() => setStage("processing")}>Generate my recommendation <Sparkles size={16} /></button></div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {stage === "processing" && (
          <section className="section pathway-processing-section">
            <div className="container pathway-processing">
              <Loader2 size={34} className="spin" />
              <h2>Analysing the record…</h2>
              <div className="processing-checklist">
                {processingSteps.map((label, i) => (
                  <div className={`processing-item ${i < visibleSteps ? "done" : ""}`} key={label}>{i < visibleSteps ? <Check size={14} /> : <span className="processing-dot" />}{label}</div>
                ))}
              </div>
            </div>
          </section>
        )}

        {stage === "locked" && (
          <section className="section pathway-locked-section">
            <div className="container pathway-locked-grid">
              <div className="locked-card">
                <div className="modal-eyebrow">Your result is ready</div>
                <h2 className="pathway-locked-heading">Recommended pathway</h2>
                <div className="locked-blur-wrap">
                  <div className="locked-blur">
                    <strong className={`locked-pathway-name ${topPathway.tone}`}>{topPathway.name}</strong>
                    <div className="pathway-preview-bars">
                      {results.map((r) => { const p = pathways.find((x) => x.id === r.cluster)!; return <div className="preview-bar" key={r.cluster}><span>{p.name}</span><div className="preview-bar-track"><div className={`preview-bar-fill ${p.tone === "blue" ? "stem" : p.tone === "yellow" ? "social" : "arts"}`} style={{ width: `${r.score}%` }} /></div><em>{r.score}%</em></div>; })}
                    </div>
                    <ul className="result-reasons">{reasons.slice(0, 2).map((r) => <li key={r}>{r}</li>)}</ul>
                  </div>
                  <div className="locked-overlay"><Lock size={20} /><span>Unlock to see the full breakdown</span></div>
                </div>
              </div>
              <div className="unlock-panel">
                <Sparkles size={20} />
                <h3>Unlock the full report</h3>
                <div className="unlock-price">{price}<small>{schoolContext ? "per learner" : "one-time"}</small></div>
                <ul className="unlock-features">
                  <li><Check size={13} /> Full pathway ranking &amp; confidence score</li>
                  <li><Check size={13} /> Subject combination guide</li>
                  <li><Check size={13} /> Reasoning behind the recommendation</li>
                  <li><Check size={13} /> Matching schools in {county || "your county"}</li>
                </ul>
                <button className="primary-action full-flow-button" onClick={() => setShowPayment(true)}><Smartphone size={16} /> Pay {price} with M-Pesa</button>
                <button className="text-link pathway-retake-link" onClick={resetAll}>Start a new assessment</button>
              </div>
            </div>
          </section>
        )}

        {stage === "unlocked" && (
          <section className="section pathway-results-section">
            <div className="container">
              <div className="results-unlocked">
                <div className="result-headline">
                  <div className="modal-eyebrow">Full pathway report{studentName ? ` · ${studentName}` : ""}</div>
                  <h2>Recommended: <em className={topPathway.tone}>{topPathway.name}</em></h2>
                  <p className="pathway-card-full">{topPathway.full}</p>
                  <div className="result-confidence"><Star size={14} fill="currentColor" /> {top.score}% confidence{closeCall && <span className="result-close-call"> · this is a close call, worth discussing with a school counselor</span>}</div>
                </div>

                <div className="result-bars">
                  {results.map((r) => { const p = pathways.find((x) => x.id === r.cluster)!; return (
                    <div className="result-bar-row" key={r.cluster}>
                      <span className="result-bar-label"><p.icon size={14} /> {p.name}</span>
                      <div className="result-bar-track"><div className={`result-bar-fill ${p.tone === "blue" ? "stem" : p.tone === "yellow" ? "social" : "arts"}`} style={{ width: `${r.score}%` }} /></div>
                      <span className="result-bar-value">{r.score}%</span>
                    </div>
                  ); })}
                </div>

                <div className="pathway-result-columns">
                  <div className="result-why-card">
                    <h3>Why this fits</h3>
                    <ul className="result-reasons">{reasons.map((r) => <li key={r}>{r}</li>)}</ul>
                  </div>
                  <div className="result-subjects-card">
                    <h3>Suggested subject combination</h3>
                    <div className="result-subjects-grid">{topPathway.subjects.map((s) => <span key={s} className="subject-chip">{s}</span>)}</div>
                    <h3 className="result-careers-title">Career directions</h3>
                    <div className="result-subjects-grid">{topPathway.careers.map((c) => <span key={c} className="subject-chip muted">{c}</span>)}</div>
                  </div>
                </div>

                <div className="result-schools-block">
                  <SectionIntro eyebrow="Matching schools" title={`Strong in ${topPathway.name}${county ? ` near ${county}` : ""}`} />
                  <div className="result-schools-grid">
                    {[...suggestedSchools].sort((a, b) => (a.cluster === top.cluster ? -1 : 0) - (b.cluster === top.cluster ? -1 : 0)).map((s) => (
                      <div className="pathway-school-card" key={s.name}>
                        <img src={s.image} alt={`${s.name} campus`} />
                        <div className="pathway-school-card-body">
                          <strong>{s.name}</strong>
                          <p>{s.note}</p>
                          <button className="text-link" onClick={() => navigate(s.slug ? `/schools/${s.slug}` : `/schools?q=${encodeURIComponent(s.name)}`)}>View school <ArrowRight size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="result-actions">
                  <button className="dark-button" onClick={() => toast("PDF export is ready to connect")}>Download report</button>
                  {schoolContext ? <button className="outline-button" onClick={resetAll}>Assess another student</button> : <button className="outline-button" onClick={resetAll}>Retake assessment</button>}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      {showPayment && <PaymentModal price={price} schoolContext={schoolContext} onClose={() => setShowPayment(false)} onSuccess={() => { setShowPayment(false); setStage("unlocked"); toast("Payment confirmed via M-Pesa"); }} />}
    </div>
  );
}
