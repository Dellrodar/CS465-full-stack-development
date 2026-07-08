import { Router } from 'express';
import travel from '../controllers/travel.js';

const router = Router();
router.get('/', travel);

export default router;
