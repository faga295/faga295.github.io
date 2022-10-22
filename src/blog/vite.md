# vite

## vite的特性

### 快

生产环境下，本地开发服务器使用的原生的`esmodule`，在打包`node_modules`中的`package`时用的`esbuild`(用go写的，速度很快)

### 开箱即用

vite很多配置都是预配置的，你甚至可以不用配置就能使用

### 插件

与rollup共享插件

## 插件

由于vite的打包用的是`rollup`,因此vite可以使用rollup的插件。在写插件的之前需要注意这个插件是不是没有用到vite独特的配置项，如果没有，那么你应该写的是一个`rollup`插件

### 常见的hooks

首先需要了解`hooks`这个概念，在`rollup`中打包分成好几个阶段，如图所示：

![image-20221022210247918](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/image-20221022210247918.png)

每一个阶段都可以理解成一个`hook`,我们可以在每一个`hook`对打包流程进行相应的处理。这个图可以理解为从入口文件出发，每个`import`的包都进行`resolveId`,然后`load`被resolve的包，`load`主要用于加载操作，可以是读取文件也可以是`virtual module`, load完成了之后，对其进行`transform`,`transform`是最常用的，用于对模块就行改写。

还有一部分`hooks`是在文件写入的时候进行的

比较常见的应该是`resolveImportMeta` , 是对`import.meta`的扩展，像vite中的`import.meta.env`,`import.meta.hot`都可以用`resolveImportMeta`实现

## try it

这个案例是`histoire`中`custom block`的实现

```typescript
  plugins.push({
    name: 'histoire-vue-docs-block',
    transform (code, id) {
      if (!id.includes('?vue&type=docs')) return
      if (!id.includes('lang.md')) return
      const file = id.substring(0, id.indexOf('?vue'))
      const html = md.render(code, {
        file,
      })
      return `export default Comp => {
        Comp.doc = ${JSON.stringify(html)}
      }`
    },
  })
```

虽然没有看过`vue sfc`插件的实现，但是大概能看出来，`vue sfc`会把`<docs></docs>`转换成`import`一个模块的方式,不然也能通过`transform`获取到。然后该模块的id大概是:原.vue文件的id加上`?vue&type=docs` 如果`custom block`是`<docs lang='md'></docs>`,那么还会加上`&lang.md`。

## hmr

