/**
 * 中间件示例:
 *
 * async function middleWareExample(ctx, next) {
 *   // 请求发起前做一些处理
 *   await next();
 *   // 收到响应后做一些处理
 * }
*/
import {
  getURLPrefix,
  getEnv,
} from '@/utils';
import fetcher from './fetcher';
import uploader from './uploader';
import download from './download';
import {
  log,
} from './helper';

// 打印请求发起前后的信息
export async function printLogger(ctx, next) {
  const start = Date.now();

  log.info(`START -> ${ctx.originURL} - ${ctx.method}`, ctx.query || '');
  await next();

  const duration = Date.now() - start;
  const method = ctx.body?.success ? 'info' : 'warning';

  log[method](`END -> ${ctx.originURL} - ${ctx.method} - ${duration}ms`, ctx.query || '', ctx.body);
}

// 在请求头添加 csrf token
export async function addCrossSiteToken(ctx, next) {
  const element = document.querySelector('input[name=csrf_token]');

  if (element?.value) {
    (ctx.headers || (ctx.headers = {})).csrf = element.value;
  }

  await next();
}

// 处理 url 前缀, 如 mock 请求或真实请求
export async function handleURLPrefix(ctx, next) {
  const slash = ctx.url.startsWith('/') ? '' : '/';

  if (process.env.USE_PROXY) {
    // 使用 dev-server 代理
    log.info(`use dev-server proxy`);
    ctx.url = `/proxy${slash}${ctx.url}`;
  } else {
    const currentEnv = getEnv();
    const prefix = getURLPrefix(currentEnv);
    ctx.url = `${prefix}${slash}${ctx.url}`;
  }

  await next();
}

// 处理错误响应
export async function handleResponseError(ctx, next) {
  try {
    await next();

    if (!ctx.body || ctx.body?.success === false) {
      throw new Error(ctx.body?.message || `[Request]: fail in request ${ctx.originURL}!`);
    }
  } catch (error) {
    log.error(error);
    // TODO: 使用 UI 组件提示用户错误信息

    if (!ctx.ignoreError) {
      throw error;
    }
  }
}

/**
 * 适配请求类型
 * 一个特殊的中间件
 */
export async function adapter(ctx, next) {
  if (ctx.type === 'upload') {
    await uploader(ctx);
  } else if (ctx.type === 'download') {
    await download(ctx);
  } else {
    await fetcher(ctx);
  }

  await next();
}
