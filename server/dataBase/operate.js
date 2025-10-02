const Model = require('./utils');
const message = require('../utils/message');
const operate = new Model('operate');
const initTime = require('../utils/initTIme');
const setRecord = async (uid, api, des) => {
    try {
        await operate.data({
            userId: uid,
            api,
            des,
            creattime: new Date().getTime()
        }).insert();
    } catch (err) {
        // 记录失败不影响主流程，但可根据需要打印日志
        console.error('setRecord error:', err);
    }
}
const getRecord = async (uid, pageSize = 10, page = 1) => {
    if (!uid) {
        return message.createMessage(false, '未查到用户', null, 400);
    }
    try {
        await setRecord(uid, '/getRecord', '获取操作记录');
    } catch (err) {
        // 记录失败不影响查询
        console.error('setRecord error:', err);
    }
    let res, total;
    try {
        // 获取总数
        total = await operate.where({ userId: uid }).count();
        // 分页查询
        res = await operate.where({ userId: uid })
            .order('creattime DESC')
            .limit((page - 1) * pageSize, pageSize)
            .select();
    } catch (err) {
        console.log(err)
        return message.createMessage(false, '查询操作记录失败', null, 500);
    }
    if (!res || res.length === 0) {
        return message.createMessage(false, '暂无操作记录', { total: 0, list: [] }, 200);
    }
    // 字段命名统一，creattime -> createTime
    console.log(res)
    const list = res.map(element => {
        const item = { ...element };
        if (item.creattime) {
            item.creattime = initTime(Number(item.creattime));
            delete item.creattime;
        }
        delete item.api;
        return item;
    });
    return message.createMessage(true, '获取成功', { total, list });
}
module.exports = {
    setRecord,
    getRecord
};