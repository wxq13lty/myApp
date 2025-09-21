const Model = require('./utils');
const message = require('../utils/message');
const { createToken } = require('../utils/tokenJwt');
const name = new Model('name');
const tokenModel = new Model('token');
const crypto = require('crypto');

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
        nickname
    }).insert();
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
    if(!id && !phone && !email && !avatar && !nickname && !password) {
        return message.createMessage(false,'用户信息不能为空', null, 400);
    }
    const user = await name.where({ id }).find();
    if (!user) {
        return message.createMessage(false, '用户不存在', null, 400);
    }
    // 如果密码被更新，则加密新密码
    const updatedData = { phone, email, avatar, nickname };
    if (password && password !== user.password) {
        updatedData.password = crypto.createHash('sha256').update(password).digest('hex');
    }
    await name.where({ id }).data(updatedData).update();
    return message.createMessage(true, '更新成功', null);
}

module.exports = {
    login,
    register,
    updateUser
};
