const express = require('express');
const path = require('path');
const fs = require('fs');
const DatabaseConfig = require('./config/database')();
const AppConfiguration = require('./config/app')();
const cors = require('cors');
const http = require('http');
const CONST = require('./bot/utils/constants');
const dir = CONST.defaults.UPLOAD_DIR;
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false, limit: '50mb'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/send',(req,res,next)=>{


botManager.sendPhoto(req.query.command, req.query.text,(error)=>{
    if(error){
        console.log("error", error)
    }else{
        console.log("done");
    }
});

    res.json({msg:"ok"});
})
const server = http.createServer(app);
const botManager = new (require('./bot/botManager'));
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});

server.listen(AppConfiguration.appPort, async function () {
console.log(`We are running on port ${AppConfiguration.appPort}!`);
})

