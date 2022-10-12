import React from 'react'
import style from './Home.module.css'
import Card from '../components/Card/Card'
import Button from '../components/Button/Button'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const props = {
    logo: "hand",
    heading: "Welcome to Talkhouse",

  }
  window.addEventListener('keydown', (e) => {
    return e.key === "Enter" ? navigate("/auth") : ""
  }
  )

  const navigate = useNavigate();
  // const isAuth = useSelector((state) => state.isAuth);
  // const { isActive } = useSelector((state) => state.user);

  return (
    <div className='cardWrapper'>
      <Card props={props}>
        <div className={`${style.peragraphWrapper}  noSelect`}>
          <p>Hello ,Dear Sir/Madem</p>
          <p>
            My name is Sourbh and i am a full stack web developer. This is my college Project .Try it and please give your feedback...</p>
        </div>
        <Link to="/auth" >
          <Button text="Let's go" logo="arrow" />
        </Link>

      </Card>
    </div>

  )
}

export default Home
