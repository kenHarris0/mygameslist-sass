import express from 'express';

import { register,login,logout,getuserdata,checkAuth } from '../controllers/user.controller.js';
const router=express.Router();
import { authmiddleware } from '../middlewares/userAuth.middleware.js';

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.get('/getuserdata',authmiddleware,getuserdata)
router.get('/checkauth',authmiddleware,checkAuth)



export default router;