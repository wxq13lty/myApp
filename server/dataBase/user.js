const { Model } = require('../dataBase/DBModel');
const {Token} = require("../dataBase/token");
const {Operate} = require("../dataBase/operate");
const crypto = require('crypto');
const {createMessage} = require("../utils/message");
const {initTime, checkPhone} = require("../utils/common");
const token = new Token();
const operate = new Operate();
class User extends  Model{
    constructor() {
        super('user');
    }
    /**
     * 登录
     * post /login
     * @param {string} username 用户名
     * @param {string} password 密码
     * @returns {Object}
     * */
    async login(username, password) {
        try {
            // 加密密码
            password = crypto.createHash('sha256').update(password).digest('hex');
            // 查询用户
            const user = await this.where({username, password}).find();
            if (!user){
                return createMessage(false, '用户不存在', [], 400);
            }
            if (!user.username || !user.password){
                return createMessage(false, '用户名或密码错误', [], 400);
            }
            delete user.password;
            if (user.creattime){
                user.creattime = initTime(user.creattime);
            }
            if (user.updatetime){
                user.updatetime = initTime(user.updatetime);
            }
            // 添加 token
            const token = await token.getToken(user.id);
            await operate.log(user.id, '/login','登录')
            return createMessage(true, '登录成功', {
                token: token.token,
                user: user
            })
        }catch (e){
            return createMessage(false, e.message, [], 500);
        }
    }
    /**
     * 手机号登录
     * */
    async phoneLogin(phone,password) {
        try {
            if (!phone || !checkPhone( phone)){
                return createMessage(false, '手机号格式错误', [], 400);
            }
            if (!password){
                return createMessage(false, '密码不能为空', [], 400);
            }
            password = crypto.createHash('sha256').update(password).digest('hex');
            // 查询用户
            const user = await this.where({phone, password}).find();
            if (!user){
                return createMessage(false, '用户不存在', [], 400);
            }
            if (!user.phone){
                return createMessage(false, '手机号错误或密码错误', [], 400);
            }
            if (user.creattime){
                user.creattime = initTime(user.creattime);
            }
            if (user.updatetime){
                user.updatetime = initTime(user.updatetime);
            }
            delete user.password;
            // 添加 token
            const token = await token.getToken(user.id);
            await operate.log(user.id, '/phoneLogin','手机号登录')
        }catch (e) {
            return createMessage(false, e.message, [], 500);
        }
    }
    /**
     * 注册账号
     * */
}
module.exports = User;