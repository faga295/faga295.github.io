import {
  EmptyIcon,
  SlideIcon,
  StickyIcon
} from "./chunk-EVGQUOHJ.js";
import {
  useArticleInfo,
  useBlogOptions
} from "./chunk-EGAIBURN.js";
import {
  PageInfo_default
} from "./chunk-AG7WF3IF.js";
import {
  DropTransition_default
} from "./chunk-VC4AEKQI.js";
import {
  useThemeLocaleData
} from "./chunk-CWHV5QX7.js";
import {
  a
} from "./chunk-YEEH5TFH.js";
import {
  client_exports
} from "./chunk-ANKY43RT.js";
import {
  RouterLink,
  useRoute,
  useRouter
} from "./chunk-SWJALXVA.js";
import {
  computed,
  defineComponent,
  h,
  onMounted,
  ref,
  toRef,
  unref,
  watch
} from "./chunk-3JL2R52N.js";

// node_modules/vuepress-theme-hope/lib/client/modules/encrypt/components/icons.js
var LockIcon = () => h(a, { name: "lock" }, () => h("path", {
  d: "M787.168 952.268H236.832c-30.395 0-55.033-24.638-55.033-55.033V429.45c0-30.395 24.638-55.034 55.033-55.034h82.55V264.35c0-106.38 86.238-192.618 192.618-192.618S704.618 157.97 704.618 264.35v110.066h82.55c30.395 0 55.033 24.639 55.033 55.034v467.785c0 30.395-24.639 55.033-55.033 55.033zM484.483 672.046v115.122h55.034V672.046c31.99-11.373 55.033-41.605 55.033-77.496 0-45.592-36.958-82.55-82.55-82.55s-82.55 36.958-82.55 82.55c0 35.89 23.042 66.123 55.033 77.496zM622.067 264.35c0-60.788-49.28-110.067-110.067-110.067s-110.067 49.28-110.067 110.067v110.066h220.135V264.35z"
}));
LockIcon.displayName = "LockIcon";

// node_modules/vuepress-theme-hope/lib/client/modules/blog/components/ArticleItem.js
import "/Users/bytedance/project/faga1.github.io/node_modules/vuepress-theme-hope/lib/client/modules/blog/styles/article-item.scss";
var ArticleItem_default = defineComponent({
  name: "ArticleItem",
  props: {
    info: {
      type: Object,
      required: true
    },
    path: { type: String, required: true }
  },
  setup(props) {
    const info = toRef(props, "info");
    const { config, items } = useArticleInfo(info);
    return () => h("article", {
      class: "article",
      vocab: "https://schema.org/",
      typeof: "Article"
    }, [
      info.value.sticky ? h(StickyIcon) : null,
      h("header", { class: "title" }, h(RouterLink, {
        to: props.path
      }, () => [
        info.value.isEncrypted ? h(LockIcon) : null,
        info.value.type === "slide" ? h(SlideIcon) : null,
        h("span", { property: "headline" }, info.value.title),
        info.value.cover ? h("meta", {
          property: "image",
          content: (0, client_exports.withBase)(info.value.cover)
        }) : null
      ])),
      info.value.excerpt ? h("div", { class: "excerpt", innerHTML: info.value.excerpt }) : null,
      h("hr", { class: "hr" }),
      h(PageInfo_default, {
        config: unref(config),
        ...items.value ? { items: items.value } : {}
      })
    ]);
  }
});

