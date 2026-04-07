import express from 'express';

import { sendMessage,getallMessages } from '../controllers/partymessage.controller.js';
const router=express.Router();
import {authmiddleware} from '../middlewares/userAuth.middleware.js'



router.use(authmiddleware)
router.post('/send',sendMessage)
router.post('/get',getallMessages)


export default router;