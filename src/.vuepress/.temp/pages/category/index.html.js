export const data = JSON.parse("{\"key\":\"v-5bc93818\",\"path\":\"/category/\",\"title\":\"Category\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"Category\",\"blog\":{\"type\":\"category\",\"key\":\"category\"},\"layout\":\"Blog\"},\"excerpt\":\"\",\"headers\":[],\"readingTime\":{\"minutes\":0,\"words\":0},\"filePathRelative\":null}")

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
