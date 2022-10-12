import React, { useState } from 'react'
import PhoneEmail from '../PhoneEmail/PhoneEmail'
import OtpAuth from '../OtpAuth/OtpAuth'

const Auth = () => {

const [page,setPage]=useState(1);

const components={
     1:PhoneEmail,
     2:OtpAuth,
}
 let Display=components[page];

const next=()=>
{
  setPage(page+1);
}

  return (
     <>
       <Display next={next}/>
       </>
  )
}

export default Auth;