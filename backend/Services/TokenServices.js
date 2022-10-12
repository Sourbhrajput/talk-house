const Jwt = require("jsonwebtoken");
require("dotenv").config();
class jwt {

     accessToken(payload) {
          return Jwt.sign(payload, process.env.ACCESS_WEB_TOKEN, {
               expiresIn: '1w',

          });
     } 

     refreshToken(payload) {
          return Jwt.sign(payload, process.env.REFRESH_WEB_TOKEN, {
               expiresIn: '30d'
          });
     }
     decriptRefreshToken(token) {
        
        return  Jwt.verify(token, process.env.REFRESH_WEB_TOKEN)
     
     }
     decriptAccessToken(token) {
        
        return  Jwt.verify(token, process.env.ACCESS_WEB_TOKEN)
     
     }

     getToken(payload) {
          return [this.accessToken(payload), this.refreshToken(payload)];
     }
       

}



module.exports = new jwt();