import { createSlice } from "@reduxjs/toolkit";
 

const userSlice = createSlice({

    name: "user",
    initialState: {
        isAuth: false,
        user: {
            phone:"",
            _id: "",
            active: false,
            name:"",
            img:"",
           
        },
        hashOtp: "",
        authWith: "",
        mute:true,
        ishandRaise:false
    }
    ,
    reducers: {

        addUser(state, action) {

          
            if( action.payload.user!=null)
            {
                state.user = action.payload.user;
                state.isAuth = true;
            }
            else{
                state.user= {
                    phone:"",
                    _id: "",
                    active: false,
                    name:"",
                    img:"",
                   
                }
                state.isAuth = false;

            }

             
        },
       
        addHashOtp(state, action) {
            state.hashOtp = action.payload?.hashOtp;
            state.authWith = action.payload?.authWith;
        }
,
        addUserName(state,action)
        {
            state.user.name=action.payload.name;
        },
        addUserImg(state,action)
        {
            state.user.img=action.payload.img;
        },
        addMute(state,action)
        {     
             state.mute=action.payload;
        },
        addIshandRaise(state,action)
        {     
             state.ishandRaise=action.payload;
        }


    }


})

export const { addUser, addHashOtp ,addUserName,addUserImg,addMute,addIshandRaise} = userSlice.actions;
export default userSlice.reducer;