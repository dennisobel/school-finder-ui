import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Download, FileText, Plus, Trash2, Upload, X } from "lucide-react";

import { img } from "../Home";
import BackofficeShell from "./Shell";
import { documents as initialDocuments, type DocumentAsset } from "./data";

type Photo = { id: string; url: string; caption: string };

// Built lazily (not as a module-level constant) since Media.tsx and Home.tsx
// import each other — `img` is a const export and isn't initialized yet if
// read while that circular import is still resolving.
function getInitialPhotos(): Photo[] {
  return [
    { id: "p1", url: img.campus, caption: "Main campus" },
    { id: "p2", url: img.classroom, caption: "Grade 5 classroom" },
    { id: "p3", url: img.courtyard, caption: "Courtyard" },
    { id: "p4", url: img.sports, caption: "Sports day" },
  ];
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Media() {
  const [photos, setPhotos] = useState<Photo[]>(getInitialPhotos);
  const [documents, setDocuments] = useState<DocumentAsset[]>(initialDocuments);
  const docInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetRef = useRef<string | null>(null);

  function addPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotos((prev) => [...prev, { id: `p-${Date.now()}`, url: URL.createObjectURL(file), caption: file.name.replace(/\.[^.]+$/, "") }]);
  }
  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  function openDocPicker(targetId: string | null) {
    replaceTargetRef.current = targetId;
    docInputRef.current?.click();
  }
  function handleDocFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const targetId = replaceTargetRef.current;
    const updated = "Just now";
    if (targetId) {
      setDocuments((prev) => prev.map((d) => (d.id === targetId ? { ...d, name: file.name.replace(/\.[^.]+$/, ""), updated, size: formatSize(file.size) } : d)));
      toast("Document replaced");
    } else {
      setDocuments((prev) => [...prev, { id: `doc-${Date.now()}`, name: file.name.replace(/\.[^.]+$/, ""), category: "General", updated, size: formatSize(file.size) }]);
      toast("Document uploaded");
    }
    e.target.value = "";
  }
  function removeDocument(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <BackofficeShell active="media" eyebrow="School" title="Media & documents">
      <input ref={docInputRef} type="file" className="bo-doc-upload-input" onChange={handleDocFile} />

      <div className="bo-panel">
        <div className="bo-panel-head">
          <div><h2>Photo gallery</h2><p>Shown on your public profile and search results</p></div>
        </div>
        <div className="bo-photo-grid">
          {photos.map((photo) => (
            <div className="bo-photo-tile" key={photo.id}>
              <img src={photo.url} alt={photo.caption} />
              <span className="bo-photo-caption">{photo.caption}</span>
              <button className="bo-photo-remove" onClick={() => removePhoto(photo.id)} aria-label={`Remove ${photo.caption}`}><X size={13} /></button>
            </div>
          ))}
          <label className="bo-photo-add">
            <Plus size={18} />
            Add photo
            <input type="file" accept="image/*" onChange={addPhoto} />
          </label>
        </div>
      </div>

      <div className="bo-panel">
        <div className="bo-panel-head">
          <div><h2>Documents</h2><p>Fee structures, guides and other files families can download</p></div>
          <button className="outline-button" onClick={() => openDocPicker(null)}><Upload size={14} /> Upload document</button>
        </div>
        <div>
          {documents.map((doc) => (
            <div className="bo-doc-row" key={doc.id}>
              <span className="bo-doc-icon"><FileText size={18} /></span>
              <div>
                <strong>{doc.name}</strong>
                <small>{doc.category} · {doc.size} · Updated {doc.updated}</small>
              </div>
              <div className="bo-doc-actions">
                <button onClick={() => openDocPicker(doc.id)} aria-label={`Replace ${doc.name}`}><Upload size={14} /></button>
                <button onClick={() => toast(`${doc.name} download is ready to connect`)} aria-label={`Download ${doc.name}`}><Download size={14} /></button>
                <button onClick={() => removeDocument(doc.id)} aria-label={`Delete ${doc.name}`}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {documents.length === 0 && <p style={{ color: "#8b968f", fontSize: 11, padding: "20px 0" }}>No documents uploaded yet.</p>}
        </div>
      </div>
    </BackofficeShell>
  );
}
