import{ab as n,B as i,C as d,G as l,ac as e}from"./app.7c3fd3fd.js";import"./vendor.0d00c928.js";const s={},a=e('<h1 id="流程梳理" tabindex="-1"><a class="header-anchor" href="#流程梳理" aria-hidden="true">#</a> 流程梳理</h1><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-1b65f790b1808212afb05d32f46ea283_r.png" alt=""></p><ul><li>初始化参数阶段，我们会从webpack.config.js或者命令行中获取到编译参数，并将二者的参数合并得到最终的参数。</li><li>开始编译准备阶段，我们会调用webpack()方法创建一个compiler实例，并且注册每一个Plugin。找到配置参数中的入口文件，调用compiler.run()开始编译。</li><li>模块编译阶段，会从入口文件开始，根据文件后缀名，执行loader对该文件进行处理，通过分析依赖的模块，以递归的方式进行编译。</li><li>完成编译阶段，在模块递归编译完成后，根据模块的依赖关系，最终生成chunk。</li><li>输出文件阶段，根据配置文件的出口文件，将chunk转化成文件输出。</li></ul><h1 id="创建目录" tabindex="-1"><a class="header-anchor" href="#创建目录" aria-hidden="true">#</a> 创建目录</h1><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-4d12dba315d31a7b2aaef46bded4ab84_720w.jpg" alt="img"></p><ul><li><code>webpack/core</code>存放我们自己将要实现的<code>webpack</code>核心代码。</li><li><code>webpack/example</code>存放我们将用来打包的实例项目。</li><li><ul><li><code>webpack/example/webpak.config.js</code>配置文件.</li><li><code>webpack/example/src/entry1</code>第一个入口文件</li><li><code>webpack/example/src/entry1</code>第二个入口文件</li><li><code>webpack/example/src/index.js</code>模块文件</li></ul></li><li><code>webpack/loaders</code>存放我们的自定义<code>loader</code>。</li><li><code>webpack/plugins</code>存放我们的自定义<code>plugin</code>。</li></ul>',6),c=e(`<h1 id="初始化参数阶段" tabindex="-1"><a class="header-anchor" href="#初始化参数阶段" aria-hidden="true">#</a> 初始化参数阶段</h1><h2 id="合并参数" tabindex="-1"><a class="header-anchor" href="#合并参数" aria-hidden="true">#</a> 合并参数</h2><p>我们在<code>webpack/core</code> 文件夹下创建<code>index.js</code> 作为核心入口文件。同时建立<code>webpack.js</code> 作为<code>webpack()</code> 实现文件。通过<code>webpack()</code> 得到compiler实例。</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-9991b7535f55f0465c3e4bb909a833b9_720w.jpg" alt="img"></p><p>在<code>index.js</code> 中我们引入<code>wepack</code> 方法和<code>webpack.config.js</code> ,将参数传入<code>webpack()</code> 得到compiler</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function webpack(options) {
  // 合并参数 得到合并后的参数 mergeOptions
  const mergeOptions = _mergeOptions(options);
}

// 合并参数
function _mergeOptions(options) {
  const shellOptions = process.argv.slice(2).reduce((option, argv) =&gt; {
    // argv -&gt; --mode=production
    const [key, value] = argv.split(&#39;=&#39;);
    if (key &amp;&amp; value) {
      const parseKey = key.slice(2);
      option[parseKey] = value;
    }
    return option;
  }, {});
  return { ...options, ...shellOptions };
}

module.exports = webpack;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面看到<code>webpack()</code> 返回compiler，其实compiler是一个类，现在我们新建<code>webpack/core/compiler.js</code> 来编写compiler类，</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// compiler.js
// Compiler类进行核心编译实现
class Compiler {
  constructor(options) {
    this.options = options;
  }

  // run方法启动编译 
  // 同时run方法接受外部传递的callback
  run(callback) {
  }
}

module.exports = Compiler
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改<code>webpack()</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function webpack(options) {
  // 合并参数 得到合并后的参数 mergeOptions
  const mergeOptions = _mergeOptions(options);
  // 创建compiler对象
  const compiler = new Compiler(mergeOptions)
  
  return compiler
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样我们就把配置参数合并，并且创建了一个compiler对象了。</p><h1 id="编译准备阶段" tabindex="-1"><a class="header-anchor" href="#编译准备阶段" aria-hidden="true">#</a> 编译准备阶段</h1><h2 id="编写plugin" tabindex="-1"><a class="header-anchor" href="#编写plugin" aria-hidden="true">#</a> 编写plugin</h2><p>在编写plugin之前，先完善一下compiler类</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const { SyncHook } = require(&#39;tapable&#39;);

class Compiler {
  constructor(options) {
    this.options = options;
    // 创建plugin hooks
    this.hooks = {
      // 开始编译时的钩子
      run: new SyncHook(),
      // 输出 asset 到 output 目录之前执行 (写入文件之前)
      emit: new SyncHook(),
      // 在 compilation 完成时执行 全部完成编译执行
      done: new SyncHook(),
    };
  }

  // run方法启动编译
  // 同时run方法接受外部传递的callback
  run(callback) {}
}

module.exports = Compiler;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里定义了<code>hooks</code> ，会在打包的不同流程时触发，当我们通过<code>new SyncHook()</code>返回一个对象实例后，我们可以通过<code>this.hook.run.tap(&#39;name&#39;,callback)</code>方法为这个对象上添加事件监听，然后在通过<code>this.hook.run.call()</code>执行所有<code>tap</code>注册的事件。</p><p>现在我们先切回<code>webpack.js</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const Compiler = require(&#39;./compiler&#39;);

function webpack(options) {
  // 合并参数
  const mergeOptions = _mergeOptions(options);
  // 创建compiler对象
  const compiler = new Compiler(mergeOptions);
  // 加载插件
  _loadPlugin(options.plugins, compiler);
  return compiler;
}

// 合并参数
function _mergeOptions(options) {
  const shellOptions = process.argv.slice(2).reduce((option, argv) =&gt; {
    // argv -&gt; --mode=production
    const [key, value] = argv.split(&#39;=&#39;);
    if (key &amp;&amp; value) {
      const parseKey = key.slice(2);
      option[parseKey] = value;
    }
    return option;
  }, {});
  return { ...options, ...shellOptions };
}

// 加载插件函数
function _loadPlugin(plugins, compiler) {
  if (plugins &amp;&amp; Array.isArray(plugins)) {
    plugins.forEach((plugin) =&gt; {
      plugin.apply(compiler);
    });
  }
}

module.exports = webpack;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们通过<code>_loadPlugin</code> 来加载配置中的插件，每个<code>plugin</code> 都有其apply 方法，<code>plugin</code> 本质上也是一个类，现在我们来开始编写一个<code>plugin</code> 类。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// plugin-a.js
// 插件A
class PluginA {
  apply(compiler) {
    // 注册同步钩子
    // 这里的compiler对象就是我们new Compiler()创建的实例哦
    compiler.hooks.run.tap(&#39;Plugin A&#39;, () =&gt; {
      // 调用
      console.log(&#39;PluginA&#39;);
    });
  }
}

module.exports = PluginA;

// plugin-b.js
class PluginB {
  apply(compiler) {
    compiler.hooks.done.tap(&#39;Plugin B&#39;, () =&gt; {
      console.log(&#39;PluginB&#39;);
    });
  }
}

module.exports = PluginB;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这里我们就可以很清楚的明白，其实<code>webpack</code>插件<strong>本质上就是通过发布订阅的模式，通过<code>compiler</code>上监听事件。然后再打包编译过程中触发监听的事件从而添加一定的逻辑影响打包结果</strong>。</p><h2 id="寻找入口文件" tabindex="-1"><a class="header-anchor" href="#寻找入口文件" aria-hidden="true">#</a> 寻找入口文件</h2><p>通过配置参数，获取入口文件路径。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// compiler.js
const { SyncHook } = require(&#39;tapable&#39;);
const { toUnixPath } = require(&#39;./utils&#39;);

class Compiler {
  constructor(options) {
    this.options = options;
    // 相对路径跟路径 Context参数
    this.rootPath = this.options.context || toUnixPath(process.cwd());
    // 创建plugin hooks
    this.hooks = {
      // 开始编译时的钩子
      run: new SyncHook(),
      // 输出 asset 到 output 目录之前执行 (写入文件之前)
      emit: new SyncHook(),
      // 在 compilation 完成时执行 全部完成编译执行
      done: new SyncHook(),
    };
  }

  // run方法启动编译
  // 同时run方法接受外部传递的callback
  run(callback) {
    // 当调用run方式时 触发开始编译的plugin
    this.hooks.run.call();
    // 获取入口配置对象
    const entry = this.getEntry();
  }

  // 获取入口文件路径
  getEntry() {
    let entry = Object.create(null);
    const { entry: optionsEntry } = this.options;
    if (typeof optionsEntry === &#39;string&#39;) {
      entry[&#39;main&#39;] = optionsEntry;
    } else {
      entry = optionsEntry;
    }
    // 将entry变成绝对路径
    Object.keys(entry).forEach((key) =&gt; {
      const value = entry[key];
      if (!path.isAbsolute(value)) {
        // 转化为绝对路径的同时统一路径分隔符为 /
        entry[key] = toUnixPath(path.join(this.rootPath, value));
      }
    });
    return entry;
  }
}

module.exports = Compiler;

// utils/index.js
/**
 *
 * 统一路径分隔符 主要是为了后续生成模块ID方便
 * @param {*} path
 * @returns
 */
function toUnixPath(path) {
  return path.replace(/\\\\/g, &#39;/&#39;);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个阶段就是compiler 调用了run方法了。</p><p><code>this.hooks.run.tap</code></p><p>这个阶段<strong>相当于我们需要告诉订阅者，发布开始执行的订阅</strong>。此时我们通过<code>this.hooks.run.call()</code>执行关于<code>run</code>的所有<code>tap</code>监听方法，从而触发对应的<code>plugin</code>逻辑。</p><p><code>getEntry</code> 函数返回了key为入口文件名称，value为入口文件绝对路径的对象<code>entry</code></p><h1 id="模块编译" tabindex="-1"><a class="header-anchor" href="#模块编译" aria-hidden="true">#</a> 模块编译</h1><p>上边我们讲述了关于编译阶段的准备工作:</p><ul><li>目录/文件基础逻辑补充。</li><li>通过<code>hooks.tap</code>注册<code>webpack</code>插件。</li><li><code>getEntry</code>方法获得各个入口的对象。</li></ul><p>接下来让我们继续完善<code>compiler.js</code>。</p><p>在模块编译阶段，我们需要做的事件:</p><ul><li>根据入口文件路径分析入口文件，对于入口文件进行匹配对应的<code>loader</code>进行处理入口文件。</li><li>将<code>loader</code>处理完成的入口文件使用<code>webpack</code>进行编译。</li><li>分析入口文件依赖，重复上边两个步骤编译对应依赖。</li><li>如果嵌套文件存在依赖文件，递归调用依赖模块进行编译。</li><li>递归编译完成后，组装一个个包含多个模块的<code>chunk</code></li></ul><p>首先我们来补充一下<code>compiler.js</code>的逻辑</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>class Compiler {
  constructor(options) {
    this.options = options;
    // 创建plugin hooks
    this.hooks = {
      // 开始编译时的钩子
      run: new SyncHook(),
      // 输出 asset 到 output 目录之前执行 (写入文件之前)
      emit: new SyncHook(),
      // 在 compilation 完成时执行 全部完成编译执行
      done: new SyncHook(),
    };
    // 保存所有入口模块对象
    this.entries = new Set();
    // 保存所有依赖模块对象
    this.modules = new Set();
    // 所有的代码块对象
    this.chunks = new Set();
    // 存放本次产出的文件对象
    this.assets = new Set();
    // 存放本次编译所有产出的文件名
    this.files = new Set();
  }
  // ...
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="开始编译入口模块" tabindex="-1"><a class="header-anchor" href="#开始编译入口模块" aria-hidden="true">#</a> 开始编译入口模块</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>class Compiler {
    // run方法启动编译
  // 同时run方法接受外部传递的callback
  run(callback) {
    // 当调用run方式时 触发开始编译的plugin
    this.hooks.run.call();
    // 获取入口配置对象
    const entry = this.getEntry();
    // 编译入口文件
    this.buildEntryModule(entry);
  }

  buildEntryModule(entry) {
    Object.keys(entry).forEach((entryName) =&gt; {
      const entryPath = entry[entryName];
      const entryObj = this.buildModule(entryName, entryPath);
      this.entries.add(entryObj);
    });
  }
  
  
  // 模块编译方法
  buildModule(moduleName,modulePath) {
    // ...
    return {}
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>buildModule</code> 是模块编译的核心方法</p><p>在进行代码编写之前，我们先来梳理一下<code>buildModule</code>方法它需要做哪些事情:</p><ul><li><code>buildModule</code>接受两个参数进行模块编译，<strong>第一个为模块所属的入口文件名称</strong>，第二个为需要编译的模块路径。</li><li><code>buildModule</code>方法要进行代码编译的前提就是，通过<code>fs</code>模块根据入口文件路径读取文件源代码。</li><li>读取文件内容之后，调用所有匹配的loader对模块进行处理得到返回后的结果。</li><li>得到<code>loader</code>处理后的结果后，通过<code>babel</code>分析<code>loader</code>处理后的代码，进行代码编译。(这一步编译主要是针对<code>require</code>语句，修改源代码中<code>require</code>语句的路径)。</li><li>如果该入口文件没有依赖与任何模块(<code>require</code>语句)，那么返回编译后的模块对象。</li><li>如果该入口文件存在依赖的模块，递归<code>buildModule</code>方法进行模块编译。</li></ul><p><strong>读取文件内容</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const fs = require(&#39;fs&#39;);
// ...
class Compiler {
      //...
      // 模块编译方法
      buildModule(moduleName, modulePath) {
        // 1. 读取文件原始代码
        const originSourceCode =
          ((this.originSourceCode = fs.readFileSync(modulePath, &#39;utf-8&#39;));
        // moduleCode为修改后的代码
        this.moduleCode = originSourceCode;
      }
      
      // ...
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="匹配loader" tabindex="-1"><a class="header-anchor" href="#匹配loader" aria-hidden="true">#</a> 匹配loader</h2><h3 id="编写loader" tabindex="-1"><a class="header-anchor" href="#编写loader" aria-hidden="true">#</a> 编写loader</h3><p>首先我们需要清楚<strong>简单来说<code>loader</code>本质上就是一个函数，接受我们的源代码作为入参同时返回处理后的结果。</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// loader本质上就是一个函数，接受原始内容，返回转换后的内容。
function loader1(sourceCode) {
  console.log(&#39;join loader1&#39;);
  return sourceCode + \`\\n const loader1 = &#39;https://github.com/19Qingfeng&#39;\`;
}

module.exports = loader1;

function loader2(sourceCode) {
  console.log(&#39;join loader2&#39;);
  return sourceCode + \`\\n const loader2 = &#39;19Qingfeng&#39;\`;
}

module.exports = loader2;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用loader处理文件" tabindex="-1"><a class="header-anchor" href="#使用loader处理文件" aria-hidden="true">#</a> 使用loader处理文件</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 模块编译方法
  buildModule(moduleName, modulePath) {
    // 1. 读取文件原始代码
    const originSourceCode =
      ((this.originSourceCode = fs.readFileSync(modulePath)), &#39;utf-8&#39;);
    // moduleCode为修改后的代码
    this.moduleCode = originSourceCode;
    //  2. 调用loader进行处理
    this.handleLoader(modulePath);
  }

  // 匹配loader处理
  handleLoader(modulePath) {
    const matchLoaders = [];
    // 1. 获取所有传入的loader规则
    const rules = this.options.module.rules;
    rules.forEach((loader) =&gt; {
      const testRule = loader.test;
      if (testRule.test(modulePath)) {
        if (loader.loader) {
          // 仅考虑loader { test:/\\.js$/g, use:[&#39;babel-loader&#39;] }, { test:/\\.js$/, loader:&#39;babel-loader&#39; }
          matchLoaders.push(loader.loader);
        } else {
          matchLoaders.push(...loader.use);
        }
      }
      // 2. 倒序执行loader传入源代码
      for (let i = matchLoaders.length - 1; i &gt;= 0; i--) {
        // 目前我们外部仅支持传入绝对路径的loader模式
        // require引入对应loader
        const loaderFn = require(matchLoaders[i]);
        // 通过loader同步处理我的每一次编译的moduleCode
        this.moduleCode = loaderFn(this.moduleCode);
      }
    });
  }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>buildModule</code> 修改为读取模块文件代码后匹配对应的loader进行处理。</p><p>先是遍历rules获取到所有与该模块对应的loader，接着倒序传入loader进行编译。</p><p>现在只要把模块传入<code>buildModule</code> 就可以得到经过loader修改后的代码了。</p><h2 id="webpack模块编译阶段" tabindex="-1"><a class="header-anchor" href="#webpack模块编译阶段" aria-hidden="true">#</a> webpack模块编译阶段</h2><p>这里我们需要做的是:<strong>针对当前模块进行编译，将当前模块所有依赖的模块(<code>require()</code>)语句引入的路径变为相对于跟路径(<code>this.rootPath</code>)的相对路径</strong>。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const parser = require(&#39;@babel/parser&#39;);
const traverse = require(&#39;@babel/traverse&#39;).default;
const generator = require(&#39;@babel/generator&#39;).default;
const t = require(&#39;@babel/types&#39;);
const tryExtensions = require(&#39;./utils/index&#39;)
// ...
  class Compiler {
     // ...
      
     // 模块编译方法
      buildModule(moduleName, modulePath) {
        // 1. 读取文件原始代码
        const originSourceCode =
          ((this.originSourceCode = fs.readFileSync(modulePath)), &#39;utf-8&#39;);
        // moduleCode为修改后的代码
        this.moduleCode = originSourceCode;
        //  2. 调用loader进行处理
        this.handleLoader(modulePath);
        // 3. 调用webpack 进行模块编译 获得最终的module对象
        const module = this.handleWebpackCompiler(moduleName, modulePath);
        // 4. 返回对应module
        return module
      }

      // 调用webpack进行模块编译
      handleWebpackCompiler(moduleName, modulePath) {
        // 将当前模块相对于项目启动根目录计算出相对路径 作为模块ID
        const moduleId = &#39;./&#39; + path.posix.relative(this.rootPath, modulePath);
        // 创建模块对象
        const module = {
          id: moduleId,
          dependencies: new Set(), // 该模块所依赖模块绝对路径地址
          name: [moduleName], // 该模块所属的入口文件
        };
        // 调用babel分析我们的代码
        const ast = parser.parse(this.moduleCode, {
          sourceType: &#39;module&#39;,
        });
        // 深度优先 遍历语法Tree
        traverse(ast, {
          // 当遇到require语句时
          CallExpression:(nodePath) =&gt; {
            const node = nodePath.node;
            if (node.callee.name === &#39;require&#39;) {
              // 获得源代码中引入模块相对路径
              const requirePath = node.arguments[0].value;
              // 寻找模块绝对路径 当前模块路径+require()对应相对路径
              const moduleDirName = path.posix.dirname(modulePath);
              const absolutePath = tryExtensions(
                path.posix.join(moduleDirName, requirePath),
                this.options.resolve.extensions,
                requirePath,
                moduleDirName
              );
              // 生成moduleId - 针对于跟路径的模块ID 添加进入新的依赖模块路径
              const moduleId =
                &#39;./&#39; + path.posix.relative(this.rootPath, absolutePath);
              // 通过babel修改源代码中的require变成__webpack_require__语句
              node.callee = t.identifier(&#39;__webpack_require__&#39;);
              // 修改源代码中require语句引入的模块 全部修改变为相对于跟路径来处理
              node.arguments = [t.stringLiteral(moduleId)];
              // 为当前模块添加require语句造成的依赖(内容为相对于根路径的模块ID)
              module.dependencies.add(moduleId);
            }
          },
        });
        // 遍历结束根据AST生成新的代码
        const { code } = generator(ast);
        // 为当前模块挂载新的生成的代码
        module._source = code;
        // 返回当前模块对象
        return module
      }
  }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>关注<code>handleWebpackCompiler</code> 方法，这里我们计算出了模块相对于根路径的相对路径计算作为模块的id出来，接着创建了模块对象，深度优先遍历<code>ast</code>语法树，当匹配到require时就将依赖的模块也计算出相对于根路径的相对路径作为模块id加入<code>module.dependenices</code> ，然后将源代码中的require改为<code>__webpack_require__</code></p><h3 id="递归处理" tabindex="-1"><a class="header-anchor" href="#递归处理" aria-hidden="true">#</a> 递归处理</h3><p>我们只需要在最后添加</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 递归依赖深度遍历 存在依赖模块则加入
    module.dependencies.forEach((dependency) =&gt; {
      const depModule = this.buildModule(moduleName, dependency);
      // 将编译后的任何依赖模块对象加入到modules对象中去
      this.modules.add(depModule);
    });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样我们就可以获得</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-42d0c7f75fa32ccb632333da83ff4bbb_720w.jpg" alt="img"></p><p>这样我们就可以获得解析后的入口文件对象，和所有入口文件依赖的对象</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Set {
  {
    id: &#39;./example/src/entry1.js&#39;,
    dependencies: Set { &#39;./example/src/module.js&#39; },
    name: [ &#39;main&#39; ],
    _source: &#39;const depModule = __webpack_require__(&quot;./example/src/module.js&quot;);\\n&#39; +
      &#39;\\n&#39; +
      &quot;console.log(depModule, &#39;dep&#39;);\\n&quot; +
      &quot;console.log(&#39;This is entry 1 !&#39;);\\n&quot; +
      &quot;const loader2 = &#39;19Qingfeng&#39;;\\n&quot; +
      &quot;const loader1 = &#39;https://github.com/19Qingfeng&#39;;&quot;
  },
  {
    id: &#39;./example/src/entry2.js&#39;,
    dependencies: Set { &#39;./example/src/module.js&#39; },
    name: [ &#39;second&#39; ],
    _source: &#39;const depModule = __webpack_require__(&quot;./example/src/module.js&quot;);\\n&#39; +
      &#39;\\n&#39; +
      &quot;console.log(depModule, &#39;dep&#39;);\\n&quot; +
      &quot;console.log(&#39;This is entry 2 !&#39;);\\n&quot; +
      &quot;const loader2 = &#39;19Qingfeng&#39;;\\n&quot; +
      &quot;const loader1 = &#39;https://github.com/19Qingfeng&#39;;&quot;
  }
} entries
Set {
  {
    id: &#39;./example/src/module.js&#39;,
    dependencies: Set {},
    name: [ &#39;main&#39; ],
    _source: &quot;const name = &#39;19Qingfeng&#39;;\\n&quot; +
      &#39;module.exports = {\\n&#39; +
      &#39;  name\\n&#39; +
      &#39;};\\n&#39; +
      &quot;const loader2 = &#39;19Qingfeng&#39;;\\n&quot; +
      &quot;const loader1 = &#39;https://github.com/19Qingfeng&#39;;&quot;
  },
  {
    id: &#39;./example/src/module.js&#39;,
    dependencies: Set {},
    name: [ &#39;second&#39; ],
    _source: &quot;const name = &#39;19Qingfeng&#39;;\\n&quot; +
      &#39;module.exports = {\\n&#39; +
      &#39;  name\\n&#39; +
      &#39;};\\n&#39; +
      &quot;const loader2 = &#39;19Qingfeng&#39;;\\n&quot; +
      &quot;const loader1 = &#39;https://github.com/19Qingfeng&#39;;&quot;
  }
} modules
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里<code>module.js</code> 被引用了两次，对<code>handleWebpackCompiler</code>进行一下优化</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    handleWebpackCompiler(moduleName, modulePath) {
       ...
        // 通过babel修改源代码中的require变成__webpack_require__语句
          node.callee = t.identifier(&#39;__webpack_require__&#39;);
          // 修改源代码中require语句引入的模块 全部修改变为相对于跟路径来处理
          node.arguments = [t.stringLiteral(moduleId)];
          // 转化为ids的数组 好处理
          const alreadyModules = Array.from(this.modules).map((i) =&gt; i.id);
          if (!alreadyModules.includes(moduleId)) {
            // 为当前模块添加require语句造成的依赖(内容为相对于根路径的模块ID)
            module.dependencies.add(moduleId);
          } else {
            // 已经存在的话 虽然不进行添加进入模块编译 但是仍要更新这个模块依赖的入口
            this.modules.forEach((value) =&gt; {
              if (value.id === moduleId) {
                value.name.push(moduleName);
              }
            });
          }
        }
      },
    });
    ...
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时针对我们的“模块编译阶段”基本已经结束了，这一步我们对于所有模块从入口文件开始进行分析。</p><ul><li>从入口出发，读取入口文件内容调用匹配<code>loader</code>处理入口文件。</li><li>通过<code>babel</code>分析依赖，并且同时将所有依赖的路径更换为相对于项目启动目录<code>options.context</code>的路径。</li><li>入口文件中如果存在依赖的话，递归上述步骤编译依赖模块。</li><li>将每个依赖的模块编译后的对象加入<code>this.modules</code>。</li><li>将每个入口文件编译后的对象加入<code>this.entries</code>。</li></ul><h1 id="编译完成阶段" tabindex="-1"><a class="header-anchor" href="#编译完成阶段" aria-hidden="true">#</a> 编译完成阶段</h1><p>在将所有模块递归编译完成后，我们需要<strong>根据上述的依赖关系，组合最终输出的<code>chunk</code>模块</strong>。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>class Compiler {

    // ...
    buildEntryModule(entry) {
        Object.keys(entry).forEach((entryName) =&gt; {
          const entryPath = entry[entryName];
          // 调用buildModule实现真正的模块编译逻辑
          const entryObj = this.buildModule(entryName, entryPath);
          this.entries.add(entryObj);
          // 根据当前入口文件和模块的相互依赖关系，组装成为一个个包含当前入口所有依赖模块的chunk
          this.buildUpChunk(entryName, entryObj);
        });
        console.log(this.chunks, &#39;chunks&#39;);
    }
    
     // 根据入口文件和依赖模块组装chunks
      buildUpChunk(entryName, entryObj) {
        const chunk = {
          name: entryName, // 每一个入口文件作为一个chunk
          entryModule: entryObj, // entry编译后的对象
          modules: Array.from(this.modules).filter((i) =&gt;
            i.name.includes(entryName)
          ), // 寻找与当前entry有关的所有module
        };
        // 将chunk添加到this.chunks中去
        this.chunks.add(chunk);
      }
      
      // ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>关注<code>buildUpChunk</code> 方法，chunk是一个对象，包括入口文件的名称，入口文件编译后的对象和其依赖的模块</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Set {
  {
    name: &#39;main&#39;,
    entryModule: {
      id: &#39;./example/src/entry1.js&#39;,
      dependencies: [Set],
      name: [Array],
      _source: &#39;const depModule = __webpack_require__(&quot;./example/src/module.js&quot;);\\n&#39; +
        &#39;\\n&#39; +
        &quot;console.log(depModule, &#39;dep&#39;);\\n&quot; +
        &quot;console.log(&#39;This is entry 1 !&#39;);\\n&quot; +
        &quot;const loader2 = &#39;19Qingfeng&#39;;\\n&quot; +
        &quot;const loader1 = &#39;https://github.com/19Qingfeng&#39;;&quot;
    },
    modules: [ [Object] ]
  },
  {
    name: &#39;second&#39;,
    entryModule: {
      id: &#39;./example/src/entry2.js&#39;,
      dependencies: Set {},
      name: [Array],
      _source: &#39;const depModule = __webpack_require__(&quot;./example/src/module.js&quot;);\\n&#39; +
        &#39;\\n&#39; +
        &quot;console.log(depModule, &#39;dep&#39;);\\n&quot; +
        &quot;console.log(&#39;This is entry 2 !&#39;);\\n&quot; +
        &quot;const loader2 = &#39;19Qingfeng&#39;;\\n&quot; +
        &quot;const loader1 = &#39;https://github.com/19Qingfeng&#39;;&quot;
    },
    modules: []
  }
} 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这一步，<strong>我们得到了<code>Webpack</code>中最终输出的两个<code>chunk</code></strong>。</p><p>它们分别拥有:</p><ul><li><code>name</code>:当前入口文件的名称</li><li><code>entryModule</code>: 入口文件编译后的对象。</li><li><code>modules</code>: 该入口文件依赖的所有模块对象组成的数组，其中每一个元素的格式和<code>entryModule</code>是一致的。</li></ul><p>此时编译完成我们拼装<code>chunk</code>的环节就圆满完成。</p><h1 id="输出文件阶段" tabindex="-1"><a class="header-anchor" href="#输出文件阶段" aria-hidden="true">#</a> 输出文件阶段</h1><p>我们先来看下用原本<code>webpack</code>打包出来的样子</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>(() =&gt; {
  var __webpack_modules__ = {
    &#39;./example/src/module.js&#39;: (module) =&gt; {
      const name = &#39;19Qingfeng&#39;;

      module.exports = {
        name,
      };

      const loader2 = &#39;19Qingfeng&#39;;
      const loader1 = &#39;https://github.com/19Qingfeng&#39;;
    },
  };
  // The module cache
  var __webpack_module_cache__ = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // Create a new module (and put it into the cache)
    var module = (__webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {},
    });

    // Execute the module function
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }

  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() =&gt; {
    const depModule = __webpack_require__(
      /*! ./module */ &#39;./example/src/module.js&#39;
    );

    console.log(depModule, &#39;dep&#39;);
    console.log(&#39;This is entry 1 !&#39;);

    const loader2 = &#39;19Qingfeng&#39;;
    const loader1 = &#39;https://github.com/19Qingfeng&#39;;
  })();
})();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-a0d174fa870488fcdaa1384747f7d8de_720w.jpg" alt="img"></p><p>这一块是入口文件代码</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-d3295115ff75616cabd412608a0a1bc1_720w.jpg" alt="img"></p><p>这一块是入口文件依赖的代码</p><p>回到compiler的run方法</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>   class Compiler {
   
   }
  // run方法启动编译
  // 同时run方法接受外部传递的callback
  run(callback) {
    // 当调用run方式时 触发开始编译的plugin
    this.hooks.run.call();
    // 获取入口配置对象
    const entry = this.getEntry();
    // 编译入口文件
    this.buildEntryModule(entry);
    // 导出列表;之后将每个chunk转化称为单独的文件加入到输出列表assets中
    this.exportFile(callback);
  }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>exportFile</code>方法</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 将chunk加入输出列表中去
  exportFile(callback) {
    const output = this.options.output;
    // 根据chunks生成assets内容
    this.chunks.forEach((chunk) =&gt; {
      const parseFileName = output.filename.replace(&#39;[name]&#39;, chunk.name);
      // assets中 { &#39;main.js&#39;: &#39;生成的字符串代码...&#39; }
      this.assets[parseFileName] = getSourceCode(chunk);
    });
    // 调用Plugin emit钩子
    this.hooks.emit.call();
    // 先判断目录是否存在 存在直接fs.write 不存在则首先创建
    if (!fs.existsSync(output.path)) {
      fs.mkdirSync(output.path);
    }
    // files中保存所有的生成文件名
    this.files = Object.keys(this.assets);
    // 将assets中的内容生成打包文件 写入文件系统中
    Object.keys(this.assets).forEach((fileName) =&gt; {
      const filePath = path.join(output.path, fileName);
      fs.writeFileSync(filePath, this.assets[fileName]);
    });
    // 结束之后触发钩子
    this.hooks.done.call();
    callback(null, {
      toJson: () =&gt; {
        return {
          entries: this.entries,
          modules: this.modules,
          files: this.files,
          chunks: this.chunks,
          assets: this.assets,
        };
      },
    });
  }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>exportFile</code>做了如下几件事:</p><ul><li>首先获取配置参数的输出配置，迭代我们的<code>this.chunks</code>，将<code>output.filename</code>中的<code>[name]</code>替换称为对应的入口文件名称。同时根据<code>chunks</code>的内容为<code>this.assets</code>中添加需要打包生成的文件名和文件内容。</li><li>将文件写入磁盘前调用<code>plugin</code>的<code>emit</code>钩子函数。</li><li>判断<code>output.path</code>文件夹是否存在，如果不存在，则通过<code>fs</code>新建这个文件夹。</li><li>将本次打包生成的所有文件名(<code>this.assets</code>的<code>key</code>值组成的数组)存放进入<code>files</code>中去。</li><li>循环<code>this.assets</code>，将文件依次写入对应的磁盘中去。</li><li>所有打包流程结束，触发<code>webpack</code>插件的<code>done</code>钩子。</li><li>同时为<code>NodeJs Webpack APi</code>呼应，调用<code>run</code>方法中外部传入的<code>callback</code>传入两个参数。</li></ul><h2 id="getsourcecode方法" tabindex="-1"><a class="header-anchor" href="#getsourcecode方法" aria-hidden="true">#</a> getSourceCode方法</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// webpack/utils/index.js

...


/**
 *
 *
 * @param {*} chunk
 * name属性入口文件名称
 * entryModule入口文件module对象
 * modules 依赖模块路径
 */
function getSourceCode(chunk) {
  const { name, entryModule, modules } = chunk;
  return \`
  (() =&gt; {
    var __webpack_modules__ = {
      \${modules
        .map((module) =&gt; {
          return \`
          &#39;\${module.id}&#39;: (module) =&gt; {
            \${module._source}
      }
        \`;
        })
        .join(&#39;,&#39;)}
    };
    // The module cache
    var __webpack_module_cache__ = {};

    // The require function
    function __webpack_require__(moduleId) {
      // Check if module is in cache
      var cachedModule = __webpack_module_cache__[moduleId];
      if (cachedModule !== undefined) {
        return cachedModule.exports;
      }
      // Create a new module (and put it into the cache)
      var module = (__webpack_module_cache__[moduleId] = {
        // no module.id needed
        // no module.loaded needed
        exports: {},
      });

      // Execute the module function
      __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

      // Return the exports of the module
      return module.exports;
    }

    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
    (() =&gt; {
      \${entryModule._source}
    })();
  })();
  \`;
}
...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>就是将chunk中的内容拼接成新的代码，和原本<code>webpack</code>输出一样的代码</p><p>这样我们实现了我们自己的webpack了</p><h1 id="流程图" tabindex="-1"><a class="header-anchor" href="#流程图" aria-hidden="true">#</a> 流程图</h1><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-8d4251b93254298f60b29dd06aa6d1cf_r.jpg" alt="preview"></p>`,95);function r(v,u){return i(),d("div",null,[a,l("more"),c])}const t=n(s,[["render",r],["__file","webpack.html.vue"]]);export{t as default};
