import {
  useThemeData,
  useThemeLocaleData
} from "./chunk-CWHV5QX7.js";
import {
  B,
  F,
  V,
  q
} from "./chunk-YEEH5TFH.js";
import {
  computed,
  inject,
  provide,
  reactive
} from "./chunk-3JL2R52N.js";

// node_modules/vuepress-theme-hope/lib/client/modules/blog/composables/categoryMap.js
import { useBlogCategory } from "vuepress-plugin-blog2/client";
var categoryMapSymbol = Symbol.for("categoryMap");
var useCategoryMap = () => {
  const categoryMap = inject(categoryMapSymbol);
  if (!categoryMap) {
    throw new Error("useCategoryMap() is called without provider.");
  }
  return categoryMap;
};
var setupCategoryMap = () => {
  const categoryMap = useBlogCategory("category");
  provide(categoryMapSymbol, categoryMap);
};

// node_modules/vuepress-theme-hope/lib/client/modules/blog/composables/options.js
var useBlogOptions = () => {
  const themeData = useThemeData();
  const themeLocale = useThemeLocaleData();
  return computed(() => ({
    ...themeData.value.blog,
    ...themeLocale.value.blog
  }));
};

// node_modules/vuepress-theme-hope/lib/client/modules/blog/composables/tagMap.js
import { useBlogCategory as useBlogCategory2 } from "vuepress-plugin-blog2/client";
var tagMapSymbol = Symbol.for("tagMap");
var useTagMap = () => {
  const tagMap = inject(tagMapSymbol);
  if (!tagMap) {
    throw new Error("useTagMap() is called without provider.");
  }
  return tagMap;
};
var setupTagMap = () => {
  const tagMap = useBlogCategory2("tag");
  provide(tagMapSymbol, tagMap);
};

// node_modules/vuepress-theme-hope/lib/client/modules/blog/composables/articleInfo.js
var useArticleAuthor = (info) => {
  const themeLocale = useThemeLocaleData();
  return computed(() => {
    const { author } = info.value;
    if (author)
      return V(author);
    if (author === false)
      return [];
    return V(themeLocale.value.author, false);
  });
};
var useArticleCategory = (info) => {
  const categoryMap = useCategoryMap();
  return computed(() => B(info.value.category).map((name) => ({
    name,
    path: categoryMap.value.map[name].path
  })));
};
var useArticleTag = (info) => {
  const tagMap = useTagMap();
  return computed(() => q(info.value.tag).map((name) => ({
    name,
    path: tagMap.value.map[name].path
  })));
};
var useArticleDate = (info) => computed(() => {
  const { date } = info.value;
  return date ? F(date) : null;
});
var useArticleInfo = (info) => {
  const blogOptions = useBlogOptions();
  const author = useArticleAuthor(info);
  const category = useArticleCategory(info);
  const tag = useArticleTag(info);
  const date = useArticleDate(info);
  const config = reactive({
    author: author.value,
    category: category.value,
    date: date.value,
    localizedDate: info.value.localizedDate || "",
    tag: tag.value,
    isOriginal: info.value.isOriginal || false,
    readingTime: info.value.readingTime || null
  });
  const items = computed(() => blogOptions.value.articleInfo);
  return { config, items };
};

// node_modules/vuepress-theme-hope/lib/client/modules/blog/composables/articles.js
import { useBlogType } from "vuepress-plugin-blog2/client";
var articlesSymbol = Symbol.for("articles");
var useArticles = () => {
  const articles = inject(articlesSymbol);
  if (!articles) {
    throw new Error("useArticles() is called without provider.");
  }
  return articles;
};
var setupArticles = () => {
  const articles = useBlogType("article");
  provide(articlesSymbol, articles);
};

// node_modules/vuepress-theme-hope/lib/client/modules/blog/composables/encryptedArticles.js
import { useBlogType as useBlogType2 } from "vuepress-plugin-blog2/client";
var encryptedArticlesSymbol = Symbol.for("encryptedArticles");
var useEncryptedArticles = () => {
  const encryptedArticles = inject(encryptedArticlesSymbol);
  if (!encryptedArticles) {
    throw new Error("useEncryptedArticles() is called without provider.");
  }
  return encryptedArticles;
};
var setupEncryptedArticles = () => {
  const encryptedArticles = useBlogType2("encrypted");
  provide(encryptedArticlesSymbol, encryptedArticles);
};

// node_modules/vuepress-theme-hope/lib/client/modules/blog/composables/slides.js
import { useBlogType as useBlogType3 } from "vuepress-plugin-blog2/client";
var slidesSymbol = Symbol.for("slides");
var useSlides = () => {
  const slides = inject(slidesSymbol);
  if (!slides) {
    throw new Error("useSlides() is called without provider.");
  }
  return slides;
};
var setupSlides = () => {
  const slides = useBlogType3("slide");
  provide(slidesSymbol, slides);
};

// node_modules/vuepress-theme-hope/lib/client/modules/blog/composables/stars.js
import { useBlogType as useBlogType4 } from "vuepress-plugin-blog2/client";
var starsSymbol = Symbol.for("stars");
var useStars = () => {
  const stars = inject(starsSymbol);
  if (!stars) {
    throw new Error("useStars() is called without provider.");
  }
  return stars;
};
var setupStars = () => {
  const stars = useBlogType4("star");
  provide(starsSymbol, stars);
};

// node_modules/vuepress-theme-hope/lib/client/modules/blog/composables/timelines.js
import { useBlogType as useBlogType5 } from "vuepress-plugin-blog2/client";
var timelinesSymbol = Symbol.for("timelines");
var useTimelines = () => {
  const timelines = inject(timelinesSymbol);
  if (!timelines) {
    throw new Error("useTimelines() is called without provider.");
  }
  return timelines;
};
var setupTimelines = () => {
  const timelines = useBlogType5("timeline");
  const timelineItems = computed(() => {
    const timelineItems2 = [];
    timelines.value.items.forEach(({ info, path }) => {
      var _a;
      const { year, month, day } = ((_a = F(info.date)) == null ? void 0 : _a.info) || {};
      if (year && month && day) {
        if (!timelineItems2[0] || timelineItems2[0].year !== year)
          timelineItems2.unshift({ year, items: [] });
        timelineItems2[0].items.push({
          date: `${month}/${day}`,
          info,
          path
        });
      }
    });
    return {
      ...timelines.value,
      config: timelineItems2.reverse()
    };
  });
  provide(timelinesSymbol, timelineItems);
};

// node_modules/vuepress-theme-hope/lib/client/modules/blog/composables/setup.js
var setupBlog = () => {
  setupArticles();
  setupCategoryMap();
  setupEncryptedArticles();
  setupSlides();
  setupStars();
  setupTagMap();
  setupTimelines();
};

export {
  categoryMapSymbol,
  useCategoryMap,
  setupCategoryMap,
  useBlogOptions,
  tagMapSymbol,
  useTagMap,
  setupTagMap,
  useArticleAuthor,
  useArticleCategory,
  useArticleTag,
  useArticleDate,
  useArticleInfo,
  articlesSymbol,
  useArticles,
  setupArticles,
  encryptedArticlesSymbol,
  useEncryptedArticles,
  setupEncryptedArticles,
  slidesSymbol,
  useSlides,
  setupSlides,
  starsSymbol,
  useStars,
  setupStars,
  timelinesSymbol,
  useTimelines,
  setupTimelines,
  setupBlog
};
//# sourceMappingURL=chunk-EGAIBURN.js.map
