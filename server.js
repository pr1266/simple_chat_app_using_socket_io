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
    console.log('new WS connected');

    // in faghat be ye client mige :
    socket.emit('message', formatMessage(botName, 'wellcome to chat !'));

    // BroadCast when a user connects
    // in broadcast mikone be hame gheir az khod e oon user
    socket.broadcast.emit('message', 'a User has joined the Chat !');

    // ye method e io.emit() ham darim ke be hame mige


    // vase disconnect :
    socket.on('disconnect', ()=>{
        io.emit('message', 'a User has left the Chat !');
    });

    // listen for chat messages :
    socket.on('chatMessage', (msg)=>{
        io.emit('message', msg);
    });
});

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
