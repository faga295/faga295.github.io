import {
  TOC_default
} from "./chunk-ZCNDYA3X.js";
import {
  PageInfo_default,
  useContributors,
  useEditLink,
  useUpdateTime
} from "./chunk-AG7WF3IF.js";
import {
  EditIcon
} from "./chunk-X33BJFNV.js";
import {
  MarkdownContent_default
} from "./chunk-DUD2F6R4.js";
import {
  getAncestorLinks
} from "./chunk-TQJYOK4F.js";
import {
  useSidebarItems
} from "./chunk-E45H3KJK.js";
import {
  AutoLink_default
} from "./chunk-QWSNCEJS.js";
import {
  Icon_default
} from "./chunk-PBSZYER2.js";
import {
  useDarkMode
} from "./chunk-HYODCAD4.js";
import {
  useAutoLink,
  useNavigate,
  usePageInfo,
  useThemeLocaleData
} from "./chunk-CWHV5QX7.js";
import {
  c,
  u,
  x
} from "./chunk-YEEH5TFH.js";
import {
  client_exports
} from "./chunk-ANKY43RT.js";
import {
  useEventListener
} from "./chunk-4Q7REXDD.js";
import {
  isPlainObject
} from "./chunk-LS4IQIE6.js";
import {
  RouterLink,
  useRoute,
  useRouter
} from "./chunk-SWJALXVA.js";
import "./chunk-YACYAO4R.js";
import {
  computed,
  defineComponent,
  h,
  onMounted,
  ref,
  resolveComponent,
  unref,
  watch
} from "./chunk-3JL2R52N.js";
import {
  isString
} from "./chunk-XYQ66V4O.js";
import "./chunk-BPKF3OQJ.js";

// node_modules/vuepress-theme-hope/lib/client/components/BreadCrumb.js
import "/Users/bytedance/project/faga1.github.io/node_modules/vuepress-theme-hope/lib/client/styles/breadcrumb.scss";
var BreadCrumb_default = defineComponent({
  name: "BreadCrumb",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const routeLocale = (0, client_exports.useRouteLocale)();
    const frontmatter = (0, client_exports.usePageFrontmatter)();
    const themeLocale = useThemeLocaleData();
    const config = ref([]);
    const enable = computed(() => {
      return (frontmatter.value.breadcrumb || frontmatter.value.breadcrumb !== false && themeLocale.value.breadcrumb !== false) && config.value.length > 1;
    });
    const iconEnable = computed(() => frontmatter.value.breadcrumbIcon || frontmatter.value.breadcrumbIcon !== false && themeLocale.value.breadcrumbIcon !== false);
    const getBreadCrumbConfig = () => {
      const routes = router.getRoutes();
      const breadcrumbConfig = getAncestorLinks(route, routeLocale.value).map((link) => {
        const route2 = routes.find((route3) => route3.path === link);
        if (route2) {
          const { meta, path } = x(router, route2.path);
          if (meta.shortTitle || meta.title)
            return {
              title: meta.shortTitle || meta.title,
              icon: meta.icon,
              path
            };
        }
        return null;
      }).filter((item) => item !== null);
      if (breadcrumbConfig.length > 1)
        config.value = breadcrumbConfig;
    };
    onMounted(() => {
      void getBreadCrumbConfig();
      watch(() => route.path, getBreadCrumbConfig);
    });
    return () => h("nav", { class: ["breadcrumb", { disable: !enable.value }] }, enable.value ? h("ol", {
      vocab: "https://schema.org/",
      typeof: "BreadcrumbList"
    }, config.value.map((item, index) => h("li", {
      class: { "is-active": config.value.length - 1 === index },
      property: "itemListElement",
      typeof: "ListItem"
    }, [
      h(RouterLink, {
        to: item.path,
        property: "item",
        typeof: "WebPage"
      }, () => [
        iconEnable.value ? h(Icon_default, { icon: item.icon }) : null,
        h("span", { property: "name" }, item.title || "Unknown")
      ]),
      h("meta", { property: "position", content: index + 1 })
    ]))) : []);
  }
});

