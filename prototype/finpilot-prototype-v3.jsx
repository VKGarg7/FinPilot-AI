import React, { useState, useMemo, useRef, useEffect, createContext, useContext } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar as RechartsBar, CartesianGrid, LineChart, Line,
} from "recharts";

/* ================================================================
   FinPilot AI — Wave 1 Prototype v3 · Showcase Build
   New in v3: onboarding splash · layered hero w/ live sparkline ·
   interactive Score Simulator (FHS-005) · page & card transitions ·
   refined dark mode · upgraded chat. Deterministic math + live
   grounded AI Coach unchanged at the core.
   ================================================================ */

/* ---------- Theme ---------- */
const THEMES = {
  light: {
    ink: "#0E1C2B", paper: "#F2F6F7", card: "#FFFFFF", cardAlt: "#FAFCFC",
    brand: "#0A6B5C", brandSoft: "#DFF0EB", brandDeep: "#07473D",
    success: "#148A5B", successSoft: "#E0F3E9",
    warn: "#B0770A", warnSoft: "#FBEFD6",
    danger: "#C13D3D", dangerSoft: "#FAE4E4",
    ai: "#5A52DB", aiSoft: "#EAE9FB", aiDeep: "#3D37A8",
    sub: "#75828E", line: "#E0E7EB", wash: "#EBF0F2",
    heroA: "#0A6B5C", heroB: "#0C4B5E", heroC: "#123A63", heroText: "#FFFFFF",
    shadow: "0 1px 2px rgba(14,28,43,.05), 0 6px 20px rgba(14,28,43,.05)",
    glowAI: "0 8px 28px rgba(90,82,219,.28)",
  },
  dark: {
    ink: "#E9EEF3", paper: "#0B121C", card: "#141E2B", cardAlt: "#101927",
    brand: "#37B49A", brandSoft: "#0F332C", brandDeep: "#7BDCC6",
    success: "#3FC286", successSoft: "#0F3020",
    warn: "#DCA63E", warnSoft: "#342810",
    danger: "#E36B6B", dangerSoft: "#3A1515",
    ai: "#948DF5", aiSoft: "#232048", aiDeep: "#C0BCF9",
    sub: "#8794A2", line: "#223041", wash: "#1A2635",
    heroA: "#0F3B33", heroB: "#0E2E42", heroC: "#131F3F", heroText: "#EAF6F1",
    shadow: "0 1px 3px rgba(0,0,0,.45)",
    glowAI: "0 8px 28px rgba(148,141,245,.25)",
  },
};
const Theme = createContext(THEMES.light);
const useT = () => useContext(Theme);
const mono = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };
const disp = { fontFamily: "'Space Grotesk', 'Inter', sans-serif" };

/* ---------- Personas ---------- */
const PERSONAS = {
  Professional: { label: "Working Professional", scale: 1, widgets: ["hero", "cash", "budgets", "insight", "goals"] },
  Student: { label: "Student", scale: 1, widgets: ["hero", "budgets", "insight", "goals"] },
  Retiree: { label: "Retiree · Senior Mode", scale: 1.16, widgets: ["hero", "bills", "insurance", "insight"] },
};

/* ---------- Data ---------- */
const USER = { name: "Arjun Mehta", dependents: 2, riskAppetite: "Moderate", cityTier: "Metro" };
const INCOME_HISTORY = [
  { m: "Jan", amt: 145000 }, { m: "Feb", amt: 145000 }, { m: "Mar", amt: 168000 },
  { m: "Apr", amt: 145000 }, { m: "May", amt: 152000 }, { m: "Jun", amt: 145000 },
];
const BUDGETS = [
  { cat: "Groceries", icon: "🛒", budget: 18000, spent: 12400 },
  { cat: "Dining Out", icon: "🍽️", budget: 10000, spent: 9350 },
  { cat: "Transport", icon: "🚗", budget: 8000, spent: 4120 },
  { cat: "Utilities", icon: "💡", budget: 7500, spent: 7480 },
  { cat: "Shopping", icon: "🛍️", budget: 12000, spent: 14750 },
  { cat: "Entertainment", icon: "🎬", budget: 5000, spent: 2100 },
];
const TXNS = [
  { d: "Jun 28", merchant: "BigBasket", cat: "Groceries", amt: -2340, acct: "HDFC •4821", conf: "high" },
  { d: "Jun 28", merchant: "Uber", cat: "Transport", amt: -412, acct: "ICICI •0937", conf: "high" },
  { d: "Jun 27", merchant: "Swiggy", cat: "Dining Out", amt: -685, acct: "HDFC •4821", conf: "high" },
  { d: "Jun 27", merchant: "RZP*KIRANA STORE", cat: "Groceries", amt: -890, acct: "HDFC •4821", conf: "low" },
  { d: "Jun 26", merchant: "Myntra", cat: "Shopping", amt: -3499, acct: "ICICI •0937", conf: "high" },
  { d: "Jun 25", merchant: "Netflix", cat: "Entertainment", amt: -649, acct: "HDFC •4821", conf: "high", recurring: true },
  { d: "Jun 25", merchant: "BESCOM Electricity", cat: "Utilities", amt: -3240, acct: "HDFC •4821", conf: "high", recurring: true },
  { d: "Jun 24", merchant: "Salary — Acme Tech", cat: "Income", amt: 145000, acct: "ICICI •0937", conf: "high" },
  { d: "Jun 22", merchant: "Blue Tokai Coffee", cat: "Dining Out", amt: -540, acct: "HDFC •4821", conf: "high" },
  { d: "Jun 20", merchant: "Amazon", cat: "Shopping", amt: -6210, acct: "ICICI •0937", conf: "high" },
  { d: "Jun 18", merchant: "Gym — Cult.fit", cat: "Entertainment", amt: -1200, acct: "HDFC •4821", conf: "high", recurring: true },
  { d: "Jun 15", merchant: "Indian Oil", cat: "Transport", amt: -2800, acct: "ICICI •0937", conf: "high" },
];
const SUBS = [
  { name: "Netflix", amt: 649, freq: "Monthly", next: "Jul 25", flag: "hike", note: "₹499 → ₹649 (+30%) since May" },
  { name: "Cult.fit", amt: 1200, freq: "Monthly", next: "Jul 18" },
  { name: "Spotify", amt: 119, freq: "Monthly", next: "Jul 12", flag: "unused", note: "No usage signal in 74 days" },
  { name: "iCloud+", amt: 75, freq: "Monthly", next: "Jul 8" },
];
const HOLDINGS = [
  { name: "Nifty 50 Index Fund", type: "Equity MF", value: 486000, invested: 380000, yrs: 3.0, top: ["HDFC Bank", "Reliance", "Infosys", "ICICI Bank"] },
  { name: "Flexi Cap Growth Fund", type: "Equity MF", value: 312000, invested: 260000, yrs: 2.5, top: ["HDFC Bank", "Reliance", "Infosys", "Bajaj Finance"] },
  { name: "Corporate Bond Fund", type: "Debt MF", value: 205000, invested: 190000, yrs: 2.0, top: [] },
  { name: "EPF", type: "Retirement", value: 640000, invested: 560000, yrs: 5.0, top: [] },
  { name: "Gold (SGB)", type: "Gold", value: 148000, invested: 120000, yrs: 2.8, top: [] },
];
const LOAN = { name: "Home Loan — HDFC", principal: 4200000, rate: 8.6, tenureMonths: 240, monthsPaid: 36 };
const INSURANCE = { life: { cover: 5000000 }, health: { cover: 500000 } };
const GOALS = [
  { name: "Emergency Fund", icon: "🛟", target: 540000, saved: 386000, targetDate: "Dec 2026" },
  { name: "Home Down Payment", icon: "🏠", target: 2500000, saved: 910000, targetDate: "Jun 2028" },
  { name: "Goa Vacation", icon: "🏖️", target: 120000, saved: 84000, targetDate: "Nov 2026" },
];
const NW_TREND = [
  { m: "Jan", nw: 1480000 }, { m: "Feb", nw: 1552000 }, { m: "Mar", nw: 1690000 },
  { m: "Apr", nw: 1671000 }, { m: "May", nw: 1758000 }, { m: "Jun", nw: 1843000 },
];

