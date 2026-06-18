import { Router } from 'express';
import {
  getSessions,
  addSession,
  deleteSession,
  getWeightLog,
  logWeight,
  getDashboard,
} from '../controllers/progress.controllers.js';

const router = Router();

// Dashboard (aggregated)
router.route('/dashboard').get(getDashboard);

// Workout sessions
router.route('/sessions').get(getSessions).post(addSession);
router.route('/sessions/:id').delete(deleteSession);

// Body weight log
router.route('/weight').get(getWeightLog).post(logWeight);

export default router;
