import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronRight,
  MapPin,
  Minus,
  Plus,
  Scale,
  Search,
  Share2,
  Star,
  X,
} from "lucide-react";

import { COMPARE_LIMIT, compare, useCompare } from "@/lib/compare";
import { Footer, Header, ModalFrame, img, openModal } from "./Home";
import {
  facilities,
  findSchool,
  firstYearCost,
  formatKes,
  formatKesShort,
  profileHref,
  schools as catalogue,
  type SchoolRecord,
} from "./schoolsData";

type Row = {
  label: string;
  hint?: string;
  value: (school: SchoolRecord) => string;
  render?: (school: SchoolRecord) => ReactNode;
  best?: { pick: "min" | "max"; score: (school: SchoolRecord) => number; tag: string; highlight?: string };
  emphasis?: boolean;
};

const statusTone: Record<SchoolRecord["admissions"]["status"], string> = { Open: "open", "Closing soon": "closing", Waitlist: "waitlist" };

const groups: { title: string; rows: Row[] }[] = [
  {
    title: "At a glance",
    rows: [
      { label: "Location", value: (s) => `${s.town}, ${s.county}` },
      { label: "School type", value: (s) => `${s.type} · ${s.gender}` },
      { label: "Day or boarding", value: (s) => s.mode },
      { label: "Curriculum", value: (s) => s.curriculum },
      { label: "Levels offered", value: (s) => s.levels },
      { label: "Established", value: (s) => String(s.established) },
      { label: "Learners", value: (s) => s.learners.toLocaleString("en-KE") },
    ],
  },
  {
    title: "Fees per term",
    rows: [
      { label: "Tuition", value: (s) => formatKes(s.fees.tuition), best: { pick: "min", score: (s) => s.fees.tuition, tag: "Lowest" } },
      { label: "Boarding", value: (s) => (s.fees.boarding == null ? "Not offered" : `${formatKes(s.fees.boarding)} · ${s.mode === "Boarding" ? "required" : "optional"}`) },
      { label: "Transport", value: (s) => (s.fees.transport == null ? "Not offered" : `From ${formatKes(s.fees.transport)}`) },
      { label: "Admission fee", hint: "Paid once", value: (s) => formatKes(s.fees.admission) },
      {
        label: "Est. first-year total",
        hint: "3 terms + admission fee",
        value: (s) => formatKes(firstYearCost(s)),
        best: { pick: "min", score: firstYearCost, tag: "Lowest", highlight: "Lowest first-year cost" },
        emphasis: true,
      },
    ],
  },
  {
    title: "Learning",
    rows: [
      { label: "Average class size", value: (s) => `${s.classSize} learners`, best: { pick: "min", score: (s) => s.classSize, tag: "Smallest", highlight: "Smallest classes" } },
      { label: "Teacher to learner", value: (s) => s.ratio },
      { label: "Languages", value: (s) => s.languages.join(", ") },
      { label: "Senior School", hint: "Grade 10–12 or equivalent", value: (s) => s.seniorOffer },
    ],
  },
  {
    title: "Facilities",
    rows: facilities.map((facility) => ({
      label: facility,
      value: (s: SchoolRecord) => (s.facilities.includes(facility) ? "Yes" : "No"),
      render: (s: SchoolRecord) =>
        s.facilities.includes(facility) ? (
          <span className="facility-mark yes"><Check size={13} /> Yes</span>
        ) : (
          <span className="facility-mark no"><Minus size={13} /> No</span>
        ),
    })),
  },
  {
    title: "Admissions 2027",
    rows: [
      { label: "Status", value: (s) => s.admissions.status, render: (s) => <span className={`admit-status ${statusTone[s.admissions.status]}`}>{s.admissions.status}</span> },
      { label: "Applications close", value: (s) => s.admissions.closes },
      { label: "Entry assessment", value: (s) => s.admissions.assessment },
      { label: "Next open day", value: (s) => s.admissions.openDay },
    ],
  },
  {
    title: "Parent reviews",
    rows: [
      {
        label: "Rating",
        value: (s) => s.rating.toFixed(1),
        render: (s) => <span className="compare-rating"><Star size={13} fill="currentColor" /> {s.rating.toFixed(1)} <small>({s.reviews} reviews)</small></span>,
        best: { pick: "max", score: (s) => s.rating, tag: "Top rated", highlight: "Top rated by parents" },
      },
      { label: "What parents say", value: (s) => s.quote, render: (s) => <q className="compare-quote">{s.quote}</q> },
    ],
  },
];

