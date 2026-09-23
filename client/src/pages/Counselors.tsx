import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { CounselorBookingModal, type Booking } from "@/components/CounselorBookingModal";
import { Footer, Header } from "./Home";
import { counselors, type Counselor } from "./counselors-data";

const SESSION_PRICE = "KES 300";

function CounselorCard({ counselor, onBook }: { counselor: Counselor; onBook: (c: Counselor) => void }) {
  return (
    <article className="counselor-card">
      <img src={counselor.photo} alt={counselor.name} className="counselor-photo" />
      <div className="counselor-body">
        <div className="counselor-name-row">
          <div><strong>{counselor.name}</strong><span className="counselor-title">{counselor.title}</span></div>
          <div className="rating"><Star size={13} fill="currentColor" /> {counselor.rating}</div>
        </div>
        <p className="counselor-bio">{counselor.bio}</p>
        <div className="counselor-specialties">{counselor.specialties.map((s) => <span key={s} className="subject-chip muted">{s}</span>)}</div>
        <div className="counselor-foot">
          <span className="counselor-meta">{counselor.years} yrs experience · {counselor.sessions} sessions</span>
          <button className="small-dark-button" onClick={() => onBook(counselor)}>Book · {SESSION_PRICE} <ArrowUpRight size={14} /></button>
        </div>
      </div>
    </article>
  );
}

export default function Counselors() {
  const [booking, setBooking] = useState<Booking | null>(null);

  return (
    <div className="site-page counselors-page">
      <Header active="counselors" />
      <main>
        <section className="pathway-hero counselors-hero">
          <div className="hero-grain" />
          <div className="container pathway-hero-grid">
            <div className="pathway-hero-copy">
              <Link href="/pathway-ai" className="onboarding-secondary-link counselors-back-link"><ChevronRight size={12} style={{ transform: "rotate(180deg)" }} /> Back to Pathway AI</Link>
              <div className="eyebrow light"><span className="eyebrow-line" />Talk it through</div>
              <h1>When the report isn't<br /><em>the whole answer.</em></h1>
              <p className="pathway-lede">Book a 30-minute call with a certified counselor to talk through a Pathway AI result, a close call between two pathways, or anything else about senior school choices.</p>
              <div className="pathway-trust-row">
                <span><ShieldCheck size={14} /> Verified credentials, checked by our team</span>
                <span><MessageCircle size={14} /> By phone or WhatsApp, at a time that suits you</span>
              </div>
            </div>
            <div className="pathway-hero-visual">
              <div className="pathway-preview-card counselor-preview-card">
                <div className="pathway-preview-lock"><Sparkles size={12} /> Most booked</div>
                <img src={counselors[0].photo} alt={counselors[0].name} className="counselor-preview-photo" />
                <strong>{counselors[0].name}</strong>
                <span className="counselor-preview-title">{counselors[0].title}</span>
                <div className="counselor-preview-rating"><Star size={13} fill="currentColor" /> {counselors[0].rating} · {counselors[0].sessions} sessions</div>
                <span className="pathway-preview-caption">30 minutes · {SESSION_PRICE} · pay only when you book</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-intro">
              <div>
                <div className="eyebrow"><span className="eyebrow-line" />Our counselors</div>
                <h2>Real people, not<br /><em>another form.</em></h2>
              </div>
              <p>Every counselor is verified before they're listed, and every session is billed only when you confirm a time.</p>
            </div>
            <div className="counselor-grid">
              {counselors.map((c) => <CounselorCard key={c.id} counselor={c} onBook={(counselor) => setBooking({ counselor, slot: null, name: "", phone: "", note: "", phase: "slot" })} />)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      {booking && (
        <CounselorBookingModal
          booking={booking}
          onClose={() => setBooking(null)}
          onChange={setBooking}
          onPay={() => setBooking({ ...booking, phase: "pay" })}
          onSuccess={() => setBooking(null)}
        />
      )}
    </div>
  );
}
