import express from 'express';

import { getMessages,sendMessage,getallmessagedusers } from '../controllers/message.controller.js';
const router=express.Router();
import {authmiddleware} from '../middlewares/userAuth.middleware.js'
router.use(authmiddleware)
router.post('/send',sendMessage)
router.post('/get',getMessages)
router.get('/getalluniquemessagers',getallmessagedusers)
export default router;