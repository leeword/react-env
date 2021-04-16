
# REACT-ENV

基于 `React` 和 `webpack` 搭建的模板仓库，提供快速初始化前端代码仓库的能力。

## 开始使用

```shell
yarn install
yarn dev
```

## 项目特色

- API 中间件模式

  洋葱模型的中间件模式，将每个**通用处理逻辑**抽象为一个函数，轻松管理 API 请求信息和响应数据，如在请求 `header` 添加`CSRF token`，或把错误响应提示给用户...使项目 api 层代码更加健壮易于维护扩展。

  1. 定义和使用中间件

     **src/service/middleware.js**定义一个中间件函数

     ```js
     // 增加一个中间件函数
     async function addMiddleWare(ctx, next) {
       // 请求发出之前执行
       // 对请求数据做一些处理

       // 调用 next 将控制权移交下一个中间件
       await next();

       // 收到响应数据后执行
       // 对响应数据做一些处理
     }
     ```

     在 **src/service/index.js** 里引入中间件

     ```js
     import {
       ...,
       addMiddleWare,
     } from './middleware';

     ...
     const middleware = [
       ...,
       testMiddleWare,
     ];
     ...
     ```

2. 发起 API 请求

   项目基础能力支持**普通的 `CRUD` 请求**，也内置了对**文件上传**、**下载**的支持，示例代码如下：

   ```js
   import request from '$src/service';
   import { DOWNLOAD, UPLOAD } from '$src/service/const';

   const APIS = {
     table: '/table/query',
     uploadFile: '/file/upload',
     tableDownload: '/table/download',
     chartDownload: '/chart/download',
   };

   // simple api request
   function queryTableData(params) {
     return request(APIS.table, {
       params,
     });
   }

   // 下载：通过 URL 路径下载文件
   function downloadTableData(params) {
     return request(APIS.tableDownload, {
       params,
       type: DOWNLOAD,
     });
   }

   // 下载：将服务端返回的 Stream 流解析并下载文件
   function downloadChartData(params) {
     return request(APIS.chartDownload, {
       params,
       method: 'POST',
       type: DOWNLOAD,
     });
   }

   // 上传：上传文件到服务端
   function uploadFileList(params) {
     return request(APIS.uploadFile, {
       params,
       method: 'POST',
       type: UPLOAD,
     });
   }
   ```


- eslint & prettier

  开发环境下 `eslint` 会检查代码语法，提前暴露出使用方式可能有问题代码，为工程质量保驾护航；

  提交时拦截 `git hooks` ，进行`prettier` 格式化&`eslint`检查，使团队代码风格保持一致；


- `git commit` 信息校验

  项目使用 [Angular commit 规范](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) 检测 `git commit` 内容，如书写不规范会被 `git hooks` 拦截掉本次提交。这么做有利于信息的规范性，通过提交类型(type)即可了解到每条 commit 大概做了哪方面工作，方便统计管理。

  提交信息示例：

  ​ `$ git commit -m "feat: 增加购物车功能"`
  ​ `$ git commit -m "fix: 修复弹框样式丢失"`

  > ##### 提交格式如下：
  >
  > ```
  > <type>(<scope>): <subject>
  > <BLANK LINE>
  > <body>
  > <BLANK LINE>
  > <footer>
  > ```
  >
  > 页眉的格式指定为提交类型(`type`)、作用域(`scope`，可选)和主题(`subject`)
  >
  > ##### 提交类型(type)
  >
  > 提交类型指定为下面其中一个：
  >
  > 1. `build`：对构建系统或者外部依赖项进行了修改
  > 2. `ci`：对 CI 配置文件或脚本进行了修改
  > 3. `docs`：对文档进行了修改
  > 4. `feat`：增加新的特征
  > 5. `fix`：修复`bug`
  > 6. `pref`：提高性能的代码更改
  > 7. `refactor`：既不是修复`bug`也不是添加特征的代码重构
  > 8. `style`：不影响代码含义的修改，比如空格、格式化、缺失的分号等
  > 9. `test`：增加确实的测试或者矫正已存在的测试


- PWA 离线支持

  借助 `service-worker` 的能力缓存前端静态资源，成功注册后即可**离线访问**，提升用户体验度。如有需要甚至可以缓存 api 数据，但这个场景必须谨慎设置**过期时间**。

## 未来计划

1. 封装工程相关内容并抽离仓库
2. TypeScript 支持
