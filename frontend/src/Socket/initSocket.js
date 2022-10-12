import { env } from '../env'
import io from "socket.io-client";


export const initSocket = () => {
   const options = {
      'force new connection': true,
      reconnectionAttempt: "Infinity",
      timeout: 10000,
      transports: ['websocket']
   }

   return  io(env.backend, options);
}