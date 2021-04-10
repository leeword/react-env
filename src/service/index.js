import {
  adapter,
  printLogger,
  handleURLPrefix,
  addCrossSiteToken,
  handleResponseError,
} from './middleware';
import {
  compose,
  optionDefaulter,
} from './helper';

const middleware = [
  printLogger,
  handleURLPrefix,
  addCrossSiteToken,
  handleResponseError,
].concat(adapter);

const invoker = compose(middleware);

/**
 * @description 数据请求方法
 * @param {string} api 请求路径
 * @param {Object} [options] 请求
 * @param {Object} [options.headers] 为本次请求定义请求头
 * @param {Object} [options.fetchOptions] fetch 请求的参数, 可覆盖默认配置
 * @param {string} [options.method = 'GET'] 请求方法
 * @param {Object} [options.params] 请求参数或载荷
 * @param {string} [options.timeout = 10000] 请求超时时间(ms)
 * @param {'fetch'|'upload'|'download'} [options.type = 'fetch'] 请求类型
 * @param {string} [options.fileName] options.type = 'download' 指定下载文件名
 * @param {File|Object} [options.file] options.type = 'upload' 上传的文件对象 / { name: 'xxx', file: File }
 * @param {boolean} [options.ignoreError = false] 忽略响应错误
 * @param {Function} [options.validateStatus] 有效的http状态码：默认200-300
 * @returns {Promise}
 */
export default async function(api, options = {}) {
  const optWithDefault = optionDefaulter(options);
  const context = {
    url: api,
    ...optWithDefault,
  };

  const { body } = await invoker(context);

  return body;
}
