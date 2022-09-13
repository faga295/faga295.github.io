import{_ as e}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as s,d as i}from"./app.6d86af47.js";const a={},l=i(`<h1 id="commonjs\u7684\u51FA\u73B0" tabindex="-1"><a class="header-anchor" href="#commonjs\u7684\u51FA\u73B0" aria-hidden="true">#</a> commonjs\u7684\u51FA\u73B0</h1><p>\u5728\u6700\u5F00\u59CB\u7F51\u7AD9\u7684\u4E1A\u52A1\u6CA1\u90A3\u4E48\u590D\u6742\uFF0Cjs\u53EA\u662F\u4F5C\u4E3A\u4E00\u95E8\u811A\u672C\u8BED\u8A00\uFF0C\u5B83\u4E0D\u9700\u8981\u5F15\u5165\u5176\u4ED6\u6587\u4EF6\u5C31\u53EF\u4EE5\u89E3\u51B3\u5DF2\u6709\u4E1A\u52A1\uFF0C\u4F46\u968F\u7740\u4E1A\u52A1\u9700\u6C42\u8D8A\u6765\u8D8A\u590D\u6742\uFF0C\u8D8A\u6765\u8D8A\u9700\u8981\u6A21\u5757\u5316\uFF0Ccommonjs\u5C31\u8FD9\u6837\u8BDE\u751F\u4E86\u3002\u518D\u5230\u540E\u6765es6\u628Aimport\uFF0Cexport\u52A0\u5165\u4E86\u5B83\u4EEC\u7684\u5173\u952E\u5B57\u5F53\u4E2D\uFF0C\u4E5F\u5C31\u6709\u4E86\u73B0\u5728\u7684esmodule\u3002\u9996\u5148\u8FD9\u4E24\u4E2A\u6700\u5927\u7684\u4E0D\u540C\u4E4B\u5904\u5728\u4E8E\uFF1Acommonjs\u7684module \u548C require \u53EA\u662F\u5BF9\u8C61\u548C\u65B9\u6CD5\u800C\u5DF2\uFF0C\u800Cesmodule\u7684import\uFF0Cexport\u5B83\u4EEC\u662F\u5173\u952E\u5B57\uFF0Ces6\u65B0\u52A0\u7684\u3002</p><h1 id="commonjs\u548Ces6\u6A21\u5757\u7684\u5DEE\u5F02" tabindex="-1"><a class="header-anchor" href="#commonjs\u548Ces6\u6A21\u5757\u7684\u5DEE\u5F02" aria-hidden="true">#</a> commonjs\u548Ces6\u6A21\u5757\u7684\u5DEE\u5F02</h1><ul><li>CommonJS \u6A21\u5757\u8F93\u51FA\u7684\u662F\u4E00\u4E2A\u503C\u7684\u62F7\u8D1D\uFF0CES6 \u6A21\u5757\u8F93\u51FA\u7684\u662F\u503C\u7684\u5F15\u7528\u3002</li><li>CommonJS \u6A21\u5757\u662F\u8FD0\u884C\u65F6\u52A0\u8F7D\uFF0CES6 \u6A21\u5757\u662F\u7F16\u8BD1\u65F6\u8F93\u51FA\u63A5\u53E3\u3002</li></ul><h1 id="commonjs\u5177\u4F53\u5B9E\u73B0" tabindex="-1"><a class="header-anchor" href="#commonjs\u5177\u4F53\u5B9E\u73B0" aria-hidden="true">#</a> commonjs\u5177\u4F53\u5B9E\u73B0</h1><p>\u5148\u770B\u4E00\u4E2A\u4F8B\u5B50</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// a.js</span>
<span class="token keyword">let</span> val <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">setVal</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">newVal</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  val <span class="token operator">=</span> newVal
<span class="token punctuation">}</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  val<span class="token punctuation">,</span>
  setVal
<span class="token punctuation">}</span>

<span class="token comment">// b.js</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> val<span class="token punctuation">,</span> setVal <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./a.js&#39;</span><span class="token punctuation">)</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">// 1</span>

<span class="token function">setVal</span><span class="token punctuation">(</span><span class="token number">101</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">// 1</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u6211\u4EEC\u53EF\u4EE5\u8FD9\u6837\u5B50\u7406\u89E3\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>const myModule = {
  exports: {}
}

let val = 1;

const setVal = (newVal) =&gt; {
  val = newVal
}

myModule.exports = {
  val,
  setVal
}

const { val: useVal, setVal: useSetVal } = myModule.exports

console.log(useVal);

useSetVal(101)

console.log(useVal);

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u8FD9\u91CC\u6211\u4EEC\u5C31\u53EF\u4EE5\u7406\u89E3\u4EC0\u4E48\u53EB\u503C\u7684\u62F7\u8D1D\u4E86</p><p>\u6211\u4EEC\u7684val\u548C\u6A21\u5757\u91CC\u7684val\u662F\u4E0D\u4E00\u6837\u7684\u6240\u4EE5\u4F7F\u7528setVal\u4FEE\u6539\u6CA1\u6709\u6548\u679C</p><p>\u5728es module\u4E2D\u5C31\u4E0D\u662F\u8F93\u51FA\u5BF9\u8C61\u7684\u62F7\u8D1D\u4E86\uFF0C\u800C\u662F\u503C\u7684\u5F15\u7528</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>// a.js
import { foo } from &#39;./b&#39;;
console.log(foo);
setTimeout(() =&gt; {
  console.log(foo);
  import(&#39;./b&#39;).then(({ foo }) =&gt; {
    console.log(foo);
  });
}, 1000);

// b.js
export let foo = 1;
setTimeout(() =&gt; {
  foo = 2;
}, 500);
// \u6267\u884C\uFF1Ababel-node a.js
// \u6267\u884C\u7ED3\u679C\uFF1A
// 1
// 2
// 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u77E5\u9053\u4E86module\u5927\u6982\u662F\u4E2A\u4EC0\u4E48\u4E1C\u897F\u4E4B\u540E\uFF0C\u6211\u4EEC\u6765\u770B\u770Bcommonjs\u7684\u5177\u4F53\u5B9E\u73B0</p><p>\u9996\u5148\u6211\u4EEC\u5B9A\u4E49\u4E00\u4E2A\u81EA\u5DF1\u7684module\uFF0C\u6BCF\u4E2A\u6587\u4EF6\u90FD\u6709\u4E00\u4E2Amodule\u5BF9\u8C61</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>function MyModule(id = &#39;&#39;) {
  this.id = id;             // \u6A21\u5757\u8DEF\u5F84
  this.exports = {};        // \u5BFC\u51FA\u7684\u4E1C\u897F\u653E\u8FD9\u91CC\uFF0C\u521D\u59CB\u5316\u4E3A\u7A7A\u5BF9\u8C61
  this.loaded = false;      // \u7528\u6765\u6807\u8BC6\u5F53\u524D\u6A21\u5757\u662F\u5426\u5DF2\u7ECF\u52A0\u8F7D
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="require\u65B9\u6CD5" tabindex="-1"><a class="header-anchor" href="#require\u65B9\u6CD5" aria-hidden="true">#</a> require\u65B9\u6CD5</h2><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>MyModule.prototype.require = function (id) {
  return MyModule._load(id);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>load\u65B9\u6CD5\u7528\u6765\u5224\u65ADrequire\u7684\u6A21\u5757\u662F\u5426\u5DF2\u7ECF\u52A0\u5165\u5230\u7F13\u5B58\uFF0C\u5E76\u4E14\u8FD4\u56DE\u9700\u8981\u52A0\u8F7D\u7684\u6A21\u5757\u7684exports</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>
MyModule._load = function (request) {    // request\u662F\u4F20\u5165\u7684\u8DEF\u5F84
  const filename = MyModule._resolveFilename(request);

  // \u5148\u68C0\u67E5\u7F13\u5B58\uFF0C\u5982\u679C\u7F13\u5B58\u5B58\u5728\u4E14\u5DF2\u7ECF\u52A0\u8F7D\uFF0C\u76F4\u63A5\u8FD4\u56DE\u7F13\u5B58
  const cachedModule = MyModule._cache[filename];
  if (cachedModule) {
    return cachedModule.exports;
  }

  // \u5982\u679C\u7F13\u5B58\u4E0D\u5B58\u5728\uFF0C\u6211\u4EEC\u5C31\u52A0\u8F7D\u8FD9\u4E2A\u6A21\u5757
  const module = new MyModule(filename);

  // load\u4E4B\u524D\u5C31\u5C06\u8FD9\u4E2A\u6A21\u5757\u7F13\u5B58\u4E0B\u6765\uFF0C\u8FD9\u6837\u5982\u679C\u6709\u5FAA\u73AF\u5F15\u7528\u5C31\u4F1A\u62FF\u5230\u8FD9\u4E2A\u7F13\u5B58\uFF0C\u4F46\u662F\u8FD9\u4E2A\u7F13\u5B58\u91CC\u9762\u7684exports\u53EF\u80FD\u8FD8\u6CA1\u6709\u6216\u8005\u4E0D\u5B8C\u6574
  MyModule._cache[filename] = module;

  // \u5982\u679C load \u5931\u8D25\uFF0C\u9700\u8981\u5C06 _cache \u4E2D\u76F8\u5E94\u7684\u7F13\u5B58\u5220\u6389\u3002\u8FD9\u91CC\u7B80\u5355\u8D77\u89C1\uFF0C\u4E0D\u505A\u8FD9\u4E2A\u5904\u7406
  module.load(filename);

  return module.exports;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u91CC\u9762\u7684MyModule._resolveFileName\u4E0D\u505A\u8FC7\u591A\u89E3\u91CA\uFF0C\u91CD\u70B9\u89E3\u91CAMyModule.prototype.load</p><p>\u8FD9\u4E2A\u51FD\u6570\u5C31\u662F\u7528\u6765\u83B7\u53D6\u6587\u4EF6\u540E\u7F00\uFF0C\u5E76\u4E14\u91C7\u53D6\u76F8\u5E94\u7684\u65B9\u6CD5\u52A0\u8F7D\uFF0C\u8FD9\u91CC\u6211\u4EEC\u53EA\u5BF9.js\u7684\u52A0\u8F7D\u8FDB\u884C\u89E3\u6790</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>MyModule.prototype.load = function (filename) {
  // \u83B7\u53D6\u6587\u4EF6\u540E\u7F00\u540D
  const extname = path.extname(filename);

  // \u8C03\u7528\u540E\u7F00\u540D\u5BF9\u5E94\u7684\u5904\u7406\u51FD\u6570\u6765\u5904\u7406\uFF0C\u5F53\u524D\u5B9E\u73B0\u53EA\u652F\u6301 JS
  MyModule._extensions[extname](this, filename);

  this.loaded = true;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u5982\u679C\u540E\u7F00\u540D\u662F.js\u4F1A\u8C03\u7528MyModule.prototype._compile</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>MyModule._extensions[&#39;.js&#39;] = function (module, filename) {
  const content = fs.readFileSync(filename, &#39;utf8&#39;);
  module._compile(content, filename);
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="compile\u7684\u5B9E\u73B0" tabindex="-1"><a class="header-anchor" href="#compile\u7684\u5B9E\u73B0" aria-hidden="true">#</a> _compile\u7684\u5B9E\u73B0</h3><p>\u9996\u5148\u6211\u4EEC\u601D\u8003,\u6211\u4EEC\u601D\u8003\u4E3A\u4EC0\u4E48\u53EF\u4EE5\u5728\u6587\u4EF6\u4E2D\u4F7F\u7528<code>exports</code>, <code>require</code>, <code>module</code>, <code>__dirname</code>, <code>__filename</code>....\u8FD9\u662F\u56E0\u4E3A\u6211\u4EEC\u5728\u52A0\u8F7D\u6587\u4EF6\u7684\u65F6\u5019\uFF0CMymodule.prototype. _compile\u628A\u6574\u4E2A\u4EE3\u7801\u5916\u9762\u5957\u4E86\u4E00\u4E2A\u51FD\u6570\uFF0C\u51FD\u6570\u91CC\u9762\u4F20\u5165\u4E86<code>exports</code>, <code>require</code>, <code>module</code>, <code>__dirname</code>, <code>__filename</code>,\u7136\u540E\u628A\u8FD9\u4E2A\u51FD\u6570\u6267\u884C\u4E00\u904D\uFF0C\u5C31\u53EF\u4EE5\u62FF\u5230exports\u4E86</p><h2 id="\u4E3A\u4EC0\u4E48commonjs\u76F8\u4E92\u5F15\u7528\u6CA1\u6709\u4EA7\u751F\u7C7B\u4F3C\u6B7B\u9501\u7684\u95EE\u9898" tabindex="-1"><a class="header-anchor" href="#\u4E3A\u4EC0\u4E48commonjs\u76F8\u4E92\u5F15\u7528\u6CA1\u6709\u4EA7\u751F\u7C7B\u4F3C\u6B7B\u9501\u7684\u95EE\u9898" aria-hidden="true">#</a> \u4E3A\u4EC0\u4E48commonjs\u76F8\u4E92\u5F15\u7528\u6CA1\u6709\u4EA7\u751F\u7C7B\u4F3C\u6B7B\u9501\u7684\u95EE\u9898</h2><p>\u89C2\u5BDFMyModule._load\u6211\u4EEC\u53EF\u4EE5\u53D1\u73B0\u5176\u4E2D\u7684\u5173\u952E\u5728\u4E8E\u52A0\u8F7D\u6A21\u5757\u548C\u52A0\u5165\u7F13\u5B58\u7684\u987A\u5E8F</p><p>\u5373\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>MyModule._cache[filename] = module;
module.load(filename);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>\u5047\u8BBEa.js\u548Cb.js\u76F8\u4E92\u5F15\u7528</p><p>\u82E5\u5148\u52A0\u8F7Da.js,\u7F13\u5B58\u4E2D\u6CA1\u6709a.js\uFF0C\u90A3\u4E48\u5C31\u4F1A\u628Aa.js\u52A0\u5165\u7F13\u5B58\uFF0C\u63A5\u7740\u52A0\u8F7Da.js\uFF0C\u52A0\u8F7Da.js\u7684\u65F6\u5019\u53D1\u73B0\u91CC\u9762require\u4E86b.js\uFF0C\u90A3\u4E48\u53C8\u4F1A\u628Ab.js\u52A0\u5165\u7F13\u5B58\uFF0C\u52A0\u8F7Db.js\uFF0Cb.js\u53D1\u73B0\u91CC\u9762require\u4E86a.js\uFF0Ca.js\u8FD9\u65F6\u5DF2\u7ECF\u7F13\u5B58\u4E86\uFF0C\u4F46\u662F\u8FD8\u6CA1\u6709module.exports\uFF0C\u56E0\u4E3A\u8FD9\u662Fa.js\u8FD8\u6CA1\u52A0\u8F7D\u5B8C\uFF0C\u8FD9\u65F6\u6211\u4EEC\u5C31\u5F15\u5165\u4E86\u4E00\u4E2A\u7A7A\u5BF9\u8C61\uFF0C\u90A3\u4E48\u5C31\u4E0D\u4F1A\u51FA\u73B0\u5FAA\u73AF\u8C03\u7528\u7684\u60C5\u51B5\u3002</p><h1 id="es-module" tabindex="-1"><a class="header-anchor" href="#es-module" aria-hidden="true">#</a> es module</h1><p>\u524D\u9762\u8BF4ESM\u7F16\u8BD1\u65F6\u8F93\u51FA\u63A5\u53E3\uFF0C\u662F\u56E0\u4E3A\u5B83\u7684\u6A21\u5757\u89E3\u6790\u53D1\u751F\u5728\u7F16\u8BD1\u9636\u6BB5\uFF0C\u800Ccommonjs\u6A21\u5757\u89E3\u6790\u53D1\u751F\u5728\u6267\u884C\u9636\u6BB5\uFF0C\u6BD5\u7ADFmodule\u4E5F\u53EA\u662F\u4E00\u4E2A\u5BF9\u8C61\u3002</p><p>import \u4F18\u5148\u6267\u884C</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>// a.js
console.log(&#39;a.js&#39;)
import { foo } from &#39;./b&#39;;

// b.js
export let foo = 1;
console.log(&#39;b.js \u5148\u6267\u884C&#39;);

// \u6267\u884C\u7ED3\u679C:
// b.js \u5148\u6267\u884C
// a.js
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>export \u4F1A\u53D8\u91CF\u63D0\u5347\uFF0C\u8FD9\u6837\u5C31\u53EF\u4EE5\u907F\u514D\u5FAA\u73AF\u5F15\u7528\u9020\u6210\u6B7B\u9501</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>// a.js
import { foo } from &#39;./b&#39;;
console.log(&#39;a.js&#39;);
export const bar = 1;
export const bar2 = () =&gt; {
  console.log(&#39;bar2&#39;);
}
export function bar3() {
  console.log(&#39;bar3&#39;);
}

// b.js
export let foo = 1;
import * as a from &#39;./a&#39;;
console.log(a);

// \u6267\u884C\u7ED3\u679C:
// { bar: undefined, bar2: undefined, bar3: [Function: bar3] }
// a.js
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,39),d=[l];function o(c,r){return n(),s("div",null,d)}const t=e(a,[["render",o],["__file","commonjs&esmodule.html.vue"]]);export{t as default};
