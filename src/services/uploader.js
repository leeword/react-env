import fetcher from './fetcher';

/**
 * 文件上传
 *
 * @param {option} ctx 上下文对象
 * @param {Object} [ctx.query] 查询字符串
 * @param {File|Object} ctx.file 上传File对象, 或指定上传的name：{ name: 'xxx', file: File }
 * @returns {Promise}
 */
export default async function uploader(ctx) {
  const { query = {}, file, ...rest } = ctx;
  const formData = new FormData();

  if (file instanceof Blob) {
    formData.append('file', file, file.name);
  } else {
    formData.append(file.name, file.file);
  }

  Object.entries(query).forEach(([key, value]) => formData.append(key, value));

  return fetcher({
    method: 'POST',
    payload: formData,
    ...rest,
  });
}
