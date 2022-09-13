import {
  ArticleIcon,
  CategoryIcon,
  CategoryList_default,
  TagIcon,
  TagList_default,
  TimelineIcon
} from "./chunk-EVGQUOHJ.js";
import {
  useArticles,
  useCategoryMap,
  useStars,
  useTagMap,
  useTimelines
} from "./chunk-EGAIBURN.js";
import {
  DropTransition_default
} from "./chunk-VC4AEKQI.js";
import {
  useNavigate,
  useThemeLocaleData
} from "./chunk-CWHV5QX7.js";
import {
  RouterLink
} from "./chunk-SWJALXVA.js";
import {
  computed,
  defineComponent,
  h,
  ref
} from "./chunk-3JL2R52N.js";

// node_modules/vuepress-theme-hope/lib/client/modules/blog/components/TimelineList.js
import "/Users/bytedance/project/faga1.github.io/node_modules/vuepress-theme-hope/lib/client/modules/blog/styles/timeline-list.scss";
var TimelineList_default = defineComponent({
  name: "TimelineList",
  setup() {
    const themeLocale = useThemeLocaleData();
    const timelines = useTimelines();
    const navigate = useNavigate();
    const hint = computed(() => themeLocale.value.blogLocales.timeline);
    return () => h("div", { class: "timeline-list-wrapper" }, [
      h("div", {
        class: "timeline-list-title",
        onClick: () => navigate(timelines.value.path)
      }, [
        h(TimelineIcon),
        h("span", { class: "num" }, timelines.value.items.length),
        hint.value
      ]),
      h("hr"),
      h("div", { class: "timeline-content" }, h("ul", { class: "timeline-list" }, timelines.value.config.map(({ year, items }, index) => h(DropTransition_default, { appear: true, delay: 0.08 * (index + 1) }, () => h("li", [
        h("h3", { class: "timeline-year" }, year),
        h("ul", { class: "timeline-year-wrapper" }, items.map(({ date, info, path }) => h("li", { class: "timeline-item" }, [
          h("span", { class: "timeline-date" }, date),
          h(RouterLink, {
            class: "timeline-title",
            to: path
          }, () => info.title)
        ])))
      ])))))
    ]);
  }
});

// node_modules/vuepress-theme-hope/lib/client/modules/blog/components/InfoList.js
import "/Users/bytedance/project/faga1.github.io/node_modules/vuepress-theme-hope/lib/client/modules/blog/styles/info-list.scss";
var InfoList_default = defineComponent({
  name: "InfoList",
  setup() {
    const themeLocale = useThemeLocaleData();
    const articles = useArticles();
    const categoryMap = useCategoryMap();
    const categoryNumber = computed(() => Object.keys(categoryMap.value.map).length);
    const stars = useStars();
    const tagMap = useTagMap();
    const tagNumber = computed(() => Object.keys(tagMap.value.map).length);
    const navigate = useNavigate();
    const active = ref("article");
    const locale = computed(() => themeLocale.value.blogLocales);
    const buttons = [
      ["article", ArticleIcon],
      ["category", CategoryIcon],
      ["tag", TagIcon],
      ["timeline", TimelineIcon]
    ];
    return () => h("div", { class: "blog-info-list" }, [
      h("div", { class: "blog-type-wrapper" }, buttons.map(([key, icon]) => h("button", {
        class: "blog-type-button",
        onClick: () => {
          active.value = key;
        }
      }, h("div", {
        class: ["icon-wapper", { active: active.value === key }],
        "aria-label": locale.value[key],
        "data-balloon-pos": "up"
      }, h(icon))))),
      active.value === "article" ? h(DropTransition_default, () => [
        h("div", { class: "sticky-article-wrapper" }, [
          h("div", {
            class: "title",
            onClick: () => navigate(articles.value.path)
          }, [
            h(ArticleIcon),
            h("span", { class: "num" }, articles.value.items.length),
            locale.value.article
          ]),
          h("hr"),
          h("ul", { class: "sticky-article-list" }, stars.value.items.map(({ info, path }, index) => h(DropTransition_default, { appear: true, delay: 0.08 * (index + 1) }, () => h("li", {
            class: "sticky-article",
            onClick: () => navigate(path)
          }, info.title))))
        ])
      ]) : null,
      active.value === "category" ? h(DropTransition_default, () => [
        h("div", { class: "category-wrapper" }, [
          categoryNumber.value ? h("div", {
            class: "title",
            onClick: () => navigate(categoryMap.value.path)
          }, [
            h(CategoryIcon),
            h("span", { class: "num" }, categoryNumber.value),
            locale.value.category
          ]) : null,
          h("hr"),
          h(DropTransition_default, { delay: 0.04 }, () => h(CategoryList_default))
        ])
      ]) : null,
      active.value === "tag" ? h(DropTransition_default, () => [
        h("div", { class: "tag-wrapper" }, [
          tagNumber.value ? h("div", {
            class: "title",
            onClick: () => navigate(tagMap.value.path)
          }, [
            h(TagIcon),
            h("span", { class: "num" }, tagNumber.value),
            locale.value.tag
          ]) : null,
          h("hr"),
          h(DropTransition_default, { delay: 0.04 }, () => h(TagList_default))
        ])
      ]) : null,
      active.value === "timeline" ? h(DropTransition_default, () => h(TimelineList_default)) : null
    ]);
  }
});

export {
  InfoList_default
};
//# sourceMappingURL=chunk-QWPZHKVG.js.map
