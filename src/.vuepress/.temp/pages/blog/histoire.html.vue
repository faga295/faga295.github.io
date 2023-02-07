<template><div><h1 id="给histoire提pr的一次记录" tabindex="-1"><a class="header-anchor" href="#给histoire提pr的一次记录" aria-hidden="true">#</a> 给histoire提pr的一次记录</h1>
<p><a href="https://histoire.dev" target="_blank" rel="noopener noreferrer">histoire<ExternalLinkIcon/></a>相当于是vue版的<code v-pre>storybook</code>。</p>
<h2 id="issue" tabindex="-1"><a class="header-anchor" href="#issue" aria-hidden="true">#</a> issue</h2>
<p>因为是在给<code v-pre>element-plus</code>写<code v-pre>histoire</code>文档的时候，发现如果给文本固定了颜色的话，那在变换背景颜色的时候会出现有一些背景颜色文本几乎和背景重合，因此我给<code v-pre>histoire</code>提了一个<a href="https://github.com/histoire-dev/histoire/issues/328" target="_blank" rel="noopener noreferrer">issue<ExternalLinkIcon/></a>,并且提出了三种解决方案,最终Akryum认可了我第三个方案，就是提供一个css变量，这个css变量代表和背景的反差色，会随着背景颜色的变化而变化</p>
<h2 id="histoire中值得学习的部分" tabindex="-1"><a class="header-anchor" href="#histoire中值得学习的部分" aria-hidden="true">#</a> histoire中值得学习的部分</h2>
<p>由于我提的pr是一个<code v-pre>feature</code>,因此必须增加一系列的测试,测试做的是<code v-pre>end to end test</code>,<code v-pre>end to end test</code>相当于就是测试来帮你去做点点点的工作，用的是<a href="https://cypress.io" target="_blank" rel="noopener noreferrer">cypress<ExternalLinkIcon/></a></p>
<hr>
<p>接下来是<code v-pre>vue sfc</code>的<code v-pre>custom block</code>的实现</p>
<p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/image-20221022172113663.png" alt="image-20221022172113663"></p>
<p>就是最下面的<code v-pre>&lt;docs&gt;&lt;/docs&gt;</code>, 想要支持<code v-pre>custom block</code> 需要添加插件，这个项目用的是<code v-pre>vite</code>。我的博客有一篇文章简单介绍了vite的插件。</p>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上就是<code v-pre>custom block</code>的实现，虽然没有看过<code v-pre>vue sfc</code>插件的实现，但是大概能看出来，<code v-pre>vue sfc</code>会把<code v-pre>&lt;docs&gt;&lt;/docs&gt;</code>转换成<code v-pre>import</code>一个模块的方式,不然也能通过<code v-pre>transform</code>获取到。然后该模块的id大概是:原.vue文件的id加上<code v-pre>?vue&amp;type=docs</code> 如果<code v-pre>custom block</code>是<code v-pre>&lt;docs lang='md'&gt;&lt;/docs&gt;</code>,那么还会加上<code v-pre>&amp;lang.md</code>。</p>
<hr>
<p><code v-pre>virtual module</code> 在histoire中发挥非常重要的作用,例如在<code v-pre>histoire app</code>中引入story(也就是用户暴露的.story.vue, histoire会将其转换为story对象)的时候，就用到了<code v-pre>virtural module</code><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/image-20221022223008226.png" alt="image-20221022223008226"></p>
<p><code v-pre>virtural module</code>的实现其实很简单，只需要在<code v-pre>resolveId</code>的时候判断一下id是不是<code v-pre>virtual module</code>,如果是则返回<code v-pre>\0</code>+<code v-pre>virtual module</code>的<code v-pre>id</code>,当然这只是个约定，因为<code v-pre>import URLs</code>是不会处理<code v-pre>\0</code>为头的模块的</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">myPlugin</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> virtualModuleId <span class="token operator">=</span> <span class="token string">'virtual:my-module'</span>
  <span class="token keyword">const</span> resolvedVirtualModuleId <span class="token operator">=</span> <span class="token string">'\0'</span> <span class="token operator">+</span> virtualModuleId

  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">'my-plugin'</span><span class="token punctuation">,</span> <span class="token comment">// required, will show up in warnings and errors</span>
    <span class="token function">resolveId</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>id <span class="token operator">===</span> virtualModuleId<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> resolvedVirtualModuleId
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">load</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>id <span class="token operator">===</span> resolvedVirtualModuleId<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">export const msg = "from virtual module"</span><span class="token template-punctuation string">`</span></span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体实现可以看<a href="https://github.com/histoire-dev/histoire/blob/main/packages/histoire/src/node/vite.ts#L250" target="_blank" rel="noopener noreferrer">这里<ExternalLinkIcon/></a></p>
</div></template>


