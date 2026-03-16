import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();
import cookieParser  from 'cookie-parser';
import  connectionDB from './config/db.js';
//imports from other files
import userRouter from './routes/user.routes.js'
import gameRouter from './routes/game.route.js'

//     configs     //
const app=express();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json());
app.use(cookieParser());

// app routes

app.use('/user',userRouter)
app.use('/game',gameRouter)



// server running
app.listen(process.env.PORT,()=>{
    connectionDB()
    console.log('server is running')
})