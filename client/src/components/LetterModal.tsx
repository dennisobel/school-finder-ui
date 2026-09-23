import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Download, Mail } from "lucide-react";

import { ModalFrame } from "../pages/Home";
import { letterContent, type LetterType, type Student } from "../pages/backoffice/data";

export function LetterModal({
  student,
  type,
  alreadyIssued,
  onClose,
  onIssue,
}: {
  student: Student;
  type: LetterType;
  alreadyIssued: boolean;
  onClose: () => void;
  onIssue: () => void;
}) {
  const [sent, setSent] = useState(false);
  const letter = letterContent(student, type);
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  if (sent) {
    return (
      <ModalFrame title="Letter sent." eyebrow="Delivered to guardian" onClose={onClose} wide>
        <div className="modal-success">
          <span><CheckCircle2 size={24} /></span>
          <p>{letter.subject} was sent to {student.guardianName}. This is a UI preview, so no email was actually dispatched — in production streamflo emails a PDF copy and logs it against {student.name}'s record.</p>
          <button className="primary-action" onClick={onClose}>Done</button>
        </div>
      </ModalFrame>
    );
  }

  return (
    <ModalFrame title={type === "admission" ? "Admission letter" : "Welcome letter"} eyebrow={`Preview for ${student.guardianName}`} onClose={onClose} wide>
      <div className="letter-paper">
        <div className="letter-paper-head">
          <strong>Greenfield Academy</strong>
          <span>{today}</span>
        </div>
        <p className="letter-paper-subject">{letter.subject}</p>
        {letter.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        <p className="letter-paper-signoff">Kind regards,<br />{letter.signOff}<br />Greenfield Academy</p>
      </div>
      <div className="flow-button-row" style={{ marginTop: 18, gap: 8, flexWrap: "wrap" }}>
        <button className="back-button" onClick={() => toast("This is a UI preview — in production this downloads a signed PDF copy of the letter.")}><Download size={14} /> Download PDF</button>
        <button
          className="primary-action"
          onClick={() => {
            onIssue();
            setSent(true);
          }}
        >
          <Mail size={14} /> {alreadyIssued ? "Resend to guardian" : "Send to guardian"}
        </button>
      </div>
    </ModalFrame>
  );
}
