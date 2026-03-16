import express from 'express';

import { getGames,addGame,removeGame } from '../controllers/game.controller.js';
const router=express.Router();


router.post('/add',addGame)
router.post('/remove/:id',removeGame)
router.get('/getgames',getGames)



export default router;