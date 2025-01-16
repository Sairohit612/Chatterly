// import {Server, server, Socket} from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();

// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: ["http://localhost:5173"]
//     }
// })

// io.on("connection", (Socket) => {
//     console.log("A user connected", Socket.id );

//     const userId = Socket.handshake.query.userId
//     if(userId) {}
// })

//   Socket.on("disconnect", () => {
//     console.log("A user disconnected", Socket.id)
//   })

// export {io, app, server}


import {Server} from "socket.io"
import http from "http"
import express from "express"

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors:{
    origin:["http://localhost:5173"]
  }
})

export function getRecieverSocketId() {
  return userSocketMap[userId]

}

const userSocketMap = {}

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  const userId = socket.handshake.query.userId
  if(userId) userSocketMap[userId] = socket.id

  io.emit("onlineUsers", Object.keys(userSocketMap))
  
  socket.on("disconnect", () => {
  console.log("A user disconnected", socket.id) 
  delete userSocketMap[userId]
  io.emit("onlineUsers", Object.keys(userSocketMap))
})
})


export {io, app, server}