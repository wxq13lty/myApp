const User = require('../dataBase/user');
const express = require('express');
const router = express.Router();
const user = new User();

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    console.log('Login request:', {username, password}); // 调试日
    const result = await user.login(username, password);
    console.log('Login result:', result); // 调试日志
    res.json(result);
    // 添加响应后日志
    console.log('Response sent');
});
module.exports = router;