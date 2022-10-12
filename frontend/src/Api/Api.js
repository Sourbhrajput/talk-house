import axios from 'axios'
import { env } from '../env'


// import {addUser} from '../Store/userSlice';
// import  {useDispatch} from 'react-redux';

const api = axios.create({
     baseURL: env.backend,
     headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
     },
     withCredentials: true

});

export const sendOtp = (data) => api.post('/api/otpgenerate', data);
export const verifOtp = (data) => api.post('/api/otpauth', data);
export const activateUser = (data) => api.post('/api/activate', data);
export const autoLogin = () => api.post('/api/refresh');
export const logout = () => api.post('/api/logout');
export const createroom = (data) => api.post('/api/createroom', data);
export const getRooms = (data) => api.post('/api/getrooms', data);
export const singleroom = (data) => api.post('/api/singleroom', data);
export const setClientAsSpeaker = (data) => api.post('/api/setClientAsSpeaker', data);
export const removeClientAsSpeaker = (data) => api.post('/api/removeClientAsSpeaker', data);
export const addTotal = (data) => api.post('/api/addtotal', data);




api.interceptors.response.use(
     (response) => {
          return response;
     },
     async (err) => {
          const originalRequest = err.config;
          if (err.config && err.response.status === 401 && !originalRequest._isRetry) {
               originalRequest._isRetry = true;
               try {
                    await axios.post(`${env.backend}api/refresh`, "", {
                         withCredentials: true,
                         'Content-Type': 'application/json',

                    },);

 
               }
               catch (e) {
                    console.log(e);
               }

               return api.request(originalRequest);
          }
     }
)


export default api;