/* ================================================================
   DETERMINISTIC CALC ENGINE
   ================================================================ */
const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtL = (n) => (Math.abs(n) >= 100000 ? "₹" + (n / 100000).toFixed(1) + "L" : fmt(n));
function smoothedIncome(h) {
  const w = h.map((_, i) => (i >= h.length - 2 ? 1.2 : 1));
  return h.reduce((s, x, i) => s + x.amt * w[i], 0) / w.reduce((a, b) => a + b, 0);
}
function computeXIRR(inv, val, yrs) {
  if (yrs <= 0 || inv <= 0) return 0;
  let r = 0.1;
  for (let i = 0; i < 60; i++) {
    const f = inv * Math.pow(1 + r, yrs) - val;
    const fp = inv * yrs * Math.pow(1 + r, yrs - 1);
    const n = r - f / fp;
    if (!isFinite(n)) break;
    if (Math.abs(n - r) < 1e-7) { r = n; break; }
    r = n;
  }
  return r * 100;
}
const emiFor = (P, rate, m) => { const i = rate / 1200; return (P * i * (1 + i) ** m) / ((1 + i) ** m - 1); };
function outstanding(P, rate, m, paid) {
  const i = rate / 1200, emi = emiFor(P, rate, m); let b = P;
  for (let k = 0; k < paid; k++) b = b * (1 + i) - emi;
  return { balance: b, emi };
}
function simulatePrepay(bal, rate, emi, extra) {
  const i = rate / 1200; let b = bal, months = 0, interest = 0;
  while (b > 0 && months < 600) { const int = b * i; interest += int; b = b + int - (emi + extra); months++; }
  return { months, interest };
}
function coverageGap(annual, liab, life, health, dep) {
  const lifeB = annual * 15 + liab, healthB = (dep + 1) * 500000;
  return { lifeB, lifeGap: Math.max(0, lifeB - life), healthB, healthGap: Math.max(0, healthB - health) };
}
function feasibility(goal, surplus) {
  const now = new Date("2026-07-01");
  const [mo, yr] = goal.targetDate.split(" ");
  const months = Math.max(1, (parseInt(yr) - now.getFullYear()) * 12 + ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(mo) / 3) - now.getMonth());
  const required = (goal.target - goal.saved) / months;
  const state = required <= surplus * 0.6 ? "On track" : required <= surplus ? "Tight but possible" : "Not feasible yet";
  return { required, months, state };
}
function healthScore(c) {
  const p = {
    savingsRate: Math.min(100, (c.sr / 0.3) * 100),
    debtToIncome: Math.min(100, Math.max(0, (1 - c.dti / 0.5) * 100)),
    budgetAdherence: c.ba * 100,
    insurance: Math.min(100, (c.life / c.lifeB) * 70 + (c.health / c.healthB) * 30),
    diversification: c.div * 100,
    emergencyFund: Math.min(100, (c.ef / 6) * 100),
  };
  const w = { savingsRate: .2, debtToIncome: .2, budgetAdherence: .15, insurance: .15, diversification: .15, emergencyFund: .15 };
  return { score: Math.round(Object.keys(p).reduce((s, k) => s + p[k] * w[k], 0)), pillars: p, weights: w, version: "v1.2" };
}
function useFinance() {
  return useMemo(() => {
    const usable = smoothedIncome(INCOME_HISTORY);
    const spent = BUDGETS.reduce((s, b) => s + b.spent, 0);
    const totalBudget = BUDGETS.reduce((s, b) => s + b.budget, 0);
    const invValue = HOLDINGS.reduce((s, h) => s + h.value, 0);
    const { balance: loanBal, emi } = outstanding(LOAN.principal, LOAN.rate, LOAN.tenureMonths, LOAN.monthsPaid);
    const cash = 412000, assets = invValue + cash, netWorth = assets - loanBal;
    const savings = usable - spent - emi, sr = savings / usable, dti = emi / usable;
    const ba = BUDGETS.filter((b) => b.spent <= b.budget).length / BUDGETS.length;
    const gaps = coverageGap(usable * 12, loanBal, INSURANCE.life.cover, INSURANCE.health.cover, USER.dependents);
    const cls = {}; HOLDINGS.forEach((h) => (cls[h.type] = (cls[h.type] || 0) + h.value));
    const div = 1 - Object.values(cls).reduce((s, v) => s + (v / invValue) ** 2, 0);
    const ef = GOALS[0].saved / (spent + emi);
    const ctx = { sr, dti, ba, life: INSURANCE.life.cover, lifeB: gaps.lifeB, health: INSURANCE.health.cover, healthB: gaps.healthB, div, ef };
    const health = healthScore(ctx);
    const holdings = HOLDINGS.map((h) => ({ ...h, xirr: computeXIRR(h.invested, h.value, h.yrs) }));
    const shared = holdings[0].top.filter((s) => holdings[1].top.includes(s));
    return { usable, spent, totalBudget, savings, sr, dti, ba, invValue, loanBal, emi, cash, assets, netWorth, gaps, div, ef, ctx, health, holdings, overlap: { funds: [holdings[0].name, holdings[1].name], shared }, alloc: cls };
  }, []);
}

/* ================================================================
   PRIMITIVES
   ================================================================ */
function useCountUp(target, dur = 950) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return v;
}
function Card({ children, style, ai, alert, onClick, delay = 0 }) {
  const T = useT();
  return (
    <div onClick={onClick} className="fadeUp" style={{
      background: T.card, borderRadius: 18, padding: 16,
      border: `1px solid ${alert ? (alert === "danger" ? T.danger : T.warn) + "50" : T.line}`,
      borderLeft: ai ? `3px solid ${T.ai}` : undefined,
      boxShadow: ai ? T.glowAI.replace("28px", "18px") : T.shadow,
      cursor: onClick ? "pointer" : "default",
      animationDelay: delay + "ms",
      transition: "transform .18s, box-shadow .18s", ...style,
    }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.transform = "none")}
    >{children}</div>
  );
}
function Label({ children, light }) {
  const T = useT();
  return <div style={{ fontSize: 10.5, letterSpacing: ".1em", textTransform: "uppercase", color: light ? "rgba(255,255,255,.72)" : T.sub, fontWeight: 800 }}>{children}</div>;
}
function Num({ children, size = 26, color }) {
  const T = useT();
  return <div style={{ ...mono, fontSize: size, fontWeight: 600, color: color || T.ink, lineHeight: 1.25 }}>{children}</div>;
}
function AIBadge() {
  const T = useT();
  return <span style={{ background: `linear-gradient(135deg, ${T.aiSoft}, ${T.aiSoft})`, color: T.aiDeep, fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 20, letterSpacing: ".06em" }}>✦ AI</span>;
}
function Explain({ text }) {
  const T = useT();
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", marginLeft: 6, display: "inline-block" }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} aria-label="Explain this figure"
        style={{ border: `1px solid ${T.line}`, background: T.wash, color: T.sub, borderRadius: "50%", width: 17, height: 17, fontSize: 10, cursor: "pointer", lineHeight: 1 }}>i</button>
      {open && (
        <span style={{ position: "absolute", zIndex: 60, top: 22, right: -8, width: 252, background: "#101E33", color: "#EAF0F6", fontSize: 12, lineHeight: 1.55, padding: "11px 13px", borderRadius: 12, display: "block", boxShadow: "0 14px 38px rgba(0,0,0,.4)" }}>
          {text}
          <button onClick={() => setOpen(false)} style={{ display: "block", marginTop: 7, background: "none", border: "none", color: "#8FA6BC", fontSize: 11, cursor: "pointer", padding: 0, fontWeight: 700 }}>Close</button>
        </span>
      )}
    </span>
  );
}
function Bar({ pct, height = 8 }) {
  const T = useT();
  const color = pct >= 100 ? T.danger : pct >= 80 ? "#D97706" : pct >= 50 ? T.warn : T.success;
  return (
    <div style={{ background: T.wash, borderRadius: 20, height, overflow: "hidden" }}>
      <div style={{ width: Math.min(100, pct) + "%", height: "100%", background: `linear-gradient(90deg, ${color}B0, ${color})`, borderRadius: 20, transition: "width .7s cubic-bezier(.22,1,.36,1)" }} />
    </div>
  );
}
function Chip({ children, tone = "neutral" }) {
  const T = useT();
  const m = { neutral: [T.wash, T.sub], danger: [T.dangerSoft, T.danger], warn: [T.warnSoft, T.warn], success: [T.successSoft, T.success], ai: [T.aiSoft, T.aiDeep] }[tone];
  return <span style={{ background: m[0], color: m[1], fontSize: 10.5, fontWeight: 800, borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap" }}>{children}</span>;
}
function SubTabs({ tabs, tab, setTab }) {
  const T = useT();
  return (
    <div style={{ display: "flex", gap: 4, background: T.wash, borderRadius: 13, padding: 4, marginBottom: 12, overflowX: "auto" }}>
      {tabs.map((t) => (
        <button key={t} onClick={() => setTab(t)}
          style={{
            flex: 1, whiteSpace: "nowrap", border: "none", borderRadius: 10, padding: "8px 11px", fontSize: 12.5, fontWeight: 750, cursor: "pointer",
            background: tab === t ? T.card : "transparent", color: tab === t ? T.ink : T.sub,
            boxShadow: tab === t ? T.shadow : "none", transition: "all .22s",
          }}>{t}</button>
      ))}
    </div>
  );
}
function ScoreRadial({ score, size = 150, light }) {
  const T = useT();
  const animated = useCountUp(score, 1150);
  const r = size / 2 - 11, c = 2 * Math.PI * r;
  const color = score >= 70 ? T.success : score >= 50 ? T.warn : T.danger;
  const label = score >= 70 ? "Good" : score >= 50 ? "Needs attention" : "At risk";
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? "rgba(255,255,255,.18)" : T.wash} strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? "#fff" : color} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={c * (1 - animated / 100)} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...mono, fontSize: size * 0.26, fontWeight: 700, color: light ? "#fff" : T.ink }}>{Math.round(animated)}</div>
        <div style={{ fontSize: 11, color: light ? "rgba(255,255,255,.85)" : color, fontWeight: 800 }}>{label}</div>
      </div>
    </div>
  );
}

