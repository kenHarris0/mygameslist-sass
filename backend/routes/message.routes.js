import express from 'express';

import { getMessages,sendMessage } from '../controllers/message.controller.js';
const router=express.Router();
import {authmiddleware} from '../middlewares/userAuth.middleware.js'
router.use(authmiddleware)
router.post('/send',sendMessage)
router.post('/get',getMessages)
export default router;