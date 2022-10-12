const Services = require("../Services/otpServices");
const DataService = require("../Services/DataServices");
const jwt = require("../Services/TokenServices");
const {
  refreshToken
} = require("../Services/TokenServices");
const dto = require("../Database/dto/dto");
const otpServices = require("../Services/otpServices");

class authentication {
  // Generate otp

  async otpGenerate(req, resp) {
    const data = req.body.phone ? req.body.phone : req.body.email;
    const check = req.body.phone ? "phone" : "email";
    if (check == "phone")
      if (data == "+91") {
        resp.send({
          error: true,
          message: "Enter Phone number",
        })
        return;
      }
    if (check == "email") {

      if (data.trim() === "") {
        resp.send({
          error: true,
          message: "Enter Email",
        })
        return;
      }
    }


    const time = Date.now() + 1000 * 60 * 10;
    // const otp = Services.generateOtp();
    const otp=1234;
    // send otp to the user
    //   const respOtp = await otpServices.sendOtp({ otp,check,data });

    // if(!respOtp)
    // {
    //   resp.status(400).send({ message: "OTP Not send ", status: false });
    //     return;
    // }
    // console.log(respOtp);


    // create hash otp 
    const hashOtp = Services.hashOtp({
      data,
      otp,
      time,
    });
    resp.send({
      hashOtp: `${hashOtp}.${time}.${check}`,
      otp,
      error: false,
      authWith: data
    });

  }
  // check otp

  async otpAuth(req, resp) {
    const hashOtpString = req.body.hashOtp;
    const otp = req.body.otp;
    const data = req.body.authWith;
    if (!otp) {
      resp.json({
        error: true,
        message: "Enter otp ",
      });
      return;
    }
    const [hashOtp, time, check] = hashOtpString.split(".");
    if (time < Date.now()) {
      resp.send({
        error: true,
        message: "Time Expired !!",
      });
      return;
    }

    const isValid = Services.checkOtp({
      data,
      time,
      hashOtp,
      otp,
    });
    if (!isValid) {
      resp.send({
        error: true,
        message: "Wrong OTP"

      });
      return; 
    }
    // insert user in database
    let user;
    
    if (check == "phone")
      user = await DataService.insertUser({
        phone: data,
      });

    else if(check =="email") {
      user = await DataService.insertUser({
        email: data,
      });
    }
     
    
    // get jwt tokens
    if(!user)
    {
      return resp.send({message:"Error with database"});
    }
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

    // Insert refresh token in database;

    try {

      await DataService.insertRefreshToken({
        userId: user._id,
        refreshToken
      })
    } catch (e) {
      console.log(e);
      resp.status(401).send({
        error: true,
        message: "Problem with database!"
      });
      return;
    }
    
    const dtoUser = new dto(user);
    resp.send({
      user: dtoUser,
      error: false
    });
    
    
  }
}

module.exports = new authentication();