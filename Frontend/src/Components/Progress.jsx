import { useState, useEffect, useRef } from "react";

const BACKEND_URL = "http://localhost:3000/api/v1/progress";

// ─── Strength Line Chart ──────────────────────────────────────────────────────
function StrengthChart({ data, exercise }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  const W = 560, H = 220;
  const padL = 16, padR = 16, padT = 24, padB = 0;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const minVal = Math.min(...data.map((d) => d.value)) - 20;
  const maxVal = Math.max(...data.map((d) => d.value)) + 20;

  const xOf = (i) => padL + (i / (data.length - 1)) * chartW;
  const yOf = (v) => padT + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const areaPath =
    `M ${xOf(0)},${yOf(data[0].value)} ` +
    data.map((d, i) => `L ${xOf(i)},${yOf(d.value)}`).join(" ") +
    ` L ${xOf(data.length - 1)},${H} L ${xOf(0)},${H} Z`;

  const pts = data.map((d, i) => `${xOf(i)},${yOf(d.value)}`).join(" ");
  const gridLines = [0.25, 0.5, 0.75].map((f) => minVal + (maxVal - minVal) * f);

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: "var(--color-on-surface,#1a1b23)" }}>
            Strength Gains
          </div>
          <div style={{ fontSize: 12, color: "var(--color-secondary,#5f5e60)", marginTop: 2 }}>
            Estimated 1RM for {exercise} (lbs)
          </div>
        </div>
        <span style={{
          padding: "5px 12px", borderRadius: 8,
          border: "1.5px solid var(--color-separator,#e4e4e7)",
          fontSize: 12, fontWeight: 600, color: "var(--color-on-surface,#1a1b23)",
          background: "var(--color-surface-container-lowest,#fff)",
        }}>
          Last 6 Months
        </span>
      </div>

      <div style={{ position: "relative", overflow: "visible" }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%"
          style={{ display: "block", overflow: "visible" }}
          onMouseLeave={() => setTooltip(null)}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {gridLines.map((v, i) => (
            <line key={i} x1={padL} x2={W - padR} y1={yOf(v)} y2={yOf(v)}
              stroke="var(--color-separator,#e4e4e7)" strokeWidth="1" strokeDasharray="4 4" />
          ))}
          <path d={areaPath} fill="url(#areaGrad)" />
          <polyline points={pts} fill="none" stroke="#2563eb" strokeWidth="2.5"
            strokeLinejoin="round" strokeLinecap="round" />
          {data.map((d, i) => (
            <g key={i} onMouseEnter={(e) => {
              const rect = svgRef.current.getBoundingClientRect();
              setTooltip({
                x: (xOf(i) / W) * rect.width,
                y: (yOf(d.value) / H) * rect.height,
                value: d.value, month: d.month,
              });
            }}>
              <circle cx={xOf(i)} cy={yOf(d.value)} r={18} fill="transparent" />
              <circle cx={xOf(i)} cy={yOf(d.value)} r={4} fill="#2563eb" stroke="#fff" strokeWidth="2" />
            </g>
          ))}
        </svg>
        {tooltip && (
          <div style={{
            position: "absolute", left: tooltip.x - 34, top: tooltip.y - 40,
            background: "#1a1b23", color: "#fff", fontSize: 12, fontWeight: 700,
            padding: "5px 10px", borderRadius: 8, pointerEvents: "none",
            whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          }}>
            {tooltip.value} lbs
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 16px 16px", marginTop: -4 }}>
        {data.map((d) => (
          <span key={d.month + d.key} style={{ fontSize: 11, color: "var(--color-secondary,#5f5e60)", fontWeight: 500 }}>
            {d.month}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Activity Heatmap ─────────────────────────────────────────────────────────
function ActivityMap({ data }) {
  const COLS = 18;
  const rows = [];
  for (let r = 0; r < 5; r++) rows.push(data.slice(r * COLS, r * COLS + COLS));
  const workoutCount = data.filter((d) => d.count > 0).length;

  const levelColors = [
    "var(--color-surface-container,#eeedf8)",
    "#bfdbfe", "#93c5fd", "#3b82f6", "#1d4ed8",
  ];

  const countToLevel = (n) => n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n <= 3 ? 3 : 4;

  return (
    <div style={{ ...card, marginTop: 16, paddingBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 17, color: "var(--color-on-surface,#1a1b23)" }}>
          Activity Map{" "}
          <span style={{ fontWeight: 400, fontSize: 13, color: "var(--color-secondary,#5f5e60)" }}>(Last 90 Days)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--color-secondary,#5f5e60)" }}>Less</span>
          {levelColors.map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
          ))}
          <span style={{ fontSize: 12, color: "var(--color-secondary,#5f5e60)" }}>More</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 5 }}>
            {row.map((cell, ci) => (
              <div
                key={ci}
                title={`${cell.date} — ${cell.count} session${cell.count !== 1 ? "s" : ""}`}
                style={{
                  width: 22, height: 22, borderRadius: 5,
                  background: levelColors[countToLevel(cell.count)],
                  flexShrink: 0, transition: "transform 0.15s", cursor: "default",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            ))}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "var(--color-secondary,#5f5e60)", marginTop: 14, marginBottom: 0 }}>
        You completed{" "}
        <strong style={{ color: "var(--color-on-surface,#1a1b23)" }}>{workoutCount} workout{workoutCount !== 1 ? "s" : ""}</strong>{" "}
        in the last 3 months.{" "}
        {workoutCount >= 30 ? "Consistency is high. 🔥" : workoutCount >= 10 ? "Keep it up!" : "Log more sessions to build your streak."}
      </p>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, icon, value, unit, trend, trendColor }) {
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-secondary,#5f5e60)" }}>
          {label}
        </span>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--color-primary,#0057bf)", opacity: 0.7 }}>
          {icon}
        </span>
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--color-on-surface,#1a1b23)", lineHeight: 1.1, letterSpacing: "-0.5px" }}>
        {value} <span style={{ fontSize: 16, fontWeight: 500 }}>{unit}</span>
      </div>
      {trend && (
        <div style={{ fontSize: 12, fontWeight: 600, color: trendColor, marginTop: 6, display: "flex", alignItems: "center", gap: 3 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>
            {trendColor === "#16a34a" ? "trending_up" : trendColor === "#dc2626" ? "trending_down" : "radio_button_checked"}
          </span>
          {trend}
        </div>
      )}
    </div>
  );
}

// ─── Personal Records Panel ───────────────────────────────────────────────────
function PersonalRecordsPanel({ records }) {
  const now = new Date();

  const formatWhen = (dateStr) => {
    const d = new Date(dateStr);
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return "TODAY";
    if (diffDays <= 7) return `${diffDays}D AGO`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}W AGO`;
    return `${Math.floor(diffDays / 30)}MO AGO`;
  };

  // The most recent record gets the badge
  const newestDate = records.length ? records.reduce((a, b) => (a.date > b.date ? a : b)).date : null;

  return (
    <div style={{
      background: "#18181b", borderRadius: 18,
      padding: "22px 22px 8px",
      marginTop: 12,
      boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#c05400", fontVariationSettings: "'FILL' 1" }}>
          emoji_events
        </span>
        <span style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>Personal Records</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {records.map((rec, i) => {
          const isNewest = rec.date === newestDate && i === 0;
          return (
            <div key={i} style={{
              borderRadius: 12, padding: "14px 16px",
              background: "rgba(255,255,255,0.06)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>
                  {rec.exercise.toUpperCase()}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                  {rec.maxWeight}{" "}
                  <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>{rec.unit}</span>
                </div>
              </div>
              {isNewest ? (
                <span style={{
                  background: "#c05400", color: "#fff",
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.05em",
                  padding: "4px 9px", borderRadius: 6,
                }}>
                  NEW RECORD!
                </span>
              ) : (
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
                  {formatWhen(rec.date)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button style={{
        width: "100%", marginTop: 14, marginBottom: 14, padding: "12px",
        borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.12)",
        background: "transparent", color: "#fff", fontWeight: 700, fontSize: 13,
        cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "background 0.2s",
      }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        View All Achievements
      </button>
    </div>
  );
}

// ─── Log Session Modal ────────────────────────────────────────────────────────
function LogSessionModal({ isOpen, onClose, onSaved }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState([{ exercise: "", sets: 3, reps: 10, weight: 0, unit: "lbs" }]);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const addRow = () => setExercises([...exercises, { exercise: "", sets: 3, reps: 10, weight: 0, unit: "lbs" }]);
  const removeRow = (i) => setExercises(exercises.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) => {
    const rows = [...exercises];
    rows[i] = { ...rows[i], [field]: val };
    setExercises(rows);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validExercises = exercises.filter((ex) => ex.exercise.trim());
    if (!validExercises.length) return;
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, notes, exercises: validExercises }),
      });
      const json = await res.json();
      if (json.success) {
        onSaved();
        onClose();
        setExercises([{ exercise: "", sets: 3, reps: 10, weight: 0, unit: "lbs" }]);
        setNotes("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 100, padding: 16,
    }}>
      <div style={{
        background: "var(--color-surface-container-lowest,#fff)",
        borderRadius: 24, padding: "32px", maxWidth: 560, width: "100%",
        boxShadow: "0 24px 64px rgba(0,0,0,0.14)",
        border: "1px solid var(--color-separator,#e4e4e7)",
        fontFamily: "'Inter',sans-serif",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--color-on-surface,#1a1b23)" }}>
            Log Workout Session
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-secondary,#5f5e60)" }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Date</label>
          <input type="date" value={date} max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)} style={inputStyle} />

          <label style={{ ...labelStyle, marginTop: 14 }}>Notes (optional)</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Leg day, felt strong" style={inputStyle} />

          <div style={{ marginTop: 18, marginBottom: 8, fontWeight: 700, fontSize: 13, color: "var(--color-on-surface,#1a1b23)" }}>
            Exercises
          </div>

          {exercises.map((ex, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 60px 32px", gap: 6, marginBottom: 8, alignItems: "center" }}>
              <input placeholder="Exercise name" value={ex.exercise}
                onChange={(e) => updateRow(i, "exercise", e.target.value)} style={{ ...inputStyle, margin: 0 }} />
              <input type="number" placeholder="Sets" min="1" value={ex.sets}
                onChange={(e) => updateRow(i, "sets", parseInt(e.target.value) || 1)} style={{ ...inputStyle, margin: 0 }} />
              <input type="number" placeholder="Reps" min="1" value={ex.reps}
                onChange={(e) => updateRow(i, "reps", parseInt(e.target.value) || 1)} style={{ ...inputStyle, margin: 0 }} />
              <input type="number" placeholder="Weight" min="0" step="0.5" value={ex.weight}
                onChange={(e) => updateRow(i, "weight", parseFloat(e.target.value) || 0)} style={{ ...inputStyle, margin: 0 }} />
              <select value={ex.unit} onChange={(e) => updateRow(i, "unit", e.target.value)}
                style={{ ...inputStyle, margin: 0, padding: "8px 4px" }}>
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
              </select>
              <button type="button" onClick={() => removeRow(i)} disabled={exercises.length === 1}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error,#ba1a1a)", opacity: exercises.length === 1 ? 0.3 : 1 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>remove_circle</span>
              </button>
            </div>
          ))}

          <button type="button" onClick={addRow} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "1.5px dashed var(--color-separator,#e4e4e7)",
            borderRadius: 8, padding: "8px 14px", cursor: "pointer",
            fontSize: 13, color: "var(--color-secondary,#5f5e60)", marginTop: 4,
            fontFamily: "'Inter',sans-serif",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Add Exercise
          </button>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
            <button type="button" onClick={onClose} style={{
              padding: "10px 22px", borderRadius: 999,
              border: "1px solid var(--color-separator,#e4e4e7)",
              background: "transparent", color: "var(--color-secondary,#5f5e60)",
              fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif",
            }}>Cancel</button>
            <button type="submit" disabled={saving} style={{
              padding: "10px 24px", borderRadius: 999,
              background: "var(--color-primary,#0057bf)", color: "#fff",
              border: "none", fontWeight: 700, fontSize: 13,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1, fontFamily: "'Inter',sans-serif",
              boxShadow: "0 3px 12px rgba(0,87,191,0.28)",
            }}>
              {saving ? "Saving…" : "Save Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onLogSession }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", textAlign: "center",
      padding: "64px 24px", gap: 20,
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: 24,
        background: "rgba(0,87,191,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span className="material-symbols-outlined" style={{
          fontSize: 44, color: "var(--color-primary,#0057bf)",
          fontVariationSettings: "'FILL' 1",
        }}>
          fitness_center
        </span>
      </div>
      <div>
        <h2 style={{ fontWeight: 700, fontSize: 22, margin: "0 0 8px", color: "var(--color-on-surface,#1a1b23)" }}>
          No workouts logged yet
        </h2>
        <p style={{ fontSize: 14, color: "var(--color-secondary,#5f5e60)", margin: 0, lineHeight: 1.6, maxWidth: 380 }}>
          Start tracking your strength gains, activity, and personal records by logging your first workout session.
        </p>
      </div>
      <button onClick={onLogSession} style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "12px 28px", borderRadius: 999,
        background: "var(--color-primary,#0057bf)", color: "#fff",
        border: "none", fontWeight: 700, fontSize: 14,
        cursor: "pointer", fontFamily: "'Inter',sans-serif",
        boxShadow: "0 4px 16px rgba(0,87,191,0.28)",
        transition: "all 0.18s",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "scale(1.03)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
        Log Your First Workout
      </button>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const card = {
  background: "var(--color-surface-container-lowest,#fff)",
  borderRadius: 18,
  border: "1px solid var(--color-separator,#e4e4e7)",
  padding: "22px 24px 0",
  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
};

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  padding: "9px 12px", borderRadius: 10,
  border: "1.5px solid var(--color-separator,#e4e4e7)",
  background: "var(--color-surface-container-lowest,#fff)",
  color: "var(--color-on-surface,#1a1b23)",
  fontSize: 13, fontFamily: "'Inter',sans-serif",
  outline: "none", marginTop: 4,
};

const labelStyle = {
  fontSize: 12, fontWeight: 600,
  color: "var(--color-secondary,#5f5e60)",
  display: "block",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Progress() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("Bench Press");

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND_URL}/dashboard?exercise=${encodeURIComponent(selectedExercise)}`);
      const json = await res.json();
      if (json.success) setDashboard(json.data);
      else setError(json.message || "Failed to load data.");
    } catch (err) {
      setError("Could not connect to the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedExercise]);

  const hasData = dashboard &&
    (dashboard.activityMap?.some((d) => d.count > 0) ||
      dashboard.strengthHistory?.length > 0 ||
      dashboard.personalRecords?.length > 0);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh", flexDirection: "column", gap: 16 }}>
          <div style={{ width: 44, height: 44, border: "4px solid var(--color-primary,#0057bf)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <span style={{ fontSize: 14, color: "var(--color-secondary,#5f5e60)" }}>Loading your progress…</span>
        </div>
      </main>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh", flexDirection: "column", gap: 14 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 44, color: "var(--color-error,#ba1a1a)" }}>error</span>
          <p style={{ fontSize: 14, color: "var(--color-secondary,#5f5e60)", margin: 0 }}>{error}</p>
          <button onClick={fetchDashboard} style={{
            padding: "9px 20px", borderRadius: 999,
            background: "var(--color-primary,#0057bf)", color: "#fff",
            border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif",
          }}>Retry</button>
        </div>
      </main>
    );
  }

  const { activityMap, strengthHistory, personalRecords, currentWeight, weightTrend, consistency } = dashboard || {};

  return (
    <>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}.prog-fadein{animation:fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards}`}</style>

      <LogSessionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchDashboard}
      />

      <main className="prog-fadein" style={{ maxWidth: 1100, margin: "0 auto", width: "100%", padding: "32px 24px 48px", fontFamily: "'Inter',sans-serif" }}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 28, margin: 0, color: "var(--color-on-surface,#1a1b23)", letterSpacing: "-0.3px" }}>
              Progress Overview
            </h1>
            <p style={{ fontSize: 14, color: "var(--color-secondary,#5f5e60)", margin: "6px 0 0", lineHeight: 1.5 }}>
              A deep dive into your athletic evolution. Tracking your consistency,{" "}
              strength gains, and personal milestones.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
            <button onClick={() => setModalOpen(true)} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 20px", borderRadius: 999,
              background: "var(--color-primary,#0057bf)", color: "#fff",
              fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
              boxShadow: "0 3px 12px rgba(0,87,191,0.28)", transition: "all 0.18s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>add</span>
              Log Session
            </button>
            <button style={{
              padding: "9px 20px", borderRadius: 999,
              border: "1.5px solid var(--color-separator,#e4e4e7)",
              background: "var(--color-surface-container-lowest,#fff)",
              color: "var(--color-on-surface,#1a1b23)",
              fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Inter',sans-serif",
              transition: "all 0.18s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-container,#eeedf8)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-surface-container-lowest,#fff)"; }}
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* ── No data yet ──────────────────────────────────────────────── */}
        {!hasData ? (
          <div style={{
            background: "var(--color-surface-container-lowest,#fff)",
            borderRadius: 20, border: "1px solid var(--color-separator,#e4e4e7)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}>
            <EmptyState onLogSession={() => setModalOpen(true)} />
          </div>
        ) : (
          /* ── Two column layout ─────────────────────────────────────── */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

            {/* Left column */}
            <div>
              {strengthHistory?.length >= 2 ? (
                <>
                  {/* Exercise selector */}
                  <div style={{ marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "var(--color-secondary,#5f5e60)", fontWeight: 600 }}>Exercise:</span>
                    <input
                      type="text"
                      value={selectedExercise}
                      onChange={(e) => setSelectedExercise(e.target.value)}
                      onBlur={fetchDashboard}
                      onKeyDown={(e) => e.key === "Enter" && fetchDashboard()}
                      placeholder="e.g. Bench Press"
                      style={{
                        padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        border: "1.5px solid var(--color-separator,#e4e4e7)",
                        background: "var(--color-surface-container-lowest,#fff)",
                        color: "var(--color-on-surface,#1a1b23)",
                        fontFamily: "'Inter',sans-serif", outline: "none",
                      }}
                    />
                  </div>
                  <StrengthChart data={strengthHistory} exercise={selectedExercise} />
                </>
              ) : (
                <div style={{ ...card, paddingBottom: 22 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6, color: "var(--color-on-surface,#1a1b23)" }}>Strength Gains</div>
                  <p style={{ fontSize: 13, color: "var(--color-secondary,#5f5e60)", margin: 0 }}>
                    Log at least 2 sessions with <em>{selectedExercise}</em> across different months to see your strength progress chart.
                  </p>
                </div>
              )}

              {activityMap && <ActivityMap data={activityMap} />}
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {currentWeight ? (
                <StatCard
                  label="CURRENT WEIGHT"
                  icon="scale"
                  value={currentWeight.weight}
                  unit={currentWeight.unit}
                  trend={
                    weightTrend !== null
                      ? `${weightTrend > 0 ? "+" : ""}${weightTrend} ${currentWeight.unit} this week`
                      : null
                  }
                  trendColor={weightTrend === null ? null : weightTrend > 0 ? "#dc2626" : "#16a34a"}
                />
              ) : (
                <div style={{ ...card, paddingBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-secondary,#5f5e60)", marginBottom: 10 }}>
                    CURRENT WEIGHT
                  </div>
                  <p style={{ fontSize: 13, color: "var(--color-secondary,#5f5e60)", margin: 0 }}>
                    No weight logged yet. Use the Log Session form or add a weight entry.
                  </p>
                </div>
              )}

              {consistency && (
                <StatCard
                  label="CONSISTENCY"
                  icon="target"
                  value={consistency.percent}
                  unit="%"
                  trend={consistency.streakDays > 0 ? `${consistency.streakDays}-day streak` : "No active streak"}
                  trendColor={consistency.streakDays >= 7 ? "#16a34a" : "#c05400"}
                />
              )}

              {personalRecords?.length > 0 ? (
                <PersonalRecordsPanel records={personalRecords} />
              ) : (
                <div style={{
                  background: "#18181b", borderRadius: 18, padding: "22px 22px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#c05400", fontVariationSettings: "'FILL' 1" }}>
                      emoji_events
                    </span>
                    <span style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>Personal Records</span>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                    Log workouts with weights to see your personal records here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}