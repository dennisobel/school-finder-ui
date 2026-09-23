import { Link } from "wouter";
import {
  ArrowUpRight,
  CircleCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  Inbox,
  MessageSquare,
  Receipt,
  Sparkles,
  TrendingUp,
  UserCog,
} from "lucide-react";

import BackofficeShell from "./Shell";
import { activity, applications, enquiries, studentProgress, students, type ActivityKind } from "./data";

const activityIcon: Record<ActivityKind, typeof Inbox> = {
  enquiry: MessageSquare,
  application: ClipboardList,
  document: FileText,
  payment: Receipt,
  student: GraduationCap,
};

const profileCompletion = 78;
const gaugeRadius = 46;
const gaugeCircumference = 2 * Math.PI * gaugeRadius;

function ProfileGauge({ percent }: { percent: number }) {
  const offset = gaugeCircumference * (1 - percent / 100);
  return (
    <div className="bo-gauge">
      <svg width="108" height="108" viewBox="0 0 108 108">
        <circle cx="54" cy="54" r={gaugeRadius} fill="none" stroke="#edf0e8" strokeWidth="10" />
        <circle cx="54" cy="54" r={gaugeRadius} fill="none" stroke="var(--forest)" strokeWidth="10" strokeLinecap="round" strokeDasharray={gaugeCircumference} strokeDashoffset={offset} />
      </svg>
      <div className="bo-gauge-value"><strong>{percent}%</strong><small>Complete</small></div>
    </div>
  );
}

export default function Overview() {
  const newEnquiries = enquiries.filter((e) => e.status === "New").length;
  const pendingApplications = applications.filter((a) => a.status === "Submitted" || a.status === "Under review").length;
  const onboardingInProgress = students.filter((s) => studentProgress(s) < 100).length;

  return (
    <BackofficeShell active="overview" eyebrow="Overview" title="Welcome back, Greenfield Academy">
      <div className="bo-stat-grid">
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>New enquiries</span><span className="bo-stat-icon"><Inbox size={15} /></span></div>
          <div className="bo-stat-value">{newEnquiries}</div>
          <div className="bo-stat-delta warn">Awaiting a reply</div>
        </div>
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Applications pending</span><span className="bo-stat-icon"><ClipboardList size={15} /></span></div>
          <div className="bo-stat-value">{pendingApplications}</div>
          <div className="bo-stat-delta">Out of {applications.length} this intake</div>
        </div>
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Students onboarding</span><span className="bo-stat-icon"><GraduationCap size={15} /></span></div>
          <div className="bo-stat-value">{onboardingInProgress}</div>
          <div className="bo-stat-delta up"><TrendingUp size={11} /> On track for January intake</div>
        </div>
        <div className="bo-stat-tile">
          <div className="bo-stat-tile-head"><span>Profile completeness</span><span className="bo-stat-icon"><UserCog size={15} /></span></div>
          <div className="bo-stat-value">{profileCompletion}%</div>
          <div className="bo-stat-delta warn">Add extracurricular photos to finish</div>
        </div>
      </div>

      <div className="bo-grid-2">
        <div className="bo-panel">
          <div className="bo-panel-head">
            <div><h2>Recent activity</h2><p>What's happened across your school profile</p></div>
          </div>
          <div className="bo-log">
            {activity.map((item) => {
              const Icon = activityIcon[item.kind];
              return (
                <div className="bo-log-row" key={item.id}>
                  <span className={`bo-log-icon ${item.kind}`}><Icon size={14} /></span>
                  <div className="bo-log-body"><strong>{item.title}</strong><p>{item.detail}</p></div>
                  <span className="bo-log-time">{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bo-panel">
          <div className="bo-panel-head"><h2>Quick actions</h2></div>
          <div className="bo-quick-actions">
            <Link href="/school-admin/media" className="bo-quick-action"><FileText size={16} /><span>Upload fee structure<small>Keep families working from current numbers</small></span></Link>
            <Link href="/school-admin/media" className="bo-quick-action"><ImageIcon size={16} /><span>Add school photos<small>Fresh campus shots help conversion</small></span></Link>
            <Link href="/school-admin/admissions" className="bo-quick-action"><ClipboardList size={16} /><span>Review pending applications<small>{pendingApplications} waiting on a decision</small></span></Link>
            <Link href="/school-admin/enquiries" className="bo-quick-action"><MessageSquare size={16} /><span>Reply to enquiries<small>{newEnquiries} families waiting to hear back</small></span></Link>
            <Link href="/pathway-ai?school=1&bulk=1" className="bo-quick-action"><Sparkles size={16} /><span>Buy a Pathway AI cohort licence<small>Cover a whole Grade 9 class in one payment</small></span></Link>
          </div>
        </div>
      </div>

      <div className="bo-grid-2">
        <div className="bo-panel">
          <div className="bo-panel-head">
            <div><h2>Student onboarding</h2><p>January 2027 intake · completion by student</p></div>
            <Link href="/school-admin/onboarding" className="text-link">View all <ArrowUpRight size={14} /></Link>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {students.map((student) => {
              const percent = studentProgress(student);
              return (
                <div key={student.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span className="bo-student-avatar">{student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <strong style={{ color: "var(--deep)", fontSize: 11 }}>{student.name}</strong>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--muted-ink)" }}>{percent}%</span>
                    </div>
                    <div className="bo-progress-track"><div className={`bo-progress-fill ${percent < 60 ? "warn" : ""}`} style={{ width: `${percent}%` }} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bo-panel">
          <div className="bo-panel-head"><h2>Finish your profile</h2></div>
          <div className="bo-profile-meter">
            <ProfileGauge percent={profileCompletion} />
            <div className="bo-profile-meter-copy">
              <p>A complete profile ranks higher in search and earns the verified badge on your public page.</p>
              <div className="bo-checklist-mini">
                <span className="done"><CircleCheck size={13} /> Basic school details</span>
                <span className="done"><CircleCheck size={13} /> Registration verified (KYC/KYB)</span>
                <span className="done"><CircleCheck size={13} /> Fee structure uploaded</span>
                <span><CircleCheck size={13} /> Extracurricular photos (2 of 6)</span>
                <span><CircleCheck size={13} /> Staff bios</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackofficeShell>
  );
}
