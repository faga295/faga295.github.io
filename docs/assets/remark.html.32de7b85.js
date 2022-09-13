import{_ as s}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as d,c as a,a as e,f as o,d as n,b as i,r as t}from"./app.cf428bfb.js";const l={},c=n(`<h1 id="remark" tabindex="-1"><a class="header-anchor" href="#remark" aria-hidden="true">#</a> remark</h1><p>remark\u4E0D\u5355\u5355\u662F\u4E00\u4E2Amarkdown\u7684\u7F16\u8BD1\u5DE5\u5177\uFF0C\u66F4\u51C6\u786E\u5730\u8BF4\uFF0C\u5B83\u662F\u4E00\u4E2A\u56F4\u7ED5markdown\u7684\u751F\u6001\u3002\u901A\u8FC7\u63D2\u4EF6\u5316\u7684\u65B9\u5F0F\uFF0C\u5BF9mdast\u8FDB\u884C\u4FEE\u6539\uFF0C\u4F7F\u5176\u8F6C\u5316\u6210\u6211\u4EEC\u60F3\u8981\u7684\u6837\u5B50\u3002<code>remarkParse</code>\u5C31\u662F\u5C06<code>markdown</code>\u7F16\u8BD1\u4E3Amdast\u7684\u63D2\u4EF6\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>import {unified} from &#39;unified&#39;
import remarkParse from &#39;remark-parse&#39;
import remarkRehype from &#39;remark-rehype&#39;
import rehypeSanitize from &#39;rehype-sanitize&#39;
import rehypeStringify from &#39;rehype-stringify&#39;

main()

async function main() {
  const file = await unified()
    .use(remarkParse) // markdown -&gt; mdast
    .use(remarkRehype) // mdast -&gt; hast
    .use(rehypeSanitize) // sanitize HTML
    .use(rehypeStringify) // hast -&gt; string
    .process(&#39;# Hello, Neptune!&#39;)

  console.log(String(file))
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="unified" tabindex="-1"><a class="header-anchor" href="#unified" aria-hidden="true">#</a> unified</h1>`,4),m=e("code",null,"unified",-1),v=i("\u76F8\u5F53\u4E8E\u4E00\u79CD\u7BA1\u9053\u4F20\u8F93\u7684\u601D\u60F3\uFF0C\u6211\u4EEC\u628A\u5185\u5BB9\u653E\u5230\u7BA1\u9053\u91CC\uFF0C\u5148\u5BF9\u5176\u89E3\u6790\uFF0C\u89E3\u6790\u4E3A"),u={href:"https://github.com/syntax-tree",target:"_blank",rel:"noopener noreferrer"},p=i("ast"),b=i("\uFF0C\u518D\u4F7F\u7528\u4E00\u4E2A\u4E00\u4E2A\u63D2\u4EF6\u5904\u7406ast\uFF0C\u7BA1\u9053\u4E2D\u7684\u5185\u5BB9\u662F\u4EE5ast\u7684\u5F62\u5F0F\u4F20\u8F93\u7684\uFF0C\u6700\u7EC8\u5C06ast\u7F16\u8BD1\uFF0C\u5E76\u5728\u7BA1\u9053\u7684\u53E6\u4E00\u5934\u83B7\u53D6\u5230\u88AB\u5904\u7406\u540E\u7684\u5185\u5BB9\u3002"),f=n(`<p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20220708230927329.png" alt="image-20220708230927329"></p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>| ........................ process ........................... |
| .......... parse ... | ... run ... | ... stringify ..........|

          +--------+                     +----------+
Input -&gt;- | Parser | -&gt;- Syntax Tree -&gt;- | Compiler | -&gt;- Output
          +--------+          |          +----------+
                              X
                              |
                       +--------------+
                       | Transformers |
                       +--------------+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>unified</code>\u5176\u5B9E\u9645\u4E0A\u53EA\u662F\u4E00\u4E2A\u914D\u7F6E<code>processor</code>\u7684\u8FC7\u7A0B\uFF0C<code>unified()</code>\u8FD4\u56DE\u503C\u662F\u4E00\u4E2A<code>processor</code>,<code>processor.use()</code>\u8FD4\u56DE\u662F\u4E00\u4E2A\u88AB\u914D\u7F6E\u8FC7\u7684<code>processor</code>,\u5728\u914D\u7F6E\u4E00\u4E2A\u63D2\u4EF6\u540E\uFF0C\u6211\u4EEC\u53EF\u4EE5\u4F7F\u7528<code>processor.process()</code>\u6216<code>processor.processSync()</code>\u5904\u7406\u3002</p><p><code>processor.processSync(file:VFile|undefined):VFile</code></p><p>\u5982\u679C\u6211\u4EEC\u4F20\u5165\u7684\u503C\u4E0D\u662FVFile\uFF0C\u5219\u4F1A\u81EA\u52A8\u7684\u4F7F\u7528<code>new VFile(x)</code> \u5C06\u5176\u8F6C\u5316\u4E3A<code>VFile</code></p><p>\u8F93\u51FA\u7684<code>VFile</code>\u6211\u4EEC\u53EF\u4EE5\u4F7F\u7528<code>String(VFile)</code> \u6216 <code>VFile.toString()</code>\u83B7\u53D6\u5230\u5176\u4E2D\u7684\u5185\u5BB9</p><h2 id="plugin" tabindex="-1"><a class="header-anchor" href="#plugin" aria-hidden="true">#</a> Plugin</h2><p>\u63D2\u4EF6\u662F\u7528\u4E8E\u914D\u7F6E<code>processor</code>\u7684\uFF0C\u90A3\u4E48\u6211\u4EEC\u8BE5\u5982\u4F55\u5199\u4E00\u4E2A\u81EA\u5DF1\u7684\u63D2\u4EF6\u5462</p><h3 id="function-attacher-options" tabindex="-1"><a class="header-anchor" href="#function-attacher-options" aria-hidden="true">#</a> function attacher(options?)</h3><p><strong>parameters</strong></p><p><code>options</code> -- configuration</p><p><strong>Return</strong></p><p><code>transformer</code></p><p><code>Plugin</code>\u5E94\u8BE5\u662F\u4E00\u4E2A\u53EF\u4EE5\u63A5\u6536options\uFF0C\u5E76\u4E14\u8FD4\u56DE<code>transformer</code>\u7684\u51FD\u6570</p><h3 id="function-transformer-tree-file-next" tabindex="-1"><a class="header-anchor" href="#function-transformer-tree-file-next" aria-hidden="true">#</a> function transformer(tree,file[,next])</h3><p>transformer\u662F\u7528\u6765\u5904\u7406<code>syntax tree</code>\u548C<code>VFile</code>\u7684\u51FD\u6570\u3002</p><p>\u4EE5\u4E0B\u662F\u5B98\u65B9\u7684\u4F8B\u5B50</p><p>move.js</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>export function move(options) {
  if (!options || !options.extname) {
    throw new Error(&#39;Missing \`options.extname\`&#39;)
  }

  return function (tree, file) {
    if (file.extname &amp;&amp; file.extname !== options.extname) {
      file.extname = options.extname
    }
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>index.js</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>import {read, write} from &#39;to-vfile&#39;
import {reporter} from &#39;vfile-reporter&#39;
import {unified} from &#39;unified&#39;
import remarkParse from &#39;remark-parse&#39;
import remarkRehype from &#39;remark-rehype&#39;
import rehypeStringify from &#39;rehype-stringify&#39;
import {move} from &#39;./move.js&#39;

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(move, {extname: &#39;.html&#39;})
  .use(rehypeStringify)
  .process(await read(&#39;index.md&#39;))

console.error(reporter(file))
await write(file) // written VFile to \u2018index.html\u2019
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>index.html</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>&lt;h1&gt;Hello, world!&lt;/h1&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="\u5B9E\u9645\u5E94\u7528" tabindex="-1"><a class="header-anchor" href="#\u5B9E\u9645\u5E94\u7528" aria-hidden="true">#</a> \u5B9E\u9645\u5E94\u7528</h1><p>\u8FD9\u662F\u5728\u6211\u5199\u4E00\u4E2Avscode\u7684\u63D2\u4EF6\u65F6\u78B0\u5230\u7684\u95EE\u9898\uFF0C\u8FD9\u4E2Avscode\u63D2\u4EF6\u662F\u7528\u4E8E\u9884\u89C8markdown\u7684\uFF0C\u867D\u7136\u63D2\u4EF6\u5E02\u573A\u5DF2\u7ECF\u6709\u5F88\u591A\u9884\u89C8markdown\u7684\u63D2\u4EF6\u4E86\uFF0C\u4F46\u662F\u7531\u4E8E\u4E00\u4E9B\u539F\u56E0\uFF0C\u8FD9\u4E2A\u63D2\u4EF6\u9700\u8981\u4F7F\u7528remark\u6765\u5B9E\u73B0\uFF0C\u6240\u4EE5\u9700\u8981\u91CD\u65B0\u505A\u4E00\u4E2A\u3002</p><p>\u5728\u9700\u8981\u5B9E\u73B0\u6EDA\u52A8\u9501\u5B9A\u529F\u80FD\u7684\u65F6\u5019\uFF0C\u5176\u4ED6\u63D2\u4EF6\u7684\u5B9E\u73B0\u65B9\u6CD5\u662F\uFF0C\u5BF9\u6BCF\u4E00\u4E2A<code>HTML Element</code>\u6DFB\u52A0\u4E00\u4E2A\u5C5E\u6027:<code>data-line</code>(\u6307\u7684\u662F\u8BE5html\u5728\u7F16\u8F91\u5668\u7684\u4F4D\u7F6E)\uFF0C\u8FD9\u6837\u6211\u5728\u6EDA\u52A8\u9884\u89C8\u9875\u9762\u7684\u65F6\u5019\u5C31\u53EA\u9700\u8981\u627E\u5230\u80FD\u770B\u5230\u7684\u6700\u4E0A\u9762\u7684<code>HTML Element</code> \u518D\u627E\u5230\u4E0E\u4E4B\u5BF9\u5E94\u7684<code>data-line</code> \u63A5\u7740\u6EDA\u52A8\u7F16\u8F91\u5668\u5373\u53EF\u3002</p><p>\u56E0\u6B64\u601D\u8DEF\u4E5F\u975E\u5E38\u6E05\u6670\u4E86\uFF0C\u6211\u4EEC\u9700\u8981\u5728\u5BF9<code>hast</code>\u7684\u5904\u7406\u8FC7\u7A0B\u4E2D\u52A0\u4E0A\u4E00\u6B65(\u6DFB\u52A0data-line\u5C5E\u6027)\uFF0C\u63A5\u7740\uFF0C\u6211\u4EEC\u5F00\u59CB\u7F16\u5199\u6B64\u63D2\u4EF6</p><p>rehype-source-line.ts</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>import {visit} from &#39;unist-util-visit&#39;;// \u7528\u4E8E\u8BBF\u95EE\u8BED\u6CD5\u6811\u7684\u8282\u70B9

export default function rehypeSourceLine() {
  return (tree:any) =&gt; {
    visit(tree, (node) =&gt; {
        if(node.position &amp;&amp; node.properties){
          node.properties.dataLine = node.position.start.line;
        }
    });
  };
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u8BA9\u6211\u4EEC\u6765\u770B\u770B\u6548\u679C</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20220710150532940.png" alt="image-20220710150532940"></p><p>ok\uFF0C\u90A3\u4E48\u8FD9\u6837\u4E00\u4E2A\u7B80\u5355\u7684\u63D2\u4EF6\u5C31\u5B8C\u6210\u4E86\u3002</p>`,32);function h(g,x){const r=t("ExternalLinkIcon");return d(),a("div",null,[c,e("p",null,[m,v,e("a",u,[p,o(r)]),b]),f])}const _=s(l,[["render",h],["__file","remark.html.vue"]]);export{_ as default};