// node_modules/vuepress-theme-hope/lib/client/components/PageNav.js
import "/Users/bytedance/project/faga1.github.io/node_modules/vuepress-theme-hope/lib/client/styles/page-nav.scss";
var resolveFromFrontmatterConfig = (conf) => {
  if (conf === false)
    return false;
  if (isString(conf))
    return useAutoLink(conf, true);
  if (isPlainObject(conf))
    return conf;
  return null;
};
var resolveFromSidebarItems = (sidebarItems, currentPath, offset) => {
  const index = sidebarItems.findIndex((item) => item.link === currentPath);
  if (index !== -1) {
    const targetItem = sidebarItems[index + offset];
    if (!(targetItem == null ? void 0 : targetItem.link))
      return null;
    return targetItem;
  }
  for (const item of sidebarItems)
    if (item.children) {
      const childResult = resolveFromSidebarItems(item.children, currentPath, offset);
      if (childResult)
        return childResult;
    }
  return null;
};
var PageNav_default = defineComponent({
  name: "PageNav",
  setup() {
    const themeLocale = useThemeLocaleData();
    const frontmatter = (0, client_exports.usePageFrontmatter)();
    const sidebarItems = useSidebarItems();
    const route = useRoute();
    const navigate = useNavigate();
    const prevNavLink = computed(() => {
      const prevConfig = resolveFromFrontmatterConfig(frontmatter.value.prev);
      return prevConfig === false ? null : prevConfig || (themeLocale.value.prevLink === false ? null : resolveFromSidebarItems(sidebarItems.value, route.path, -1));
    });
    const nextNavLink = computed(() => {
      const nextConfig = resolveFromFrontmatterConfig(frontmatter.value.next);
      return nextConfig === false ? null : nextConfig || (themeLocale.value.nextLink === false ? null : resolveFromSidebarItems(sidebarItems.value, route.path, 1));
    });
    useEventListener("keydown", (event) => {
      if (event.altKey) {
        if (event.key === "ArrowRight") {
          if (nextNavLink.value) {
            navigate(nextNavLink.value.link);
            event.preventDefault();
          }
        } else if (event.key === "ArrowLeft") {
          if (prevNavLink.value) {
            navigate(prevNavLink.value.link);
            event.preventDefault();
          }
        }
      }
    });
    return () => prevNavLink.value || nextNavLink.value ? h("nav", { class: "page-nav" }, [
      prevNavLink.value ? h(AutoLink_default, { class: "prev", config: prevNavLink.value }, () => {
        var _a, _b;
        return [
          h("div", { class: "hint" }, [
            h("span", { class: "arrow left" }),
            themeLocale.value.metaLocales.prev
          ]),
          h("div", { class: "link" }, [
            h(Icon_default, {
              icon: (_a = prevNavLink.value) == null ? void 0 : _a.icon
            }),
            (_b = prevNavLink.value) == null ? void 0 : _b.text
          ])
        ];
      }) : null,
      nextNavLink.value ? h(AutoLink_default, { class: "next", config: nextNavLink.value }, () => {
        var _a, _b;
        return [
          h("div", { class: "hint" }, [
            themeLocale.value.metaLocales.next,
            h("span", { class: "arrow right" })
          ]),
          h("div", { class: "link" }, [
            (_a = nextNavLink.value) == null ? void 0 : _a.text,
            h(Icon_default, {
              icon: (_b = nextNavLink.value) == null ? void 0 : _b.icon
            })
          ])
        ];
      }) : null
    ]) : null;
  }
});

