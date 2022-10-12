import React from "react";
import { Link,useLocation } from "react-router-dom";
import style from "./Navigation.module.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Api/Api";
import { addUser } from "../../Store/userSlice";
import Button from "../components/Button/Button";



const Navigavtion = ({ setLoading }) => {
  const link = {
    textDecoration: 'none',
    color: '#ffff'
  }
const {pathname}=useLocation();
 const isRoom=pathname.match("room/");
 
  const { isAuth } = useSelector((state) => state.user);
  const { img, name, active } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  
  async function logOut() {
    try {
      setLoading(true)
      const response = await logout();
      dispatch(addUser({ user: response.data.user }));
      setLoading(false)
    }
    catch (e) {
      setLoading(false)
      console.log(e);
    }
  }


  return (
    <nav className={`${style.nav} container `}>
      <div className={style.left}>
      <Link to="/" style={link}>
        <img className={style.img} src="../logo.svg" alt="" />
        <span className={style.brand}> Talkhouse </span>
      </Link>
      </div>
      {
        isAuth &&
        <div className={style.right}>
          {
            active && <div className={style.nameimgcon}>
              <span className={style.name} >{name}</span>

              <div className={style.userImgWrapper}>
                <img src={img} className={style.userimg} draggable="false" alt="user_image" />
                </div>
              </div> 
       }
             {
              isRoom==null &&  <div onClick={logOut}>
                <Button btnstyle={style.btn} text="" logo="../images/logout" /> 
              </div>
             }
            </div>
          }
        </nav>
  );
};

      export default Navigavtion;
