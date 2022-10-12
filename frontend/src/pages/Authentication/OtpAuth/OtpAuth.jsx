import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Card from '../../components/Card/Card'
import style from './OtpAuth.module.css'
import Button from '../../components/Button/Button'
import { Link } from 'react-router-dom' 
import { verifOtp } from '../../../Api/Api'
import { useDispatch, useSelector } from 'react-redux'
import { addHashOtp } from '../../../Store/userSlice'
import { addUser } from '../../../Store/userSlice'
import Loading from '../../Loading/Loading'


const OtpAuth = ({ next }) => {
   // redux use selector for get data from store
   const { hashOtp, authWith } = useSelector((state) => state.user);
   const dispatch = useDispatch();
   const [otp, setOtp] = useState("");
   const [loading,setLoading]=useState(false);
   const props = {
      logo: "otp",
      heading: "Enter the code we just texted you"
   }


   async function checkOtp() {
     
      if(otp.trim()==="")
      {
         toast.error("Enter OTP")
          
         return; 
      }
     
       
         
      const data = {
         otp,
         hashOtp,
         authWith
      }
    
      try{
      setLoading(true);
      const response = await verifOtp(data);
      setLoading(false)
      if (response.data.error) {
         toast.error(response.data.message);
         return;
      }
      toast.success("OTP is matched ");

      // user data store in redux store
      dispatch(addHashOtp({hashOtp:"",authWith:""}))
      dispatch(addUser({ user: response.data.user, }))
   }
   catch(e)
   {
      console.log(e);
      setLoading(false)
   }
}
   
   window.onkeydown = (e) => e.key === "Enter" ? checkOtp() : ""
   if(loading)
   return <Loading/>

   return (
      <div className='cardWrapper'>
         <Card props={props} >
            <div className={style.inputWrapper}>
               <input type="text" value={otp} className={style.input} onChange={(e) => setOtp(e.target.value.trim())} />
               <div className={style.inputOver}></div>
               <div></div>
               <div></div>
            </div>
            <div className={style.btnWrapper} onClick={checkOtp}>
               <Button text="Verify" logo="arrow" />
            </div>
            <div className={style.resend}>
               <p>Didn’t get OTP ,<Link style={{ textDecoration: "none", color: "#1B279B", margin: "0px 4px" }}  > resend </Link>again </p>
            </div>
         </Card>
      </div>
   )
}

export default OtpAuth