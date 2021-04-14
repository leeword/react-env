/** START ----- 环境标识 */
// 沙盒环境
export const DAILY = 'daily';
// 预发环境
export const PRE = 'pre';
// 正式环境
export const PROD = 'prod';
// mock环境
export const MOCK = 'mock';
/** END ----- 环境标识 */

// 是否是生产环境
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 配置 console 显示
export const SILENT_LEVEL = {
  info: !IS_PRODUCTION,
  success: !IS_PRODUCTION,
  debug: !IS_PRODUCTION,
  warning: true,
  error: true,
};
