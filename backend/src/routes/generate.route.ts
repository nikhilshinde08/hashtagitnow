import { Router } from 'express';
import { generateContent } from '../controllers/generate.controller';

const router = Router();
router.post('/', generateContent);
export default router;