function winnersFor(row: Row, list: SchoolRecord[]) {
  if (!row.best || list.length < 2) return new Set<string>();
  const { pick, score } = row.best;
  const scores = list.map(score);
  const target = pick === "min" ? Math.min(...scores) : Math.max(...scores);
  if (scores.every((value) => value === target)) return new Set<string>();
  return new Set(list.filter((_, i) => scores[i] === target).map((school) => school.slug));
}

function useSelectedSchools() {
  return useCompare()
    .map(findSchool)
    .filter((school): school is SchoolRecord => Boolean(school));
}

function SchoolPicker({ selected, onClose }: { selected: SchoolRecord[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const full = selected.length >= COMPARE_LIMIT;
  const q = query.trim().toLowerCase();
  const matches = catalogue.filter((s) => !q || `${s.name} ${s.town} ${s.county} ${s.curriculum}`.toLowerCase().includes(q));
  return (
    <ModalFrame title="Add a school" eyebrow={`${selected.length} of ${COMPARE_LIMIT} selected`} onClose={onClose} wide>
      <div className="picker-search">
        <Search size={16} />
        <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by school, town or curriculum" aria-label="Search schools to compare" />
      </div>
      {full && <p className="picker-note">Your comparison is full. Remove a school to make room for another.</p>}
      <div className="picker-list">
        {matches.map((s) => {
          const added = selected.some((x) => x.slug === s.slug);
          return (
            <div className="picker-row" key={s.slug}>
              <img src={img[s.image]} alt="" />
              <span>
                <strong>{s.name}</strong>
                <small>{s.town}, {s.county} · {s.curriculum} · From {formatKesShort(s.fees.tuition)} / term</small>
              </span>
              <button className={`picker-add ${added ? "added" : ""}`} disabled={added || full} onClick={() => compare.add(s.slug)}>
                {added ? <><Check size={13} /> Added</> : <><Plus size={13} /> Add</>}
              </button>
            </div>
          );
        })}
        {matches.length === 0 && (
          <p className="picker-empty">No schools match “{query.trim()}”. <Link href="/schools" onClick={onClose}>Search all schools</Link></p>
        )}
      </div>
      <div className="flow-button-row solo"><button className="primary-action" onClick={onClose}>Done <Check size={15} /></button></div>
    </ModalFrame>
  );
}

function CompareEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="compare-empty">
      <div>
        <span className="compare-empty-icon"><Scale size={22} /></span>
        <h2>Nothing to compare <em>yet.</em></h2>
        <p>Tap “Compare” on any school in your search results to add it here, or pick up to {COMPARE_LIMIT} schools yourself. Fees, facilities, admissions and reviews line up row by row.</p>
        <div className="compare-empty-actions">
          <button className="primary-action" onClick={onAdd}><Plus size={15} /> Add a school</button>
          <button className="save-profile" onClick={() => compare.set(["greenfield-academy", "kiambu-hills-school", "st-hannahs-academy"])}>Try a sample comparison</button>
          <Link href="/schools" className="text-link">Browse schools <ArrowUpRight size={15} /></Link>
        </div>
      </div>
      <div className="compare-empty-slots" aria-hidden="true">
        {Array.from({ length: COMPARE_LIMIT }, (_, i) => (
          <button key={i} tabIndex={-1} onClick={onAdd}><span>0{i + 1}</span><Plus size={18} /></button>
        ))}
      </div>
    </div>
  );
}

