import { useState } from "react";
import { toast } from "sonner";
import { Check, GraduationCap, Shirt } from "lucide-react";

import BackofficeShell from "./Shell";
import { students as initialStudents, studentProgress, type Student } from "./data";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

export default function Onboarding() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedId, setSelectedId] = useState<string | null>(initialStudents[0]?.id ?? null);

  const selected = students.find((s) => s.id === selectedId) ?? null;
  const fullyOnboarded = students.filter((s) => studentProgress(s) === 100).length;
  const averageProgress = Math.round(students.reduce((sum, s) => sum + studentProgress(s), 0) / students.length);

  function toggleTask(studentId: string, taskId: string) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
          : s
      )
    );
  }

  return (
    <BackofficeShell active="onboarding" eyebrow="Students" title="Onboarding">
      <div className="bo-stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
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
            <div className="bo-checklist">
              {selected.tasks.map((task) => (
                <label className={`bo-check-row ${task.done ? "done" : ""}`} key={task.id}>
                  <input type="checkbox" checked={task.done} onChange={() => toggleTask(selected.id, task.id)} />
                  <span>{task.label}</span>
                  <Check size={16} />
                </label>
              ))}
            </div>
            <div className="flow-button-row solo" style={{ marginTop: 18 }}>
              <button className="back-button" onClick={() => toast(`Reminder sent to ${selected.guardianName}`)}>Send reminder to guardian</button>
            </div>
          </div>
        )}
      </div>
    </BackofficeShell>
  );
}
