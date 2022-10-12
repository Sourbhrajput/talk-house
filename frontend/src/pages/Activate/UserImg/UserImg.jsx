import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../../components/Card/Card'
import style from './UserImg.module.css'
import Button from '../../components/Button/Button'
import { addUserImg, addUser } from "../../../Store/userSlice"
import { activateUser } from "../../../Api/Api"
import toast from "react-hot-toast";
import Loading from '../../Loading/Loading'
const UserImg = ({ onNext }) => {

  const name = useSelector((state) => state.user.user.name);
  const img = useSelector((state) => state.user.user.img);
  const [loading, setLoading] = useState(false);
  const [userImg, setUserImg] = useState(img);
  const dispatch = useDispatch();
  const props = {
    heading: `Okay, ${name}`,
    logo: "photo"
  }

  const next = async () => {
    if (img.trim() === "") {
      toast.error("Select Profile picture :)");
      return;
    }
    const data = {
      name,
      img: img
    }
    try {

      setLoading(true);
      const response = await activateUser(data);

      setLoading(false);
      if (!response) {
        return;
      }
      if (response.data.error) {
        toast.error(response.data.message);

      }
      else {
         
        dispatch(addUser({ user: response.data.user }))

      }
    }
    catch (e) {
     
      setLoading(false)
    }

  }

  const imgChange = (e) => {

    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onloadend = () => {
      setUserImg(fileReader.result);
      dispatch(addUserImg({ img: fileReader.result }));

    }

  }
  if (loading)
    return <Loading />
  return (
    <div className={style.wrapper}>
      <Card props={props} cardStyle={style.card}  >

        <p className={style.peragraph}> How's this photo?</p>
        <div className={style.imgWrapper}>
          <img className={style.img} src={userImg !== "" ? userImg : "../monkey.png"} alt="profile_picture" />
        </div>

        <input id='imgInput' type="file" className={style.imgInput} onChange={imgChange} />
        <label htmlFor='imgInput' className={style.imginputlable}>
          Choose a different photo
        </label>
        <div onClick={next}>
          <Button text="Next" logo="arrow" />
        </div>
      </Card>

    </div>
  )
}

export default UserImg

