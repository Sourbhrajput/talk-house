const ACTION = require('../ACTION')
 

const socketUserMapping = [];
module.exports = (io) => {

      io.on("connection", (socket) => {
            socket.on(ACTION.JOIN, ({user,roomId }) => {
                  socketUserMapping[socket.id] = user;
                  const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
                  clients.forEach(clientId => {
                        io.to(clientId).emit(ACTION.ADD_PEER, ({
                              peerId: socket.id,
                              user: socketUserMapping[socket.id],
                              createOffer: false
                        }));

                        socket.emit(ACTION.ADD_PEER, ({
                              peerId: clientId,
                              user: socketUserMapping[clientId],
                              createOffer: true
                        }));
                  })

                  socket.join(roomId);

            })

            //  Handel relay ice 

            socket.on(ACTION.RELAY_ICE, ({ peerId, iceCandidate }) => {
                  io.to(peerId).emit(ACTION.RELAY_ICE, {
                        peerId: socket.id,
                        iceCandidate
                  })
            });
            // Handel relay sdp
            socket.on(ACTION.RELAY_SDP, ({ peerId, sessionDescription }) => {
                  io.to(peerId).emit(ACTION.RELAY_SDP, {
                        peerId: socket.id,
                        sessionDescription
                  })
            });

            // leaving the rooms



            const leaveroom = () => {
                  const { rooms } = socket;
                  try {
                        Array.from(rooms).forEach(async(roomId) => {
                              const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
                              
                              clients.forEach(clientId => {
                                    if (clientId != socket.id) {
                                          io.to(clientId).emit(ACTION.REMOVE_PEER, {
                                                peerId: socket.id,
                                                userId: socketUserMapping[socket.id] ? socketUserMapping[socket.id]._id : ""
                                          })
                                    }

                                    socket.emit(ACTION.REMOVE_PEER, {
                                          peerId: socket.id,
                                          userId: socketUserMapping[clientId] ? socketUserMapping[clientId]._id : ""
                                    })

                              })


                        });

                        


                  } catch (e) {
                        console.log(e);
                  }

              delete socketUserMapping[socket.id];
             
            }

            socket.on(ACTION.LEAVE, leaveroom);
            socket.on('disconnecting',leaveroom)
            
            // mute clients


            socket.on(ACTION.MUTE,({isMute,roomId,clientId})=>
            {
                 if( socketUserMapping[socket.id])
                 {
                  socketUserMapping[socket.id].mute=isMute;
                 }
                  io.to(roomId).emit(ACTION.MUTE,{isMute,clientId});
            })
            socket.on(ACTION.HANDRAISE,({ishandRaise,roomId,clientId})=>
            {
                 if( socketUserMapping[socket.id])
                 {
                  socketUserMapping[socket.id].ishandRaise=ishandRaise;
                 }
                  io.to(roomId).emit(ACTION.HANDRAISE,{ishandRaise,clientId});
            })

       // remove client from room 

            socket.on(ACTION.REMOVE,({roomId,clientId})=>
            {
               io.to(roomId).emit(ACTION.REMOVE,{clientId}); 

                  
            })
      // set room after client change 

        socket.on(ACTION.ADDROOM,({room,roomId})=>
        {
            io.to(roomId).emit(ACTION.ADDROOM,{room});
        })
        
      //   mute client after remove as speaker

      socket.on(ACTION.MUTECLIENTAFTERREMOVE,({roomId,userId})=>
      {
            io.to(roomId).emit(ACTION.MUTECLIENTAFTERREMOVE,{userId});
      })



      })
} 