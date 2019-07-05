

/**
 * @description http 响应异常状态码处理
 * @param { number } code `http`响应状态码
 * @return { boolean } 是否是异常状态码
 */
const handleErrorStatus = (code) => {
  switch (code) {
    // case 401:
    //   logOut();
    //   break;
    default:
      return false;
  }
};

export default handleErrorStatus;