/* ================================================================
   SPLASH / ONBOARDING (Epic 1 nod)
   ================================================================ */
function Splash({ onEnter, T }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: `radial-gradient(1200px 800px at 20% 10%, ${T.heroC}, transparent), linear-gradient(150deg, ${T.heroA}, ${T.heroB} 55%, ${T.heroC})`,
      color: "#fff", padding: 24, textAlign: "center",
    }}>
      <div className="floatY" style={{ fontSize: 52, marginBottom: 8 }}>✦</div>
      <div className="fadeUp" style={{ ...disp, fontSize: 34, fontWeight: 700, letterSpacing: "-.01em" }}>
        FinPilot <span style={{ color: "#A9E8D8" }}>AI</span>
      </div>
      <div className="fadeUp" style={{ maxWidth: 300, fontSize: 14.5, lineHeight: 1.65, opacity: .88, margin: "12px 0 6px", animationDelay: "120ms" }}>
        Your financial operating system — every insight grounded in your real numbers, never guessed.
      </div>
      <div className="fadeUp" style={{ display: "flex", gap: 14, margin: "18px 0 26px", animationDelay: "240ms" }}>
        {[["Deterministic math", "∑"], ["Grounded AI", "✦"], ["You own your data", "◈"]].map(([t, i]) => (
          <div key={t} style={{ fontSize: 11, opacity: .85, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, width: 88 }}>
            <span style={{ fontSize: 18 }}>{i}</span>{t}
          </div>
        ))}
      </div>
      <button onClick={onEnter} className="fadeUp"
        style={{
          animationDelay: "360ms", background: "#fff", color: T.heroA, border: "none", borderRadius: 14,
          padding: "14px 34px", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 12px 34px rgba(0,0,0,.28)",
        }}>
        Enter demo — Arjun's dashboard →
      </button>
      <div className="fadeUp" style={{ fontSize: 10.5, opacity: .6, marginTop: 16, animationDelay: "480ms" }}>
        Wave 1 prototype · Epics 1–5 · synthetic data
      </div>
    </div>
  );
}

/* ================================================================
   HOME
   ================================================================ */
