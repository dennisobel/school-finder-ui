import { ArrowRight, Check } from "lucide-react";

import { ModalFrame } from "../pages/Home";
import type { Counselor } from "../pages/counselors-data";
import { MpesaPaymentModal } from "./MpesaPaymentModal";

const SESSION_PRICE = "KES 300";

export type Booking = { counselor: Counselor; slot: string | null; name: string; phone: string; note: string; phase: "slot" | "pay" };

/**
 * Slot-picking + M-Pesa flow for a single, already-chosen counselor. Shared by
 * the full counselor directory (where the person picks the card) and the
 * Pathway AI report upsell (where the counselor is auto-matched and this modal
 * is the only thing the parent sees — no counselor list).
 */
export function CounselorBookingModal({ booking, onClose, onChange, onPay, onSuccess }: { booking: Booking; onClose: () => void; onChange: (b: Booking) => void; onPay: () => void; onSuccess: () => void }) {
  if (booking.phase === "pay") {
    return (
      <MpesaPaymentModal
        eyebrow={`Pay ${SESSION_PRICE} with M-Pesa`}
        title="Confirm your session."
        amount={SESSION_PRICE}
        amountLabel={`30-minute session · ${booking.counselor.name}`}
        payNote={`This is a UI preview, so no real payment is taken. In production this books your ${booking.slot} slot with ${booking.counselor.name} once payment clears.`}
        successTitle="Session booked."
        successBody={`You're set for ${booking.slot} with ${booking.counselor.name}. They'll reach you by phone or WhatsApp on ${booking.phone || "the number you provided"} at that time.`}
        ctaLabel="Done"
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
  }

  const valid = booking.slot && booking.name && booking.phone;
  return (
    <ModalFrame title="Book a session" eyebrow={`${booking.counselor.name} · ${SESSION_PRICE} / 30 min`} onClose={onClose}>
      <p className="modal-copy">{booking.counselor.bio}</p>
      <div className="flow-form">
        <label className="levels-label">Pick a time</label>
        <div className="level-toggle counselor-slot-toggle">
          {booking.counselor.slots.map((s) => (
            <button type="button" key={s} className={booking.slot === s ? "active" : ""} onClick={() => onChange({ ...booking, slot: s })}>
              {booking.slot === s && <Check size={12} />}{s}
            </button>
          ))}
        </div>
        <div className="form-grid">
          <label>Your name<input required placeholder="e.g. Jane Wanjiku" value={booking.name} onChange={(e) => onChange({ ...booking, name: e.target.value })} /></label>
          <label>Phone or WhatsApp number<input required type="tel" placeholder="+254 7XX XXX XXX" value={booking.phone} onChange={(e) => onChange({ ...booking, phone: e.target.value })} /></label>
        </div>
        <label>What would you like to talk through? <span className="optional-tag">optional</span>
          <textarea rows={3} placeholder="e.g. Pathway AI gave us a close call between STEM and Social Sciences…" value={booking.note} onChange={(e) => onChange({ ...booking, note: e.target.value })} />
        </label>
        <button className="primary-action full-flow-button" disabled={!valid} onClick={onPay}>Continue to payment <ArrowRight size={16} /></button>
      </div>
    </ModalFrame>
  );
}
