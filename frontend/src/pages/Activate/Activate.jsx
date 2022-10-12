import React, { useState } from 'react'
import UserName from './UserName/UserName'
import UserImg from './UserImg/UserImg'



const SemiProtedted = () => {

  const [step,setStep]=useState(1);

    
  const component={
    1:UserName,
    2:UserImg
  }

  const Display=component[step];
  const onNext=()=>
  {
        setStep(step+1);
  }

    return (
        <Display onNext={onNext}  />
        
    )
}

export default SemiProtedted