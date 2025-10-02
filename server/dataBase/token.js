const {Model} = require('../dataBase/DBModel');
const {createToken} = require('../utils/tokenJwt');

class Token extends Model {
    constructor() {
        super('token');
    }

    /**
     * 添加 token
     * @param {String} userId
     * @return {Object}
     * */
    async insertToken(userId) {
        const now = this.getCurrentTime(); //
        return this.insert({
            userId,
            token: createToken(userId),
            date: now,
            entime: now + 72 * 60 * 60 * 1000
        });
    }

    async getToken(userId) {
        const now = this.getCurrentTime();
        try {
            const condition = {
                userId,
                entime: {$gt: now - 72 * 60 * 60 * 1000}
            };

            const rows = await this.where(condition).select();
            if (rows.length > 0) {
                // 更新时应该使用相同的条件
                await this.where(condition).update({
                    token: createToken(userId),
                    date: now,
                    entime: now + 72 * 60 * 60 * 1000
                });
                return rows[0];
            }
            // 如果没有找到，应该插入新记录
            return await this.insertToken(userId);
        } catch (e) {
            console.error('getToken error:', e);
            return await this.insertToken(userId);
        }
    }
}
module.exports = Token;