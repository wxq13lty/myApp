/**
 * suucess: true/false,
 * message: '提示信息',
 * data: '数据'
 * @returns {Object}
 * */
function createMessage(success, message, data = null,code) {
    return {
        success,
        message,
        data,
        code
    };
}
module.exports = {
    createMessage
};