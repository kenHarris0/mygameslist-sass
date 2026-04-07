    import express from 'express';

    import { createParty,deleteParty,leaveParty,getallparty,joinParty } from '../controllers/party.controller.js';
    const router=express.Router();
    import {authmiddleware} from '../middlewares/userAuth.middleware.js'

    router.post('/add',authmiddleware,createParty)
    router.post('/delete',authmiddleware,deleteParty)
    router.post('/join',authmiddleware,joinParty)
    router.post('/leave',authmiddleware,leaveParty)
    router.get('/getallparty',authmiddleware,getallparty)
   

    export default router;