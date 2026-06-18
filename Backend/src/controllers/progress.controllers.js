import mongoose from 'mongoose';
import { WorkoutSession, BodyWeight } from '../models/workout.models.js';

const STATIC_USER_ID = new mongoose.Types.ObjectId('60d5ec49f83ca32578d61111');

// ── Helper: today string ──────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split('T')[0];

// ── Helper: date N days ago ───────────────────────────────────────────────
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

// ═══════════════════════════════════════════════════════════════════════════
// WORKOUT SESSIONS
// ═══════════════════════════════════════════════════════════════════════════

/** GET /api/v1/progress/sessions?date=YYYY-MM-DD  (omit date → all) */
export const getSessions = async (req, res) => {
  try {
    const { date } = req.query;
    const filter = { userId: STATIC_USER_ID };
    if (date) filter.date = date;

    const sessions = await WorkoutSession.find(filter).sort({ date: -1, createdAt: -1 });
    return res.status(200).json({ success: true, data: sessions });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** POST /api/v1/progress/sessions  – log a new workout session */
export const addSession = async (req, res) => {
  try {
    const { date, notes, exercises } = req.body;
    const targetDate = date || todayStr();

    const session = await WorkoutSession.create({
      userId: STATIC_USER_ID,
      date: targetDate,
      notes: notes || '',
      exercises: exercises || [],
    });

    return res.status(201).json({ success: true, data: session });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** DELETE /api/v1/progress/sessions/:id */
export const deleteSession = async (req, res) => {
  try {
    const result = await WorkoutSession.deleteOne({ _id: req.params.id, userId: STATIC_USER_ID });
    if (result.deletedCount === 0)
      return res.status(404).json({ success: false, message: 'Session not found.' });
    return res.status(200).json({ success: true, message: 'Session deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// BODY WEIGHT
// ═══════════════════════════════════════════════════════════════════════════

/** GET /api/v1/progress/weight?limit=N – last N entries (default 30) */
export const getWeightLog = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 30, 365);
    const entries = await BodyWeight.find({ userId: STATIC_USER_ID })
      .sort({ date: -1 })
      .limit(limit);
    return res.status(200).json({ success: true, data: entries.reverse() }); // oldest → newest
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** POST /api/v1/progress/weight  { date?, weight, unit? } */
export const logWeight = async (req, res) => {
  try {
    const { weight, unit, date } = req.body;
    if (weight === undefined || weight === null)
      return res.status(400).json({ success: false, message: 'weight is required.' });

    const targetDate = date || todayStr();

    const entry = await BodyWeight.findOneAndUpdate(
      { userId: STATIC_USER_ID, date: targetDate },
      { weight, unit: unit || 'lbs' },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, data: entry });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// AGGREGATED PROGRESS DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/v1/progress/dashboard
 *
 * Returns:
 *  - activityMap:   Array<{ date: "YYYY-MM-DD", count: number }> for last 90 days
 *  - strengthHistory: Array<{ month: "MMM", avgWeight: number, exercise: string }> for last 6 months for a given exercise
 *  - personalRecords: Array<{ exercise, maxWeight, unit, date }> (one PR per distinct exercise, ever)
 *  - currentWeight:  { weight, unit, date } | null
 *  - weightTrend:    number (change vs 7 days ago, null if insufficient data)
 *  - consistency:    { percent: number, streakDays: number }
 */
export const getDashboard = async (req, res) => {
  try {
    const { exercise = 'Bench Press' } = req.query;

    // ── 1. Activity map: last 90 days ─────────────────────────────────────
    const ninetyDaysAgo = daysAgo(90);
    const sessions90 = await WorkoutSession.find({
      userId: STATIC_USER_ID,
      date: { $gte: ninetyDaysAgo },
    }).select('date');

    const activityMap = buildActivityMap(sessions90);

    // ── 2. Strength history: last 6 months for selected exercise ──────────
    const sixMonthsAgo = daysAgo(183);
    const sessionsStrength = await WorkoutSession.find({
      userId: STATIC_USER_ID,
      date: { $gte: sixMonthsAgo },
      'exercises.exercise': { $regex: new RegExp(exercise, 'i') },
    }).select('date exercises');

    const strengthHistory = buildStrengthHistory(sessionsStrength, exercise);

    // ── 3. Personal records: max weight per exercise, all-time ────────────
    const allSessions = await WorkoutSession.find({ userId: STATIC_USER_ID }).select('date exercises');
    const personalRecords = buildPersonalRecords(allSessions);

    // ── 4. Current weight ─────────────────────────────────────────────────
    const latestWeight = await BodyWeight.findOne({ userId: STATIC_USER_ID }).sort({ date: -1 });
    const sevenDaysAgoStr = daysAgo(7);
    const oldWeight = await BodyWeight.findOne({
      userId: STATIC_USER_ID,
      date: { $lte: sevenDaysAgoStr },
    }).sort({ date: -1 });

    const weightTrend = latestWeight && oldWeight
      ? parseFloat((latestWeight.weight - oldWeight.weight).toFixed(1))
      : null;

    // ── 5. Consistency (last 90 days) ─────────────────────────────────────
    const consistency = buildConsistency(sessions90);

    return res.status(200).json({
      success: true,
      data: {
        activityMap,
        strengthHistory,
        personalRecords,
        currentWeight: latestWeight
          ? { weight: latestWeight.weight, unit: latestWeight.unit, date: latestWeight.date }
          : null,
        weightTrend,
        consistency,
        selectedExercise: exercise,
      },
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// Pure helper functions
// ═══════════════════════════════════════════════════════════════════════════

function buildActivityMap(sessions) {
  // Count workouts per date
  const countByDate = {};
  for (const s of sessions) {
    countByDate[s.date] = (countByDate[s.date] || 0) + 1;
  }

  const result = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push({ date: dateStr, count: countByDate[dateStr] || 0 });
  }
  return result;
}

function buildStrengthHistory(sessions, exerciseName) {
  // Group max weight by month (format: "MMM YYYY")
  const byMonth = {};

  for (const session of sessions) {
    const monthKey = session.date.slice(0, 7); // "YYYY-MM"
    for (const ex of session.exercises) {
      if (ex.exercise.toLowerCase().includes(exerciseName.toLowerCase())) {
        // Estimate 1RM using Epley formula: weight × (1 + reps/30)
        const oneRM = ex.weight * (1 + ex.reps / 30);
        if (!byMonth[monthKey] || oneRM > byMonth[monthKey]) {
          byMonth[monthKey] = Math.round(oneRM);
        }
      }
    }
  }

  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => {
      const [, mm] = key.split('-');
      return { month: MONTHS[parseInt(mm, 10) - 1], value, key };
    });
}

function buildPersonalRecords(sessions) {
  const records = {}; // exercise → { maxWeight, date, unit }

  for (const session of sessions) {
    for (const ex of session.exercises) {
      const key = ex.exercise.trim().toLowerCase();
      if (!records[key] || ex.weight > records[key].maxWeight) {
        records[key] = {
          exercise: ex.exercise.trim(),
          maxWeight: ex.weight,
          unit: ex.unit || 'lbs',
          date: session.date,
        };
      }
    }
  }

  return Object.values(records)
    .sort((a, b) => b.maxWeight - a.maxWeight)
    .slice(0, 5); // top 5
}

function buildConsistency(sessions90) {
  const activeDates = new Set(sessions90.map((s) => s.date));
  const percent = Math.round((activeDates.size / 90) * 100);

  // Streak: count from today backwards
  let streak = 0;
  for (let i = 0; i < 90; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (activeDates.has(dateStr)) streak++;
    else if (i > 0) break; // stop on first gap (skip today if not logged yet)
  }

  return { percent, streakDays: streak };
}
