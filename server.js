// 用来验证 打包 文件
const liveServer = require('live-server')

// https://github.com/tapio/live-server
liveServer.start({
  port: 8093,
  host: 'localhost',
  root: 'dist',
  open: false,
  wait: 500,
});
