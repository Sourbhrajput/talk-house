/* eslint-disable no-unreachable */
import React from 'react'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home';
import Navigavtion from './pages/Navigation/Navigavtion';
import Auth from './pages/Authentication/Auth/Auth';
import { Toaster } from 'react-hot-toast';
import Activate from './pages/Activate/Activate';
import Loading from './pages/Loading/Loading';
import Rooms from './pages/Rooms/Rooms';
import SingleRoom from './pages/SingleRoom/SingleRoom';




import "./App.css"
import { useSelector } from 'react-redux';
import { useAutoLogin } from './Api/autoLogin';

const App = () => {
     const { isAuth } = useSelector((state) => state.user);
     const { active } = useSelector((state) => state.user.user);
     //  isAuth=true;

     const checkActive = (Page) => {
          return isAuth && active ? <Page /> : <Navigate to="/activate" />
     }

     let loading = useAutoLogin();
     const setLoading = (type) => {
          loading = type;
     }
     if (loading)
          return <Loading />
     return (


          <BrowserRouter>
               <Toaster position="top-center "
                    toastOptions={{
                         success: {
                              theme: {
                                   primary: '#181717'
                              }
                         },
                         duration: 800,
                         style:
                         {
                              backgroundColor: "#181717",
                              color: "#fff"
                         }
                    }} containerClassName="toaster">


               </Toaster>

               <Navigavtion setLoading={setLoading} />
               <Routes>

                    <Route path="/" element={(!isAuth && !active) ? <Home /> : <Navigate to="/activate" />}> </Route>
                    <Route path="/auth" element={(!isAuth && !active) ? <Auth /> : <Navigate to="/activate" />}></Route>
                    <Route path="/activate" element={
                         (isAuth && !active) ?
                              <Activate /> : active ?
                                   <Navigate to="/rooms" />
                                   : <Navigate to="/auth" />
                    }
                    />

                    <Route path="/rooms" element={checkActive(Rooms)} />

                    <Route path="/room/:roomId" element={checkActive(SingleRoom)} />

                    <Route path="*" element={
                         (isAuth && !active) ?
                         <Navigate to="/activate" /> : active ?
                                   <Navigate to="/rooms" />
                                   : <Navigate to="/auth" />
                    }
                    />

               </Routes>
          </BrowserRouter>


     )





}


export default App;