// node_modules/vuepress-theme-hope/lib/client/components/PageTitle.js
import "/Users/bytedance/project/faga1.github.io/node_modules/vuepress-theme-hope/lib/client/styles/page-title.scss";
var PageTitle_default = defineComponent({
  name: "PageTitle",
  setup() {
    const page = (0, client_exports.usePageData)();
    const frontmatter = (0, client_exports.usePageFrontmatter)();
    const themeLocale = useThemeLocaleData();
    const { config, items } = usePageInfo();
    return () => h("div", { class: "page-title" }, [
      h("h1", [
        themeLocale.value.titleIcon !== false ? h(Icon_default, { icon: frontmatter.value.icon }) : null,
        page.value.title
      ]),
      h(PageInfo_default, {
        config: unref(config),
        ...items.value === null ? {} : { items: items.value }
      }),
      h("hr")
    ]);
  }
});

// node_modules/vuepress-theme-hope/lib/client/modules/info/components/PageMeta.js
import "/Users/bytedance/project/faga1.github.io/node_modules/vuepress-theme-hope/lib/client/modules/info/styles/page-meta.scss";
var PageMeta_default = defineComponent({
  name: "PageMeta",
  setup() {
    const themeLocale = useThemeLocaleData();
    const editLink = useEditLink();
    const updateTime = useUpdateTime();
    const contributors = useContributors();
    return () => {
      const { metaLocales } = themeLocale.value;
      return h("footer", { class: "page-meta" }, [
        editLink.value ? h("div", { class: "meta-item edit-link" }, h(AutoLink_default, { class: "label", config: editLink.value }, { before: () => h(EditIcon) })) : null,
        updateTime.value ? h("div", { class: "meta-item update-time" }, [
          h("span", { class: "label" }, `${metaLocales.lastUpdated}: `),
          h("span", { class: "info" }, updateTime.value)
        ]) : null,
        contributors.value && contributors.value.length ? h("div", { class: "meta-item contributors" }, [
          h("span", { class: "label" }, `${metaLocales.contributors}: `),
          contributors.value.map(({ email, name }, index) => [
            h("span", { class: "contributor", title: `email: ${email}` }, name),
            index !== contributors.value.length - 1 ? "," : ""
          ])
        ]) : null
      ]);
    };
  }
});

// node_modules/vuepress-theme-hope/lib/client/components/NormalPage.js
import "/Users/bytedance/project/faga1.github.io/node_modules/vuepress-theme-hope/lib/client/styles/page.scss";
var NormalPage_default = defineComponent({
  name: "NormalPage",
  setup(_props, { slots }) {
    const frontmatter = (0, client_exports.usePageFrontmatter)();
    const { isDarkMode } = useDarkMode();
    const themeLocale = useThemeLocaleData();
    const tocEnable = computed(() => frontmatter.value.toc || frontmatter.value.toc !== false && themeLocale.value.toc !== false);
    return () => h("main", { class: "page", id: "main-content" }, h(c("LocalEncrypt") ? resolveComponent("LocalEncrypt") : u, () => {
      var _a, _b, _c, _d, _e, _f;
      return [
        (_a = slots["top"]) == null ? void 0 : _a.call(slots),
        h(BreadCrumb_default),
        h(PageTitle_default),
        tocEnable.value ? h(TOC_default, {
          headerDepth: (_c = (_b = frontmatter.value.headerDepth) != null ? _b : themeLocale.value.headerDepth) != null ? _c : 2
        }) : null,
        (_d = slots["contentBefore"]) == null ? void 0 : _d.call(slots),
        h(MarkdownContent_default),
        (_e = slots["contentAfter"]) == null ? void 0 : _e.call(slots),
        h(PageMeta_default),
        h(PageNav_default),
        c("CommentService") ? h(resolveComponent("CommentService"), {
          darkmode: isDarkMode.value
        }) : null,
        (_f = slots["bottom"]) == null ? void 0 : _f.call(slots)
      ];
    }));
  }
});

// dep:@theme-hope_components_NormalPage__js
var theme_hope_components_NormalPage_js_default = NormalPage_default;
export {
  theme_hope_components_NormalPage_js_default as default
};
//# sourceMappingURL=@theme-hope_components_NormalPage__js.js.map