export default function Compare() {
  const selected = useSelectedSchools();
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // A shared link (/compare?schools=a,b,c) replaces whatever was being compared.
  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("schools");
    if (shared) compare.set(shared.split(",").filter((slug) => findSchool(slug)));
  }, []);

  const canAdd = selected.length < COMPARE_LIMIT;
  const canDiff = selected.length >= 2;
  const tableStyle = { "--cols": selected.length + (canAdd ? 1 : 0) } as CSSProperties;

  const visibleGroups = groups
    .map((group) => ({
      ...group,
      rows: group.rows.filter((row) => !(onlyDiff && canDiff) || new Set(selected.map(row.value)).size > 1),
    }))
    .filter((group) => group.rows.length > 0);

  const highlights: Record<string, string[]> = {};
  for (const row of groups.flatMap((group) => group.rows)) {
    if (!row.best?.highlight) continue;
    winnersFor(row, selected).forEach((slug) => (highlights[slug] ??= []).push(row.best!.highlight!));
  }

  async function share() {
    const url = `${window.location.origin}/compare?schools=${selected.map((s) => s.slug).join(",")}`;
    try {
      await navigator.clipboard.writeText(url);
      toast("Comparison link copied");
    } catch {
      toast("Couldn't copy the link. Try again from your browser's address bar.");
    }
  }

  const emptyCell = canAdd && <div className="compare-cell compare-spare" aria-hidden="true" />;

  return (
    <div className="site-page compare-page">
      <Header active="compare" />
      <main>
        <section className="compare-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/">Home</Link><ChevronRight size={14} /><Link href="/schools">Find a school</Link><ChevronRight size={14} /><span>Compare</span></div>
            <div className="compare-hero-grid">
              <div>
                <div className="eyebrow light"><span className="eyebrow-line" />Compare schools</div>
                <h1>Weigh them up,<br /><em>side by side.</em></h1>
              </div>
              <p>Fees, curriculum, facilities, admission dates and parent reviews for up to {COMPARE_LIMIT} schools, lined up on one screen. No spreadsheet required.</p>
            </div>
          </div>
        </section>

        <section className="compare-body">
          <div className="container">
            {selected.length === 0 ? (
              <CompareEmpty onAdd={() => setPickerOpen(true)} />
            ) : (
              <>
                <div className="compare-toolbar">
                  <p><strong>{selected.length} of {COMPARE_LIMIT}</strong> schools selected</p>
                  <div className="compare-toolbar-actions">
                    <label className={`diff-toggle ${canDiff ? "" : "disabled"}`} title={canDiff ? undefined : "Add another school to compare differences"}>
                      <input type="checkbox" checked={onlyDiff && canDiff} disabled={!canDiff} onChange={(e) => setOnlyDiff(e.target.checked)} />
                      <span className="diff-switch" />
                      Only show differences
                    </label>
                    <button className="text-link" onClick={share}><Share2 size={14} /> Share</button>
                    <button className="text-link" onClick={() => openModal("signin")}><Bookmark size={14} /> Save</button>
                    <button className="clear-link" onClick={() => compare.clear()}>Clear all</button>
                  </div>
                </div>

                <div className="compare-table" style={tableStyle}>
                  <div className="compare-row compare-media">
                    <div className="compare-label" />
                    {selected.map((s) => (
                      <div className="compare-cell" key={s.slug}>
                        <div className="compare-photo">
                          <img src={img[s.image]} alt={`${s.name} campus`} />
                          <button className="compare-remove" onClick={() => compare.remove(s.slug)} aria-label={`Remove ${s.name} from comparison`}><X size={14} /></button>
                        </div>
                        {highlights[s.slug] && <div className="compare-highlights">{highlights[s.slug].map((h) => <span key={h}>{h}</span>)}</div>}
                      </div>
                    ))}
                    {canAdd && (
                      <div className="compare-cell">
                        <button className="compare-add" onClick={() => setPickerOpen(true)}>
                          <span><Plus size={18} /></span>
                          Add a school
                          <small>{COMPARE_LIMIT - selected.length} {COMPARE_LIMIT - selected.length === 1 ? "slot" : "slots"} free</small>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="compare-row compare-heads">
                    <div className="compare-label"><span className="eyebrow"><span className="eyebrow-line" />Your shortlist</span></div>
                    {selected.map((s) => (
                      <div className="compare-cell" key={s.slug}>
                        <Link href={profileHref} className="compare-school-name">{s.name}</Link>
                        <span className="school-location"><MapPin size={12} />{s.town}, {s.county}</span>
                      </div>
                    ))}
                    {emptyCell}
                  </div>

                  {visibleGroups.map((group) => (
                    <div className="compare-group" key={group.title}>
                      <div className="compare-group-title">{group.title}</div>
                      {group.rows.map((row) => {
                        const winners = winnersFor(row, selected);
                        return (
                          <div className={`compare-row ${row.emphasis ? "emphasis" : ""}`} key={row.label}>
                            <div className="compare-label">{row.label}{row.hint && <small>{row.hint}</small>}</div>
                            {selected.map((s) => (
                              <div className={`compare-cell ${winners.has(s.slug) ? "is-best" : ""}`} key={s.slug}>
                                {row.render ? row.render(s) : row.value(s)}
                                {winners.has(s.slug) && <span className="best-tag">{row.best!.tag}</span>}
                              </div>
                            ))}
                            {emptyCell}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {visibleGroups.length === 0 && <p className="compare-same">These schools match on everything shown. Turn off “Only show differences” to see the full table.</p>}

                  <div className="compare-row compare-actions">
                    <div className="compare-label" />
                    {selected.map((s) => (
                      <div className="compare-cell" key={s.slug}>
                        <Link href={profileHref} className="small-dark-button">View school <ArrowUpRight size={14} /></Link>
                        <button className="text-link" onClick={() => toast("Enquiry form is coming soon")}>Enquire</button>
                      </div>
                    ))}
                    {emptyCell}
                  </div>
                </div>

                <p className="compare-footnote">Fees are as published by each school for the 2027 intake and may change. The first-year total adds three terms of tuition, compulsory boarding and the one-off admission fee. It leaves out transport, optional boarding, uniform and trips.</p>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
      {pickerOpen && <SchoolPicker selected={selected} onClose={() => setPickerOpen(false)} />}
    </div>
  );
}

export function CompareTray() {
  const selected = useSelectedSchools();
  if (selected.length === 0) return null;
  return (
    <>
      <div className="compare-tray-spacer" aria-hidden="true" />
      <div className="compare-tray" role="region" aria-label="Schools to compare">
        <div className="container compare-tray-inner">
          <div className="compare-tray-copy">
            <strong>Compare schools</strong>
            <small>{selected.length < 2 ? "Add one more to compare" : `${selected.length} of ${COMPARE_LIMIT} selected`}</small>
          </div>
          <div className="compare-tray-slots">
            {Array.from({ length: COMPARE_LIMIT }, (_, i) => selected[i]).map((s, i) =>
              s ? (
                <div className="tray-slot" key={s.slug}>
                  <img src={img[s.image]} alt="" />
                  <span>{s.name}</span>
                  <button onClick={() => compare.remove(s.slug)} aria-label={`Remove ${s.name} from comparison`}><X size={13} /></button>
                </div>
              ) : (
                <div className="tray-slot empty" key={`empty-${i}`}>Empty slot</div>
              ),
            )}
          </div>
          <div className="compare-tray-actions">
            <button className="tray-clear" onClick={() => compare.clear()}>Clear</button>
            <Link href="/compare" className="cream-button">Compare now <ArrowUpRight size={15} /></Link>
          </div>
        </div>
      </div>
    </>
  );
}