function Home({ F, go, persona }) {
  const T = useT();
  const nw = useCountUp(F.netWorth);
  const P = PERSONAS[persona];
  const has = (w) => P.widgets.includes(w);
  const spark = NW_TREND.map((d) => ({ v: d.nw }));
  let d = 0; const nd = () => (d += 70);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="fadeUp" onClick={() => go("wealth")} role="button"
        style={{ background: T.dangerSoft, border: `1px solid ${T.danger}42`, color: T.danger, borderRadius: 13, padding: "11px 14px", fontSize: 13, fontWeight: 750, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>⚠ Life cover gap: {fmtL(F.gaps.lifeGap)} below benchmark</span><span>→</span>
      </div>

      {has("hero") && (
        <div className="fadeUp" style={{
          animationDelay: nd() + "ms",
          borderRadius: 22, padding: "22px 20px 16px",
          background: `radial-gradient(500px 260px at 85% -20%, ${T.heroC}CC, transparent), linear-gradient(135deg, ${T.heroA}, ${T.heroB})`,
          color: T.heroText, boxShadow: "0 16px 44px rgba(10,107,92,.30)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", left: -40, bottom: -80, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.05)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Label light>Net worth</Label>
              <div style={{ ...mono, fontSize: 35, fontWeight: 700, margin: "5px 0 3px" }}>{fmtL(nw)}</div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#AFF0DC" }}>▲ +₹85,000 this month</div>
            </div>
            <div onClick={() => go("goals")} style={{ cursor: "pointer" }}>
              <ScoreRadial score={F.health.score} size={102} light />
            </div>
          </div>
          <div style={{ height: 46, marginTop: 8, opacity: .95 }}>
            <ResponsiveContainer>
              <LineChart data={spark}>
                <Line dataKey="v" stroke="rgba(255,255,255,.9)" strokeWidth={2} dot={false} />
                <YAxis hide domain={["dataMin - 60000", "dataMax + 40000"]} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 10.5, opacity: .7, marginTop: 2 }}>6-month trend · tap the ring for your full score breakdown</div>
        </div>
      )}

      {has("cash") && (
        <Card delay={nd()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Label>June cash flow</Label>
            <span style={{ fontSize: 11, color: T.sub }}>Usable income<Explain text="Smoothed over 6 months (recent months weighted 1.2×) so one unusual month never distorts your plan." /></span>
          </div>
          <div style={{ display: "flex", marginTop: 12 }}>
            {[["In", F.usable, T.success], ["Out", F.spent + F.emi, T.ink], ["Saved", F.savings, T.brand]].map(([l, v, c], i) => (
              <div key={l} style={{ flex: 1, borderLeft: i ? `1px solid ${T.line}` : "none", paddingLeft: i ? 14 : 0 }}>
                <div style={{ fontSize: 11.5, color: T.sub, fontWeight: 650 }}>{l}</div>
                <Num size={17} color={c}>{fmtL(v)}</Num>
              </div>
            ))}
          </div>
        </Card>
      )}

      {has("budgets") && (
        <Card delay={nd()} onClick={() => go("money")}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Label>Budgets at risk</Label><Chip tone="danger">{BUDGETS.filter((b) => b.spent / b.budget >= 1).length} over</Chip>
          </div>
          {BUDGETS.filter((b) => b.spent / b.budget >= 0.8).map((b) => {
            const pct = (b.spent / b.budget) * 100;
            return (
              <div key={b.cat} style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span style={{ fontWeight: 650 }}>{b.icon} {b.cat}</span>
                  <span style={{ ...mono, fontWeight: 750, color: pct >= 100 ? T.danger : T.ink }}>{Math.round(pct)}%</span>
                </div>
                <Bar pct={pct} />
              </div>
            );
          })}
        </Card>
      )}

      {has("insurance") && (
        <Card delay={nd()} onClick={() => go("wealth")} alert="danger">
          <Label>Insurance coverage health</Label>
          <div style={{ marginTop: 10, fontSize: 13.5 * P.scale, lineHeight: 1.6 }}>
            Life cover is <b style={mono}>{fmtL(INSURANCE.life.cover)}</b> against a <b style={mono}>{fmtL(F.gaps.lifeB)}</b> benchmark — a {fmtL(F.gaps.lifeGap)} gap worth reviewing.
          </div>
        </Card>
      )}

      {has("bills") && (
        <Card delay={nd()}>
          <Label>Upcoming bills</Label>
          {SUBS.slice(0, 3).map((s) => (
            <div key={s.name} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.wash}`, fontSize: 13.5 * P.scale }}>
              <span style={{ fontWeight: 650 }}>{s.name}</span>
              <span style={{ color: T.sub }}>{s.next} · <b style={{ ...mono, color: T.ink }}>{fmt(s.amt)}</b></span>
            </div>
          ))}
        </Card>
      )}

      {has("insight") && (
        <Card delay={nd()} ai>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}><AIBadge /><Label>Insight of the day</Label></div>
          <div style={{ fontSize: 13.5 * P.scale, lineHeight: 1.62 }}>
            Netflix raised its price 30% in May, and Shopping has run over budget two months straight. Trimming Shopping to its 3-month average frees <b style={mono}>₹1,550/mo</b> for your Home Down Payment goal.
          </div>
          <button onClick={() => go("ai")} style={{ marginTop: 11, background: `linear-gradient(135deg, ${T.ai}, ${T.aiDeep})`, color: "#fff", border: "none", borderRadius: 10, padding: "9px 15px", fontSize: 12, fontWeight: 800, cursor: "pointer", boxShadow: T.glowAI }}>Chat about this →</button>
        </Card>
      )}

      {has("goals") && (
        <Card delay={nd()}>
          <Label>Goals</Label>
          <div style={{ display: "flex", gap: 10, marginTop: 10, overflowX: "auto", paddingBottom: 2 }}>
            {GOALS.map((g) => (
              <div key={g.name} onClick={() => go("goals")} style={{ minWidth: 158, background: T.wash, borderRadius: 13, padding: 12, cursor: "pointer" }}>
                <div style={{ fontSize: 13, fontWeight: 750 }}>{g.icon} {g.name}</div>
                <div style={{ margin: "9px 0 5px" }}><Bar pct={(g.saved / g.target) * 100} height={6} /></div>
                <div style={{ fontSize: 11, color: T.sub, ...mono }}>{fmtL(g.saved)} / {fmtL(g.target)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ================================================================
   MONEY
   ================================================================ */
function Money({ F }) {
  const T = useT();
  const [tab, setTab] = useState("Transactions");
  const [txns, setTxns] = useState(TXNS);
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const cats = ["All", ...new Set(TXNS.filter((t) => t.amt < 0).map((t) => t.cat))];
  const visible = txns.filter((t) =>
    (catFilter === "All" || t.cat === catFilter) &&
    (q === "" || t.merchant.toLowerCase().includes(q.toLowerCase()))
  );
  const confirmCat = (merchant) => {
    setTxns(txns.map((t) => (t.merchant === merchant ? { ...t, conf: "high" } : t)));
    setToast("Category confirmed — FinPilot will remember this merchant.");
    setTimeout(() => setToast(null), 2600);
  };
  return (
    <div>
      <SubTabs tabs={["Transactions", "Budgets", "Income", "Subscriptions"]} tab={tab} setTab={setTab} />
      {toast && <div style={{ position: "fixed", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 80, background: "#0E3B2E", color: "#CFF3E3", fontSize: 12.5, fontWeight: 750, padding: "11px 17px", borderRadius: 30, boxShadow: "0 10px 28px rgba(0,0,0,.3)" }}>{toast}</div>}

      {tab === "Transactions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search merchants…" aria-label="Search transactions"
            style={{ border: `1.5px solid ${T.line}`, background: T.card, color: T.ink, borderRadius: 13, padding: "12px 15px", fontSize: 14, outline: "none" }} />
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
            {cats.map((c) => (
              <button key={c} onClick={() => setCatFilter(c)}
                style={{ whiteSpace: "nowrap", border: "none", borderRadius: 20, padding: "7px 14px", fontSize: 12, fontWeight: 750, cursor: "pointer", background: catFilter === c ? T.brand : T.wash, color: catFilter === c ? "#fff" : T.sub, transition: "all .18s" }}>{c}</button>
            ))}
          </div>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            {visible.length === 0 && <div style={{ padding: 26, textAlign: "center", color: T.sub, fontSize: 13 }}>No transactions match. Clear the search to see everything.</div>}
            {visible.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${T.wash}`, gap: 12 }}>
                <div style={{ width: 37, height: 37, borderRadius: 12, background: t.amt > 0 ? T.successSoft : T.wash, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {t.amt > 0 ? "↑" : BUDGETS.find((b) => b.cat === t.cat)?.icon || "•"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 680, whiteSpace: "nowrap", overflow: "hidden", textOverflowEllipsis: "ellipsis", textOverflow: "ellipsis" }}>
                    {t.merchant} {t.recurring && <Chip>↻</Chip>}
                  </div>
                  <div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>
                    {t.d} · {t.acct} · {t.cat}
                    {t.conf === "low" && (
                      <button onClick={() => confirmCat(t.merchant)} style={{ marginLeft: 6, background: T.warnSoft, color: T.warn, border: "none", borderRadius: 6, fontSize: 10, fontWeight: 800, padding: "2px 8px", cursor: "pointer" }}>low confidence — confirm?</button>
                    )}
                  </div>
                </div>
                <div style={{ ...mono, fontWeight: 680, fontSize: 14, color: t.amt > 0 ? T.success : T.ink }}>{t.amt > 0 ? "+" : ""}{fmt(t.amt)}</div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === "Budgets" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card style={{ display: "flex", justifyContent: "space-between" }}>
            <div><Label>Budgeted</Label><Num size={19}>{fmt(F.totalBudget)}</Num></div>
            <div><Label>Spent</Label><Num size={19} color={F.spent > F.totalBudget ? T.danger : undefined}>{fmt(F.spent)}</Num></div>
            <div><Label>Days left</Label><Num size={19}>9</Num></div>
          </Card>
          {BUDGETS.map((b, i) => {
            const pct = (b.spent / b.budget) * 100;
            return (
              <Card key={b.cat} delay={i * 45} alert={pct >= 100 ? "danger" : undefined}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 680, marginBottom: 8 }}>
                  <span>{b.icon} {b.cat} {pct >= 100 && <Chip tone="danger">over</Chip>}{pct >= 80 && pct < 100 && <Chip tone="warn">80%</Chip>}</span>
                  <span style={mono}>{fmt(b.spent)} <span style={{ color: T.sub, fontWeight: 400 }}>/ {fmt(b.budget)}</span></span>
                </div>
                <Bar pct={pct} />
              </Card>
            );
          })}
          <Card ai>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7 }}><AIBadge /><Label>Suggested rebalance — next month</Label></div>
            <div style={{ fontSize: 13.5, lineHeight: 1.58 }}>Move <b style={mono}>₹2,000</b> from Entertainment (42% used) to Shopping (123% used), based on your actual 3-month pace — not a generic rule.</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={{ background: T.brand, color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}>Accept for next period</button>
              <button style={{ background: "none", color: T.sub, border: `1px solid ${T.line}`, borderRadius: 10, padding: "9px 16px", fontSize: 12.5, fontWeight: 750, cursor: "pointer" }}>No thanks</button>
            </div>
          </Card>
        </div>
      )}

      {tab === "Income" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card>
            <Label>Usable monthly income</Label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Num>{fmt(F.usable)}</Num>
              <Explain text="Trailing 6-month average, recent months weighted 1.2×. Used consistently across budgets, goals, and DTI — one number, platform-wide." />
            </div>
            <div style={{ height: 172, marginTop: 14 }}>
              <ResponsiveContainer>
                <BarChart data={INCOME_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.wash} vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 11, color: T.ink }} />
                  <RechartsBar dataKey="amt" fill={T.brand} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card ai>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7 }}><AIBadge /><Label>Tax provision nudge</Label></div>
            <div style={{ fontSize: 13.5, lineHeight: 1.58 }}>Your March freelance credit of ₹23,000 had no tax withheld — consider setting aside about <b style={mono}>₹4,800</b> for advance tax. Planning estimate only, not a filing figure.</div>
          </Card>
        </div>
      )}

      {tab === "Subscriptions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card style={{ display: "flex", gap: 28 }}>
            <div><Label>Monthly recurring</Label><Num size={19}>{fmt(SUBS.reduce((s, x) => s + x.amt, 0))}</Num></div>
            <div><Label>Annualized</Label><Num size={19}>{fmt(SUBS.reduce((s, x) => s + x.amt, 0) * 12)}</Num></div>
          </Card>
          {SUBS.map((s, i) => (
            <Card key={s.name} delay={i * 45} alert={s.flag === "hike" ? "danger" : s.flag === "unused" ? "warn" : undefined}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 750 }}>{s.name} {s.flag === "hike" && <Chip tone="danger">price hike</Chip>}{s.flag === "unused" && <Chip tone="warn">possibly unused</Chip>}</div>
                  <div style={{ fontSize: 11, color: T.sub, marginTop: 3 }}>{s.freq} · next {s.next}</div>
                  {s.note && <div style={{ fontSize: 12, color: s.flag === "hike" ? T.danger : T.warn, fontWeight: 680, marginTop: 5 }}>{s.note}</div>}
                </div>
                <div style={{ ...mono, fontWeight: 750, fontSize: 15 }}>{fmt(s.amt)}</div>
              </div>
              {s.flag && (
                <div style={{ display: "flex", gap: 8, marginTop: 11 }}>
                  <button style={{ background: "none", border: `1px solid ${T.line}`, color: T.sub, borderRadius: 9, padding: "7px 13px", fontSize: 11.5, fontWeight: 750, cursor: "pointer" }}>{s.flag === "hike" ? "View history" : "Yes, keep it"}</button>
                  <button style={{ background: T.wash, border: "none", color: T.ink, borderRadius: 9, padding: "7px 13px", fontSize: 11.5, fontWeight: 750, cursor: "pointer" }}>{s.flag === "hike" ? "I've cancelled this" : "Help me cancel"}</button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   WEALTH
   ================================================================ */
function Wealth({ F }) {
  const T = useT();
  const [tab, setTab] = useState("Net Worth");
  const [extra, setExtra] = useState(10000);
  const base = simulatePrepay(F.loanBal, LOAN.rate, F.emi, 0);
  const sim = simulatePrepay(F.loanBal, LOAN.rate, F.emi, extra);
  const saved = base.interest - sim.interest, monthsSaved = base.months - sim.months;
  const pie = Object.entries(F.alloc).map(([name, value]) => ({ name, value }));
  const pieColors = [T.brand, "#3E8FB0", "#8A6FBF", "#C08B2D", "#5B8C5A"];

  return (
    <div>
      <SubTabs tabs={["Net Worth", "Investments", "Loan", "Insurance"]} tab={tab} setTab={setTab} />
      {tab === "Net Worth" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div><Label>Net worth</Label><Num>{fmtL(F.netWorth)}</Num></div>
              <Chip tone="success">▲ 24.5% in 6 months</Chip>
            </div>
            <div style={{ height: 184, marginTop: 10 }}>
              <ResponsiveContainer>
                <AreaChart data={NW_TREND}>
                  <defs>
                    <linearGradient id="nwg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.brand} stopOpacity=".38" />
                      <stop offset="100%" stopColor={T.brand} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.wash} vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: T.sub }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={["dataMin - 120000", "dataMax + 80000"]} />
                  <Tooltip formatter={(v) => fmtL(v)} contentStyle={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 11, color: T.ink }} />
                  <Area dataKey="nw" stroke={T.brand} strokeWidth={2.5} fill="url(#nwg)" dot={{ r: 3, fill: T.brand }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Card delay={60}><Label>Assets</Label><Num size={19} color={T.success}>{fmtL(F.assets)}</Num><div style={{ fontSize: 11, color: T.sub, marginTop: 3 }}>Investments {fmtL(F.invValue)} · Cash {fmtL(F.cash)}</div></Card>
            <Card delay={120}><Label>Liabilities</Label><Num size={19} color={T.danger}>{fmtL(F.loanBal)}</Num><div style={{ fontSize: 11, color: T.sub, marginTop: 3 }}>Home loan outstanding</div></Card>
          </div>
        </div>
      )}

      {tab === "Investments" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <div style={{ width: 134, height: 134, position: "relative", flexShrink: 0 }}>
              <ResponsiveContainer>
                <PieChart><Pie data={pie} dataKey="value" innerRadius={43} outerRadius={63} paddingAngle={3} strokeWidth={0}>
                  {pie.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie><Tooltip formatter={(v) => fmtL(v)} contentStyle={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 11, color: T.ink }} /></PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ ...mono, fontSize: 15, fontWeight: 750 }}>{fmtL(F.invValue)}</div>
                <div style={{ fontSize: 9.5, color: T.sub }}>total</div>
              </div>
            </div>
            <div style={{ flex: 1, fontSize: 12.5, lineHeight: 2 }}>
              {pie.map((p, i) => (
                <div key={p.name} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span><span style={{ color: pieColors[i], fontWeight: 800 }}>●</span> {p.name}</span>
                  <b style={mono}>{Math.round((p.value / F.invValue) * 100)}%</b>
                </div>
              ))}
            </div>
          </Card>
          <Card delay={60} alert="warn">
            <div style={{ fontSize: 13.5, fontWeight: 800, color: T.warn }}>Overlap detected<Explain text="Both funds hold significant positions in the same stocks — two expense ratios for partially duplicated exposure, a false sense of diversification." /></div>
            <div style={{ fontSize: 13.5, marginTop: 7, lineHeight: 1.58 }}>
              <b>{F.overlap.funds[0]}</b> and <b>{F.overlap.funds[1]}</b> share {F.overlap.shared.length} top holdings: {F.overlap.shared.join(", ")}.
            </div>
          </Card>
          {F.holdings.map((h, i) => (
            <Card key={h.name} delay={120 + i * 45}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontSize: 14, fontWeight: 750 }}>{h.name}</div><div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>{h.type}</div></div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ ...mono, fontWeight: 750 }}>{fmtL(h.value)}</div>
                  <div style={{ ...mono, fontSize: 11.5, fontWeight: 750, color: h.xirr >= 0 ? T.success : T.danger }}>XIRR {h.xirr.toFixed(1)}%</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "Loan" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card>
            <Label>{LOAN.name}</Label>
            <div style={{ display: "flex", marginTop: 10 }}>
              {[["Outstanding", fmtL(F.loanBal)], ["EMI", fmt(F.emi)], ["Rate", LOAN.rate + "%"]].map(([l, v], i) => (
                <div key={l} style={{ flex: 1, borderLeft: i ? `1px solid ${T.line}` : "none", paddingLeft: i ? 14 : 0 }}>
                  <div style={{ fontSize: 11, color: T.sub, fontWeight: 650 }}>{l}</div><Num size={17}>{v}</Num>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12.5, color: T.sub, marginTop: 12 }}>
              Debt-to-income: <b style={{ ...mono, color: F.dti > 0.4 ? T.danger : T.ink }}>{Math.round(F.dti * 100)}%</b> of usable income
              <Explain text="Uses the same smoothed usable-income figure as your Budget module — one number, platform-wide." />
            </div>
          </Card>
          <Card delay={60} style={{ background: T.cardAlt }}>
            <Label>Prepayment simulator</Label>
            <div style={{ fontSize: 13.5, margin: "10px 0 7px" }}>Extra monthly payment: <b style={{ ...mono, fontSize: 16 }}>{fmt(extra)}</b></div>
            <input type="range" min="0" max="50000" step="1000" value={extra} onChange={(e) => setExtra(+e.target.value)}
              style={{ width: "100%", accentColor: T.brand }} aria-label="Extra monthly payment amount" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
              <div style={{ background: T.successSoft, borderRadius: 13, padding: 14 }}>
                <div style={{ fontSize: 11, color: T.sub, fontWeight: 650 }}>Interest saved</div>
                <Num size={21} color={T.success}>{fmtL(saved)}</Num>
              </div>
              <div style={{ background: T.brandSoft, borderRadius: 13, padding: 14 }}>
                <div style={{ fontSize: 11, color: T.sub, fontWeight: 650 }}>Ends sooner by</div>
                <Num size={21} color={T.brand}>{Math.floor(monthsSaved / 12)}y {monthsSaved % 12}m</Num>
              </div>
            </div>
            <div style={{ fontSize: 11, color: T.sub, marginTop: 10 }}>Assumes the current rate holds (floating-rate loan). Deterministic amortization — planning aid, not advice.</div>
          </Card>
        </div>
      )}

      {tab === "Insurance" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card alert="danger">
            <Label>Coverage health — Life</Label>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, margin: "10px 0 6px" }}>
              <span>Covered: <b style={mono}>{fmtL(INSURANCE.life.cover)}</b></span>
              <span>Benchmark: <b style={mono}>{fmtL(F.gaps.lifeB)}</b><Explain text={`15× annual usable income (${fmtL(F.usable * 12)}) + outstanding liabilities (${fmtL(F.loanBal)}). Fully transparent — no black box.`} /></span>
            </div>
            <Bar pct={(INSURANCE.life.cover / F.gaps.lifeB) * 100} />
            <div style={{ fontSize: 13.5, color: T.danger, fontWeight: 800, marginTop: 9 }}>Gap: {fmtL(F.gaps.lifeGap)}</div>
          </Card>
          <Card delay={60} alert={F.gaps.healthGap > 0 ? "warn" : undefined}>
            <Label>Coverage health — Health</Label>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, margin: "10px 0 6px" }}>
              <span>Covered: <b style={mono}>{fmtL(INSURANCE.health.cover)}</b></span>
              <span>Benchmark: <b style={mono}>{fmtL(F.gaps.healthB)}</b><Explain text="₹5L per family member (you + 2 dependents), metro city tier." /></span>
            </div>
            <Bar pct={(INSURANCE.health.cover / F.gaps.healthB) * 100} />
            {F.gaps.healthGap > 0 && <div style={{ fontSize: 13.5, color: T.warn, fontWeight: 800, marginTop: 9 }}>Gap: {fmtL(F.gaps.healthGap)}</div>}
          </Card>
          <div className="fadeUp" style={{ background: T.cardAlt, border: `1.5px dashed ${T.line}`, borderRadius: 15, padding: 14, animationDelay: "120ms" }}>
            <Chip tone="warn">SPONSORED</Chip>
            <div style={{ fontSize: 12, color: T.sub, marginTop: 8, lineHeight: 1.55 }}>Partner term-insurance options would appear here — always visually separated from the neutral analysis above and never influencing the benchmark itself (Global Business Rule 4).</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   GOALS + HEALTH SCORE + SIMULATOR (FHS-005)
   ================================================================ */
