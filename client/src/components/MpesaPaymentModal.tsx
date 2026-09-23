import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, CheckCircle2, Loader2, Smartphone } from "lucide-react";

import { ModalFrame } from "../pages/Home";

/**
 * Shared UI-only M-Pesa payment flow used across every paid feature (Pathway AI,
 * fee collection, admissions boosts, job listings, counselor bookings). Keeping
 * one component means every "pay with M-Pesa" moment in the product looks and
 * behaves the same way, and it's the only place that fakes the STK push delay.
 */
export type MpesaPaymentModalProps = {
  eyebrow: string;
  title: string;
  amount: string;
  amountLabel?: string;
  /** When set, this is a request-to-pay flow (e.g. a school billing a guardian) — the phone is fixed, not typed in. */
  payerPhone?: string;
  payNote: ReactNode;
  waitingNote?: ReactNode;
  successTitle?: string;
  successBody: ReactNode;
  ctaLabel?: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function MpesaPaymentModal({
  eyebrow,
  title,
  amount,
  amountLabel = "Amount due",
  payerPhone,
  payNote,
  waitingNote,
  successTitle = "Payment received.",
  successBody,
  ctaLabel = "Continue",
  onClose,
  onSuccess,
}: MpesaPaymentModalProps) {
  const [phase, setPhase] = useState<"details" | "waiting" | "success">("details");
  const [phone, setPhone] = useState("");
  const activePhone = payerPhone || phone;

  useEffect(() => {
    if (phase !== "waiting") return;
    const timer = setTimeout(() => setPhase("success"), 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "success") {
    return (
      <ModalFrame title={successTitle} eyebrow="M-Pesa confirmation" onClose={onClose}>
        <div className="modal-success">
          <span><CheckCircle2 size={24} /></span>
          <p>{successBody}</p>
          <button className="primary-action" onClick={onSuccess}>{ctaLabel} <ArrowRight size={16} /></button>
        </div>
      </ModalFrame>
    );
  }

  if (phase === "waiting") {
    return (
      <ModalFrame title="Check your phone." eyebrow="M-Pesa payment request sent" onClose={onClose}>
        <div className="payment-waiting">
          <Loader2 size={28} className="spin" />
          <p className="modal-copy">{waitingNote || `We've sent a payment prompt to ${activePhone || "your phone"}. Enter your M-Pesa PIN to complete the ${amount} payment.`}</p>
        </div>
      </ModalFrame>
    );
  }

  return (
    <ModalFrame title={title} eyebrow={eyebrow} onClose={onClose}>
      <p className="modal-copy">{payNote}</p>
      <div className="flow-form">
        {payerPhone ? (
          <div className="payer-phone-display"><Smartphone size={15} /> Sending a payment request to <strong>{payerPhone}</strong></div>
        ) : (
          <label>M-Pesa phone number
            <input required placeholder="+254 7XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
        )}
        <div className="payment-price-row"><span>{amountLabel}</span><strong>{amount}</strong></div>
        <button className="primary-action full-flow-button" disabled={!payerPhone && !phone} onClick={() => setPhase("waiting")}><Smartphone size={16} /> Send M-Pesa request</button>
      </div>
    </ModalFrame>
  );
}
