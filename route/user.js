const express = require('express');
const router = express.Router();
const upload = require('../http/middlewares/multer');
const validatorMiddleware = require('../http/middlewares/validator');
const dataValidator=require("../http/validation/user");



const dataController = require('../http/controller/dataController');
router.get('/messages',dataController.messages);
router.get('/users', dataController.users);
router.post('/send',upload.array("file"), validatorMiddleware(dataValidator.data), dataController.saveAndSend);


module.exports = router;