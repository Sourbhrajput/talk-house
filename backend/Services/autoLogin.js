const jwt = require('./TokenServices')
const { RefreshModel, UserModel } = require('../Database/Model/Model');
const dto = require('../Database/dto/dto');


class autoLogin {
     async refreshToken(req, resp) {
          // Get refresh token from cookies
          const { refreshToken: refreshTokenCookies } = req.cookies;
          if (!refreshTokenCookies) {

               resp.send({ message: "Refresh token unavailable" });
               return;
          }

          //validate refresh Token

          try {

               const tokenData = jwt.decriptRefreshToken(refreshTokenCookies);
               if (!tokenData) {
                    throw new Error();

               }



               const refreshdata = await RefreshModel.findOne({ userId: tokenData._id, refreshToken: refreshTokenCookies })



               if (!refreshdata) {
                    throw new Error();

               }

               const user = await UserModel.findOne({ _id: refreshdata.userId })
               if (!user) {
                    throw new Error();
               }

               // get jwt tokens

               const [accessToken, refreshToken] = jwt.getToken({
                    _id: user._id,
                    active: user.active,
               });
               // set cookie

               resp.cookie("refreshToken", refreshToken, {
                    maxAge: new Date(1000 * 60 * 60 * 24 * 30),
                    httpOnly: true,
               });
               resp.cookie("accessToken", accessToken, {
                    maxAge: new Date(1000 * 60 * 60 * 24 * 30),
                    httpOnly: true,
               });

               refreshdata.refreshToken = refreshToken;
               await refreshdata.save();


               resp.send({ user: new dto(user) });

          }


          catch (e) {
               resp.status(400).json({ message: "Refresh token error" });
          }
     }
}


module.exports = new autoLogin();