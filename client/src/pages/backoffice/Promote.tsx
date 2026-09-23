import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Check, Eye, MousePointerClick, Rocket, Sparkles, Star } from "lucide-react";

import { MpesaPaymentModal } from "@/components/MpesaPaymentModal";
import { img } from "@/lib/images";
import BackofficeShell from "./Shell";

type Package = { id: string; name: string; duration: string; days: number; price: string; blurb: string; recommended?: boolean };

const packages: Package[] = [
  { id: "weekly", name: "1-week boost", duration: "7 days", days: 7, price: "KES 1,200", blurb: "A quick push around an open house or a fast-closing intake window." },
  { id: "intake", name: "Intake season boost", duration: "21 days", days: 21, price: "KES 3,500", blurb: "Covers a full admissions push — most schools use this for the January intake and Grade 10 placement.", recommended: true },
  { id: "term", name: "Full-term boost", duration: "90 days", days: 90, price: "KES 8,000", blurb: "Stay featured for the whole term. Best value per day for schools admitting year-round." },
];

type ActiveBoost = { packageId: string; daysTotal: number; daysUsed: number };

export default function Promote() {
  const [paying, setPaying] = useState<Package | null>(null);
  const [active, setActive] = useState<ActiveBoost | null>({ packageId: "intake", daysTotal: 21, daysUsed: 6 });

  const activePackage = active ? packages.find((p) => p.id === active.packageId) : null;
  const percentUsed = active ? Math.round((active.daysUsed / active.daysTotal) * 100) : 0;
  const daysLeft = active ? active.daysTotal - active.daysUsed : 0;

  function confirmPurchase(pkg: Package) {
    setActive({ packageId: pkg.id, daysTotal: pkg.days, daysUsed: 0 });
    setPaying(null);
    toast(`${pkg.name} is live on your profile`);
  }

  return (
    <BackofficeShell active="promote" eyebrow="Promote" title="Admissions boost">
      <div className="bo-grid-2">
        <div className="bo-panel promote-preview-panel">
          <div className="bo-panel-head"><div><h2>How you'll appear</h2><p>Featured listings sit above standard results on search and the homepage</p></div></div>
          <article className="school-card compact-card promote-preview-card">
            <div className="school-image-wrap">
              <img src={img.campus} alt="Greenfield Academy campus" className="school-image" />
              <div className="image-overlay" />
              <span className="card-status">{active ? "Featured" : "Standard"}</span>
            </div>
            <div className="school-card-body">
              <div className="school-card-heading">
                <div><span className="school-name">Greenfield Academy</span><div className="school-location">Ruiru, Kiambu</div></div>
                <div className="rating"><Star size={14} fill="currentColor" /> 4.8</div>
              </div>
              <div className="school-tags"><span>Private</span><span>Day &amp; Boarding</span><span>CBC</span></div>
            </div>
          </article>
          {active && activePackage ? (
            <div className="boost-active-card">
              <div className="boost-active-head"><span><Rocket size={14} /> {activePackage.name} active</span><strong>{daysLeft} of {active.daysTotal} days left</strong></div>
              <div className="bo-progress-track"><div className="bo-progress-fill" style={{ width: `${percentUsed}%` }} /></div>
              <div className="boost-active-stats">
                <span><Eye size={12} /> +212% profile views this week</span>
                <span><MousePointerClick size={12} /> 18 enquiries since boosting</span>
              </div>
            </div>
          ) : (
            <p className="modal-copy" style={{ marginTop: 16 }}>You're on the standard listing. Buy a boost package below to appear above other schools in search and on the homepage.</p>
          )}
        </div>

        <div className="bo-panel">
          <div className="bo-panel-head"><div><h2>Boost packages</h2><p>Seasonal pushes for when admissions matter most</p></div></div>
          <div className="boost-package-grid">
            {packages.map((p) => (
              <div className={`boost-package-card ${active?.packageId === p.id ? "current" : ""}`} key={p.id}>
                {p.recommended && <span className="package-recommended"><Sparkles size={11} /> Most popular</span>}
                <strong className="package-name">{p.name}</strong>
                <div className="package-price">{p.price}<small>/ {p.duration}</small></div>
                <p className="boost-package-blurb">{p.blurb}</p>
                <ul className="unlock-features package-features boost-package-features">
                  <li><Check size={13} /> Featured badge on your profile</li>
                  <li><Check size={13} /> Priority placement in search &amp; homepage</li>
                  <li><Check size={13} /> Included in the parent newsletter</li>
                </ul>
                <button className={active?.packageId === p.id ? "outline-button" : "primary-action"} style={{ width: "100%", justifyContent: "center" }} onClick={() => setPaying(p)} disabled={active?.packageId === p.id}>
                  {active?.packageId === p.id ? "Currently active" : "Boost my listing"}
                </button>
              </div>
            ))}
          </div>
          <div className="promote-seasonal-note"><CalendarDays size={14} /> Most schools boost twice a year: 4–6 weeks before the January intake, and again ahead of Grade 10 placement in June.</div>
        </div>
      </div>

      {paying && (
        <MpesaPaymentModal
          eyebrow={`Pay ${paying.price} with M-Pesa`}
          title={`Boost with ${paying.name}.`}
          amount={paying.price}
          amountLabel={`${paying.name} · ${paying.duration}`}
          payNote="This is a UI preview, so no real payment is taken. In production this can be billed to your school's M-Pesa or invoiced account."
          successTitle="Boost activated."
          successBody={`Greenfield Academy is now featured for ${paying.duration}. You'll see it reflected in search and on the homepage right away.`}
          ctaLabel="View my listing"
          onClose={() => setPaying(null)}
          onSuccess={() => confirmPurchase(paying)}
        />
      )}
    </BackofficeShell>
  );
}
