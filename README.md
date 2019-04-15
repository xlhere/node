# 总结

## bug总结

1. 引用静态资源的时候，node_modules 的别名复制上一条没有修改导致样式加载不出来
```app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))```
2. 一些包使用新版本导致样式很奇怪，复制培训老师的package.json文件 然后npm i 安装相关包

## 知识点

1. 持久化session存储
2. 默认session数据是内存存储的，服务器一旦重启就会丢失，真正的生产环境会把session进行持久化存储
3. 浏览器记忆功能
4. 表单同步提交和异步提交
5. web的本质——字符串交互