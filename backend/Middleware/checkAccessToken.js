const jwt = require('../Services/TokenServices');
const checkAccessToken= (req,resp,next)=>
{
     const {accessToken}=req.cookies;
     try{
      if(!accessToken)
     {
          throw new Error();
     }
     
          const userData= jwt.decriptAccessToken(accessToken);
          if(!userData)
          {
               throw new Error();
          }
          
          req.user=userData;
          next();
      }
      catch(e)
      {
         resp.status(401).send({
          error:true,
          message:"Access Token not verifed"
         }) 
          
      }
      
      
  

       
}
 
module.exports=checkAccessToken;