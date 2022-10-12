import React, { useState } from 'react'
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import style from './UserName.module.css';
import {useSelector,useDispatch} from 'react-redux';
import { addUserName } from '../../../Store/userSlice';
import toast from 'react-hot-toast';

const UserName = ({ onNext }) => {
  const {name}=useSelector((state)=>state.user.user);
  const dispatch = useDispatch();
  const [userName,setUserName]=useState(name);
  const props = {
    heading: "What's your full name?",
    logo: "name"
  }
  

const  setName=(e)=>
{
  setUserName(e.target.value)
  dispatch(addUserName({name:e.target.value}))
  
}

function next()
{
    if(name.trim()==="")
    {
        toast.error("Enter your name",{
          
        })    
    }
    else
    {
    onNext()
    }
}

window.onkeydown = (e) => e.key === "Enter" ? next() : ""

  return (
    <div className={style.wrapper} >
      <Card props={props} cardStyle={style.card}  >

        <input type="text" className={style.input} placeholder="Enter your name" onChange={setName} value={userName} />
        <p className={style.peragraph}>People use real name at Talkhouse :)</p>
        <div onClick={next}>
        <Button text="Next" logo="arrow"  />
        </div>
      </Card>

    </div>
  )

}

export default UserName;
