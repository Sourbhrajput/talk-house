const jwt = require('./TokenServices')
const { RefreshModel} = require('../Database/Model/Model');
class logout
{
    async logoutUser(req,resp)
     {
          try{
         const {refreshToken}=req.cookies;
         if(!refreshToken)
         {
           throw new Error();
         }

         const tokenData = jwt.decriptRefreshToken(refreshToken);
         if (!tokenData) {
              throw new Error();
         }
 
      
        const r=  await RefreshModel.deleteOne({ userId:tokenData._id})
        
          resp.clearCookie("refreshToken");
         resp.clearCookie("accessToken");
           resp.send({user:null})
         
     }
     catch(e)
     {
          console.log(e);
          
         resp.clearCookie("refreshToken");
         resp.clearCookie("accessToken");
           resp.send({user:null})
         
  }

}
}
module.exports=new logout();
