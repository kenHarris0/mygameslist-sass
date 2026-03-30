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

//     configs     //

app.use(cors({
    origin:'http://localhost:5173',
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


// server running
server.listen(process.env.PORT,()=>{
    connectionDB()
    console.log('server is running')
})