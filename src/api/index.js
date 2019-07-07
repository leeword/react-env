import createHTTPRequest from './http'

/**
 * 
 * @description async await 统一捕获异常
 */
async function asyncCapture(api, method = 'get', params) {
  try {
      method = method.toLowerCase()
      let response = await createHTTPRequest[method](api, params);

      return [null, response]
  } catch (error) {
      return [error, null]
  }
}

// example
export const example = () => {
  const api = ''
  const params = {}
  const method = 'get'

  return asyncCapture(api, method, params)
}
