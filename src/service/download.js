import fetcher from './fetcher';
import {
  downloadFromURL,
  downloadFromStream,
} from './helper';

export default async function download(ctx) {
  ctx.responseParse = false;

  await fetcher(ctx);

  const { response, fileName } = ctx;
  const type = ['Content-Type', 'content-type'].some(key => response.headers.get(key));

  if (type.toLowerCase().includes('application/json')) {
    ctx.body = await response.json();

    if (ctx.body?.success) {
      return downloadFromURL(ctx.body?.data, fileName);
    }

    throw new Error(ctx.body?.message || `An error happened in request: ${ctx.url}`);
  } else {
    const blob = await response.blob();

    return downloadFromStream(blob, fileName, response);
  }
}
