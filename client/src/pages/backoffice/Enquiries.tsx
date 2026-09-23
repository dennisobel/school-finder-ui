import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Check, Inbox, Mail, Phone, Search, Send, X } from "lucide-react";

import BackofficeShell from "./Shell";
import { enquiries as initialEnquiries, type Enquiry, type EnquiryStatus } from "./data";

const filters: ("All" | EnquiryStatus)[] = ["All", "New", "Responded", "Closed"];
const toneClass: Record<EnquiryStatus, string> = { New: "tone-new", Responded: "tone-responded", Closed: "tone-closed" };

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [filter, setFilter] = useState<"All" | EnquiryStatus>("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialEnquiries[0]?.id ?? null);
  const [reply, setReply] = useState("");

  const visible = enquiries.filter((e) => (filter === "All" || e.status === filter) && (e.name.toLowerCase().includes(query.toLowerCase()) || e.subject.toLowerCase().includes(query.toLowerCase())));
  const selected = enquiries.find((e) => e.id === selectedId) ?? null;

  function setStatus(id: string, status: EnquiryStatus) {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }
  function sendReply() {
    if (!selected) return;
    if (!reply.trim()) {
      toast("Write a reply before sending");
      return;
    }
    setStatus(selected.id, "Responded");
    toast(`Reply sent to ${selected.name}`);
    setReply("");
  }

  return (
    <BackofficeShell active="enquiries" eyebrow="Admissions" title="Enquiries">
      <div className="bo-filter-row">
        {filters.map((f) => (
          <button key={f} className={`bo-filter-pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f}{f !== "All" && ` (${enquiries.filter((e) => e.status === f).length})`}
          </button>
        ))}
        <div className="bo-search" style={{ marginLeft: "auto" }}>
          <Search size={14} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search enquiries" aria-label="Search enquiries" />
        </div>
      </div>

      <div className="bo-split">
        <div className="bo-list-panel">
          {visible.map((enquiry) => (
            <button key={enquiry.id} className={`bo-list-item ${selectedId === enquiry.id ? "active" : ""}`} onClick={() => setSelectedId(enquiry.id)}>
              <div className="bo-list-item-top"><strong>{enquiry.name}</strong><time>{enquiry.date.split(",")[0]}</time></div>
              <p>{enquiry.subject}</p>
              <div className="bo-list-item-foot"><span className={`bo-status-pill ${toneClass[enquiry.status]}`}>{enquiry.status}</span></div>
            </button>
          ))}
          {visible.length === 0 && <div style={{ padding: 24, color: "#8b968f", fontSize: 11, textAlign: "center" }}>No enquiries match.</div>}
        </div>

        {selected ? (
          <div className="bo-detail-panel">
            <div className="bo-detail-head">
              <div>
                <span className={`bo-status-pill ${toneClass[selected.status]}`}>{selected.status}</span>
                <h2>{selected.subject}</h2>
                <div className="bo-detail-meta">
                  <span><strong style={{ color: "var(--deep)" }}>{selected.name}</strong></span>
                  <span><Mail size={12} /> {selected.email}</span>
                  <span><Phone size={12} /> {selected.phone}</span>
                  <span>{selected.date}</span>
                </div>
              </div>
              {selected.status !== "Closed" && (
                <button className="bo-icon-btn" onClick={() => { setStatus(selected.id, "Closed"); toast("Enquiry closed"); }} aria-label="Close enquiry"><X size={15} /></button>
              )}
            </div>
            <div className="bo-detail-body">
              <div className="bo-message-block">{selected.message}</div>
              <div className="bo-reply-box">
                <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder={`Reply to ${selected.name}…`} />
                <div className="flow-button-row solo" style={{ gap: 10 }}>
                  {selected.status === "New" && <button className="back-button" type="button" onClick={() => { setStatus(selected.id, "Responded"); toast("Marked as responded"); }}><Check size={14} /> Mark responded</button>}
                  <button className="primary-action" type="button" onClick={sendReply}>Send reply <Send size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bo-detail-panel bo-detail-empty">
            <Inbox size={28} />
            <p>Select an enquiry to view details</p>
          </div>
        )}
      </div>

      <div className="bo-panel">
        <div className="bo-panel-head"><div><h2>Prefer applications over enquiries?</h2><p>Accepted enquiries can be nudged toward a full application.</p></div>
          <a className="text-link" href="/school-admin/admissions">Go to applications <ArrowUpRight size={14} /></a>
        </div>
      </div>
    </BackofficeShell>
  );
}
