const mongoose = require("mongoose");
const RoomsSchema = new mongoose.Schema({

     name: {
          required: true,
          type: String
     },
     ownerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required:true,
     },
     topic:{
         required:true,
         type:String
     },
     speakers: [
          {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
               
          },
     ],
     total: {
          type:Number,
          default:0
     },
     roomtype:{
          type:String,
          required:true,
     }

},
{
     timestamps: true
}
);
module.exports = RoomsSchema;