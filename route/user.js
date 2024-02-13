const express = require('express');
const router = express.Router();
const upload = require('../http/middlewares/multer');

const dataController = require('../http/controller/dataController');
router.get('/messages',dataController.messages);
router.get('/users', dataController.users);
router.post('/message',upload.array("file"), dataController.saveAndSend);


module.exports = router;