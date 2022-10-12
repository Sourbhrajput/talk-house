import { useEffect, useRef } from "react";
import { useCallback } from "react";
import { useState } from "react"

export const  useStateWithCallBack=(initialState)=>
{
   const cbRef=useRef();
  const [clients,setClients]=useState(initialState);


  const updateState=useCallback((newState,cb)=>
  { 
      cbRef.current=cb;  

      setClients((pre)=>
      {
          return typeof  newState==='function'   ?  newState(pre) :newState; 
      
  })
   
},[])

   useEffect(()=>
   {
          if(cbRef.current)
          {
               cbRef.current(clients);
               cbRef.current=null;
               
          }

     },[clients]) 


   return [clients,updateState]

}