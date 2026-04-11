import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();
import cookieParser  from 'cookie-parser';
import  connectionDB from './config/db.js';
//imports from other files
import userRouter from './routes/user.routes.js'
import gameRouter from './routes/game.route.js'
import {app,server} from './config/socket.js'
import messagerouter from './routes/message.routes.js'
import rateLimit from "express-rate-limit";
import partyrouter from './routes/party.routes.js'
import Paertmessagerouter from './routes/partymessage.route.js'
//     configs     //
const limiter=rateLimit({
  windowMs: 10*60*1000, 
  max:100,
  message:"Too many requests from this IP, please try again after 15 minutes"
})

app.use(limiter)


app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json({limit:"20mb"}));
app.use(cookieParser());



// app routes

app.use('/user',userRouter)
app.use('/game',gameRouter)
app.use('/msg',messagerouter)
app.use('/party',partyrouter)
app.use('/partymsg',Paertmessagerouter)

// server running
server.listen(process.env.PORT,()=>{
    connectionDB()
    console.log('server is running')
})