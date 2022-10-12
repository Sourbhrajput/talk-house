import React from 'react'

import style from './Loading.module.css'

 
const Loading = ({text}) => {
  return (
    <div className={style.loadingWrapper}> 
       
 <img src="./spinner.svg" alt="" className={style.spinner} draggable="false"  />
             
    </div>
  )
}


export default Loading;
