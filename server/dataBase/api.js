const Model = require('./utils');
const message = require('../utils/message');
const { createToken } = require('../utils/tokenJwt');
const name = new Model('name');
const tokenModel = new Model('token');
const crypto = require('crypto');
const operateModel = require('./operate');
// 登录
const login = async (username, password) => {
    // 密码加密
    password = crypto.createHash('sha256').update(password).digest('hex');
    const res = await name.where({ username, password }).select();
    const data = res[0];
    if (data) {
        delete data.password;
        data.loginTime = new Date().getTime();
        const result = await tokenModel.where({ userId: data.id }).select();
        // 如果存在并且未过期，则更新token和时间，否则插入新记录
        const endtime = result[0] ? result[0].entime : 0;
        if (result[0] && endtime > data.loginTime) {
            data.token = result[0].token;
            await tokenModel.where({ userId: data.id }).data({
                time: data.loginTime,
                entime: data.loginTime + 24 * 60 * 60 * 1000 // 设置为24小时后过期 
            }).update();
        } else {
            data.token = await createToken({
                name: data.username,
                id: data.id,
                date: data.loginTime
            });
            await tokenModel.where({ userId: data.id }).data({
                userId: data.id,
                token: data.token,
                time: data.loginTime,
                entime: data.loginTime + 24 * 60 * 60 * 1000 // 设置为24小时后过期 
            }).insert();
        }
        operateModel.setRecord(data.id,'/login','用户登录');
        return message.createMessage(true, '登录成功', data);
    } else {
        return message.createMessage(false, '用户名或密码错误', null, 400);
    }
};

// 注册
const register = async ({
    username,
    password,
    phone,
    email,
    avatar = '',
    nickname = ''
}) => {
    // 检查用户名是否已存在
    if (!username || !password) {
        return message.createMessage(false, '用户名或密码不能为空', null, 400);
    }
    // 用户名长度
    if (username.length < 3 || username.length > 20) {
        return message.createMessage(false, '用户名长度应在3到20个字符之间', null, 400);
    }
    // 密码长度
    if (password.length < 6) {
        return message.createMessage(false, '密码长度应至少为6个字符', null, 400);
    }
    const existingUser = await name.where({ username }).find();
    if (existingUser) {
        return message.createMessage(false, '用户名已存在', null, 400);
    }
    // 密码加密
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    await name.data({
        username,
        password: hashedPassword,
        phone,
        email,
        avatar,
        nickname,
        creattime: new Date().getTime()
    }).insert();
    operateModel.setRecord(existingUser.id,'/register','用户注册');
    return message.createMessage(true, '注册成功', null);
}
// 更新
const updateUser = async ({
    id,
    phone,
    email,
    avatar,
    nickname,
    password
}) => {
    if (!id) {
        return message.createMessage(false, '用户信息不能为空', null, 400);
    }
    const user = await name.where({ id }).find();
    if (!user) {
        return message.createMessage(false, '用户不存在', null, 400);
    }
    const updatedData = { phone, email, avatar, nickname };
    // 如果提供了新密码，则更新密码（同样进行加密）
    if (password) {
        updatedData.password = crypto.createHash('sha256').update(password).digest('hex');
    }
    const data = {
        phone: phone || user.phone,
        email: email || user.email,
        avatar: avatar || user.avatar,
        nickname: nickname || user.nickname,
        password: updatedData.password || user.password,
        updatetime: new Date().getTime()
    };
    await name.where({ id }).data(data).update();
    let updateDesc = '更新用户信息, ';
    if(user.phone !== data.phone){
        updateDesc += `电话：${user.phone} -> ${data.phone || user.phone},\r\n`;
    }
    if(user.email !== data.email){
        updateDesc += `邮箱：${user.email} -> ${data.email || user.email},\r\n`;
    }
    if(user.avatar !== data.avatar){
        updateDesc += `头像：${user.avatar} -> ${data.avatar || user.avatar},\r\n`;
    }
    if(user.nickname !== data.nickname){
        updateDesc += `昵称：${user.nickname} -> ${data.nickname || user.nickname},\r\n`;
    }
    if(user.name !== data.name){
        updateDesc += `用户名：${user.name} -> ${data.name || user.name},\r\n`;
    }
    if(user.password !== data.password){
        updateDesc += `更新密码,\r\n`;
    }
    // 记录变更内容
    operateModel.setRecord(id,'/updateUser',updateDesc);
    return message.createMessage(true, '更新成功', null);
}

module.exports = {
    login,
    register,
    updateUser
};
