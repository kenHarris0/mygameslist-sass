import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();
import  connectionDB from './config/db.js';




//     configs     //
const app=express();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json());

// app routes





// server running
app.listen(process.env.PORT,()=>{
    connectionDB()
    console.log('server is running')
})