// node_modules/vuepress-theme-hope/lib/client/modules/blog/components/Pagination.js
import "/Users/bytedance/project/faga1.github.io/node_modules/vuepress-theme-hope/lib/client/modules/blog/styles/pagination.scss";
var Pagination_default = defineComponent({
  name: "Pagination",
  props: {
    total: { type: Number, default: 10 },
    perPage: { type: Number, default: 10 },
    currentPage: { type: Number, default: 1 }
  },
  emits: ["updateCurrentPage"],
  setup(props, { emit }) {
    const themeLocale = useThemeLocaleData();
    const input = ref("");
    const locale = computed(() => themeLocale.value.paginationLocales);
    const totalPages = computed(() => Math.ceil(props.total / props.perPage));
    const enable = computed(() => Boolean(totalPages.value) && totalPages.value !== 1);
    const displayLeftEllipsis = computed(() => {
      if (totalPages.value < 7)
        return false;
      return props.currentPage > 4;
    });
    const displayRightEllipsis = computed(() => {
      if (totalPages.value < 7)
        return false;
      return props.currentPage < totalPages.value - 3;
    });
    const indexs = computed(() => {
      const { currentPage } = props;
      let min = 1;
      let max = totalPages.value;
      const arr = [];
      if (totalPages.value >= 7) {
        if (currentPage <= 4 && currentPage < totalPages.value - 3) {
          min = 1;
          max = 5;
        } else if (currentPage > 4 && currentPage >= totalPages.value - 3) {
          max = totalPages.value;
          min = totalPages.value - 4;
        } else if (totalPages.value > 7) {
          min = currentPage - 2;
          max = currentPage + 2;
        }
      }
      for (let i = min; i <= max; i++)
        arr.push(i);
      return arr;
    });
    const navigate = (page) => emit("updateCurrentPage", page);
    const jumpPage = (index) => {
      const pageNum = parseInt(index);
      if (pageNum <= totalPages.value && pageNum > 0)
        navigate(pageNum);
      else
        alert(locale.value.errorText.replace(/\$page/g, totalPages.value.toString()));
    };
    return () => h("div", { class: "pagination-wrapper" }, enable.value ? h("div", { class: "pagination-list" }, [
      h("div", { class: "page-number" }, [
        props.currentPage > 1 ? h("div", {
          class: "prev",
          role: "navigation",
          unselectable: "on",
          onClick: () => navigate(props.currentPage - 1)
        }, locale.value.prev) : null,
        ...displayLeftEllipsis.value ? [
          h("div", {
            role: "navigation",
            onClick: () => navigate(1)
          }, 1),
          h("div", { class: "ellipsis" }, "...")
        ] : [],
        ...indexs.value.map((num) => h("div", {
          key: num,
          class: { active: props.currentPage === num },
          role: "navigation",
          onClick: () => navigate(num)
        }, num)),
        ...displayRightEllipsis.value ? [
          h("div", { class: "ellipsis" }, "..."),
          h("div", {
            role: "navigation",
            onClick: () => navigate(totalPages.value)
          }, totalPages.value)
        ] : [],
        props.currentPage < totalPages.value ? h("div", {
          class: "next",
          role: "navigation",
          unselectable: "on",
          onClick: () => navigate(props.currentPage + 1)
        }, locale.value.next) : null
      ]),
      h("div", { class: "navigate-wrapper" }, [
        h("label", { for: "navigation-text" }, `${locale.value.navigate}: `),
        h("input", {
          id: "navigation-text",
          value: input.value,
          onInput: ({ target }) => {
            input.value = target.value;
          },
          onKeydown: (event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              jumpPage(input.value);
            }
          }
        }),
        h("button", {
          class: "navigate",
          role: "navigation",
          title: locale.value.action,
          onClick: () => jumpPage(input.value)
        }, locale.value.action)
      ])
    ]) : []);
  }
});

// node_modules/vuepress-theme-hope/lib/client/modules/blog/components/ArticleList.js
import "/Users/bytedance/project/faga1.github.io/node_modules/vuepress-theme-hope/lib/client/modules/blog/styles/article-list.scss";
var ArticleList_default = defineComponent({
  name: "ArticleList",
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const blogOptions = useBlogOptions();
    const currentPage = ref(1);
    const articlePerPage = computed(() => blogOptions.value.articlePerPage || 10);
    const currentArticles = computed(() => props.items.slice((currentPage.value - 1) * articlePerPage.value, currentPage.value * articlePerPage.value));
    const updatePage = (page) => {
      currentPage.value = page;
      const query = { ...route.query };
      if (query["page"] === page.toString() || page === 1 && !query["page"])
        return;
      if (page === 1)
        delete query["page"];
      else
        query["page"] = page.toString();
      void router.push({ path: route.path, query });
    };
    watch(currentPage, () => {
      const distance = document.querySelector("#article-list").getBoundingClientRect().top + window.scrollY;
      setTimeout(() => {
        window.scrollTo(0, distance);
      }, 100);
    });
    onMounted(() => {
      const { page } = route.query;
      updatePage(page ? Number(page) : 1);
    });
    return () => h("div", { id: "article-list", class: "article-wrapper" }, currentArticles.value.length ? [
      ...currentArticles.value.map(({ info, path }, index) => h(DropTransition_default, { appear: true, delay: index * 0.04 }, () => h(ArticleItem_default, { key: path, info, path }))),
      h(Pagination_default, {
        currentPage: currentPage.value,
        perPage: articlePerPage.value,
        total: props.items.length,
        onUpdateCurrentPage: updatePage
      })
    ] : h(EmptyIcon));
  }
});

export {
  ArticleList_default
};
//# sourceMappingURL=chunk-3D7MHV3U.js.map
