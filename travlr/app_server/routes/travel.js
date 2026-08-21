import { Router } from 'express';
import { travel, travelDetails } from '../controllers/travel.js';

const router = Router();
router.get('/', travel);
router.get('/:tripCode', travelDetails);

export default router;
