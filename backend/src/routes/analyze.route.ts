import { Router } from 'express';
import { analyzePost } from '../controllers/analyze.controller';

const router = Router();

router.post('/', analyzePost);

export default router;
