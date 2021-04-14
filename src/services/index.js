import {
  adapter,
  printLogger,
  handleURLPrefix,
  addCrossSiteToken,
  handleResponseError,
} from './middleware';
import {
  compose,
  setDefault,
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
 * @param {Object} [options]
 * @param {Object} [options.headers] 定义请求头
 * @param {Object} [options.fetchOptions] fetch 请求的参数, 可覆盖默认配置
 * @param {string} [options.method = 'GET'] 请求方法
 * @param {Object} [options.params] 请求参数或荷载(推荐)
 * @param {'fetch'|'upload'|'download'} [options.type = 'fetch'] 请求类型
 * @param {string} [options.timeout = 10000] 请求超时时间(ms)
 * @param {string} [options.fileName] 当 options.type = 'download' 时指定下载文件名
 * @param {File|Object} [options.file] options.type = 'upload' 上传的文件对象 / { name: 'xxx', file: File }
 * @param {Object} [options.payload] 一般用于需要传递载荷, 同时`params`数据放在`query string`的场景
 * @param {boolean} [options.ignoreError = false] 忽略响应错误
 * @param {Function} [options.validateStatus] 有效的http状态码：默认200-300
 * @returns {Promise}
 */
export default async function(api, options = {}) {
  const opts = setDefault(options);
  const context = {
    url: api,
    ...opts,
  };

  const { body } = await invoker(context);

  return body;
}
