import { SILENT_LEVEL } from '@/const';

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

  return async function (context) {
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
    })(index);
  };
}

class OptionDefaulter {
  constructor(options = {}) {
    this.options = Object.assign({}, options);
  }

  get() {
    return this.options;
  }

  set(key, defaultValue) {
    if (typeof defaultValue === 'function') {
      this.options[key] = defaultValue(this.options, key);
    } else {
      this.options[key] = this.options[key] || defaultValue;
    }

    return this;
  }
}

export function setDefault(options) {
  const defaulter = new OptionDefaulter(options);

  defaulter
    .set('originURL', options.url)
    .set('timeout', 10000)
    .set('query', options.params)
    .set('method', 'GET')
    .set('type', 'fetch')
    .set('headers', {})
    .set('ignoreError', false)
    .set('validateStatus', () => validateStatus);

  return defaulter.get();
}

/**
 * 简易 log 函数封装
 *
 * @returns {Object}
 */
export const log = (function logger() {
  // 这里参考 bootstrap 的色值分类
  // https://getbootstrap.com/docs/5.0/customize/color/
  const typeConfig = [
    { type: 'info', color: '#0dcaf0' },
    { type: 'success', color: '#198754' },
    { type: 'debug', color: '#6c757d' },
    { type: 'warn', color: '#ffc107' },
    { type: 'error', color: '#dc3545' },
  ];

  return typeConfig.reduce((result, el) => {
    const { type, color } = el;
    const silentLog = SILENT_LEVEL[type] || false;

    result[type] = silentLog
      ? noop
      : function logFunc(...msg) {
          /* eslint-disable no-console */
          console.log(`%c[${type.toUpperCase()}]: `, `color:${color};font-weight:bold;`, ...msg);
        };

    return result;
  }, Object.create(null));
})();

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
  const disposition = ['Content-Disposition', 'content-disposition'].some((key) => response.headers.get(key));
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
    if (name) {
      filename = name;
    }
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
