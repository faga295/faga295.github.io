import{ab as s,B as d,C as a,A as i,N as e,I as t,ac as n,P as o}from"./app.58af2e3e.js";import"./vendor.44925b61.js";const l={},c=n(`<h1 id="remark" tabindex="-1"><a class="header-anchor" href="#remark" aria-hidden="true">#</a> remark</h1><p>remark不单单是一个markdown的编译工具，更准确地说，它是一个围绕markdown的生态。通过插件化的方式，对mdast进行修改，使其转化成我们想要的样子。<code>remarkParse</code>就是将<code>markdown</code>编译为mdast的插件。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import {unified} from &#39;unified&#39;
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="unified" tabindex="-1"><a class="header-anchor" href="#unified" aria-hidden="true">#</a> unified</h1>`,4),m=i("code",null,"unified",-1),v={href:"https://github.com/syntax-tree",target:"_blank",rel:"noopener noreferrer"},u=n(`<p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20220708230927329.png" alt="image-20220708230927329"></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>| ........................ process ........................... |
| .......... parse ... | ... run ... | ... stringify ..........|

          +--------+                     +----------+
Input -&gt;- | Parser | -&gt;- Syntax Tree -&gt;- | Compiler | -&gt;- Output
          +--------+          |          +----------+
                              X
                              |
                       +--------------+
                       | Transformers |
                       +--------------+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>unified</code>其实际上只是一个配置<code>processor</code>的过程，<code>unified()</code>返回值是一个<code>processor</code>,<code>processor.use()</code>返回是一个被配置过的<code>processor</code>,在配置一个插件后，我们可以使用<code>processor.process()</code>或<code>processor.processSync()</code>处理。</p><p><code>processor.processSync(file:VFile|undefined):VFile</code></p><p>如果我们传入的值不是VFile，则会自动的使用<code>new VFile(x)</code> 将其转化为<code>VFile</code></p><p>输出的<code>VFile</code>我们可以使用<code>String(VFile)</code> 或 <code>VFile.toString()</code>获取到其中的内容</p><h2 id="plugin" tabindex="-1"><a class="header-anchor" href="#plugin" aria-hidden="true">#</a> Plugin</h2><p>插件是用于配置<code>processor</code>的，那么我们该如何写一个自己的插件呢</p><h3 id="function-attacher-options" tabindex="-1"><a class="header-anchor" href="#function-attacher-options" aria-hidden="true">#</a> function attacher(options?)</h3><p><strong>parameters</strong></p><p><code>options</code> -- configuration</p><p><strong>Return</strong></p><p><code>transformer</code></p><p><code>Plugin</code>应该是一个可以接收options，并且返回<code>transformer</code>的函数</p><h3 id="function-transformer-tree-file-next" tabindex="-1"><a class="header-anchor" href="#function-transformer-tree-file-next" aria-hidden="true">#</a> function transformer(tree,file[,next])</h3><p>transformer是用来处理<code>syntax tree</code>和<code>VFile</code>的函数。</p><p>以下是官方的例子</p><p>move.js</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>export function move(options) {
  if (!options || !options.extname) {
    throw new Error(&#39;Missing \`options.extname\`&#39;)
  }

  return function (tree, file) {
    if (file.extname &amp;&amp; file.extname !== options.extname) {
      file.extname = options.extname
    }
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>index.js</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import {read, write} from &#39;to-vfile&#39;
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
await write(file) // written VFile to ‘index.html’
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>index.html</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;h1&gt;Hello, world!&lt;/h1&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="实际应用" tabindex="-1"><a class="header-anchor" href="#实际应用" aria-hidden="true">#</a> 实际应用</h1><p>这是在我写一个vscode的插件时碰到的问题，这个vscode插件是用于预览markdown的，虽然插件市场已经有很多预览markdown的插件了，但是由于一些原因，这个插件需要使用remark来实现，所以需要重新做一个。</p><p>在需要实现滚动锁定功能的时候，其他插件的实现方法是，对每一个<code>HTML Element</code>添加一个属性:<code>data-line</code>(指的是该html在编辑器的位置)，这样我在滚动预览页面的时候就只需要找到能看到的最上面的<code>HTML Element</code> 再找到与之对应的<code>data-line</code> 接着滚动编辑器即可。</p><p>因此思路也非常清晰了，我们需要在对<code>hast</code>的处理过程中加上一步(添加data-line属性)，接着，我们开始编写此插件</p><p>rehype-source-line.ts</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import {visit} from &#39;unist-util-visit&#39;;// 用于访问语法树的节点

export default function rehypeSourceLine() {
  return (tree:any) =&gt; {
    visit(tree, (node) =&gt; {
        if(node.position &amp;&amp; node.properties){
          node.properties.dataLine = node.position.start.line;
        }
    });
  };
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>让我们来看看效果</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20220710150532940.png" alt="image-20220710150532940"></p><p>ok，那么这样一个简单的插件就完成了。</p>`,32);function p(b,f){const r=o("ExternalLinkIcon");return d(),a("div",null,[c,i("p",null,[m,e("相当于一种管道传输的思想，我们把内容放到管道里，先对其解析，解析为"),i("a",v,[e("ast"),t(r)]),e("，再使用一个一个插件处理ast，管道中的内容是以ast的形式传输的，最终将ast编译，并在管道的另一头获取到被处理后的内容。")]),u])}const x=s(l,[["render",p],["__file","remark.html.vue"]]);export{x as default};
