const Router=require('express').Router();
const path = require('path');

const authentication = require('../Authentication/authentication');
const Activate=require('../Activate/Activate');
const  checkAccessToken =require("../Middleware/checkAccessToken");
const autoLogin = require('../Services/autoLogin');
const logout = require('../Services/logout');
const Rooms = require('../controlers/Rooms');

Router.post("/api/otpgenerate",authentication.otpGenerate);
Router.post("/api/otpauth",  authentication.otpAuth);   
Router.post("/api/activate",checkAccessToken,Activate.activateUser);
Router.post("/api/refresh",autoLogin.refreshToken);
Router.post("/api/logout",logout.logoutUser);
Router.post("/api/createroom",checkAccessToken,Rooms.createRoom);
Router.post("/api/getrooms",checkAccessToken,Rooms.getRooms);
Router.post("/api/singleroom",checkAccessToken,Rooms.singleRoom);
Router.post("/api/setClientAsSpeaker",checkAccessToken,Rooms.setClientAsSpeaker);
Router.post("/api/removeClientAsSpeaker",checkAccessToken,Rooms.removeClientAsSpeaker);
Router.post("/api/addtotal",checkAccessToken,Rooms.addTotal);
module.exports=Router;