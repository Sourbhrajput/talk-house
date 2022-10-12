const { UserModel } = require("../Database/Model/Model");
const DataService = require("../Services/DataServices");
const path=require("path");
const jimp = require('jimp');
require('dotenv').config();

class Activate {
     async activateUser(req, resp) {
          const { name, img } = req.body;
          const { phone, _id } = req.user;
       
              
               try {  
                    const user = await DataService.checkUserById({ _id: _id });
                    const buffer= Buffer.from(img.split(',')[1],'base64');
                     const storefilePath=path.join(__dirname,"../Storage/");
                     const filename=Date.now()*24+"-"+Math.floor(Math.random()*1e10)+".png";
                    const jimpReader=jimp.read(buffer);
                    (await jimpReader).resize(150,jimp.AUTO).write(storefilePath+filename);

                    user.name=name;
                    user.img="Storage/"+filename;
                    user.active=true;

                    await user.save();

              
                   resp.send({user})
                   
                    
          }
          catch (e) {
               resp.send({ error: true, message: "Select different Profile Picture" });
               console.log(e);
          }

     }

     
}

module.exports = new Activate();