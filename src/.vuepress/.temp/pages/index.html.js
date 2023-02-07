export const data = JSON.parse("{\"key\":\"v-8daa1a0e\",\"path\":\"/\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{\"home\":true,\"layout\":\"Blog\",\"heroImage\":\"https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/微信图片_20220607163536.jpg\",\"heroText\":\"faga\",\"actionLink\":\"/blog/\",\"projects\":[{\"name\":\"mafs-vue\",\"desc\":\"由svg绘制的vue数学函数组件库\",\"link\":\"https://mafs-vue-docs.vercel.app/\"},{\"name\":\"ni-rs\",\"desc\":\"ni的rust实现, 帮助你选择正确的包管理工具\",\"link\":\"https://github.com/faga295/ni-rs\"},{\"name\":\"escape-html-rs\",\"desc\":\"转义会被html忽略的字符\",\"link\":\"https://github.com/faga295/escape-html\"}]},\"excerpt\":\"\",\"headers\":[],\"readingTime\":{\"minutes\":0.32,\"words\":95},\"filePathRelative\":\"README.md\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
