import { useState } from "react";
import { Link, useSearch } from "wouter";
import { toast } from "sonner";
import { Check, FileText, GraduationCap, Mail, Shirt } from "lucide-react";

import { LetterModal } from "@/components/LetterModal";
import BackofficeShell from "./Shell";
import { students as initialStudents, studentProgress, type LetterType, type Student } from "./data";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

export default function Onboarding() {
  const search = useSearch();
  const paramStudent = new URLSearchParams(search).get("student");

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedId, setSelectedId] = useState<string | null>(
    (paramStudent && initialStudents.some((s) => s.id === paramStudent) ? paramStudent : initialStudents[0]?.id) ?? null
  );
  const [lettering, setLettering] = useState<{ student: Student; type: LetterType; alreadyIssued: boolean } | null>(null);

  const selected = students.find((s) => s.id === selectedId) ?? null;
  const fullyOnboarded = students.filter((s) => studentProgress(s) === 100).length;
  const averageProgress = Math.round(students.reduce((sum, s) => sum + studentProgress(s), 0) / students.length);
  const lettersPending = students.filter((s) => s.tasks.some((t) => t.letterType && !t.done)).length;

  function toggleTask(studentId: string, taskId: string) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
          : s
      )
    );
  }

  function issueLetter(studentId: string, type: LetterType) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, tasks: s.tasks.map((t) => (t.letterType === type ? { ...t, done: true } : t)) }
          : s
      )
    );
  }

  return (
    <BackofficeShell active="onboarding" eyebrow="Students" title="Onboarding">
      <div className="bo-stat-grid">
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Fully onboarded</span><span className="bo-stat-icon"><Check size={15} /></span></div>
          <div className="bo-stat-value">{fullyOnboarded} / {students.length}</div>
          <div className="bo-stat-delta">Ready for the January 2027 intake</div>
        </div>
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Average completion</span><span className="bo-stat-icon"><GraduationCap size={15} /></span></div>
          <div className="bo-stat-value">{averageProgress}%</div>
          <div className="bo-stat-delta">Across all admitted students</div>
        </div>
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Letters pending</span><span className="bo-stat-icon"><Mail size={15} /></span></div>
          <div className="bo-stat-value">{lettersPending}</div>
          <div className="bo-stat-delta warn">Admission or welcome letter not yet sent</div>
        </div>
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Uniforms outstanding</span><span className="bo-stat-icon"><Shirt size={15} /></span></div>
          <div className="bo-stat-value">{students.filter((s) => !s.tasks.find((t) => t.label === "Uniform ordered")?.done).length}</div>
          <div className="bo-stat-delta warn">Follow up before term starts</div>
        </div>
      </div>

      <div className="bo-split">
        <div style={{ display: "grid", gap: 10 }}>
          {students.map((student) => {
            const percent = studentProgress(student);
            return (
              <button key={student.id} className={`bo-student-card ${selectedId === student.id ? "active" : ""}`} onClick={() => setSelectedId(student.id)} style={{ width: "100%", textAlign: "left" }}>
                <span className="bo-student-avatar">{initials(student.name)}</span>
                <div className="bo-student-info">
                  <strong>{student.name}</strong>
                  <small>{student.grade} · Starts {student.startDate}</small>
                </div>
                <div className="bo-student-progress">
                  <strong>{percent}%</strong>
                  <div className="bo-progress-track"><div className={`bo-progress-fill ${percent < 60 ? "warn" : ""}`} style={{ width: `${percent}%` }} /></div>
                </div>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="bo-detail-panel">
            <div className="bo-detail-head">
              <div>
                <span className="bo-status-pill tone-review">{studentProgress(selected)}% complete</span>
                <h2>{selected.name}</h2>
                <div className="bo-detail-meta">
                  <span><strong style={{ color: "var(--deep)" }}>{selected.grade}</strong></span>
                  <span>Guardian: {selected.guardianName}</span>
                  <span>Starts {selected.startDate}</span>
                </div>
              </div>
            </div>
            <div className="bo-progress-track" style={{ marginBottom: 18 }}>
              <div className={`bo-progress-fill ${studentProgress(selected) < 60 ? "warn" : ""}`} style={{ width: `${studentProgress(selected)}%` }} />
            </div>
            <div className="bo-checklist" style={{ marginBottom: 4 }}>
              {selected.tasks.filter((t) => t.letterType).map((task) => (
                <div className={`bo-check-row ${task.done ? "done" : ""}`} key={task.id}>
                  <Mail size={16} />
                  <span>{task.label}</span>
                  <button
                    className="outline-button"
                    style={{ padding: "6px 10px" }}
                    onClick={() => setLettering({ student: selected, type: task.letterType!, alreadyIssued: task.done })}
                  >
                    {task.done ? "View letter" : "Preview & send"}
                  </button>
                </div>
              ))}
            </div>
            <div className="bo-checklist">
              {selected.tasks.filter((t) => !t.letterType).map((task) => (
                <label className={`bo-check-row ${task.done ? "done" : ""}`} key={task.id}>
                  <input type="checkbox" checked={task.done} onChange={() => toggleTask(selected.id, task.id)} />
                  <span>{task.label}</span>
                  <Check size={16} />
                </label>
              ))}
            </div>
            <div className="flow-button-row solo" style={{ marginTop: 18, gap: 8, flexWrap: "wrap" }}>
              <Link href={`/school-admin/reports?student=${selected.id}`} className="back-button"><FileText size={14} /> View progress reports</Link>
              <button className="back-button" onClick={() => toast(`Reminder sent to ${selected.guardianName}`)}>Send reminder to guardian</button>
            </div>
          </div>
        )}
      </div>

      {lettering && (
        <LetterModal
          student={lettering.student}
          type={lettering.type}
          alreadyIssued={lettering.alreadyIssued}
          onClose={() => setLettering(null)}
          onIssue={() => {
            issueLetter(lettering.student.id, lettering.type);
            toast(`${lettering.type === "admission" ? "Admission" : "Welcome"} letter sent to ${lettering.student.guardianName}`);
          }}
        />
      )}
    </BackofficeShell>
  );
}
