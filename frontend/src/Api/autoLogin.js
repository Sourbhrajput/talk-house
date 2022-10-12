import { useDispatch } from "react-redux";
import {addUser} from "../Store/userSlice"
import { useState,useEffect } from 'react'
import {autoLogin}  from './Api'

 

const useAutoLogin = () => {
     const [loading,setLoading]=useState(true);
     const dispatch=useDispatch();
   useEffect( ()=>
   {
      (async()=>
      {    try{
          const response=await autoLogin();
         if(response)
         dispatch(addUser({user:response.data.user}))
         setLoading(false);
      }
      catch(e)
      {

          setLoading(false);
      }
          

      })();
     


   },[])


   return loading;
}

export  {useAutoLogin};
