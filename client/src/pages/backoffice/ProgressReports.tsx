import { useState } from "react";
import { useSearch } from "wouter";
import { toast } from "sonner";
import { Award, CheckCircle2, ClipboardCheck, Download, Send } from "lucide-react";

import BackofficeShell from "./Shell";
import { students, progressReports as initialReports, reportAverage, type ProgressReport } from "./data";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

export default function ProgressReports() {
  const search = useSearch();
  const paramStudent = new URLSearchParams(search).get("student");

  const [reports, setReports] = useState<ProgressReport[]>(initialReports);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    (paramStudent && students.some((s) => s.id === paramStudent) ? paramStudent : students[0]?.id) ?? null
  );
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) ?? null;
  const studentReports = reports.filter((r) => r.studentId === selectedStudentId);
  const activeReportId = selectedReportId && studentReports.some((r) => r.id === selectedReportId) ? selectedReportId : studentReports[studentReports.length - 1]?.id ?? null;
  const activeReport = studentReports.find((r) => r.id === activeReportId) ?? null;

  const publishedReports = reports.filter((r) => r.published);
  const draftReports = reports.filter((r) => !r.published);
  const avgScore = publishedReports.length ? Math.round(publishedReports.reduce((sum, r) => sum + reportAverage(r), 0) / publishedReports.length) : 0;

  function publishReport(reportId: string) {
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, published: true, issuedOn: today } : r)));
    toast(`Report published and sent to ${selectedStudent?.guardianName}`);
  }

  return (
    <BackofficeShell active="reports" eyebrow="Students" title="Progress reports">
      <div className="bo-stat-grid">
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Published reports</span><span className="bo-stat-icon"><CheckCircle2 size={15} /></span></div>
          <div className="bo-stat-value">{publishedReports.length}</div>
          <div className="bo-stat-delta">Sent to guardians</div>
        </div>
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Average score</span><span className="bo-stat-icon"><Award size={15} /></span></div>
          <div className="bo-stat-value">{avgScore}%</div>
          <div className="bo-stat-delta">Across published reports</div>
        </div>
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Drafts to review</span><span className="bo-stat-icon"><ClipboardCheck size={15} /></span></div>
          <div className="bo-stat-value">{draftReports.length}</div>
          <div className="bo-stat-delta warn">Awaiting publish</div>
        </div>
      </div>

      <div className="bo-split">
        <div style={{ display: "grid", gap: 10 }}>
          {students.map((student) => {
            const studentRepList = reports.filter((r) => r.studentId === student.id);
            const latest = studentRepList[studentRepList.length - 1];
            return (
              <button
                key={student.id}
                className={`bo-student-card ${selectedStudentId === student.id ? "active" : ""}`}
                onClick={() => { setSelectedStudentId(student.id); setSelectedReportId(null); }}
                style={{ width: "100%", textAlign: "left" }}
              >
                <span className="bo-student-avatar">{initials(student.name)}</span>
                <div className="bo-student-info">
                  <strong>{student.name}</strong>
                  <small>{student.grade} · {studentRepList.length} report{studentRepList.length === 1 ? "" : "s"}</small>
                </div>
                <div className="bo-student-progress">
                  <strong>{latest ? `${reportAverage(latest)}%` : "—"}</strong>
                  <small style={{ color: "#8b968f" }}>{latest ? latest.term : "No reports yet"}</small>
                </div>
              </button>
            );
          })}
        </div>

        {selectedStudent && (
          <div className="bo-detail-panel">
            <div className="bo-detail-head">
              <div>
                {activeReport && <span className={`bo-status-pill ${activeReport.published ? "tone-accepted" : "tone-review"}`}>{activeReport.published ? "Published" : "Draft"}</span>}
                <h2>{selectedStudent.name}</h2>
                <div className="bo-detail-meta">
                  <span><strong style={{ color: "var(--deep)" }}>{selectedStudent.grade}</strong></span>
                  <span>Guardian: {selectedStudent.guardianName}</span>
                </div>
              </div>
            </div>

            {studentReports.length === 0 ? (
              <div style={{ padding: "24px 0", color: "#8b968f", fontSize: 11 }}>No progress reports yet for this student.</div>
            ) : (
              <>
                <div className="bo-filter-row" style={{ marginBottom: 18 }}>
                  {studentReports.map((r) => (
                    <button key={r.id} className={`bo-filter-pill ${activeReportId === r.id ? "active" : ""}`} onClick={() => setSelectedReportId(r.id)}>
                      {r.term} · {r.kind}{!r.published && " (Draft)"}
                    </button>
                  ))}
                </div>

                {activeReport && (
                  <div className="bo-detail-body">
                    <div className="review-card">
                      <div><small>Year</small><strong>{activeReport.year}</strong></div>
                      <div><small>Attendance</small><strong>{activeReport.attendance}</strong></div>
                      <div><small>Position</small><strong>{activeReport.position}</strong></div>
                      <div><small>Average score</small><strong>{reportAverage(activeReport)}%</strong></div>
                      {activeReport.issuedOn && <div><small>Issued on</small><strong>{activeReport.issuedOn}</strong></div>}
                    </div>

                    <div className="bo-table-wrap">
                      <table className="bo-table">
                        <thead><tr><th>Subject</th><th>Score</th><th>Grade</th></tr></thead>
                        <tbody>
                          {activeReport.subjects.map((s) => (
                            <tr key={s.subject}><td><strong>{s.subject}</strong></td><td>{s.score > 0 ? `${s.score}%` : "—"}</td><td>{s.grade}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {activeReport.classTeacherComment && (
                      <div className="bo-message-block"><strong style={{ display: "block", marginBottom: 4, color: "var(--deep)" }}>Class teacher's comment</strong>{activeReport.classTeacherComment}</div>
                    )}
                    {activeReport.principalComment && (
                      <div className="bo-message-block"><strong style={{ display: "block", marginBottom: 4, color: "var(--deep)" }}>Head teacher's comment</strong>{activeReport.principalComment}</div>
                    )}

                    <div className="flow-button-row solo" style={{ gap: 8, flexWrap: "wrap" }}>
                      {activeReport.published ? (
                        <>
                          <button className="back-button" onClick={() => toast("This is a UI preview — in production this downloads a signed PDF report card.")}><Download size={14} /> Download PDF</button>
                          <button className="back-button" onClick={() => toast(`Report resent to ${selectedStudent.guardianName}`)}><Send size={14} /> Resend to guardian</button>
                        </>
                      ) : (
                        <button className="primary-action" onClick={() => publishReport(activeReport.id)}><Send size={14} /> Publish &amp; send to guardian</button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </BackofficeShell>
  );
}
