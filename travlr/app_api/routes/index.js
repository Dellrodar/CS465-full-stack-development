import { Router } from 'express';
import { tripsList, tripsFindByCode, addTrips, updateTrip } from '../controllers/trips.js';  

const router = Router();

router.route('/trips').get(tripsList);
router.route('/trips').post(addTrips);
router.route('/trips/:tripCode').get(tripsFindByCode);
router.route('/trips/:tripCode').put(updateTrip);

export default router
