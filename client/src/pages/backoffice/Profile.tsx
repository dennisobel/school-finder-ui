import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { Camera, ShieldCheck, X } from "lucide-react";

import { img } from "../Home";
import BackofficeShell from "./Shell";

const schoolTypes = ["Private", "Public", "Faith-based", "International", "Special needs"];
const curricula = ["CBC", "8-4-4", "British (Cambridge)", "American", "IB"];
const levelOptions = ["Pre-primary", "Primary", "Junior secondary", "Senior secondary"];

type ProfileForm = {
  displayName: string;
  tagline: string;
  about: string;
  schoolType: string;
  curriculum: string;
  county: string;
  town: string;
  address: string;
  website: string;
  phone: string;
  email: string;
};

const initialForm: ProfileForm = {
  displayName: "Greenfield Academy",
  tagline: "A place to grow curious, right in Ruiru.",
  about: "Greenfield Academy is a private co-educational day and boarding school located in Ruiru, Kiambu. We create a warm, ambitious environment where every learner is known, challenged and encouraged to find their own way forward.",
  schoolType: "Private",
  curriculum: "CBC",
  county: "Kiambu",
  town: "Ruiru",
  address: "Eastern Bypass, off Kamiti Road",
  website: "https://greenfield.sc.ke",
  phone: "+254 709 123 456",
  email: "admissions@greenfield.sc.ke",
};

export default function Profile() {
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [levels, setLevels] = useState<string[]>(["Primary", "Junior secondary"]);
  const [facilities, setFacilities] = useState<string[]>(["Swimming pool", "Robotics lab", "Football pitch", "Library", "Music room"]);
  const [facilityInput, setFacilityInput] = useState("");
  const [logo, setLogo] = useState(img.campus);
  const [cover, setCover] = useState(img.classroom);

  function update(key: keyof ProfileForm) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }
  function toggleLevel(level: string) {
    setLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]));
  }
  function addFacility(e: FormEvent) {
    e.preventDefault();
    const value = facilityInput.trim();
    if (!value) return;
    if (!facilities.includes(value)) setFacilities((prev) => [...prev, value]);
    setFacilityInput("");
  }
  function removeFacility(value: string) {
    setFacilities((prev) => prev.filter((f) => f !== value));
  }
  function handleImageSelect(setter: (url: string) => void) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setter(URL.createObjectURL(file));
    };
  }
  function handleSave(e: FormEvent) {
    e.preventDefault();
    toast("Profile updated");
  }

  return (
    <BackofficeShell
      active="profile"
      eyebrow="School"
      title="School profile"
      actions={<button className="primary-action" form="profile-form" type="submit">Save changes</button>}
    >
      <div className="bo-panel">
        <div className="bo-panel-head">
          <div><h2>Legal identity</h2><p>Verified through your KYC/KYB submission — contact support to change these.</p></div>
          <span className="bo-status-pill tone-accepted"><ShieldCheck size={12} /> Verified</span>
        </div>
        <div className="review-card">
          <div><small>Legal school name</small><strong>Greenfield Academy Ltd</strong></div>
          <div><small>MOE registration number</small><strong>MOE/PVT/2014/0456</strong></div>
          <div><small>Ownership structure</small><strong>Private limited company</strong></div>
          <div><small>KRA PIN</small><strong>P051234567X</strong></div>
        </div>
      </div>

      <form id="profile-form" className="bo-panel" onSubmit={handleSave}>
        <div className="bo-panel-head"><div><h2>Branding</h2><p>Shown at the top of your public school profile</p></div></div>
        <div className="bo-avatar-row">
          <div className="bo-logo-upload">
            <img src={logo} alt="School logo" />
            <label htmlFor="logo-upload"><Camera size={18} /></label>
            <input id="logo-upload" type="file" accept="image/*" onChange={handleImageSelect(setLogo)} />
          </div>
          <div style={{ flex: 1 }} className="bo-cover-upload">
            <img src={cover} alt="School cover" />
            <label htmlFor="cover-upload"><Camera size={13} /> Replace cover photo</label>
            <input id="cover-upload" type="file" accept="image/*" onChange={handleImageSelect(setCover)} />
          </div>
        </div>

        <div className="bo-field-grid" style={{ marginTop: 22 }}>
          <label>Display name<input value={form.displayName} onChange={update("displayName")} /></label>
          <label>Tagline<input value={form.tagline} onChange={update("tagline")} /></label>
          <label>School type<select value={form.schoolType} onChange={update("schoolType")}>{schoolTypes.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label>Primary curriculum<select value={form.curriculum} onChange={update("curriculum")}>{curricula.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label>County<input value={form.county} onChange={update("county")} /></label>
          <label>Town / area<input value={form.town} onChange={update("town")} /></label>
        </div>
        <label className="bo-field-full">Physical address<input value={form.address} onChange={update("address")} /></label>
        <label className="bo-field-full">About the school<textarea value={form.about} onChange={update("about")} /></label>

        <label className="levels-label" style={{ marginTop: 18, display: "block" }}>Education levels offered</label>
        <div className="level-toggle">
          {levelOptions.map((l) => (
            <button type="button" key={l} className={levels.includes(l) ? "active" : ""} onClick={() => toggleLevel(l)}>{l}</button>
          ))}
        </div>

        <div className="bo-field-grid" style={{ marginTop: 22 }}>
          <label>Contact phone<input value={form.phone} onChange={update("phone")} /></label>
          <label>Contact email<input type="email" value={form.email} onChange={update("email")} /></label>
          <label>Website<input type="url" value={form.website} onChange={update("website")} /></label>
        </div>
      </form>

      <div className="bo-panel">
        <div className="bo-panel-head"><div><h2>Facilities & extracurriculars</h2><p>Shown as tags on your public profile</p></div></div>
        <form className="bo-tag-input" onSubmit={addFacility}>
          {facilities.map((f) => (
            <span className="bo-tag" key={f}>{f}<button type="button" onClick={() => removeFacility(f)} aria-label={`Remove ${f}`}><X size={12} /></button></span>
          ))}
          <input value={facilityInput} onChange={(e) => setFacilityInput(e.target.value)} placeholder="Add a facility or activity and press Enter" />
        </form>
      </div>
    </BackofficeShell>
  );
}
