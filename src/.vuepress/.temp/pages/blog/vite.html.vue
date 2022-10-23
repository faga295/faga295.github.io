<template><div><h1 id="vite" tabindex="-1"><a class="header-anchor" href="#vite" aria-hidden="true">#</a> vite</h1>
<h2 id="vite的特性" tabindex="-1"><a class="header-anchor" href="#vite的特性" aria-hidden="true">#</a> vite的特性</h2>
<h3 id="快" tabindex="-1"><a class="header-anchor" href="#快" aria-hidden="true">#</a> 快</h3>
<p>生产环境下，本地开发服务器使用的原生的<code v-pre>esmodule</code>，在打包<code v-pre>node_modules</code>中的<code v-pre>package</code>时用的<code v-pre>esbuild</code>(用go写的，速度很快)</p>
<h3 id="开箱即用" tabindex="-1"><a class="header-anchor" href="#开箱即用" aria-hidden="true">#</a> 开箱即用</h3>
<p>vite很多配置都是预配置的，你甚至可以不用配置就能使用</p>
<h3 id="插件" tabindex="-1"><a class="header-anchor" href="#插件" aria-hidden="true">#</a> 插件</h3>
<p>与rollup共享插件</p>
<h2 id="插件-1" tabindex="-1"><a class="header-anchor" href="#插件-1" aria-hidden="true">#</a> 插件</h2>
<p>由于vite的打包用的是<code v-pre>rollup</code>,因此vite可以使用rollup的插件。在写插件的之前需要注意这个插件是不是没有用到vite独特的配置项，如果没有，那么你应该写的是一个<code v-pre>rollup</code>插件</p>
<h3 id="常见的hooks" tabindex="-1"><a class="header-anchor" href="#常见的hooks" aria-hidden="true">#</a> 常见的hooks</h3>
<p>首先需要了解<code v-pre>hooks</code>这个概念，在<code v-pre>rollup</code>中打包分成好几个阶段，如图所示：</p>
<p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/image-20221022210247918.png" alt="image-20221022210247918"></p>
<p>每一个阶段都可以理解成一个<code v-pre>hook</code>,我们可以在每一个<code v-pre>hook</code>对打包流程进行相应的处理。这个图可以理解为从入口文件出发，每个<code v-pre>import</code>的包都进行<code v-pre>resolveId</code>,然后<code v-pre>load</code>被resolve的包，<code v-pre>load</code>主要用于加载操作，可以是读取文件也可以是<code v-pre>virtual module</code>, load完成了之后，对其进行<code v-pre>transform</code>,<code v-pre>transform</code>是最常用的，用于对模块就行改写。</p>
<p>还有一部分<code v-pre>hooks</code>是在文件写入的时候进行的</p>
<p>比较常见的应该是<code v-pre>resolveImportMeta</code> , 是对<code v-pre>import.meta</code>的扩展，像vite中的<code v-pre>import.meta.env</code>,<code v-pre>import.meta.hot</code>都可以用<code v-pre>resolveImportMeta</code>实现</p>
<h2 id="try-it" tabindex="-1"><a class="header-anchor" href="#try-it" aria-hidden="true">#</a> try it</h2>
<p>这个案例是<code v-pre>histoire</code>中<code v-pre>custom block</code>的实现</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code>  plugins<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    name<span class="token operator">:</span> <span class="token string">'histoire-vue-docs-block'</span><span class="token punctuation">,</span>
    <span class="token function">transform</span> <span class="token punctuation">(</span>code<span class="token punctuation">,</span> id<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>id<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span><span class="token string">'?vue&amp;type=docs'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>id<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span><span class="token string">'lang.md'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span>
      <span class="token keyword">const</span> file <span class="token operator">=</span> id<span class="token punctuation">.</span><span class="token function">substring</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> id<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token string">'?vue'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
      <span class="token keyword">const</span> html <span class="token operator">=</span> md<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>code<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        file<span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">export default Comp => {
        Comp.doc = </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>html<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">
      }</span><span class="token template-punctuation string">`</span></span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>虽然没有看过<code v-pre>vue sfc</code>插件的实现，但是大概能看出来，<code v-pre>vue sfc</code>会把<code v-pre>&lt;docs&gt;&lt;/docs&gt;</code>转换成<code v-pre>import</code>一个模块的方式,不然也能通过<code v-pre>transform</code>获取到。然后该模块的id大概是:原.vue文件的id加上<code v-pre>?vue&amp;type=docs</code> 如果<code v-pre>custom block</code>是<code v-pre>&lt;docs lang='md'&gt;&lt;/docs&gt;</code>,那么还会加上<code v-pre>&amp;lang.md</code>。</p>
<h2 id="hmr" tabindex="-1"><a class="header-anchor" href="#hmr" aria-hidden="true">#</a> hmr</h2>
</div></template>


