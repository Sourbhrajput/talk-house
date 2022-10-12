import React from 'react'
import style from './Button.module.css'

const Button = ({text,logo,btnstyle}) => {
 
  return (
     <> 
        <button className={`${btnstyle ? btnstyle:style.btn }`}>
          <span>{text}</span>
        { logo && <img className={style.btnimg} src={`../${logo}.svg`} alt="arrow" />}
        </button>   
     </>
  )
}

export default Button