/**
 * suucess: true/false,
 * message: '提示信息',
 * data: '数据'
 * @returns {Object}
 * */
function createMessage(success, message, data = null,code = 200) {
    // 判断data是不是一个数组 并且 data从原型上是一个对象
    let newData = []
    let SymbolObj  ={};
    let obj = {}
    if (!Array.isArray(data) && data && data.constructor === Object) {
        // 如果不是可迭代对象
        if (!(Symbol.iterator in Object(data))){
            SymbolObj = {
                [Symbol.iterator]: function* () {
                    for (const key in data) {
                        const value = data[key];
                        yield{key,value}
                    }
                }
            }
            // 遍历 SymbolObj ，如果是对象 存储到 obj中 如果是数组 存储到 newData中
            // 遍历 SymbolObj
            for (const value of SymbolObj) {
                if (value && value.constructor === Object) {
                    obj[value.key] = value.value;
                }else {
                    newData.push(value.value);
                }
            }
        }else {
            newData = data;
        }
    }else {
        newData = data;
    }
    return {
        code,
        success,
        message,
        data:newData,
        ...obj,
    };
}
module.exports = {
    createMessage
};