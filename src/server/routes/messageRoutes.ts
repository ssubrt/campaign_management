
import express from 'express';
import { generatePersonalizedMessage } from '../controllers/messageController';

const router = express.Router();

// Message route
router.post('/', generatePersonalizedMessage);

export default router;
