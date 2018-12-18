# hc-vue
`Vue` 组件整理，基于 [element-ui](http://element-cn.eleme.io/#/zh-CN "element-ui") 的基础上, 进行了一些扩展。
## 扩展模块
1. 全局 `ProgressBar`
类似于 `Github` 在进行加载的时候，顶部出现的进度条。
2. `ajax`
使用自己封装的 [axreq](https://www.npmjs.com/package/axreq "axreq") 进行 `ajax` 请求。
    > 后续可能会考虑使用 [ES6-Promise](https://github.com/stefanpenner/es6-promise "ES6-Promise") + [fetch](https://github.com/github/fetch "fetch") 进行替换

## 使用
由于现阶段因为整理的组件比较少，所以没有进行打包，无法直接在浏览器中使用，只能通过 `Vue` + `Webpack` 的方式配合使用。详细文档：
