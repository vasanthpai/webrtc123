'use strict';

const express = require('express');
// const socketIO = require('socket.io');



const PORT = process.env.PORT || 3001;
const INDEX = 'public/index.html';

const server = express()
    .use('/room-id=:roomid&role=:role&id=:id&name=:name', (req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});

// const io = socketIO(server);

const users = {}
var org;
const rooms = {};
var arrayOfObjects = {
    "answers": [

    ]
};

// io.on('connection', (socket) => {
//   console.log('Client connected');
//   socket.on('disconnect', () => console.log('Client disconnected'));
// });

// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

io.on('connection', function (socket) {
    // console.log('Socket is connected with ID', socket.id);

    // socket.on('new-room', roomid => {
    //     socket.join('some')
    //     console.log("New room created", roomid, "User is", socket.id);
    //     users[socket.id] = roomid;
    //     console.log((Object.keys(users)))
    //     console.log((Object.values(users)))
    //     io.to(socket.id).emit("room-created", roomid, socket.id);
    // })
    // io.on('connection', socket => {
    // socket.on('new-room', roomid => {
    //     socket.join(roomid);
    //     // io.to(roomid).emit('joined',socket.id,roomid);
    //     socket.to(roomid).emit('room-created',socket.id,roomid);
    // });

    socket.on('new-room', (roomid, role, id, name) => {

        // if(role=="org"){
        //     // console.log(org_cred.orginfo.length)
        //     var status;
        //     for(i=0;i<org_cred.orginfo.length;i++){
        //         if(org_cred.orginfo[i].roomid==roomid && org_cred.orginfo[i].id==id && org_cred.orginfo[i].name==name){
        //             console.log("user authorized")
        //             status=true;
        //             break;
        //         }
        //     }
        //     if (!status) {
        //         socket.emit('wrongOrg');
        //         return false;
        //     }
        // }

        if (Object.values(users).includes(roomid) == false) {
            console.log("New room created", roomid, "User is", socket.id, name);
            socket.join(roomid);
            org = socket.id;
            users[socket.id] = roomid;
            io.to(socket.id).emit('room-created', socket.id, roomid, name);
            // socket.to(roomid).emit('new-user',socket.id,roomid);
        }
        else {
            console.log("User Joined in Room", roomid, "User is", socket.id, name);
            socket.join(roomid);
            users[socket.id] = roomid;
            io.to(socket.id).emit('join-room', socket.id, roomid, name);
            setTimeout(() => {
                // console.log(org)
                // socket.to(roomid).emit('new-user', socket.id, roomid, name);
                io.to(Object.keys(users)[0]).emit("new-user", socket.id, roomid, name);
            }, 1000);

            // var roster = io.sockets.clients(roomid);

            // roster.forEach(function (client) {
            //     console.log('Username: ' + client);
            // });
        }
        // socket.broadcast.emit('user-connected', name)
    })

    socket.on('send-offer', (offer, id, myid, name) => {
        io.to(id).emit("handle-offer", offer, myid, name);
    });

    socket.on('send-answer', (answer, id) => {
        io.to(id).emit("handle-answer", answer);
    });

    socket.on('send-candidate', (candidate, id, room) => {
        // io.to(id).emit("handle-candidate", candidate);
        socket.to(room).emit('handle-candidate', id, candidate);
    });

    socket.on('msg', (msg, room, id, name) => {
        // io.to(id).emit("handle-candidate", candidate);
        // socket.to(room).emit('handle-candidate', msg);
        socket.to(room).emit('handle-msg', msg, id, name)
    });

    socket.on('send-handRise', (id, orgid) => {
        socket.to(orgid).emit('handle-handRise', id)
    });

    socket.on('send-handDown', (id, orgid) => {
        socket.to(orgid).emit('handle-handDown', id)
    });

    socket.on('send-muteAudio', (id, room, orgid) => {
        socket.to(orgid).emit('handle-muteAudio', id)
    });

    socket.on('send-unmuteAudio', (id, room, orgid) => {
        socket.to(orgid).emit('handle-unmuteAudio', id)
    });

    socket.on('send-muteVideo', (id, room, orgid) => {
        socket.to(orgid).emit('handle-muteVideo', id)
    });

    socket.on('send-unmuteVideo', (id, room, orgid) => {
        socket.to(orgid).emit('handle-unmuteVideo', id)
    });

    socket.on('org-streams', (id, name, screenId, opAudioId, opVideoId) => {
        io.to(id).emit('org-stream', name, screenId, opAudioId, opVideoId);
    });

    socket.on('screen-shared', (id, name, room) => {
        socket.to(room).emit('handle-screenShared', id, name)
    });

    socket.on('screenShareEnd', (ele, room) => {
        console.log(ele);
        socket.to(room).emit('handle-screenShareEnd', ele)
    });

    socket.on('op-stream', (track_id, id, name, room) => {
        socket.to(room).emit('handle-op-stream', track_id, id, name);
    });

    socket.on('op-stopStream', (id, room) => {
        socket.to(room).emit('handle-op-stopStream', id);
    });

    socket.on('send-MuteRemoteAudio', id => {
        io.to(id).emit('handle-MuteRemoteAudio');
    });

    socket.on('send-UnMuteRemoteAudio', id => {
        io.to(id).emit('handle-UnMuteRemoteAudio');
    });

    socket.on('send-MuteRemoteVideo', id => {
        io.to(id).emit('handle-MuteRemoteVideo');
    });

    socket.on('send-UnMuteRemoteVideo', id => {
        io.to(id).emit('handle-UnMuteRemoteVideo');
    });

    socket.on('send-UnMuteRemoteVideo', id => {
        io.to(id).emit('handle-UnMuteRemoteVideo');
    });

    socket.on('send-muteAudioAll', (id, room) => {
        socket.to(room).emit('handle-muteAudioAll', id)
    });

    socket.on('send-unmuteAudioAll', (id, room) => {
        socket.to(room).emit('handle-unmuteAudioAll', id)
    });

    socket.on('send-muteVideoAll', (id, room) => {
        socket.to(room).emit('handle-muteVideoAll', id)
    });

    socket.on('send-unmuteVideoAll', (id, room) => {
        socket.to(room).emit('handle-unmuteVideoAll', id)
    });

    socket.on('new-poll', (room, questionId, question, questionLink, rightAnswer, fileName) => {
        socket.to(room).emit('handle-poll', questionId, question, questionLink, rightAnswer, fileName)
    });

    socket.on('poll-answer', (myid, name, orgid, answer, questionId, question, rightAnswer, result, fileName, room) => {


        const fs = require('fs');
        const path = require('path');
        // const customer = {
        //     name: "Newbie Co.",
        //     order_count: 0,
        //     address: "Po Box City",
        // }


        arrayOfObjects.answers.push({
            qid: questionId,
            question: question,
            myid: myid,
            myname: name,
            answer: answer,
            rightAnswer: rightAnswer,
            result: result,
            datetime: new Date()
        })

        const jsonString = JSON.stringify(arrayOfObjects);
        const outputFileName = room + '_' + fileName + '_qa';
        fs.writeFile(path.join(__dirname, '/public/AnswerPaper_Archive/' + outputFileName + '.json'), jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
                io.to(orgid).emit('handle-pollAnswer', myid, answer);
            }
        })

        // var fs = require('fs')
        // const path = require('path');

        // fs.readFile(path.join(__dirname, '/public/json/output.json'), 'utf-8', function (err, data) {
        //     if (err) throw err

        //     var arrayOfObjects = JSON.parse(data)
        //     arrayOfObjects.answers.push({
        //         qid: questionId,
        //         question: question,
        //         myid: myid,
        //         answer: answer,
        //         rightAnswer:rightAnswer, 
        //         result:result
        //     })

        //     // console.log(arrayOfObjects)

        //     fs.writeFile(path.join(__dirname,'/public/json/output.json'), JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
        //         if (err) throw err
        //         console.log('Done!')
        //     })
        // })




        // const fs = require('fs')
        // const path = require('path');

        // let answerPaper = {
        //     qid: questionId,
        //     question: question,
        //     myid: myid,
        //     answer: answer,
        // };

        // let jsonString = JSON.stringify(answerPaper);
        // // const customer = {
        // //     name: "Newbie Co.",
        // //     order_count: 0,
        // //     address: "Po Box City",
        // // }
        // // const jsonString = JSON.stringify(customer)
        // fs.writeFile(path.join(__dirname,'/public/json/output.json'), jsonString, err => {
        //     if (err) {
        //         console.log('Error writing file', err)
        //     } else {
        //         console.log('Successfully wrote file')
        //     }
        // })
    });

    socket.on('makePresenter', id => {
        io.to(id).emit('handle-makePresenter');
    });

    socket.on('cancelPresenter', id => {
        io.to(id).emit('handle-cancelPresenter');
    });

    socket.on('disconnect', () => {
        console.log("User Disconnected", socket.id);
        // socket.leave(socket.id);
        delete users[socket.id];
        // console.log(Object(io.in(roomid).allSockets()))
        socket.broadcast.emit('user-disconnected', socket.id)
    })

    socket.on('close-meet', (room) => {
        socket.to(room).emit('handle-closeMeet')
    })
    // });
});