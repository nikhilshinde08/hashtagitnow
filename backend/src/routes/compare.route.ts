import { Router } from 'express';
import { comparePosts } from '../controllers/compare.controller';

const router = Router();

router.post('/', comparePosts);

export default router;
