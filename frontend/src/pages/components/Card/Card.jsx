import React from 'react'
import style from './Card.module.css'

const Card = ({props,children,cardStyle}) => {
   
   
  return (
    <>
     <div className={style.cardWrapper}>
     <div className={ cardStyle ? cardStyle: style.card}>
     <div className={`${style.headingWrapper} noSelect`}>
       {props && <><img draggable="false" className={style.img} src={`../${props.logo}.svg`} alt="" />
        <span>{`${props.heading}`}</span></> }
      </div>
       {children}
      </div>
    </div>
    </>
  )
}

export default Card