import express from 'express';

import { getGames,addGame,removeGame,addGametoUser,calculateTimePlayed,startGame,markGameAway } from '../controllers/game.controller.js';
const router=express.Router();
import {authmiddleware} from '../middlewares/userAuth.middleware.js'

router.post('/add',addGame)
router.post('/remove/:id',removeGame)
router.get('/getgames',getGames)
router.post('/addgametouser',authmiddleware,addGametoUser)
router.post('/timeplayed',authmiddleware,calculateTimePlayed)
router.post('/startgame',authmiddleware,startGame)
router.post('/away', authmiddleware, markGameAway)
export default router;