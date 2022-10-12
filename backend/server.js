const express = require('express');
const cors = require('cors');
const path = require('path');
require("./Database/Connection/dbconnect");
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const port = process.env.PORT || 5000;
app.use(express.json({ limit: "10mb" }));
require("dotenv").config();
const options = {
    origin: [`${process.env.FRONTEND_URL}`], 
    credentials: true,
} 
app.use(cors(options));
const Router = require('./Routes/Router');
app.set({ 'Content-type': 'application/json' });
const StorageStatic = path.join(__dirname, "Storage")
app.use("/Storage", express.static(StorageStatic))

app.use('/', Router);
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: options
});
require('./Sockets/sockets')(io);
 
    app.use(express.static('./build'));
    app.get("*", (req, resp) => {
        resp.sendFile(path.join(__dirname, "build/index.html"));
    });  
 

server.listen(port, (err) => {
    console.log(`Listening in ${port}`);
})
