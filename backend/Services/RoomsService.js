const { default: mongoose } = require('mongoose');
const { RoomsModel, UserModel } = require('../Database/Model/Model')
const DataServices = require('./DataServices')

DataServices

class RoomsService {

   async createRoom(data) {

      data = await this.filter(data);
      if (!data) {
         return data;
      }

      return await RoomsModel.create(data);
   }


   async getRooms({ find }) {
      return await RoomsModel.find({ roomtype: { $in: find } }).populate("speakers").populate("ownerId").exec();
   }

   async getRoombyid({ roomId }) {
      return await RoomsModel.findOne({ _id: roomId }).populate("speakers").populate("ownerId").exec();
   }

   async setClientAsSpeaker({ roomId, userId }) {
      try {
         let room = await RoomsModel.findOne({ _id: roomId });
         // console.log( mongoose.Types.ObjectId(userId));
         const check = room.speakers.findIndex(speaker => {
            return speaker.toString() === userId;
         });
         if (check <= -1) {
            room.speakers.push(userId);
            await room.save();
            return this.getRoombyid({ roomId })
         }
         return null;
      }
      catch (e) {
         console.log(e);
      }

   }


   async removeClientAsSpeaker({ roomId, userId }) {
      try {
         let room = await RoomsModel.findOne({ _id: roomId });

         const check = room.speakers.findIndex(speaker => {
            return speaker.toString() === userId;
         });

         if (check > -1) {
            room.speakers.splice(check, 1);
            await room.save();
            return this.getRoombyid({ roomId })
         }
         return null;
      }
      catch (e) {
         console.log(e);
      }

   }

 async addTotal({roomId,total})
   {
      let room = await RoomsModel.findOne({ _id: roomId });
      room.total=total;
      await room.save();
      return room;
   }



   filter = async (data) => {
      const _id = data.user._id;
      try {
         const user = await DataServices.checkUserById({ _id });
         if (!user) {
            throw new Error();
         }
         return {
            ownerId: user._id,
            name: user.name,
            topic: data.body.topic,
            roomtype: data.body.roomtype,
            speakers: [
               user._id
            ]
         }
      }

      catch (e) {
         console.log("Data base Error");
      }
   }


}


module.exports = new RoomsService();