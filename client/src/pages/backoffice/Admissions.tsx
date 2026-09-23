import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Banknote, CheckCircle2, ClipboardList, GraduationCap, Mail, Phone, Send, Smartphone, ThumbsDown, ThumbsUp } from "lucide-react";

import { MpesaPaymentModal } from "@/components/MpesaPaymentModal";
import BackofficeShell from "./Shell";
import { applications as initialApplications, students, type Application, type ApplicationStatus } from "./data";

const PLATFORM_FEE_RATE = 0.02;

const filters: ("All" | ApplicationStatus)[] = ["All", "Submitted", "Under review", "Offer sent", "Accepted", "Declined"];
const statusTone: Record<ApplicationStatus, string> = {
  Submitted: "tone-submitted",
  "Under review": "tone-review",
  "Offer sent": "tone-offer",
  Accepted: "tone-accepted",
  Declined: "tone-declined",
};
const feeTone: Record<Application["feeStatus"], string> = { Pending: "tone-pending", Paid: "tone-paid", Waived: "tone-closed" };

export default function Admissions() {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [filter, setFilter] = useState<"All" | ApplicationStatus>("All");
  const [selectedId, setSelectedId] = useState<string | null>(initialApplications[0]?.id ?? null);
  const [collectedVia, setCollectedVia] = useState<Record<string, boolean>>({});
  const [collecting, setCollecting] = useState<Application | null>(null);

  const visible = applications.filter((a) => filter === "All" || a.status === filter);
  const selected = applications.find((a) => a.id === selectedId) ?? null;

  function setStatus(id: string, status: ApplicationStatus) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }
  function setFeeStatus(id: string, feeStatus: Application["feeStatus"]) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, feeStatus } : a)));
  }
  function collectFee(app: Application) {
    setFeeStatus(app.id, "Paid");
    setCollectedVia((prev) => ({ ...prev, [app.id]: true }));
    setCollecting(null);
    toast(`Admission fee collected from ${app.guardianName}`);
  }

  return (
    <BackofficeShell active="admissions" eyebrow="Admissions" title="Applications">
      <div className="bo-filter-row">
        {filters.map((f) => (
          <button key={f} className={`bo-filter-pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f}{f !== "All" && ` (${applications.filter((a) => a.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="bo-split">
        <div className="bo-list-panel">
          {visible.map((app) => (
            <button key={app.id} className={`bo-list-item ${selectedId === app.id ? "active" : ""}`} onClick={() => setSelectedId(app.id)}>
              <div className="bo-list-item-top"><strong>{app.childName}</strong><time>{app.submittedOn}</time></div>
              <p>{app.level} · Guardian: {app.guardianName}</p>
              <div className="bo-list-item-foot"><span className={`bo-status-pill ${statusTone[app.status]}`}>{app.status}</span><span className={`bo-status-pill ${feeTone[app.feeStatus]}`}><Banknote size={11} /> {app.feeStatus}</span></div>
            </button>
          ))}
          {visible.length === 0 && <div style={{ padding: 24, color: "#8b968f", fontSize: 11, textAlign: "center" }}>No applications match.</div>}
        </div>

        {selected ? (
          <div className="bo-detail-panel">
            <div className="bo-detail-head">
              <div>
                <span className={`bo-status-pill ${statusTone[selected.status]}`}>{selected.status}</span>
                <h2>{selected.childName}</h2>
                <div className="bo-detail-meta">
                  <span><strong style={{ color: "var(--deep)" }}>{selected.level}</strong></span>
                  <span>Intake {selected.intakeYear}</span>
                  <span>Submitted {selected.submittedOn}</span>
                </div>
              </div>
            </div>
            <div className="bo-detail-body">
              <div className="review-card">
                <div><small>Guardian</small><strong>{selected.guardianName}</strong></div>
                <div><small>Email</small><strong>{selected.guardianEmail}</strong></div>
                <div><small>Phone</small><strong>{selected.guardianPhone}</strong></div>
              </div>

              <div className="bo-panel" style={{ padding: 18, background: "var(--paper)" }}>
                <div className="bo-panel-head" style={{ marginBottom: 10 }}>
                  <div><h2 style={{ fontSize: 15 }}>Admission fee</h2></div>
                  <span className={`bo-status-pill ${feeTone[selected.feeStatus]}`}><Banknote size={12} /> {selected.feeStatus}</span>
                </div>
                <p style={{ margin: "0 0 12px", color: "var(--deep)", fontFamily: "'Fraunces', serif", fontSize: 24 }}>KES {selected.admissionFee.toLocaleString()}</p>
                {selected.feeStatus === "Paid" && collectedVia[selected.id] && (
                  <div className="fee-breakdown">
                    <span className="fee-breakdown-tag"><CheckCircle2 size={12} /> Collected via streamflo</span>
                    <div className="fee-breakdown-row"><span>Gross fee</span><strong>KES {selected.admissionFee.toLocaleString()}</strong></div>
                    <div className="fee-breakdown-row muted"><span>streamflo fee (2%)</span><span>− KES {Math.round(selected.admissionFee * PLATFORM_FEE_RATE).toLocaleString()}</span></div>
                    <div className="fee-breakdown-row total"><span>Net payout to school</span><strong>KES {Math.round(selected.admissionFee * (1 - PLATFORM_FEE_RATE)).toLocaleString()}</strong></div>
                  </div>
                )}
                {selected.feeStatus !== "Paid" && (
                  <div className="flow-button-row solo" style={{ gap: 8, flexWrap: "wrap" }}>
                    <button className="primary-action" onClick={() => setCollecting(selected)}><Smartphone size={14} /> Collect via M-Pesa</button>
                    <button className="back-button" onClick={() => { setFeeStatus(selected.id, "Paid"); toast("Fee marked as paid manually"); }}>Mark as paid manually</button>
                    <button className="back-button" onClick={() => { setFeeStatus(selected.id, "Waived"); toast("Fee waived"); }}>Waive fee</button>
                  </div>
                )}
              </div>

              <div>
                <div className="bo-panel-head" style={{ marginBottom: 10 }}><div><h2 style={{ fontSize: 15 }}>Decision</h2><p>Move this application through your pipeline</p></div></div>
                <div className="bo-filter-row">
                  {selected.status === "Submitted" && <button className="outline-button" onClick={() => { setStatus(selected.id, "Under review"); toast("Marked as under review"); }}><ClipboardList size={14} /> Start review</button>}
                  {(selected.status === "Submitted" || selected.status === "Under review") && (
                    <>
                      <button className="outline-button" onClick={() => { setStatus(selected.id, "Offer sent"); toast(`Offer sent to ${selected.guardianName}`); }}><Send size={14} /> Send offer</button>
                      <button className="outline-button" onClick={() => { setStatus(selected.id, "Declined"); toast("Application declined"); }}><ThumbsDown size={14} /> Decline</button>
                    </>
                  )}
                  {selected.status === "Offer sent" && (
                    <>
                      <button className="outline-button" onClick={() => { setStatus(selected.id, "Accepted"); toast(`${selected.childName} marked as accepted`); }}><ThumbsUp size={14} /> Mark accepted</button>
                      <button className="outline-button" onClick={() => { setStatus(selected.id, "Declined"); toast("Offer withdrawn"); }}><ThumbsDown size={14} /> Withdraw offer</button>
                    </>
                  )}
                  {(selected.status === "Accepted" || selected.status === "Declined") && <span style={{ color: "#8b968f", fontSize: 10, alignSelf: "center" }}>This application has been finalized.</span>}
                </div>
              </div>

              {selected.status === "Accepted" && (() => {
                const linkedStudent = students.find((s) => s.applicationId === selected.id);
                return (
                  <div className="bo-panel" style={{ padding: 18, background: "var(--paper)" }}>
                    <div className="bo-panel-head" style={{ marginBottom: 10 }}>
                      <div>
                        <h2 style={{ fontSize: 15 }}>Onboarding</h2>
                        <p>{linkedStudent ? "Continue this student's onboarding checklist, letters and progress reports." : "Kick off the onboarding checklist, admission letter and welcome letter for this student."}</p>
                      </div>
                    </div>
                    {linkedStudent ? (
                      <Link href={`/school-admin/onboarding?student=${linkedStudent.id}`} className="outline-button"><GraduationCap size={14} /> Go to onboarding checklist</Link>
                    ) : (
                      <button className="outline-button" onClick={() => toast(`Onboarding checklist created for ${selected.childName} — head to Students → Onboarding to continue.`)}><GraduationCap size={14} /> Set up onboarding</button>
                    )}
                  </div>
                );
              })()}

              <div className="flow-button-row solo" style={{ gap: 10 }}>
                <button className="back-button" onClick={() => toast(`Opening email to ${selected.guardianEmail}…`)}><Mail size={14} /> Email guardian</button>
                <button className="back-button" onClick={() => toast(`Calling ${selected.guardianPhone}…`)}><Phone size={14} /> Call guardian</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bo-detail-panel bo-detail-empty">
            <ClipboardList size={28} />
            <p>Select an application to view details</p>
          </div>
        )}
      </div>

      {collecting && (
        <MpesaPaymentModal
          eyebrow={`Request KES ${collecting.admissionFee.toLocaleString()} from ${collecting.guardianName}`}
          title="Collect via streamflo."
          amount={`KES ${collecting.admissionFee.toLocaleString()}`}
          amountLabel="Admission fee"
          payerPhone={collecting.guardianPhone}
          payNote={`This is a UI preview, so no real payment is taken. In production streamflo sends an M-Pesa STK push straight to ${collecting.guardianName}'s phone and settles the balance to your school account, minus a 2% platform fee.`}
          successTitle="Fee collected."
          successBody={`KES ${collecting.admissionFee.toLocaleString()} received from ${collecting.guardianName}. KES ${Math.round(collecting.admissionFee * PLATFORM_FEE_RATE).toLocaleString()} streamflo fee deducted — the rest is on its way to your school account.`}
          ctaLabel="Done"
          onClose={() => setCollecting(null)}
          onSuccess={() => collectFee(collecting)}
        />
      )}
    </BackofficeShell>
  );
}
