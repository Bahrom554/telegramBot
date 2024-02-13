
const dataService = require('../usecases/data');

exports.users = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const search = req.query.search || null;
        res.json(await dataService.getUsers(page, limit, search))
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        next(err);
    }
}

exports.messages = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const search = req.query.search || null;
        res.json(await dataService.geMessages(page, limit, search))
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        next(err);
    }
}

exports.saveAndSend = async(req, res, next)=>{

    try {
        let files = req.files || null;
        let bot = req.app.get('bot');
        await dataService.saveAndSend(req.body, files, bot);
        res.send("ok");
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        next(err);
    }
}