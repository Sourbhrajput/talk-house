const mongoose=require('mongoose');
require("dotenv").config();
 
  const dblink=process.env.DATABASE_CONNECTION_URL;
  mongoose.connect(dblink, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      },((err)=>
      {
        if(err)
        {   console.log("Data connection error:", dblink);
            return console.log(err);
        }
        console.log("Database connected");
      }))


     
     
 
 

