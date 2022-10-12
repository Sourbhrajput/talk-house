import { useState } from 'react'
import style from './Rooms.module.css'
import Button from '../components/Button/Button'
import CreateRoom from '../components/CreateRoom/CreateRoom'
import Room from '../components/Room/Room'
import {getRooms} from '../../Api/Api'
 




const Rooms = () => {

  const [createRoom, setCreateRoom] = useState(false);
  const [rooms,setRooms]=useState([]);
  useState(()=>
  {
    
    setTimeout(()=>
    {
      (async()=>
      {
             const {data}=await getRooms({find:["open",],});
             if(data.rooms)
             {
                 
                 setRooms(data.rooms);
                  
                
             }  
            
            
      })();
    },400)

  },[]) 
  
  
   
  return (
    <div className={`${style.roomsWrappper} container`}>
      <div className={style.roomtop} >
        <div className={style.left}>
          <span>All voice rooms</span>
          <div className={style.searchWrapper}>
            <div> <img src="./images/search.svg" alt="" /> </div>
            <input type="text" name="" id="" />
          </div>
        </div>
        <div className={style.right} onClick={()=>setCreateRoom(true)}> <Button btnstyle={style.createroombtn} logo="./images/room" text="Start a room" /> </div>
      </div>
      {
        createRoom && <CreateRoom setCreateRoom={setCreateRoom} />

      
      }
 
        <div className={style.globalrooms}>
       { rooms.map(room=><Room key={room._id} room={room}/>)}
        </div>
       
    </div>
  )
}


export default Rooms
