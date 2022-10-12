const mongoose=require("mongoose");


const RefreshSchema = new mongoose.Schema({
     refreshToken:{
          required:true,
          type:String,
          unique:true
     },
     userId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"
     }
},
     {
          timestamps: true
     }
);
module.exports=RefreshSchema;