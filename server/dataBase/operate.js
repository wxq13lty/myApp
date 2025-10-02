const Model = require('../dataBase/DBModel');
const {initTime} = require("../utils/common");
const {createMessage} = require("../utils/message");

class Operate extends Model {
    constructor() {
        super('operate');
    }

    /**
     * 日志
     * @param {Number|String} userId
     * @param {String} des
     * @param {String} api
     * @return Void
     * */
    async log(userId, api, des) {
        await this.insert({
            userId,
            des,
            api,
            creattime: new Date.now()
        })
    }

    /**
     * 获取日志
     * @param {Number|String} userId
     * @param {Number} page
     * @param {Number} pageSize
     * @return {Array}
     * */
    async getLog(userId, page, pageSize) {
        try {
            const rows = await this.where({userId}).order('creattime DESC').limit(page, pageSize).select();
            // 获取总条数
            const total = await this.where({userId}).count();
            // 遍历
            if (rows.length > 0) {
                rows.forEach(item => {
                    item.creattime = initTime(item.creattime);
                    // 删除api
                    delete item.api;
                });
                return createMessage(true, '获取成功', {
                    rows,
                    total,
                    page,
                    pageSize
                });
            }
            return createMessage(false, '暂无数据', []);
        } catch (e) {
            return createMessage(false, e.message, []);
        }
    }
}
module.exports = Operate;