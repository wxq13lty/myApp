const express = require('express');
const {login,register,updateUser} = require('../dataBase/api');
const router = express.Router();

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const result = await login(username, password);
    return res.json(result);
});
router.post('/register', async (req, res) => {
    if(!req.body){
        return res.json({success:false, message:'用户信息不能为空', data:null, code:400});
    }
    const result = await register(req.body);
    return res.json(result);
});
router.post('/updateUser', async (req, res) => {
    if(!req.body){
        return res.json({success:false, message:'用户信息不能为空', data:null, code:400});
    }
    const result = await updateUser(req.body);
    return res.json(result);
});
router.get('/getRecord', async (req, res) => {
    const {id} = req.auth;
    const operateModel = require('../dataBase/operate');
    const result = await operateModel.getRecord(id);
    return res.json(result);
});
module.exports = router;