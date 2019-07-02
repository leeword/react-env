/**
 * 
 * @description 包装 async 函数
 * @param { Function } asyncFunc 异步请求函数
 * @returns { Array }
 */
export async function asyncCapture(asyncFunc, ...rest) {
    try {
        let response = await asyncFunc(...rest);

        return [null, response]
    } catch (error) {
        return [error, null]
    }
}
