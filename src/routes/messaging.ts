import express from 'express';
import { getLastSeen, getMessages } from '../controllers/messaging';
const router = express.Router();

router.route('/:userId').get(getMessages);
router.route('/lastSeen').post(getLastSeen);
export default router;
