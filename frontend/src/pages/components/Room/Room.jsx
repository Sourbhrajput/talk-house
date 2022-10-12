import React from 'react'
import style from './Room.module.css'
import { useNavigate } from 'react-router-dom'

const Room = ({ room }) => {
     const navigate=useNavigate();
     let imagecount=0;
     let usercount=0;
     return (
          <div className={style.roomWrapper} onClick={()=>navigate(`/room/${room._id}`)} >

               <div className={style.room}>
                    <div className={style.topic} >
                         <h2>{room.topic}</h2>
                    </div>
                    <div className={room.speakers.length!==1?style.imgname:style.imgnameuser1}>
                    <div className={style.userImgWrapper}>
                         <div className={style.userimg}>
                              {      
                                   room.speakers.map(speaker => {
                                        if(usercount<2)
                                        {    usercount++;
                                             return <div className={style.imgdiv} key={speaker._id} >
                                             <img draggable="false" src={speaker.img} alt="" />
                                            </div>
                                        }
                                        else
                                        {
                                          return "";   
                                        }
                                       

                                   })
                                   
                                  
                              }
                         
                         </div>
                         </div>
                         <div className={style.usename}>
                          
                              {    
                                   room.speakers.map(speaker => {
                                        if(imagecount<2)
                                       {
                                           imagecount++;
                                        return <div key={speaker._id} >
                                             <span>{speaker.name}</span><img draggable="false" src="./images/message.svg" alt="" />
                                        </div>
                                       }
                                       return ""

                                   })
                              }
                         </div>
                    </div>
                    <div className={style.total}> 
                         <span>{room.total}</span>
                         <img draggable="false" src="./images/total.svg" alt="" />
                    </div>
               </div>
          </div>
     )
}

export default Room;  