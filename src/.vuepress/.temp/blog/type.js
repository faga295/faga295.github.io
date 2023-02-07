export const typeMap = {"article":{"/":{"path":"/article/","keys":["v-3443b765","v-42c4032e","v-f97d9e00","v-411eebfe","v-4ffc2ec9","v-7b7b3b28","v-16486196","v-5bd623d9","v-00864001"]}},"encrypted":{"/":{"path":"/encrypted/","keys":[]}},"slide":{"/":{"path":"/slide/","keys":[]}},"star":{"/":{"path":"/star/","keys":[]}},"timeline":{"/":{"path":"/timeline/","keys":["v-3443b765","v-42c4032e","v-f97d9e00","v-411eebfe","v-4ffc2ec9","v-7b7b3b28"]}}}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateBlogType) {
    __VUE_HMR_RUNTIME__.updateBlogType(typeMap)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ typeMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typeMap)
  })
}
