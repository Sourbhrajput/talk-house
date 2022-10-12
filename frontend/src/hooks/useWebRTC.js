import { useEffect, useRef, useCallback } from "react";
import freeice from "freeice";
import { useStateWithCallBack } from "./useStateWithCallback";
import { ACTION } from "../ACTION";
import { initSocket } from "../Socket/initSocket";
import { useNavigate } from "react-router-dom";
import { setClientAsSpeaker, removeClientAsSpeaker } from "../Api/Api";
// import { addUser } from '../../Store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addMute, addIshandRaise } from "../Store/userSlice";




export const useWebRTC = (roomId, user, setClientFeature, setRoom, setShowHand) => {
  const [clients, setClients] = useStateWithCallBack([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef();
  const { mute: muteState } = useSelector((state) => state.user);
  const { ishandRaise: ishandRaiseState } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // add audio stream of every clients in userId
  const navigate = useNavigate();




  useEffect(() => {

    const init = async () => {
      // socket init
      socket.current = initSocket();
      await addMedia().then(() => {
        addNewClient({ ...user, mute: muteState, ishandRaise: ishandRaiseState }, () => {
          const media = audioElements.current[user._id]
          if (!media) return;
          media.volume = 0;
          media.srcObject = localMediaStream.current;
          const newUser = { ...user, mute: muteState };
          socket.current.on(ACTION.MUTE, setMute);
          socket.current.on(ACTION.HANDRAISE, setHandRaise);
          socket.current.on(ACTION.ADD_PEER, handelNewPeer)
          socket.current.on(ACTION.RELAY_ICE, addIceCandidate)
          socket.current.on(ACTION.RELAY_SDP, handelRemoteSDP);
          socket.current.on(ACTION.REMOVE_PEER, handelRemovePeer);
          socket.current.on(ACTION.REMOVE, removeme);
          socket.current.on(ACTION.MUTECLIENTAFTERREMOVE, muteClientAfterRemove)
          socket.current.on(ACTION.ADDROOM, setRoomAfterAddSpeaker);

          socket.current.emit(ACTION.JOIN, { user: newUser, roomId });

        })
      })


      // set mute

      const setMute = ({ isMute, clientId }) => {
        const index = clientsRef.current.map(client => client._id).indexOf(clientId);
        if (index > -1) {
          clientsRef.current[index].mute = isMute;
          setClients(clientsRef.current);
        }
      }


      // hanndel new peer

      const handelNewPeer = async ({ peerId, user: remoteUser, createOffer }) => {
        if (peerId in connections.current) {
          return console.log(`You are already connected with ${peerId} (${remoteUser.name})`);
        }
        connections.current[peerId] = new RTCPeerConnection({
          iceServers: freeice()
        });

        let userPeer = connections.current[peerId];


        //  handle on track 

        userPeer.ontrack = ({ streams: [remoteStream] }) => {


          addNewClient({ ...remoteUser }, () => {
            if (audioElements.current[remoteUser._id]) {
              audioElements.current[remoteUser._id].srcObject = remoteStream;
            }
            else {
              const interval = setInterval(() => {
                let isDone = false;
                if (audioElements.current[remoteUser._id]) {
                  audioElements.current[remoteUser._id].srcObject = remoteStream;
                  isDone = true;
                }
                if (isDone) {
                  clearInterval(interval);
                }
              }, 1000)
            }
          })
        }

        // Ice candidate

        userPeer.onicecandidate = (event) => {
          socket.current.emit(ACTION.RELAY_ICE, {
            peerId,
            iceCandidate: event.candidate

          })
        }

        //  add local track in  remote connection 

        localMediaStream.current.getTracks().forEach(track => {
          userPeer.addTrack(track, localMediaStream.current)
        })

        if (createOffer) {
          const offer = await userPeer.createOffer();
          userPeer.setLocalDescription(offer);

          socket.current.emit(ACTION.RELAY_SDP,
            {
              peerId,
              sessionDescription: offer

            }
          )
        }


      }

      //  add ice candidate

      const addIceCandidate = ({ peerId, iceCandidate }) => {
        if (iceCandidate) {
          connections.current[peerId].addIceCandidate(iceCandidate);
        }
      }

      // add session description

      const handelRemoteSDP = async ({ peerId, sessionDescription }) => {
        if (sessionDescription) {
          connections.current[peerId].setRemoteDescription(
            new RTCSessionDescription(sessionDescription)
          );
        }
        //  if session description is type of offer then create answer

        if (sessionDescription.type === "offer") {
          const connection = connections.current[peerId];
          const answer = await connection.createAnswer();
          connection.setLocalDescription(answer);
          socket.current.emit(ACTION.RELAY_SDP,
            {
              peerId,
              sessionDescription: answer

            }
          )

        }

      }


      // delete client detail after remove

      const handelRemovePeer = async ({ peerId, userId }) => {
        if (connections.current[peerId]) {
          connections.current[peerId].close();
        }

        delete connections.current.peerId;
        delete audioElements.current.userId;
        setClients(list => list.filter((client) => client._id !== userId))
      }
      // leave from room when owner left me 
      const removeme = ({ clientId }) => {
        if (clientId === user._id) {
          navigate('/rooms')
        }
        setClientFeature(false);

      }
      // mute after remove by owner as speaker
      const muteClientAfterRemove = ({ userId }) => {
        if (userId === user._id) {
          localMediaStream.current.getTracks()[0].enabled = false;
        }
        socket.current.emit(ACTION.MUTE, { isMute: true, roomId, clientId: userId });
      }
      // set room after add speaker
      const setRoomAfterAddSpeaker = ({ room }) => { setRoom(room) }

      // set ishandraise

      const setHandRaise = ({ ishandRaise, clientId }) => {
        const index = clientsRef.current.map(client => client._id).indexOf(clientId);
        if (index > -1) {
          clientsRef.current[index].ishandRaise = ishandRaise;
          setClients(clientsRef.current);
        }
      }


      // add media 
      async function addMedia() {
        const media = await navigator.mediaDevices.getUserMedia({
          audio: true
        })
        localMediaStream.current = media;
      }

    }

    init();

    return () => {
      if (localMediaStream.current)
        localMediaStream.current.getTracks().forEach(track => track.stop());
      dispatch(addMute(true));
      socket.current.emit(ACTION.LEAVE, { roomId });
      socket.current.off(ACTION.HANDRAISE);
      socket.current.off(ACTION.MUTE);
      socket.current.off(ACTION.ADD_PEER);
      socket.current.off(ACTION.RELAY_ICE);
      socket.current.off(ACTION.RELAY_SDP);
      socket.current.off(ACTION.REMOVE_PEER);
      socket.current.off(ACTION.REMOVE);
      socket.current.off(ACTION.MUTECLIENTAFTERREMOVE);
      socket.current.off(ACTION.ADDROOM);


    }
  }, [])




  // adding new client

  const addNewClient = useCallback(
    (newClient, cb) => {
      const isAvailable = clients.find(client => client._id === newClient._id)
      if (isAvailable === undefined) {
        setClients((prev) => {
          return [...prev, newClient];
        }, cb)
      }
    },
    [clients, setClients],
  )

  //  add audio element for all clients

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };


  // mute the client

  const mute = (isMute, roomId, clientId) => {
    let check = false;

    if (localMediaStream.current) {
      localMediaStream.current.getTracks()[0].enabled = !isMute;
      check = true;
      dispatch(addMute(isMute));
      socket.current.emit(ACTION.MUTE, { isMute, roomId, clientId });

    }
    else {

      const interval = setInterval(() => {
        if (localMediaStream.current) {
          localMediaStream.current.getTracks()[0].enabled = !isMute;
          check = true;
          dispatch(addMute(isMute));
          socket.current.emit(ACTION.MUTE, { isMute, roomId, clientId });

        }
        if (check) {
          clearInterval(interval);
        }
      }, 200);

    }
  }



  // add hand raise

  const handRaise = (ishandRaise, roomId, clientId) => {
    dispatch(addIshandRaise(ishandRaise));
    socket.current.emit(ACTION.HANDRAISE, { ishandRaise, roomId, clientId });
  }


  //  ref for store clients

  const clientsRef = useRef();

  useEffect(() => {
    clientsRef.current = [...clients];
  }, [clients])





  // leave client 

  const leaveClient = (roomId, clientId) => {
    socket.current.emit(ACTION.REMOVE, { roomId, clientId })
  }

  // set client as  speaker by owner

  const setSpeaker = async (roomId, userId) => {
    const response = await setClientAsSpeaker({ roomId, userId });
    setClientFeature((pre => !pre))
    if (!response.error) {
      socket.current.emit(ACTION.HANDRAISE, { ishandRaise: false, roomId, clientId: userId });
      socket.current.emit(ACTION.ADDROOM, { room: response.data.room, roomId, })

    }


  }


  // removed client as speaker by owner

  const removeSpeaker = async (roomId, userId) => {
    const response = await removeClientAsSpeaker({ roomId, userId });
    setClientFeature((pre => !pre))
    if (!response.error) {
      socket.current.emit(ACTION.MUTECLIENTAFTERREMOVE, { roomId, userId });
      socket.current.emit(ACTION.ADDROOM, { room: response.data.room, roomId })

    }

  }


  return { clients, provideRef, mute, leaveClient, setSpeaker, removeSpeaker, handRaise };

}