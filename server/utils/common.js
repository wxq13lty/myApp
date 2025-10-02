const initTime = (time) => {
    // 年月日 时分秒
    const date = new Date(time);
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
}
/**
 *验证手机号
 * @param {String} phone
 * */
const checkPhone = (phone) => {
    return /^1[3456789]\d{9}$/.test(phone);
}
module.exports = {
    initTime,
    checkPhone
};