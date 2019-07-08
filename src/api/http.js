import axios from 'axios'
import qs from 'qs'
import handleErrorStatus from './error-handle'
import {
  timeout,
  baseURL,
  enableCookieWhenCross,
  requestHeader,
} from './config'

const { CancelToken } = axios

const fetchingList = Object.create(null)
const requestCancelArray = []

/**
 * @description axios global config
 */
axios.defaults.baseURL = baseURL
axios.defaults.timeout = timeout
axios.defaults.headers = requestHeader
axios.defaults.withCredentials = enableCookieWhenCross

/**
 * @description 发起请求之前进行拦截，做一些处理
 */
axios.interceptors.request.use(
  (config) => {
    // 取消掉当前正在进行的相同 url 请求
    if (requestCancelArray.length) { cancelRequest() }

    return config
  },
  error => Promise.reject(error),
);

/**
 * @description 拦截响应，对异常状态码统一处理
 */
axios.interceptors.response.use(
  // 默认 200 - 300 之间的状态码执行 fulFilled 函数
  response => response,
  (error) => {
    // 被手动取消的响应没有 response
    if (error.response) {
      handleErrorStatus(error.response.status)
    }

    return Promise.reject(error)
  },
);

/**
 * @description 取消重复的 http 请求
 */
const cancelRequest = () => {
  // 自定义取消信息
  const message = {
    type: 'timeout',
    result: 'request cancel by user',
  }

  requestCancelArray.forEach((canCelFunc) => {
    canCelFunc(message);
  })
  requestCancelArray.length = 0
};

/**
 * @description 生成 http 请求的 Cancel Token
 * @param url `http`请求的url
 * @return {{cancel: *, cancelToken: CancelToken}}
 */
const genCancelToken = (url) => {
  let cancel = null;
  // 生成取消的 token
  const cancelToken = new CancelToken((c) => {
    if (Reflect.has(fetchingList, url)) {
      requestCancelArray.push(fetchingList[url]);
    }
    cancel = c
    fetchingList[url] = c
  });

  return {
    cancel,
    cancelToken,
  };
};

const base = (url, method, params = {}) => {
  const transform = {
    url,
    method,
    ...params,
    ...genCancelToken(url),
  };

  return axios(transform)
    .then(response => response.data)
    .catch(error => Promise.reject(error));
};

const methodWithData = method => (api, params) => {
  let filterParams

  if (params) {
    filterParams = {
      data: params,
    }
  }

  return base(api, method, filterParams)
};

const methodNoData = method => (api, params) => {
  const filterApi = params ? `${api}?${qs.stringify(params)}` : api

  return base(filterApi, method)
};

const createHTTPRequest = {
  ...['post', 'put', 'patch'].reduce((obj, el) => {
    obj[el] = methodWithData(el)
    return obj
  }, {}),
  ...['get', 'delete', 'head', 'options'].reduce((obj, el) => {
    obj[el] = methodNoData(el)
    return obj
  }, {}),
};

export default createHTTPRequest
