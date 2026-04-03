    import express from 'express';

    import { createParty,deleteParty,leaveParty,getallparty,joinParty } from '../controllers/party.controller.js';
    const router=express.Router();
    import {authmiddleware} from '../middlewares/userAuth.middleware.js'

    router.post('/add',createParty)
    router.post('/delete',deleteParty)
    router.post('/join',authmiddleware,joinParty)
    router.post('/leave',authmiddleware,leaveParty)
    router.get('/getallparty',authmiddleware,getallparty)
   

    export default router;