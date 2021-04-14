/**
 * 使用 Promise 包裹 setTimeout
 * 如果时间超过`delay`ms，Promise 状态将`rejected`
 *
 * @param {number} delay 超时时间(ms)
 * @returns {Promise}
 */
function timeout(url, delay = 10000) {
  return new Promise((r, reject) => {
    setTimeout(() => {
      reject(
        new Error(`[Request]: ${url} has been timeout after ${delay}ms`),
      );
    }, delay);
  });
}

/**
 * 带有超时机制的`fetch`请求
 *
 * @param {string} url 要获取资源的 URL
 * @param {Object} options fetch 请求参数
 * @returns {Promise}
 */
function fetchWithTimeout(url, options = {}) {
  const { timeout: delay, ...fetchOptions } = options;

  return Promise.race(
    fetch(
      url,
      fetchOptions,
    ),
    timeout(url, delay),
  );
}

/**
 * 序列化`url query`
 *
 * @param {Object} reqPara key/value 键值对
 * @returns {string}
 */
function formatParam(reqPara = {}) {
  return Object.entries(reqPara)
    .map((entry) => {
      const [key, value] = entry;

      return `${key}=${value}`;
    })
    .join('&');
}

/**
 * 获取 fetcher 参数
 *
 * @param {Object} ctx 上下文对象
 * @returns {Object}
 */
function getOptions(ctx) {
  const {
    url,
    method = 'GET',
    timeout: delay,
    headers = {},
    query,
    payload,
    fetchOptions = {},
  } = ctx;
  const upperMethod = method.toUpperCase();
  const params = payload || query || null;
  const dataMethods = ['PUT', 'POST', 'PATCH'].includes(upperMethod);

  const options = {
    method: upperMethod,
    mode: 'cors',
    headers,
    timeout: delay,
    credentials: 'include',
    ...(fetchOptions),
  };
  if (dataMethods && params) {
    if (params instanceof FormData) {
      options.body = params;
    } else {
      options.headers['Content-Type'] = 'application/json;charset=UTF-8';
      options.body = JSON.stringify(params);
    }
  }
  // `post`请求也可能有`query string`
  const slash = url.includes('?') ? '&' : '?';
  options.url = (query && !payload) ? `${url}${slash}${formatParam(query)}` : url;

  return options;
}

export default async function(ctx) {
  const { url, options } = getOptions(ctx);
  const { parseResponse = true, validateStatus } = ctx;

  try {
    const res = await fetchWithTimeout(url, options);

    if (!validateStatus(res.status)) {
      throw new Error(`[Request]: ${url} failed with status code ${res.status}!`);
    }

    ctx.response = res;
    // 不解析 http 响应
    if (!parseResponse) { return ctx }

    ctx.body = await res.json();

    return ctx;
  } catch (error) {
    // 继续向上抛出错误
    throw new Error(`[Request]: ${url} 请求异常，请稍后再试。`);
  }
}