function Goals({ F }) {
  const T = useT();
  const [tab, setTab] = useState("Health Score");
  const [simSavings, setSimSavings] = useState(Math.round(F.sr * 100));
  const [simCloseGap, setSimCloseGap] = useState(false);
  const [simEF, setSimEF] = useState(+F.ef.toFixed(1));

  const simScore = useMemo(() => healthScore({
    ...F.ctx,
    sr: simSavings / 100,
    life: simCloseGap ? F.gaps.lifeB : INSURANCE.life.cover,
    ef: simEF,
  }).score, [F, simSavings, simCloseGap, simEF]);
  const delta = simScore - F.health.score;

  const meta = {
    savingsRate: ["Savings rate", `You save ${Math.round(F.sr * 100)}% of usable income (target 30%).`],
    debtToIncome: ["Debt-to-income", `EMI is ${Math.round(F.dti * 100)}% of usable income — lower is better.`],
    budgetAdherence: ["Budget adherence", `${BUDGETS.filter((b) => b.spent <= b.budget).length} of ${BUDGETS.length} budgets on track this period.`],
    insurance: ["Insurance adequacy", `Life cover is ${Math.round((INSURANCE.life.cover / F.gaps.lifeB) * 100)}% of your benchmark.`],
    diversification: ["Diversification", `Spread across ${Object.keys(F.alloc).length} asset classes.`],
    emergencyFund: ["Emergency fund", `Covers ${F.ef.toFixed(1)} months of expenses (target 6).`],
  };
  const actions = [
    { text: `Close the ${fmtL(F.gaps.lifeGap)} life-cover gap`, impact: "+9 pts" },
    { text: "Bring Shopping back within budget", impact: "+4 pts" },
    { text: `Add ${fmtL(540000 - GOALS[0].saved)} to your Emergency Fund`, impact: "+6 pts" },
  ];
  return (
    <div>
      <SubTabs tabs={["Health Score", "Simulator", "Goals"]} tab={tab} setTab={setTab} />
      {tab === "Health Score" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <ScoreRadial score={F.health.score} />
            <div style={{ flex: 1 }}>
              <Label>Financial Health Score</Label>
              <div style={{ fontSize: 12, color: T.sub, marginTop: 6, lineHeight: 1.6 }}>
                Formula <b style={mono}>{F.health.version}</b> · six weighted pillars, computed deterministically — never AI-estimated. Past scores are never silently recalculated.
              </div>
            </div>
          </Card>
          <Card delay={60}>
            <Label>Pillar breakdown</Label>
            {Object.entries(F.health.pillars).map(([k, v]) => (
              <div key={k} style={{ marginTop: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span style={{ fontWeight: 650 }}>{meta[k][0]} <span style={{ fontSize: 10, color: T.sub }}>({Math.round(F.health.weights[k] * 100)}%)</span><Explain text={meta[k][1]} /></span>
                  <span style={{ ...mono, fontWeight: 750 }}>{Math.round(v)}</span>
                </div>
                <Bar pct={v} height={6} />
              </div>
            ))}
          </Card>
          <Card delay={120} ai>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}><AIBadge /><Label>Improve your score — ranked by impact</Label></div>
            {actions.map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: i ? `1px solid ${T.wash}` : "none", fontSize: 13.5 }}>
                <span><b style={{ color: T.aiDeep }}>{i + 1}.</b> {a.text}</span>
                <span style={{ ...mono, color: T.success, fontWeight: 800, fontSize: 12.5 }}>{a.impact}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === "Simulator" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card style={{ textAlign: "center" }}>
            <Label>If you made these changes…</Label>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, marginTop: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: T.sub, fontWeight: 650 }}>Today</div>
                <div style={{ ...mono, fontSize: 30, fontWeight: 700 }}>{F.health.score}</div>
              </div>
              <div style={{ fontSize: 22, color: T.sub }}>→</div>
              <div>
                <div style={{ fontSize: 11, color: T.sub, fontWeight: 650 }}>Simulated</div>
                <div style={{ ...mono, fontSize: 30, fontWeight: 700, color: delta > 0 ? T.success : delta < 0 ? T.danger : T.ink }}>{simScore}</div>
              </div>
              {delta !== 0 && <Chip tone={delta > 0 ? "success" : "danger"}>{delta > 0 ? "+" : ""}{delta} pts</Chip>}
            </div>
            <div style={{ fontSize: 10.5, color: T.sub, marginTop: 10 }}>Same formula {F.health.version} — a preview, never a promise. Your real score only changes when your real finances do.</div>
          </Card>
          <Card delay={60}>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 4 }}>Savings rate: <b style={mono}>{simSavings}%</b> <span style={{ fontSize: 11, color: T.sub, fontWeight: 500 }}>(today {Math.round(F.sr * 100)}%)</span></div>
            <input type="range" min="0" max="50" value={simSavings} onChange={(e) => setSimSavings(+e.target.value)} style={{ width: "100%", accentColor: T.brand }} aria-label="Simulated savings rate" />
          </Card>
          <Card delay={100}>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 4 }}>Emergency fund: <b style={mono}>{simEF} months</b> <span style={{ fontSize: 11, color: T.sub, fontWeight: 500 }}>(today {F.ef.toFixed(1)})</span></div>
            <input type="range" min="0" max="12" step="0.5" value={simEF} onChange={(e) => setSimEF(+e.target.value)} style={{ width: "100%", accentColor: T.brand }} aria-label="Simulated emergency fund months" />
          </Card>
          <Card delay={140} onClick={() => setSimCloseGap(!simCloseGap)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>Close the life-insurance gap</div>
              <div style={{ fontSize: 11.5, color: T.sub, marginTop: 3 }}>Raise cover from {fmtL(INSURANCE.life.cover)} to the {fmtL(F.gaps.lifeB)} benchmark</div>
            </div>
            <div style={{ width: 46, height: 26, borderRadius: 20, background: simCloseGap ? T.brand : T.wash, position: "relative", transition: "background .2s", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 3, left: simCloseGap ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.25)", transition: "left .2s" }} />
            </div>
          </Card>
        </div>
      )}

      {tab === "Goals" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {GOALS.map((g, i) => {
            const f = feasibility(g, F.savings);
            const tone = f.state === "On track" ? "success" : f.state === "Tight but possible" ? "warn" : "danger";
            return (
              <Card key={g.name} delay={i * 60}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, ...disp }}>{g.icon} {g.name}</div>
                  <Chip tone={tone}>{f.state}</Chip>
                </div>
                <div style={{ margin: "12px 0 7px" }}><Bar pct={(g.saved / g.target) * 100} /></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.sub }}>
                  <span style={mono}>{fmtL(g.saved)} / {fmtL(g.target)}</span><span>by {g.targetDate}</span>
                </div>
                <div style={{ fontSize: 12.5, marginTop: 10, background: T.wash, borderRadius: 11, padding: "10px 12px", lineHeight: 1.55 }}>
                  Needs <b style={mono}>{fmt(f.required)}/mo</b> for {f.months} months · current surplus <b style={mono}>{fmt(F.savings)}</b>
                  <Explain text="Feasibility = required monthly contribution vs. your actual computed surplus (usable income − spend − EMI). Informational only — you can always proceed." />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   AI COACH
   ================================================================ */
function buildEvidence(F) {
  return {
    user: { name: USER.name, persona: "Working Professional", dependents: USER.dependents, riskAppetite: USER.riskAppetite, cityTier: USER.cityTier },
    income: { usableMonthly: Math.round(F.usable), method: "6-month weighted trailing average", history: INCOME_HISTORY },
    budgets: BUDGETS.map((b) => ({ category: b.cat, budget: b.budget, spent: b.spent, pctUsed: Math.round((b.spent / b.budget) * 100) })),
    monthlySurplus: Math.round(F.savings), savingsRatePct: Math.round(F.sr * 100),
    netWorth: Math.round(F.netWorth), assets: Math.round(F.assets), liabilities: Math.round(F.loanBal),
    loan: { name: LOAN.name, outstanding: Math.round(F.loanBal), emi: Math.round(F.emi), ratePct: LOAN.rate, dtiPct: Math.round(F.dti * 100) },
    investments: F.holdings.map((h) => ({ name: h.name, type: h.type, value: h.value, xirrPct: +h.xirr.toFixed(1) })),
    overlapFinding: { funds: F.overlap.funds, sharedHoldings: F.overlap.shared },
    insurance: {
      lifeCover: INSURANCE.life.cover, lifeBenchmark: Math.round(F.gaps.lifeB), lifeGap: Math.round(F.gaps.lifeGap),
      healthCover: INSURANCE.health.cover, healthBenchmark: F.gaps.healthB, healthGap: F.gaps.healthGap,
      benchmarkMethod: "Life: 15x annual usable income + outstanding liabilities. Health: Rs 5L per family member, metro tier.",
    },
    goals: GOALS.map((g) => { const f = feasibility(g, F.savings); return { name: g.name, target: g.target, saved: g.saved, targetDate: g.targetDate, requiredMonthly: Math.round(f.required), feasibility: f.state }; }),
    subscriptions: SUBS, emergencyFundMonths: +F.ef.toFixed(1),
    healthScore: { score: F.health.score, formulaVersion: F.health.version, pillars: Object.fromEntries(Object.entries(F.health.pillars).map(([k, v]) => [k, Math.round(v)])) },
  };
}
const SYS = (ev) => `You are the FinPilot AI Coach — a grounded financial coach, not a generic chatbot.

HARD RULES:
1. Every number you state MUST come verbatim from the EVIDENCE JSON. Never invent, estimate, or compute new figures. If evidence is insufficient, say "I don't have enough information for that" honestly.
2. Educational/informational only — never licensed investment, tax, or legal advice; never recommend a specific product to buy or sell. Explain tradeoffs neutrally.
3. End each factual sentence with a citation tag naming its source: [budgets], [loan], [insurance], [goals], [investments], [income], [healthScore], [subscriptions], [overlapFinding].
4. Finish the entire reply with one final line: "CONFIDENCE: High" (fully grounded) or "CONFIDENCE: Medium" (partially interpretive).
5. Warm, concise, coach-like. Indian rupee formatting (₹1.2L style where natural). Under 150 words. Evidence amounts are INR.
6. If the user seems in genuine distress, drop coaching, respond supportively, suggest speaking to a human.

EVIDENCE JSON (only source of truth about this user):
${JSON.stringify(ev)}`;

function Coach({ F }) {
  const T = useT();
  const [msgs, setMsgs] = useState([{ role: "assistant", text: `Hi Arjun — I'm grounded in your live data: budgets, ${fmtL(F.netWorth)} net worth, your loan, insurance, and goals. Every figure I give comes from your computed numbers, with a source tag. What shall we look at?`, conf: null }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef(null);
  useEffect(() => { scroller.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [msgs, busy]);
  const chips = ["Can I afford my Home Down Payment goal?", `Why is my health score ${F.health.score}?`, "Do my mutual funds overlap?", "Prepay my loan or invest more?"];

  async function send(text) {
    const q = (text || input).trim();
    if (!q || busy) return;
    setInput("");
    const history = [...msgs, { role: "user", text: q }];
    setMsgs(history); setBusy(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          system: SYS(buildEvidence(F)),
          messages: history.map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await res.json();
      let full = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
      let conf = null;
      const cm = full.match(/CONFIDENCE:\s*(High|Medium|Low)/i);
      if (cm) { conf = cm[1]; full = full.replace(/\n?CONFIDENCE:.*$/i, "").trim(); }
      setMsgs((m) => [...m, { role: "assistant", text: full || "I couldn't put together a confident answer just now — please try again.", conf }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", text: "AI insights are temporarily paused — every deterministic feature (budgets, net worth, simulators) keeps working normally. Try again shortly.", conf: null }]);
    }
    setBusy(false);
  }

  const renderText = (t) => t.split(/(\[[a-zA-Z]+\])/g).map((part, i) => {
    const m = part.match(/^\[([a-zA-Z]+)\]$/);
    if (m) return <span key={i} style={{ background: T.aiSoft, color: T.aiDeep, fontSize: 10, fontWeight: 800, borderRadius: 6, padding: "1px 6px", margin: "0 2px", ...mono }}>{m[1]}</span>;
    return <span key={i}>{part}</span>;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 158px)", maxHeight: 660 }}>
      <div ref={scroller} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
        {msgs.map((m, i) => (
          <div key={i} className="fadeUp" style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%", display: "flex", gap: 8 }}>
            {m.role === "assistant" && (
              <div style={{ width: 29, height: 29, borderRadius: 11, background: `linear-gradient(135deg, ${T.ai}, ${T.aiDeep})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginTop: 2, boxShadow: T.glowAI }}>✦</div>
            )}
            <div>
              <div style={{
                background: m.role === "user" ? `linear-gradient(135deg, ${T.brand}, ${T.heroB})` : T.card,
                color: m.role === "user" ? "#fff" : T.ink,
                border: m.role === "user" ? "none" : `1px solid ${T.line}`,
                borderRadius: m.role === "user" ? "18px 18px 5px 18px" : "5px 18px 18px 18px",
                padding: "11px 15px", fontSize: 13.5, lineHeight: 1.66, whiteSpace: "pre-wrap",
                boxShadow: T.shadow,
              }}>
                {m.role === "assistant" ? renderText(m.text) : m.text}
              </div>
              {m.conf && (
                <div style={{ fontSize: 10.5, color: T.sub, marginTop: 4, display: "flex", gap: 5, alignItems: "center" }}>
                  <span style={{ width: 7, height: 7, borderRadius: 10, background: m.conf === "High" ? T.success : T.warn }} />
                  Confidence: {m.conf} · grounded in your data
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div style={{ alignSelf: "flex-start", display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 29, height: 29, borderRadius: 11, background: `linear-gradient(135deg, ${T.ai}, ${T.aiDeep})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✦</div>
            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: "5px 18px 18px 18px", padding: "13px 17px", display: "flex", gap: 4 }}>
              {[0, 1, 2].map((i) => <span key={i} style={{ width: 6, height: 6, borderRadius: 6, background: T.ai, display: "inline-block", animation: `pulse 1.2s ${i * 0.18}s infinite` }} />)}
            </div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "10px 0" }}>
        {chips.map((c) => (
          <button key={c} onClick={() => send(c)} disabled={busy}
            style={{ whiteSpace: "nowrap", background: T.aiSoft, color: T.aiDeep, border: "none", borderRadius: 20, padding: "8px 14px", fontSize: 12, fontWeight: 750, cursor: "pointer", flexShrink: 0 }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about your finances…" aria-label="Ask the AI Coach"
          style={{ flex: 1, border: `1.5px solid ${T.line}`, background: T.card, color: T.ink, borderRadius: 14, padding: "12px 16px", fontSize: 14, outline: "none" }} />
        <button onClick={() => send()} disabled={busy}
          style={{ background: `linear-gradient(135deg, ${T.ai}, ${T.aiDeep})`, color: "#fff", border: "none", borderRadius: 14, padding: "0 20px", fontWeight: 800, cursor: "pointer", fontSize: 14, opacity: busy ? 0.6 : 1, boxShadow: T.glowAI }}>Send</button>
      </div>
      <div style={{ fontSize: 10, color: T.sub, marginTop: 7, textAlign: "center" }}>Educational coaching only — not licensed financial, tax, or legal advice.</div>
    </div>
  );
}

/* ================================================================
   APP SHELL
   ================================================================ */
export default function FinPilotV3() {
  const F = useFinance();
  const [entered, setEntered] = useState(false);
  const [nav, setNav] = useState("home");
  const [dark, setDark] = useState(false);
  const [persona, setPersona] = useState("Professional");
  const [personaOpen, setPersonaOpen] = useState(false);
  const T = dark ? THEMES.dark : THEMES.light;
  const NAVS = [["home", "Home", "⌂"], ["money", "Money", "◐"], ["wealth", "Wealth", "◆"], ["goals", "Goals", "◎"], ["ai", "AI Coach", "✦"]];

  return (
    <Theme.Provider value={T}>
      <div style={{ background: T.paper, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: T.ink, transition: "background .35s, color .35s" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=IBM+Plex+Mono:wght@500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
          *::-webkit-scrollbar{height:4px;width:4px} *::-webkit-scrollbar-thumb{background:${T.line};border-radius:4px}
          button:focus-visible,input:focus-visible{outline:2px solid ${T.brand};outline-offset:2px}
          @keyframes pulse{0%,100%{opacity:.3;transform:scale(.85)}50%{opacity:1;transform:scale(1.1)}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
          .fadeUp{animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both}
          @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
          .floatY{animation:floatY 3.2s ease-in-out infinite}
          @media (prefers-reduced-motion: reduce){.fadeUp,.floatY{animation:none}}
          input[type=range]{height:5px}`}</style>

        {!entered && <Splash T={T} onEnter={() => setEntered(true)} />}

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 14px 94px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 2px 14px" }}>
            <div>
              <div style={{ ...disp, fontWeight: 700, fontSize: 20, color: T.brand }}>FinPilot <span style={{ color: T.ai }}>AI</span></div>
              <button onClick={() => setPersonaOpen(!personaOpen)}
                style={{ background: "none", border: "none", padding: 0, fontSize: 11, color: T.sub, cursor: "pointer", fontWeight: 650 }}>
                {USER.name} · {PERSONAS[persona].label} ⌄
              </button>
              {personaOpen && (
                <div style={{ position: "absolute", zIndex: 70, marginTop: 6, background: T.card, border: `1px solid ${T.line}`, borderRadius: 13, boxShadow: "0 16px 40px rgba(0,0,0,.22)", overflow: "hidden" }}>
                  {Object.keys(PERSONAS).map((p) => (
                    <button key={p} onClick={() => { setPersona(p); setPersonaOpen(false); }}
                      style={{ display: "block", width: "100%", textAlign: "left", background: p === persona ? T.wash : "none", border: "none", padding: "11px 17px", fontSize: 13, fontWeight: 650, color: T.ink, cursor: "pointer" }}>
                      {PERSONAS[p].label}
                      <div style={{ fontSize: 10.5, color: T.sub }}>Persona-adaptive dashboard (DASH-010)</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => setDark(!dark)} aria-label="Toggle dark mode"
                style={{ width: 37, height: 37, borderRadius: 13, border: `1px solid ${T.line}`, background: T.card, cursor: "pointer", fontSize: 15 }}>
                {dark ? "☾" : "☀"}
              </button>
              <div style={{ width: 37, height: 37, borderRadius: "50%", background: T.brandSoft, color: dark ? T.brandDeep : T.brand, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>AM</div>
            </div>
          </div>

          <div key={nav} className="fadeUp">
            {nav === "home" && <Home F={F} go={setNav} persona={persona} />}
            {nav === "money" && <Money F={F} />}
            {nav === "wealth" && <Wealth F={F} />}
            {nav === "goals" && <Goals F={F} />}
            {nav === "ai" && <Coach F={F} />}
          </div>
        </div>

        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.card + "F2", borderTop: `1px solid ${T.line}`, backdropFilter: "blur(14px)" }}>
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex" }}>
            {NAVS.map(([id, label, icon]) => {
              const active = nav === id;
              const color = active ? (id === "ai" ? T.ai : T.brand) : T.sub;
              return (
                <button key={id} onClick={() => setNav(id)} aria-label={label}
                  style={{ flex: 1, background: "none", border: "none", padding: "8px 0 11px", cursor: "pointer", color, position: "relative" }}>
                  {active && <div style={{ position: "absolute", top: 0, left: "30%", right: "30%", height: 3, borderRadius: 3, background: color }} />}
                  <div style={{ fontSize: 17, transform: active ? "translateY(-1px) scale(1.08)" : "none", transition: "transform .22s" }}>{icon}</div>
                  <div style={{ fontSize: 10.5, fontWeight: active ? 800 : 500 }}>{label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Theme.Provider>
  );
}
