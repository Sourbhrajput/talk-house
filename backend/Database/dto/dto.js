require('dotenv').config();
class dto
{
     constructor(user)
     {
         this._id=user._id;
         this.phone=user.phone;
         this.active=user.active;
         this.name=user.name?user.name :""
         this.img=user.img?user.img:""
     }
}

module.exports=dto;