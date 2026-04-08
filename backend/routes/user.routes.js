import express from 'express';

import { register,login,logout,getuserdata,checkAuth ,getUserGames,changeProfilePicture,editProfile,editcurrentlyplaying,sendFriendReq,acceptFriendReq,
    rejectFriendReq,getallusers,
         sendPartyReq,acceptPartyReq,rejectPartyReq} from '../controllers/user.controller.js';
const router=express.Router();
import { authmiddleware } from '../middlewares/userAuth.middleware.js';

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.get('/getuserdata',authmiddleware,getuserdata)
router.get('/checkauth',authmiddleware,checkAuth)
router.get('/getall',authmiddleware,getallusers)

router.get('/getusergames',authmiddleware,getUserGames)
router.post('/changePP',authmiddleware,changeProfilePicture)
router.post('/edit',authmiddleware,editProfile)
router.post('/editCurrentplaying',authmiddleware,editcurrentlyplaying)

//friendd request handling

router.post('/sendreq',authmiddleware,sendFriendReq)
router.post('/accept',authmiddleware,acceptFriendReq)
router.post('/reject',authmiddleware,rejectFriendReq)


//party request handling for private parties

router.post('/sendpartyreq',authmiddleware,sendPartyReq)
router.post('/acceptpartyreq',authmiddleware,acceptPartyReq)
router.post('/rejectpartyreq',authmiddleware,rejectPartyReq)






export default router;