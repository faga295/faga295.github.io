export const data = JSON.parse("{\"key\":\"v-8daa1a0e\",\"path\":\"/\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{\"home\":true,\"layout\":\"Blog\",\"heroImage\":\"https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/微信图片_20220607163536.jpg\",\"heroText\":\"faga\",\"heroFUllScreen\":true,\"tagline\":\"faga's blog\",\"actionText\":\"welcome →\",\"actionLink\":\"/blog/\",\"features\":[{\"title\":\"About Me\",\"details\":\"一个前端，大三在读\"},{\"title\":\"About Blog\",\"details\":\"主要记录前端学习过程中的笔记\"},{\"title\":\"My Expectation\",\"details\":\"努力学习，尽量产出更高质量的文章\"}]},\"excerpt\":\"\",\"headers\":[],\"readingTime\":{\"minutes\":0.27,\"words\":80},\"filePathRelative\":\"README.md\"}")

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
