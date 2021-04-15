import { DAILY, PRE, PROD, MOCK } from '@/const';

export function getURLParam(key) {
  const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`);
  const search = window.location.search.substr(1);
  const value = search.match(reg);

  if (value !== null) {
    return decodeURIComponent(value[2]);
  }

  return null;
}

export function getEnv() {
  const { hostname } = window.location;
  const env = getURLParam('env');

  // 优先使用查询字符串里的标识判断环境
  if (env && [DAILY, PRE, PROD, MOCK].includes(env)) {
    return env;
  }
  /** 根据域名特征自动判断环境 */
  // localhost 默认 mock 环境
  if (isLocalhost()) return MOCK;
  // 域名里含有 daily、test 字段为沙盒环境
  if (/daily|test/.test(hostname)) return DAILY;
  // 域名里含有 pre 字段为预发环境
  if (/pre/.test(hostname)) return PRE;

  return PROD;
}

export function getURLPrefix(env) {
  // 配置不同环境 API 域名前缀
  const mapURL = {
    [DAILY]: '//xxxx.daily',
    [PRE]: '//xxxx.pre',
    [PROD]: '//xxxx.prod',
    [MOCK]: '//xxxx.mock',
  };

  return mapURL[env] || mapURL[PROD];
}

export function isLocalhost() {
  const { hostname } = window.location;

  return Boolean(
    hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );
}
