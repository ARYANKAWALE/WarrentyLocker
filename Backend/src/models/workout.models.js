import mongoose from 'mongoose';

const STATIC_USER_ID = new mongoose.Types.ObjectId('60d5ec49f83ca32578d61111');

// ── One exercise set within a workout session ──────────────────────────────
const exerciseEntrySchema = new mongoose.Schema({
  exercise: { type: String, required: true, trim: true },   // e.g. "Bench Press"
  sets:     { type: Number, default: 1, min: 1 },
  reps:     { type: Number, default: 1, min: 1 },
  weight:   { type: Number, default: 0, min: 0 },           // in kg
  unit:     { type: String, default: 'kg', enum: ['lbs', 'kg'] },
}, { _id: false });

// ── A single workout session ───────────────────────────────────────────────
const workoutSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: () => STATIC_USER_ID,
  },
  date: {
    type: String,                                            // "YYYY-MM-DD"
    required: true,
    index: true,
  },
  notes:     { type: String, trim: true, default: '' },
  exercises: { type: [exerciseEntrySchema], default: [] },
}, { timestamps: true });

// ── Body weight log (one entry per day) ────────────────────────────────────
const bodyWeightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: () => STATIC_USER_ID,
  },
  date:   { type: String, required: true, index: true },    // "YYYY-MM-DD"
  weight: { type: Number, required: true, min: 0 },         // in kg
  unit:   { type: String, default: 'kg', enum: ['lbs', 'kg'] },
}, { timestamps: true });

export const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);
export const BodyWeight     = mongoose.model('BodyWeight',     bodyWeightSchema);
