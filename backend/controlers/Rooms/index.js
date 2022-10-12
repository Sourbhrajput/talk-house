const RoomsService = require('../../Services/RoomsService')


class Rooms {
     async createRoom(req, resp) {
          try {
               const room = await RoomsService.createRoom({ user: req.user, body: req.body })
               if (!room) {
                    console.log(room);
                    throw new Error();
               }
               resp.send({ success: true, room: room });
          }
          catch (e) {
               resp.status(400).json({ message: " error during room creation" });
               console.log(e);
          }

     }

     async getRooms(req, resp) {
          try {

               const rooms = await RoomsService.getRooms({ find: req.body.find });

               if (!rooms) {
                    return resp.send({ message: "Rooms not available" });

               }

               resp.send({ message: "Success", rooms })
          }
          catch (e) {
               console.log(e);
               resp.status(400).json({ message: "Database error" });
          }
     }


     async singleRoom(req, resp) {
          try {


               const response = await RoomsService.getRoombyid({ roomId: req.body.roomId });
               if (!response) {
                    throw new Error();
               }
               return resp.send({ room: response });
          }
          catch (e) {
               return resp.status(400).json({ error: true, message: "Room not exist" })
          }

     }

     async setClientAsSpeaker(req, resp) {


          try {
               const room = await RoomsService.setClientAsSpeaker({ roomId: req.body.roomId, userId: req.body.userId })

               if (!room) {
                    throw new Error();
               }
               resp.send({ error: false, room })

          }
          catch (e) {
               return resp.status(400).json({ error: true, message: "Room not exist" })
          }
     }

     async removeClientAsSpeaker(req, resp) {
          try {
               const room = await RoomsService.removeClientAsSpeaker({ roomId: req.body.roomId, userId: req.body.userId })

               if (!room) {
                    throw new Error();
               }
               resp.send({ error: false, room })

          }
          catch (e) {
               return resp.status(400).json({ error: true, message: "Room not exist" })
          }
     }
     async addTotal(req,resp)
     { 
          try
          {
            const room=await RoomsService.addTotal({ roomId: req.body.roomId, total: req.body.total })
            if(!room)
            {
               throw new Error();
            }
            resp.send({ error: false })
          }
          catch(e)
          {
               return resp.status(400).json({ error: true, message: "Database error" })
          }
     }

}


module.exports = new Rooms();