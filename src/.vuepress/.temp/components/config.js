import { h } from "vue";
import { defineClientConfig } from "@vuepress/client";
import Badge from "/Users/faga/i/faga1.github.io/node_modules/.pnpm/vuepress-plugin-components@2.0.0-beta.113/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import FontIcon from "/Users/faga/i/faga1.github.io/node_modules/.pnpm/vuepress-plugin-components@2.0.0-beta.113/node_modules/vuepress-plugin-components/lib/client/components/FontIcon.js";
import BackToTop from "/Users/faga/i/faga1.github.io/node_modules/.pnpm/vuepress-plugin-components@2.0.0-beta.113/node_modules/vuepress-plugin-components/lib/client/components/BackToTop.js";


export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("Badge", Badge);
    app.component("FontIcon", FontIcon);
    
  },
  setup: () => {
    
  },
  rootComponents: [
    () => h(BackToTop, { threshold: 300 }),
    
  ],
});