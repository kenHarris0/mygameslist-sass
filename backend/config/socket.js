import {Server} from 'socket.io'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { socketMiddleware } from '../middlewares/socketmiddleware.js'

const app=express()


const server=http.createServer(app)


const io=new Server(server,{
    cors:{
    origin:'http://localhost:5173',
    credentials:true,
    methods:['POST','GET','PUT','DELETE'],
    }
    
})

io.use(socketMiddleware)
let mapuseridtosocket={}

export const returnUsersocket=(userId)=>{
    
   return mapuseridtosocket[userId];
}

io.on('connection',(socket)=>{
    console.log(`${socket.user.name} connected with id ${socket.id}`)

    mapuseridtosocket[socket.userId]=socket.id

   

    io.emit('onlineusers',Object.keys(mapuseridtosocket))





    socket.on('disconnect',()=>{
        console.log(`${socket.user.name} disconnected with id ${socket.id}`)
      delete  mapuseridtosocket[socket.userId]
      io.emit('onlineusers',Object.keys(mapuseridtosocket))
    })


})


export {io,app,server}