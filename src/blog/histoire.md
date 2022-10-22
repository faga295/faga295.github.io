# 给histoire提pr的一次记录
[histoire](https://histoire.dev)相当于是vue版的`storybook`。

## issue
因为是在给`element-plus`写`histoire`文档的时候，发现如果给文本固定了颜色的话，那在变换背景颜色的时候会出现有一些背景颜色文本几乎和背景重合，因此我给`histoire`提了一个[issue](https://github.com/histoire-dev/histoire/issues/328),并且提出了三种解决方案,最终Akryum认可了我第三个方案，就是提供一个css变量，这个css变量代表和背景的反差色，会随着背景颜色的变化而变化

## histoire中值得学习的部分
![](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/20221022164802.png)
先来看一下`histoire`这个包,很神奇的事这个包只进行了类型校验，并没有对这个包进行打包也就是说，你去`node_modules`里去看这个包

![](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/20221022165828.png)

它是这个样子的，还是比较少见的。这个包主要用来提供`cli`，因此打不打包问题不大。

<hr>

由于我提的pr是一个`feature`,因此必须增加一系列的测试,测试做的是`end to end test`,`end to end test`相当于就是测试来帮你去做点点点的工作，用的是[cypress](https://cypress.io)

<hr>

包管理使用的`pnpm` 以及`monorepo` 这块我就不继续介绍了。

<hr>

接下来是`vue sfc`的`custom block`的实现

![image-20221022172113663](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/image-20221022172113663.png)

就是最下面的`<docs></docs>`, 想要支持`custom block` 需要添加插件，这个项目用的是`vite`。我的博客有一篇文章简单介绍了vite的插件。

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

以上就是`custom block`的实现，虽然没有看过`vue sfc`插件的实现，但是大概能看出来，`vue sfc`会把`<docs></docs>`转换成`import`一个模块的方式,不然也能通过`transform`获取到。然后该模块的id大概是:原.vue文件的id加上`?vue&type=docs` 如果`custom block`是`<docs lang='md'></docs>`,那么还会加上`&lang.md`。

<hr>

`virtual module` 在histoire中发挥非常重要的作用,例如在`histoire app`中引入story的时候，就用到了`virtural module`![image-20221022223008226](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/image-20221022223008226.png)

`virtural module`的实现其实很简单，只需要在`resolveId`的时候判断一下id是不是`virtual module`,如果是则返回`\0`+`virtual module`的`id`,当然这只是个约定，因为`import URLs`是不会处理`\0`为头的模块的

```javascript
export default function myPlugin() {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'my-plugin', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`
      }
    }
  }
}
```



