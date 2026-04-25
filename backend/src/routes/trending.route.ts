import { Router } from 'express';
import { getTrending } from '../controllers/trending.controller';

const router = Router();
router.post('/', getTrending);
export default router;
