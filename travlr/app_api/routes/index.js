import { Router } from 'express';
import { tripsList, tripsFindByCode } from '../controllers/trips.js';  

const router = Router();

router.route('/trips').get(tripsList);
router.route('/trips/:tripCode').get(tripsFindByCode);

export default router
