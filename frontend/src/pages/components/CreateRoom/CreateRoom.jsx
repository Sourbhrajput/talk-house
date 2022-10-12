import  {useState} from 'react'
import style from './CreateRoom.module.css'
import {createroom} from '../../../Api/Api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
 
const CreateRoom = ({setCreateRoom}) => {

  const [topic,setTopic]=useState("");
  const [roomtype,setRoomtype]=useState("open");
 const [error,setError]=useState(false);
const navigate=useNavigate();
  const createRoom=async()=>
  {
    if(topic.trim() ==="")
    {
      setError(true);
      setTopic("")
      return;
    }

    const {data}= await createroom({topic,roomtype});
    if(!data)
    {
      toast.error("Room not created")
      return;
    } 
     toast.success("Room created ");
     navigate(`/room/${data.room._id}`);
     
  }
  window.onkeydown = (e) => e.key === "Enter" ?createRoom()  : ""
  return (
     
     <div className={style.ceateRoomWrapper}>
     <div className={style.createRoomContainer}>
     <img  onClick={()=>setCreateRoom(false)} className={style.vector} src="./images/Vector.svg" alt="cross" />
       <div className={style.top}>
         <h1 className={style.roomtypeheading}>Enter the topic to be disscussed</h1>
         <div className={error ?style.inputWrapper:""}>
         <input className={style.inputError} value={topic}  type="text" name="" id="" onChange={(e)=>
         {setTopic(e.target.value);
         setError(false)}
          } />
         </div>
         <h2>Room type</h2>
         
         <div  className={style.roomtype}>
           <div onClick={()=>setRoomtype("open")} className={roomtype==="open"?style.roomtypecolor:""} > <img draggable="false" src="./images/gloab.svg" alt="gloab" />
           <h3>Open</h3>
           </div>
           <div onClick={()=>setRoomtype("social")} 
           className={roomtype==="social"?style.roomtypecolor:""}> <img draggable="false" src="./images/Users.svg" alt="gloab" />
           <h3>Social</h3></div>
           <div onClick={()=>setRoomtype("closed")} 
           className={roomtype==="closed"?style.roomtypecolor:""} > <img draggable="false" src="./images/Lock.svg" alt="gloab" />
           <h3>Closed</h3></div>
       </div>
     
       </div>

       <div className={style.bottom}>
          <h3>Start a room, open to everyone</h3>
          <button onClick={createRoom}>
           <img src="./images/celebration.svg" alt="" />
           Let's Go
          </button>
       </div>
     </div>

   </div>
  )
}

export default CreateRoom