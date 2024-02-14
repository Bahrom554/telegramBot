const express = require('express');
const path = require('path');
const fs = require('fs');
const DatabaseConfig = require('./config/database')();
const AppConfiguration = require('./config/app')();
const cors = require('cors');
const http = require('http');
const CONST = require('./utils/constants');
const dir = CONST.defaults.UPLOAD_DIR;
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false, limit: '50mb'}));
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const userRoute = require('./route/user');
const botManager = new (require('./bot/botManager'));
app.use('/',userRoute);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});
mongoose.set("strictQuery", false);
mongoose.connect(`mongodb://${DatabaseConfig.dbHost}:${DatabaseConfig.dbPort}/${DatabaseConfig.dbName}`, {
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(function (db) {
    server.listen(AppConfiguration.appPort, async function () {

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }

        console.log(`We are running on port ${AppConfiguration.appPort}!`);
    })
}).catch(function (reason) {
    console.error(reason);
});

