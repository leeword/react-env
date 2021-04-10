/**
 * 中间件示例:
 *
 * async function middleWareExample(ctx, next) {
 *   // 请求发起前做一些处理
 *   await next();
 *   // 收到响应后做一些处理
 * }
 */
import fetcher from './fetcher';
import uploader from './uploader';
import download from './download';

// 打印请求发起前后的信息
export async function printLogger(ctx, next) {
  const start = Date.now();
  // eslint-disable-next-line
  console.log(`<-- before ${ctx.method || 'GET'} ${ctx.url}`, ctx.query || '');

  await next();

  const duration = Date.now() - start;
  // eslint-disable-next-line
  console.log(`--> after ${ctx.method || 'GET'} ${ctx.url} %c${duration}ms`, 'color:#06C', ctx.body, ctx.query || '');
}

// 在响应头添加 csrf token
export async function addCrossSiteToken(ctx, next) {
  // TODO:

  await next();
}

// 处理 url 前缀, 如 mock 请求或真实请求
export async function handleURLPrefix(ctx, next) {
  // TODO:

  await next();
}

// 处理错误响应
export async function handleResponseError(ctx, next) {
  await next();

  // TODO:
}

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
