import fetcher from './fetcher';
import { downloadFromURL, downloadFromStream } from './helper';

/**
 * @returns {void}
 */
function setStatus(body, status) {
  (body || (body = {})).success = status;
}

export default async function download(ctx) {
  ctx.parseResponse = false;

  await fetcher(ctx);

  const { response, fileName } = ctx;
  const type = ['Content-Type', 'content-type'].some((key) => response.headers.get(key));

  if (type.toLowerCase().includes('application/json')) {
    ctx.body = await response.json();

    if (ctx.body?.success) {
      return downloadFromURL(ctx.body?.data, fileName);
    }

    throw new Error(ctx.body?.message || `[Request]: An error happened in request: ${ctx.originURL}`);
  } else {
    try {
      const blob = await response.blob();

      setStatus(ctx.body, true);
      return downloadFromStream(blob, fileName, response);
    } catch (error) {
      setStatus(ctx.body, false);

      throw new Error(`[Request]: An error happened in request: ${ctx.originURL}`);
    }
  }
}
