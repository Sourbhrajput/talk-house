const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
     phone: {
          type: String,
          required: false,
          
     },
     email: {
          type: String,
          required: false,
           
     },
     active: {
          type: Boolean,
          default: false
     },
     name:{
          required:false,
          type:String
            
     },
     img:{
          required:false,
             type:String,
             get:((img) =>`${img?process.env.CURRENT_URL:""}${img?img:""}`)
     }

},
     {
          timestamps: true,
          toJSON:{getters:true}
     }
);
module.exports = UserSchema;