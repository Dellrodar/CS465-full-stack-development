import { Router } from 'express';
import rooms from '../controllers/rooms.js';

const router = Router();
router.get('/', rooms);

export default router;