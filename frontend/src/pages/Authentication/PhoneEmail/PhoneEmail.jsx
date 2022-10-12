import React from 'react'
import Card from '../../components/Card/Card'
import style from './PhoneEmail.module.css'
import Button from '../../components/Button/Button'
import { useState } from 'react';
import { sendOtp } from '../../../Api/Api';
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { addHashOtp } from '../../../Store/userSlice';
import Loading from '../../Loading/Loading';


const PhoneEmail = ({ next }) => {

     const dispatch = useDispatch();
     const [phone, setPhone] = useState("+91");
     const [email, setEmail] = useState("");
     const [props, setProps] = useState({
          logo: "phone",
          heading: " Enter Your phone number"
     });
     const [toggle, setToggle] = useState(1);
     const [phoneColor, setPhoneColor] = useState(style.primary);
     const [emailColor, setEmailColor] = useState(style.secondary);
     const [loading,setLoading]=useState(false);
     const toggleEmail = (e) => {

          setProps({
               logo: "email",
               heading: "Enter Your email"
          })
          setToggle(2);
          setPhoneColor(style.secondary);
          setEmailColor(style.primary);

     }
     const togglePhone = (e) => {

          setProps({
               logo: "phone",
               heading: "Enter Your phone number"
          })
          setToggle(1);
          setPhoneColor(style.primary);
          setEmailColor(style.secondary);
     }
     const setNumber = (e) => {

          e.target.value.length === 2 ?
               setPhone("+91") :
               setPhone(e.target.value);
     }





     const generateOtp = async () => {

          const sendData = {};
          toggle === 1 ? sendData.phone = phone : sendData.email = email;
          if (toggle === 1)
               if (sendData?.phone.trim() === "+91") {
                    toast.error("Enter Phone number !!!");
                    return;
               }
          if (toggle === 2)
               if (sendData.email.trim() === "") {
                    toast.error("Enter Email !!!");
                    return;
               }
          setLoading(true)
          const response = await sendOtp(sendData);
          setLoading(false)
          if (response.data.error) {
               toast.error("Unable to send OTP!!");
               return;
          }
          else {
               dispatch(addHashOtp({ hashOtp: response.data.hashOtp, authWith: response.data.authWith }));
               toast.success("OTP send successfully");
               console.log(response.data.otp);
          }
          next();

     }


     window.onkeydown = (e) => e.key === "Enter" ? generateOtp() : ""

  if(loading)
   return <Loading/>
     return (
          <div className='cardWrapper'>
               <div className={style.togglewraper} >
                    <div className={`${style.toggle} ${phoneColor}`} onClick={togglePhone} >
                         <img src="./android.svg" alt="phone" />
                    </div>
                    <div className={`${style.toggle} ${emailColor}`} onClick={toggleEmail}>
                         <img src="./mail.svg" alt="email" />
                    </div>
               </div>
               <Card props={props}>
                    <div className={style.inputWrapper}>
                         {
                              toggle === 1 ?
                                   <> <img className={style.img} draggable="false" src="./india.svg" alt="" />
                                        <input className={`${style.input} ${style.input_number}`} value={phone} type="text" onChange={setNumber} />
                                   </>
                                   :
                                   <input className={`${style.input} ${style.input_email}`} placeholder="Enter your email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
                         }
                    </div>

                    <div className={style.btnWrapper} onClick={generateOtp}>
                         <Button text="Next" logo="arrow"  ></Button>
                    </div>
                    <div className={style.terms}>
                         <p>By entring your {toggle === 1 ? "number" : "email"},you’re agreeing to our Term of Service and Privacy Policy.Thanks!</p>
                    </div>
               </Card>
          </div>


     )
}

export default PhoneEmail;