const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = '1266 admin';

// Run when a client connects
io.on('connection', socket =>{

    socket.on('joinRoom', ({username, room})=>{
        
        const user = userJoin(socket.id, username, room);
        //! ino nafahmidam chi mikone :
        socket.join(user.room);
        // in faghat be ye client mige :
        socket.emit('message', formatMessage(botName, 'wellcome to chat !'));

        // BroadCast when a user connects
        // in broadcast mikone be hame gheir az khod e oon user
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the Chat !`));
        // ye method e io.emit() ham darim ke be hame mige

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // listen for chat messages :
    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // vase disconnect :
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the Chat !`));    
        
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
