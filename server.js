const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const app = express();
const server = http.createServer(app);
const io = socketio(server);


// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord bot';

// Run when a client connects
io.on('connection', socket =>{

    socket.on('joinRoom', ({username, room})=>{
    
        // in faghat be ye client mige :
        socket.emit('message', formatMessage(botName, 'wellcome to chat !'));

        // BroadCast when a user connects
        // in broadcast mikone be hame gheir az khod e oon user
        socket.broadcast.emit(formatMessage(botName,'message', 'a User has joined the Chat !'));

        // ye method e io.emit() ham darim ke be hame mige
    });

    // listen for chat messages :
    socket.on('chatMessage', (msg)=>{
        io.emit('message', formatMessage('User', msg));
    });

    // vase disconnect :
    socket.on('disconnect', ()=>{
        io.emit('message', formatMessage(botName, 'a User has left the Chat !'));
    });
});

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
