const { AwsInstance } = require("twilio/lib/rest/accounts/v1/credential/aws");
const {UserModel,RefreshModel} = require("../Database/Model/Model");

class DataService {
  
     
     async checkUser({ phone,email }) {
       
           
          if(phone!==undefined)
         {
         return await UserModel.findOne({ phone });
        
         }
         else{
         return await UserModel.findOne({ email });
         
         }
        
         
     }
     async checkUserById({ _id }) {
          const user = await UserModel.findOne({ _id });
          return user;
     }

     async insertUser({ phone,email }) {
          // await UserModel.deleteMany({})
         try{
          const user = await this.checkUser({ phone,email });
           
          if (!user) {
               const insert = new UserModel();
               phone!==undefined ? insert.phone = phone: insert.email = email;
               // await insert.save();
               // console.log(insert);
               // insert.phone="1234";
             await  insert.save()

               return await this.checkUser({ phone,email });
          }

          return user;
         }
         catch(e)
         {
          console.log(e);
         }

     }

     async checkRefreshToken({userId})
     {
       return await RefreshModel.findOne({userId});

     }
     async insertRefreshToken({userId,refreshToken})
     {
          const refreshData=await this.checkRefreshToken({userId});

          if(refreshData)
          {

              refreshData.refreshToken=refreshToken;
              refreshData.save();
               return refreshData;   
          }

           return await  new RefreshModel({
          refreshToken,userId
         }).save();

     }



}


module.exports = new DataService();