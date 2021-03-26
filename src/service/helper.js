export function noop() {}

/**
 * 验证http状态码是否在指定区间内
 *
 * @param {number} status http状态码
 * @returns {boolean}
 */
function validateStatus(status) {
  return status >= 200 && status < 300;
}

/**
 * 中间件执行方法
 *
 * @param {Function[]} middleware 中间件数组
 * @returns {Promise}
 */
export function compose(middleware) {
  if (!Array.isArray(middleware)) {
    throw new TypeError('middleware must be a Array');
  }

  return async function(context) {
    let index = 0;

    return (async function dispatch(i) {
      const fn = middleware[i];
      if (i === middleware.length) return context;

      if (typeof fn !== 'function') {
        throw new TypeError('each middleware must be a function!');
      }

      try {
        // eslint-disable-next-line
        return await fn.call(context, context, dispatch.bind(null, ++index)), context;
      } catch (error) {
        return Promise.reject(error);
      }
    }(index));
  }
}

export function optionDefaulter(option) {
  const shadowClone = { ...option };

  setDefaultVal(option, 'originUrl', option.url);
  setDefaultVal(option, 'timeout', 10000);
  setDefaultVal(option, 'query', option.params);
  setDefaultVal(option, 'method', 'GET');
  setDefaultVal(option, 'type', 'fetch');
  setDefaultVal(option, 'ignoreError', false);
  setDefaultVal(option, 'validateStatus', validateStatus);

  return shadowClone;
}

function setDefaultVal(option, key, defaultValue) {
  if (typeof defaultValue === 'function') {
    option[key] = defaultValue(option, key);
  } else {
    option[key] = option[key] || defaultValue;
  }
}

export function downloadFromURL(url, fileName) {
  return new Promise((resolve, reject) => {
    const filename = fileName || url.substr(url.lastIndexOf('/') + 1);

    const a = document.createElement('a');

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    resolve();
  });
}

function getHeaderFileName(response) {
  const disposition = ['Content-Disposition', 'content-disposition'].some(key => response.headers.get(key));
  if (!disposition) return null;

  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = filenameRegex.exec(disposition);

  if (matches !== null && matches[1]) {
    return matches[1].replace(/['"]/g, '');
  }

  return null;
}

export function downloadFromStream(blob, fileName, response) {
  let filename = fileName || 'download.txt';

  if (!fileName && response) {
    const name = getHeaderFileName(response);
    if (name) { filename = name; }
  }

  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    document.body.appendChild(a); // firfox need append the creation a link to body

    if (navigator.userAgent.indexOf('Firefox') > 0) {
      a.download = decodeURIComponent(escape(filename));
    } else {
      a.download = decodeURI(filename);
    }

    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
