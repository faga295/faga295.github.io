(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{434:function(e,n,o){"use strict";o.r(n);var t=o(65),s=Object(t.a)({},(function(){var e=this,n=e.$createElement,o=e._self._c||n;return o("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[o("h1",{attrs:{id:"流程梳理"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#流程梳理"}},[e._v("#")]),e._v(" 流程梳理")]),e._v(" "),o("p",[o("img",{attrs:{src:"https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-1b65f790b1808212afb05d32f46ea283_r.png",alt:""}})]),e._v(" "),o("ul",[o("li",[e._v("初始化参数阶段，我们会从webpack.config.js或者命令行中获取到编译参数，并将二者的参数合并得到最终的参数。")]),e._v(" "),o("li",[e._v("开始编译准备阶段，我们会调用webpack()方法创建一个compiler实例，并且注册每一个Plugin。找到配置参数中的入口文件，调用compiler.run()开始编译。")]),e._v(" "),o("li",[e._v("模块编译阶段，会从入口文件开始，根据文件后缀名，执行loader对该文件进行处理，通过分析依赖的模块，以递归的方式进行编译。")]),e._v(" "),o("li",[e._v("完成编译阶段，在模块递归编译完成后，根据模块的依赖关系，最终生成chunk。")]),e._v(" "),o("li",[e._v("输出文件阶段，根据配置文件的出口文件，将chunk转化成文件输出。")])]),e._v(" "),o("h1",{attrs:{id:"创建目录"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#创建目录"}},[e._v("#")]),e._v(" 创建目录")]),e._v(" "),o("p",[o("img",{attrs:{src:"https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-4d12dba315d31a7b2aaef46bded4ab84_720w.jpg",alt:"img"}})]),e._v(" "),o("ul",[o("li",[o("code",[e._v("webpack/core")]),e._v("存放我们自己将要实现的"),o("code",[e._v("webpack")]),e._v("核心代码。")]),e._v(" "),o("li",[o("code",[e._v("webpack/example")]),e._v("存放我们将用来打包的实例项目。")]),e._v(" "),o("li",[o("ul",[o("li",[o("code",[e._v("webpack/example/webpak.config.js")]),e._v("配置文件.")]),e._v(" "),o("li",[o("code",[e._v("webpack/example/src/entry1")]),e._v("第一个入口文件")]),e._v(" "),o("li",[o("code",[e._v("webpack/example/src/entry1")]),e._v("第二个入口文件")]),e._v(" "),o("li",[o("code",[e._v("webpack/example/src/index.js")]),e._v("模块文件")])])]),e._v(" "),o("li",[o("code",[e._v("webpack/loaders")]),e._v("存放我们的自定义"),o("code",[e._v("loader")]),e._v("。")]),e._v(" "),o("li",[o("code",[e._v("webpack/plugins")]),e._v("存放我们的自定义"),o("code",[e._v("plugin")]),e._v("。")])]),e._v(" "),o("h1",{attrs:{id:"初始化参数阶段"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#初始化参数阶段"}},[e._v("#")]),e._v(" 初始化参数阶段")]),e._v(" "),o("h2",{attrs:{id:"合并参数"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#合并参数"}},[e._v("#")]),e._v(" 合并参数")]),e._v(" "),o("p",[e._v("我们在"),o("code",[e._v("webpack/core")]),e._v(" 文件夹下创建"),o("code",[e._v("index.js")]),e._v(" 作为核心入口文件。同时建立"),o("code",[e._v("webpack.js")]),e._v(" 作为"),o("code",[e._v("webpack()")]),e._v(" 实现文件。通过"),o("code",[e._v("webpack()")]),e._v(" 得到compiler实例。")]),e._v(" "),o("p",[o("img",{attrs:{src:"https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-9991b7535f55f0465c3e4bb909a833b9_720w.jpg",alt:"img"}})]),e._v(" "),o("p",[e._v("在"),o("code",[e._v("index.js")]),e._v(" 中我们引入"),o("code",[e._v("wepack")]),e._v(" 方法和"),o("code",[e._v("webpack.config.js")]),e._v(" ,将参数传入"),o("code",[e._v("webpack()")]),e._v(" 得到compiler")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("function webpack(options) {\n  // 合并参数 得到合并后的参数 mergeOptions\n  const mergeOptions = _mergeOptions(options);\n}\n\n// 合并参数\nfunction _mergeOptions(options) {\n  const shellOptions = process.argv.slice(2).reduce((option, argv) => {\n    // argv -> --mode=production\n    const [key, value] = argv.split('=');\n    if (key &amp;&amp; value) {\n      const parseKey = key.slice(2);\n      option[parseKey] = value;\n    }\n    return option;\n  }, {});\n  return { ...options, ...shellOptions };\n}\n\nmodule.exports = webpack;\n")])])]),o("p",[e._v("上面看到"),o("code",[e._v("webpack()")]),e._v(" 返回compiler，其实compiler是一个类，现在我们新建"),o("code",[e._v("webpack/core/compiler.js")]),e._v(" 来编写compiler类，")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("// compiler.js\n// Compiler类进行核心编译实现\nclass Compiler {\n  constructor(options) {\n    this.options = options;\n  }\n\n  // run方法启动编译 \n  // 同时run方法接受外部传递的callback\n  run(callback) {\n  }\n}\n\nmodule.exports = Compiler\n")])])]),o("p",[e._v("修改"),o("code",[e._v("webpack()")])]),e._v(" "),o("div",{staticClass:"language- extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("function webpack(options) {\n  // 合并参数 得到合并后的参数 mergeOptions\n  const mergeOptions = _mergeOptions(options);\n  // 创建compiler对象\n  const compiler = new Compiler(mergeOptions)\n  \n  return compiler\n}\n")])])]),o("p",[e._v("这样我们就把配置参数合并，并且创建了一个compiler对象了。")]),e._v(" "),o("h1",{attrs:{id:"编译准备阶段"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#编译准备阶段"}},[e._v("#")]),e._v(" 编译准备阶段")]),e._v(" "),o("h2",{attrs:{id:"编写plugin"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#编写plugin"}},[e._v("#")]),e._v(" 编写plugin")]),e._v(" "),o("p",[e._v("在编写plugin之前，先完善一下compiler类")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("const { SyncHook } = require('tapable');\n\nclass Compiler {\n  constructor(options) {\n    this.options = options;\n    // 创建plugin hooks\n    this.hooks = {\n      // 开始编译时的钩子\n      run: new SyncHook(),\n      // 输出 asset 到 output 目录之前执行 (写入文件之前)\n      emit: new SyncHook(),\n      // 在 compilation 完成时执行 全部完成编译执行\n      done: new SyncHook(),\n    };\n  }\n\n  // run方法启动编译\n  // 同时run方法接受外部传递的callback\n  run(callback) {}\n}\n\nmodule.exports = Compiler;\n")])])]),o("p",[e._v("这里定义了"),o("code",[e._v("hooks")]),e._v(" ，会在打包的不同流程时触发，当我们通过"),o("code",[e._v("new SyncHook()")]),e._v("返回一个对象实例后，我们可以通过"),o("code",[e._v("this.hook.run.tap('name',callback)")]),e._v("方法为这个对象上添加事件监听，然后在通过"),o("code",[e._v("this.hook.run.call()")]),e._v("执行所有"),o("code",[e._v("tap")]),e._v("注册的事件。")]),e._v(" "),o("p",[e._v("现在我们先切回"),o("code",[e._v("webpack.js")])]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("const Compiler = require('./compiler');\n\nfunction webpack(options) {\n  // 合并参数\n  const mergeOptions = _mergeOptions(options);\n  // 创建compiler对象\n  const compiler = new Compiler(mergeOptions);\n  // 加载插件\n  _loadPlugin(options.plugins, compiler);\n  return compiler;\n}\n\n// 合并参数\nfunction _mergeOptions(options) {\n  const shellOptions = process.argv.slice(2).reduce((option, argv) => {\n    // argv -> --mode=production\n    const [key, value] = argv.split('=');\n    if (key &amp;&amp; value) {\n      const parseKey = key.slice(2);\n      option[parseKey] = value;\n    }\n    return option;\n  }, {});\n  return { ...options, ...shellOptions };\n}\n\n// 加载插件函数\nfunction _loadPlugin(plugins, compiler) {\n  if (plugins &amp;&amp; Array.isArray(plugins)) {\n    plugins.forEach((plugin) => {\n      plugin.apply(compiler);\n    });\n  }\n}\n\nmodule.exports = webpack;\n")])])]),o("p",[e._v("这里我们通过"),o("code",[e._v("_loadPlugin")]),e._v(" 来加载配置中的插件，每个"),o("code",[e._v("plugin")]),e._v(" 都有其apply 方法，"),o("code",[e._v("plugin")]),e._v(" 本质上也是一个类，现在我们来开始编写一个"),o("code",[e._v("plugin")]),e._v(" 类。")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("// plugin-a.js\n// 插件A\nclass PluginA {\n  apply(compiler) {\n    // 注册同步钩子\n    // 这里的compiler对象就是我们new Compiler()创建的实例哦\n    compiler.hooks.run.tap('Plugin A', () => {\n      // 调用\n      console.log('PluginA');\n    });\n  }\n}\n\nmodule.exports = PluginA;\n\n// plugin-b.js\nclass PluginB {\n  apply(compiler) {\n    compiler.hooks.done.tap('Plugin B', () => {\n      console.log('PluginB');\n    });\n  }\n}\n\nmodule.exports = PluginB;\n")])])]),o("p",[e._v("在这里我们就可以很清楚的明白，其实"),o("code",[e._v("webpack")]),e._v("插件"),o("strong",[e._v("本质上就是通过发布订阅的模式，通过"),o("code",[e._v("compiler")]),e._v("上监听事件。然后再打包编译过程中触发监听的事件从而添加一定的逻辑影响打包结果")]),e._v("。")]),e._v(" "),o("h2",{attrs:{id:"寻找入口文件"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#寻找入口文件"}},[e._v("#")]),e._v(" 寻找入口文件")]),e._v(" "),o("p",[e._v("通过配置参数，获取入口文件路径。")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("// compiler.js\nconst { SyncHook } = require('tapable');\nconst { toUnixPath } = require('./utils');\n\nclass Compiler {\n  constructor(options) {\n    this.options = options;\n    // 相对路径跟路径 Context参数\n    this.rootPath = this.options.context || toUnixPath(process.cwd());\n    // 创建plugin hooks\n    this.hooks = {\n      // 开始编译时的钩子\n      run: new SyncHook(),\n      // 输出 asset 到 output 目录之前执行 (写入文件之前)\n      emit: new SyncHook(),\n      // 在 compilation 完成时执行 全部完成编译执行\n      done: new SyncHook(),\n    };\n  }\n\n  // run方法启动编译\n  // 同时run方法接受外部传递的callback\n  run(callback) {\n    // 当调用run方式时 触发开始编译的plugin\n    this.hooks.run.call();\n    // 获取入口配置对象\n    const entry = this.getEntry();\n  }\n\n  // 获取入口文件路径\n  getEntry() {\n    let entry = Object.create(null);\n    const { entry: optionsEntry } = this.options;\n    if (typeof optionsEntry === 'string') {\n      entry['main'] = optionsEntry;\n    } else {\n      entry = optionsEntry;\n    }\n    // 将entry变成绝对路径\n    Object.keys(entry).forEach((key) => {\n      const value = entry[key];\n      if (!path.isAbsolute(value)) {\n        // 转化为绝对路径的同时统一路径分隔符为 /\n        entry[key] = toUnixPath(path.join(this.rootPath, value));\n      }\n    });\n    return entry;\n  }\n}\n\nmodule.exports = Compiler;\n\n// utils/index.js\n/**\n *\n * 统一路径分隔符 主要是为了后续生成模块ID方便\n * @param {*} path\n * @returns\n */\nfunction toUnixPath(path) {\n  return path.replace(/\\\\/g, '/');\n}\n")])])]),o("p",[e._v("这个阶段就是compiler 调用了run方法了。")]),e._v(" "),o("p",[o("code",[e._v("this.hooks.run.tap")])]),e._v(" "),o("p",[e._v("这个阶段"),o("strong",[e._v("相当于我们需要告诉订阅者，发布开始执行的订阅")]),e._v("。此时我们通过"),o("code",[e._v("this.hooks.run.call()")]),e._v("执行关于"),o("code",[e._v("run")]),e._v("的所有"),o("code",[e._v("tap")]),e._v("监听方法，从而触发对应的"),o("code",[e._v("plugin")]),e._v("逻辑。")]),e._v(" "),o("p",[o("code",[e._v("getEntry")]),e._v(" 函数返回了key为入口文件名称，value为入口文件绝对路径的对象"),o("code",[e._v("entry")])]),e._v(" "),o("h1",{attrs:{id:"模块编译"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#模块编译"}},[e._v("#")]),e._v(" 模块编译")]),e._v(" "),o("p",[e._v("上边我们讲述了关于编译阶段的准备工作:")]),e._v(" "),o("ul",[o("li",[e._v("目录/文件基础逻辑补充。")]),e._v(" "),o("li",[e._v("通过"),o("code",[e._v("hooks.tap")]),e._v("注册"),o("code",[e._v("webpack")]),e._v("插件。")]),e._v(" "),o("li",[o("code",[e._v("getEntry")]),e._v("方法获得各个入口的对象。")])]),e._v(" "),o("p",[e._v("接下来让我们继续完善"),o("code",[e._v("compiler.js")]),e._v("。")]),e._v(" "),o("p",[e._v("在模块编译阶段，我们需要做的事件:")]),e._v(" "),o("ul",[o("li",[e._v("根据入口文件路径分析入口文件，对于入口文件进行匹配对应的"),o("code",[e._v("loader")]),e._v("进行处理入口文件。")]),e._v(" "),o("li",[e._v("将"),o("code",[e._v("loader")]),e._v("处理完成的入口文件使用"),o("code",[e._v("webpack")]),e._v("进行编译。")]),e._v(" "),o("li",[e._v("分析入口文件依赖，重复上边两个步骤编译对应依赖。")]),e._v(" "),o("li",[e._v("如果嵌套文件存在依赖文件，递归调用依赖模块进行编译。")]),e._v(" "),o("li",[e._v("递归编译完成后，组装一个个包含多个模块的"),o("code",[e._v("chunk")])])]),e._v(" "),o("p",[e._v("首先我们来补充一下"),o("code",[e._v("compiler.js")]),e._v("的逻辑")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("class Compiler {\n  constructor(options) {\n    this.options = options;\n    // 创建plugin hooks\n    this.hooks = {\n      // 开始编译时的钩子\n      run: new SyncHook(),\n      // 输出 asset 到 output 目录之前执行 (写入文件之前)\n      emit: new SyncHook(),\n      // 在 compilation 完成时执行 全部完成编译执行\n      done: new SyncHook(),\n    };\n    // 保存所有入口模块对象\n    this.entries = new Set();\n    // 保存所有依赖模块对象\n    this.modules = new Set();\n    // 所有的代码块对象\n    this.chunks = new Set();\n    // 存放本次产出的文件对象\n    this.assets = new Set();\n    // 存放本次编译所有产出的文件名\n    this.files = new Set();\n  }\n  // ...\n }\n")])])]),o("h2",{attrs:{id:"开始编译入口模块"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#开始编译入口模块"}},[e._v("#")]),e._v(" 开始编译入口模块")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("class Compiler {\n    // run方法启动编译\n  // 同时run方法接受外部传递的callback\n  run(callback) {\n    // 当调用run方式时 触发开始编译的plugin\n    this.hooks.run.call();\n    // 获取入口配置对象\n    const entry = this.getEntry();\n    // 编译入口文件\n    this.buildEntryModule(entry);\n  }\n\n  buildEntryModule(entry) {\n    Object.keys(entry).forEach((entryName) => {\n      const entryPath = entry[entryName];\n      const entryObj = this.buildModule(entryName, entryPath);\n      this.entries.add(entryObj);\n    });\n  }\n  \n  \n  // 模块编译方法\n  buildModule(moduleName,modulePath) {\n    // ...\n    return {}\n  }\n}\n")])])]),o("p",[o("code",[e._v("buildModule")]),e._v("  是模块编译的核心方法")]),e._v(" "),o("p",[e._v("在进行代码编写之前，我们先来梳理一下"),o("code",[e._v("buildModule")]),e._v("方法它需要做哪些事情:")]),e._v(" "),o("ul",[o("li",[o("code",[e._v("buildModule")]),e._v("接受两个参数进行模块编译，"),o("strong",[e._v("第一个为模块所属的入口文件名称")]),e._v("，第二个为需要编译的模块路径。")]),e._v(" "),o("li",[o("code",[e._v("buildModule")]),e._v("方法要进行代码编译的前提就是，通过"),o("code",[e._v("fs")]),e._v("模块根据入口文件路径读取文件源代码。")]),e._v(" "),o("li",[e._v("读取文件内容之后，调用所有匹配的loader对模块进行处理得到返回后的结果。")]),e._v(" "),o("li",[e._v("得到"),o("code",[e._v("loader")]),e._v("处理后的结果后，通过"),o("code",[e._v("babel")]),e._v("分析"),o("code",[e._v("loader")]),e._v("处理后的代码，进行代码编译。(这一步编译主要是针对"),o("code",[e._v("require")]),e._v("语句，修改源代码中"),o("code",[e._v("require")]),e._v("语句的路径)。")]),e._v(" "),o("li",[e._v("如果该入口文件没有依赖与任何模块("),o("code",[e._v("require")]),e._v("语句)，那么返回编译后的模块对象。")]),e._v(" "),o("li",[e._v("如果该入口文件存在依赖的模块，递归"),o("code",[e._v("buildModule")]),e._v("方法进行模块编译。")])]),e._v(" "),o("p",[o("strong",[e._v("读取文件内容")])]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("const fs = require('fs');\n// ...\nclass Compiler {\n      //...\n      // 模块编译方法\n      buildModule(moduleName, modulePath) {\n        // 1. 读取文件原始代码\n        const originSourceCode =\n          ((this.originSourceCode = fs.readFileSync(modulePath, 'utf-8'));\n        // moduleCode为修改后的代码\n        this.moduleCode = originSourceCode;\n      }\n      \n      // ...\n }\n")])])]),o("h2",{attrs:{id:"匹配loader"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#匹配loader"}},[e._v("#")]),e._v(" 匹配loader")]),e._v(" "),o("h3",{attrs:{id:"编写loader"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#编写loader"}},[e._v("#")]),e._v(" 编写loader")]),e._v(" "),o("p",[e._v("首先我们需要清楚"),o("strong",[e._v("简单来说"),o("code",[e._v("loader")]),e._v("本质上就是一个函数，接受我们的源代码作为入参同时返回处理后的结果。")])]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("// loader本质上就是一个函数，接受原始内容，返回转换后的内容。\nfunction loader1(sourceCode) {\n  console.log('join loader1');\n  return sourceCode + `\\n const loader1 = 'https://github.com/19Qingfeng'`;\n}\n\nmodule.exports = loader1;\n\nfunction loader2(sourceCode) {\n  console.log('join loader2');\n  return sourceCode + `\\n const loader2 = '19Qingfeng'`;\n}\n\nmodule.exports = loader2;\n")])])]),o("h3",{attrs:{id:"使用loader处理文件"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#使用loader处理文件"}},[e._v("#")]),e._v(" 使用loader处理文件")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("// 模块编译方法\n  buildModule(moduleName, modulePath) {\n    // 1. 读取文件原始代码\n    const originSourceCode =\n      ((this.originSourceCode = fs.readFileSync(modulePath)), 'utf-8');\n    // moduleCode为修改后的代码\n    this.moduleCode = originSourceCode;\n    //  2. 调用loader进行处理\n    this.handleLoader(modulePath);\n  }\n\n  // 匹配loader处理\n  handleLoader(modulePath) {\n    const matchLoaders = [];\n    // 1. 获取所有传入的loader规则\n    const rules = this.options.module.rules;\n    rules.forEach((loader) => {\n      const testRule = loader.test;\n      if (testRule.test(modulePath)) {\n        if (loader.loader) {\n          // 仅考虑loader { test:/\\.js$/g, use:['babel-loader'] }, { test:/\\.js$/, loader:'babel-loader' }\n          matchLoaders.push(loader.loader);\n        } else {\n          matchLoaders.push(...loader.use);\n        }\n      }\n      // 2. 倒序执行loader传入源代码\n      for (let i = matchLoaders.length - 1; i >= 0; i--) {\n        // 目前我们外部仅支持传入绝对路径的loader模式\n        // require引入对应loader\n        const loaderFn = require(matchLoaders[i]);\n        // 通过loader同步处理我的每一次编译的moduleCode\n        this.moduleCode = loaderFn(this.moduleCode);\n      }\n    });\n  }\n")])])]),o("p",[o("code",[e._v("buildModule")]),e._v(" 修改为读取模块文件代码后匹配对应的loader进行处理。")]),e._v(" "),o("p",[e._v("先是遍历rules获取到所有与该模块对应的loader，接着倒序传入loader进行编译。")]),e._v(" "),o("p",[e._v("现在只要把模块传入"),o("code",[e._v("buildModule")]),e._v(" 就可以得到经过loader修改后的代码了。")]),e._v(" "),o("h2",{attrs:{id:"webpack模块编译阶段"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#webpack模块编译阶段"}},[e._v("#")]),e._v(" webpack模块编译阶段")]),e._v(" "),o("p",[e._v("这里我们需要做的是:"),o("strong",[e._v("针对当前模块进行编译，将当前模块所有依赖的模块("),o("code",[e._v("require()")]),e._v(")语句引入的路径变为相对于跟路径("),o("code",[e._v("this.rootPath")]),e._v(")的相对路径")]),e._v("。")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("const parser = require('@babel/parser');\nconst traverse = require('@babel/traverse').default;\nconst generator = require('@babel/generator').default;\nconst t = require('@babel/types');\nconst tryExtensions = require('./utils/index')\n// ...\n  class Compiler {\n     // ...\n      \n     // 模块编译方法\n      buildModule(moduleName, modulePath) {\n        // 1. 读取文件原始代码\n        const originSourceCode =\n          ((this.originSourceCode = fs.readFileSync(modulePath)), 'utf-8');\n        // moduleCode为修改后的代码\n        this.moduleCode = originSourceCode;\n        //  2. 调用loader进行处理\n        this.handleLoader(modulePath);\n        // 3. 调用webpack 进行模块编译 获得最终的module对象\n        const module = this.handleWebpackCompiler(moduleName, modulePath);\n        // 4. 返回对应module\n        return module\n      }\n\n      // 调用webpack进行模块编译\n      handleWebpackCompiler(moduleName, modulePath) {\n        // 将当前模块相对于项目启动根目录计算出相对路径 作为模块ID\n        const moduleId = './' + path.posix.relative(this.rootPath, modulePath);\n        // 创建模块对象\n        const module = {\n          id: moduleId,\n          dependencies: new Set(), // 该模块所依赖模块绝对路径地址\n          name: [moduleName], // 该模块所属的入口文件\n        };\n        // 调用babel分析我们的代码\n        const ast = parser.parse(this.moduleCode, {\n          sourceType: 'module',\n        });\n        // 深度优先 遍历语法Tree\n        traverse(ast, {\n          // 当遇到require语句时\n          CallExpression:(nodePath) => {\n            const node = nodePath.node;\n            if (node.callee.name === 'require') {\n              // 获得源代码中引入模块相对路径\n              const requirePath = node.arguments[0].value;\n              // 寻找模块绝对路径 当前模块路径+require()对应相对路径\n              const moduleDirName = path.posix.dirname(modulePath);\n              const absolutePath = tryExtensions(\n                path.posix.join(moduleDirName, requirePath),\n                this.options.resolve.extensions,\n                requirePath,\n                moduleDirName\n              );\n              // 生成moduleId - 针对于跟路径的模块ID 添加进入新的依赖模块路径\n              const moduleId =\n                './' + path.posix.relative(this.rootPath, absolutePath);\n              // 通过babel修改源代码中的require变成__webpack_require__语句\n              node.callee = t.identifier('__webpack_require__');\n              // 修改源代码中require语句引入的模块 全部修改变为相对于跟路径来处理\n              node.arguments = [t.stringLiteral(moduleId)];\n              // 为当前模块添加require语句造成的依赖(内容为相对于根路径的模块ID)\n              module.dependencies.add(moduleId);\n            }\n          },\n        });\n        // 遍历结束根据AST生成新的代码\n        const { code } = generator(ast);\n        // 为当前模块挂载新的生成的代码\n        module._source = code;\n        // 返回当前模块对象\n        return module\n      }\n  }\n")])])]),o("p",[e._v("关注"),o("code",[e._v("handleWebpackCompiler")]),e._v(" 方法，这里我们计算出了模块相对于根路径的相对路径计算作为模块的id出来，接着创建了模块对象，深度优先遍历"),o("code",[e._v("ast")]),e._v("语法树，当匹配到require时就将依赖的模块也计算出相对于根路径的相对路径作为模块id加入"),o("code",[e._v("module.dependenices")]),e._v(" ，然后将源代码中的require改为"),o("code",[e._v("__webpack_require__")])]),e._v(" "),o("h3",{attrs:{id:"递归处理"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#递归处理"}},[e._v("#")]),e._v(" 递归处理")]),e._v(" "),o("p",[e._v("我们只需要在最后添加")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("// 递归依赖深度遍历 存在依赖模块则加入\n    module.dependencies.forEach((dependency) => {\n      const depModule = this.buildModule(moduleName, dependency);\n      // 将编译后的任何依赖模块对象加入到modules对象中去\n      this.modules.add(depModule);\n    });\n")])])]),o("p",[e._v("这样我们就可以获得")]),e._v(" "),o("p",[o("img",{attrs:{src:"https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-42d0c7f75fa32ccb632333da83ff4bbb_720w.jpg",alt:"img"}})]),e._v(" "),o("p",[e._v("这样我们就可以获得解析后的入口文件对象，和所有入口文件依赖的对象")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("Set {\n  {\n    id: './example/src/entry1.js',\n    dependencies: Set { './example/src/module.js' },\n    name: [ 'main' ],\n    _source: 'const depModule = __webpack_require__(\"./example/src/module.js\");\\n' +\n      '\\n' +\n      \"console.log(depModule, 'dep');\\n\" +\n      \"console.log('This is entry 1 !');\\n\" +\n      \"const loader2 = '19Qingfeng';\\n\" +\n      \"const loader1 = 'https://github.com/19Qingfeng';\"\n  },\n  {\n    id: './example/src/entry2.js',\n    dependencies: Set { './example/src/module.js' },\n    name: [ 'second' ],\n    _source: 'const depModule = __webpack_require__(\"./example/src/module.js\");\\n' +\n      '\\n' +\n      \"console.log(depModule, 'dep');\\n\" +\n      \"console.log('This is entry 2 !');\\n\" +\n      \"const loader2 = '19Qingfeng';\\n\" +\n      \"const loader1 = 'https://github.com/19Qingfeng';\"\n  }\n} entries\nSet {\n  {\n    id: './example/src/module.js',\n    dependencies: Set {},\n    name: [ 'main' ],\n    _source: \"const name = '19Qingfeng';\\n\" +\n      'module.exports = {\\n' +\n      '  name\\n' +\n      '};\\n' +\n      \"const loader2 = '19Qingfeng';\\n\" +\n      \"const loader1 = 'https://github.com/19Qingfeng';\"\n  },\n  {\n    id: './example/src/module.js',\n    dependencies: Set {},\n    name: [ 'second' ],\n    _source: \"const name = '19Qingfeng';\\n\" +\n      'module.exports = {\\n' +\n      '  name\\n' +\n      '};\\n' +\n      \"const loader2 = '19Qingfeng';\\n\" +\n      \"const loader1 = 'https://github.com/19Qingfeng';\"\n  }\n} modules\n")])])]),o("p",[e._v("这里"),o("code",[e._v("module.js")]),e._v(" 被引用了两次，对"),o("code",[e._v("handleWebpackCompiler")]),e._v("进行一下优化")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("    handleWebpackCompiler(moduleName, modulePath) {\n       ...\n        // 通过babel修改源代码中的require变成__webpack_require__语句\n          node.callee = t.identifier('__webpack_require__');\n          // 修改源代码中require语句引入的模块 全部修改变为相对于跟路径来处理\n          node.arguments = [t.stringLiteral(moduleId)];\n          // 转化为ids的数组 好处理\n          const alreadyModules = Array.from(this.modules).map((i) => i.id);\n          if (!alreadyModules.includes(moduleId)) {\n            // 为当前模块添加require语句造成的依赖(内容为相对于根路径的模块ID)\n            module.dependencies.add(moduleId);\n          } else {\n            // 已经存在的话 虽然不进行添加进入模块编译 但是仍要更新这个模块依赖的入口\n            this.modules.forEach((value) => {\n              if (value.id === moduleId) {\n                value.name.push(moduleName);\n              }\n            });\n          }\n        }\n      },\n    });\n    ...\n    }\n")])])]),o("p",[e._v("此时针对我们的“模块编译阶段”基本已经结束了，这一步我们对于所有模块从入口文件开始进行分析。")]),e._v(" "),o("ul",[o("li",[e._v("从入口出发，读取入口文件内容调用匹配"),o("code",[e._v("loader")]),e._v("处理入口文件。")]),e._v(" "),o("li",[e._v("通过"),o("code",[e._v("babel")]),e._v("分析依赖，并且同时将所有依赖的路径更换为相对于项目启动目录"),o("code",[e._v("options.context")]),e._v("的路径。")]),e._v(" "),o("li",[e._v("入口文件中如果存在依赖的话，递归上述步骤编译依赖模块。")]),e._v(" "),o("li",[e._v("将每个依赖的模块编译后的对象加入"),o("code",[e._v("this.modules")]),e._v("。")]),e._v(" "),o("li",[e._v("将每个入口文件编译后的对象加入"),o("code",[e._v("this.entries")]),e._v("。")])]),e._v(" "),o("h1",{attrs:{id:"编译完成阶段"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#编译完成阶段"}},[e._v("#")]),e._v(" 编译完成阶段")]),e._v(" "),o("p",[e._v("在将所有模块递归编译完成后，我们需要"),o("strong",[e._v("根据上述的依赖关系，组合最终输出的"),o("code",[e._v("chunk")]),e._v("模块")]),e._v("。")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("class Compiler {\n\n    // ...\n    buildEntryModule(entry) {\n        Object.keys(entry).forEach((entryName) => {\n          const entryPath = entry[entryName];\n          // 调用buildModule实现真正的模块编译逻辑\n          const entryObj = this.buildModule(entryName, entryPath);\n          this.entries.add(entryObj);\n          // 根据当前入口文件和模块的相互依赖关系，组装成为一个个包含当前入口所有依赖模块的chunk\n          this.buildUpChunk(entryName, entryObj);\n        });\n        console.log(this.chunks, 'chunks');\n    }\n    \n     // 根据入口文件和依赖模块组装chunks\n      buildUpChunk(entryName, entryObj) {\n        const chunk = {\n          name: entryName, // 每一个入口文件作为一个chunk\n          entryModule: entryObj, // entry编译后的对象\n          modules: Array.from(this.modules).filter((i) =>\n            i.name.includes(entryName)\n          ), // 寻找与当前entry有关的所有module\n        };\n        // 将chunk添加到this.chunks中去\n        this.chunks.add(chunk);\n      }\n      \n      // ...\n}\n")])])]),o("p",[e._v("关注"),o("code",[e._v("buildUpChunk")]),e._v(" 方法，chunk是一个对象，包括入口文件的名称，入口文件编译后的对象和其依赖的模块")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("Set {\n  {\n    name: 'main',\n    entryModule: {\n      id: './example/src/entry1.js',\n      dependencies: [Set],\n      name: [Array],\n      _source: 'const depModule = __webpack_require__(\"./example/src/module.js\");\\n' +\n        '\\n' +\n        \"console.log(depModule, 'dep');\\n\" +\n        \"console.log('This is entry 1 !');\\n\" +\n        \"const loader2 = '19Qingfeng';\\n\" +\n        \"const loader1 = 'https://github.com/19Qingfeng';\"\n    },\n    modules: [ [Object] ]\n  },\n  {\n    name: 'second',\n    entryModule: {\n      id: './example/src/entry2.js',\n      dependencies: Set {},\n      name: [Array],\n      _source: 'const depModule = __webpack_require__(\"./example/src/module.js\");\\n' +\n        '\\n' +\n        \"console.log(depModule, 'dep');\\n\" +\n        \"console.log('This is entry 2 !');\\n\" +\n        \"const loader2 = '19Qingfeng';\\n\" +\n        \"const loader1 = 'https://github.com/19Qingfeng';\"\n    },\n    modules: []\n  }\n} \n")])])]),o("p",[e._v("这一步，"),o("strong",[e._v("我们得到了"),o("code",[e._v("Webpack")]),e._v("中最终输出的两个"),o("code",[e._v("chunk")])]),e._v("。")]),e._v(" "),o("p",[e._v("它们分别拥有:")]),e._v(" "),o("ul",[o("li",[o("code",[e._v("name")]),e._v(":当前入口文件的名称")]),e._v(" "),o("li",[o("code",[e._v("entryModule")]),e._v(": 入口文件编译后的对象。")]),e._v(" "),o("li",[o("code",[e._v("modules")]),e._v(": 该入口文件依赖的所有模块对象组成的数组，其中每一个元素的格式和"),o("code",[e._v("entryModule")]),e._v("是一致的。")])]),e._v(" "),o("p",[e._v("此时编译完成我们拼装"),o("code",[e._v("chunk")]),e._v("的环节就圆满完成。")]),e._v(" "),o("h1",{attrs:{id:"输出文件阶段"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#输出文件阶段"}},[e._v("#")]),e._v(" 输出文件阶段")]),e._v(" "),o("p",[e._v("我们先来看下用原本"),o("code",[e._v("webpack")]),e._v("打包出来的样子")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("(() => {\n  var __webpack_modules__ = {\n    './example/src/module.js': (module) => {\n      const name = '19Qingfeng';\n\n      module.exports = {\n        name,\n      };\n\n      const loader2 = '19Qingfeng';\n      const loader1 = 'https://github.com/19Qingfeng';\n    },\n  };\n  // The module cache\n  var __webpack_module_cache__ = {};\n\n  // The require function\n  function __webpack_require__(moduleId) {\n    // Check if module is in cache\n    var cachedModule = __webpack_module_cache__[moduleId];\n    if (cachedModule !== undefined) {\n      return cachedModule.exports;\n    }\n    // Create a new module (and put it into the cache)\n    var module = (__webpack_module_cache__[moduleId] = {\n      // no module.id needed\n      // no module.loaded needed\n      exports: {},\n    });\n\n    // Execute the module function\n    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);\n\n    // Return the exports of the module\n    return module.exports;\n  }\n\n  var __webpack_exports__ = {};\n  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.\n  (() => {\n    const depModule = __webpack_require__(\n      /*! ./module */ './example/src/module.js'\n    );\n\n    console.log(depModule, 'dep');\n    console.log('This is entry 1 !');\n\n    const loader2 = '19Qingfeng';\n    const loader1 = 'https://github.com/19Qingfeng';\n  })();\n})();\n")])])]),o("p",[o("img",{attrs:{src:"https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-a0d174fa870488fcdaa1384747f7d8de_720w.jpg",alt:"img"}})]),e._v(" "),o("p",[e._v("这一块是入口文件代码")]),e._v(" "),o("p",[o("img",{attrs:{src:"https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-d3295115ff75616cabd412608a0a1bc1_720w.jpg",alt:"img"}})]),e._v(" "),o("p",[e._v("这一块是入口文件依赖的代码")]),e._v(" "),o("p",[e._v("回到compiler的run方法")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("   class Compiler {\n   \n   }\n  // run方法启动编译\n  // 同时run方法接受外部传递的callback\n  run(callback) {\n    // 当调用run方式时 触发开始编译的plugin\n    this.hooks.run.call();\n    // 获取入口配置对象\n    const entry = this.getEntry();\n    // 编译入口文件\n    this.buildEntryModule(entry);\n    // 导出列表;之后将每个chunk转化称为单独的文件加入到输出列表assets中\n    this.exportFile(callback);\n  }\n")])])]),o("p",[o("code",[e._v("exportFile")]),e._v("方法")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("// 将chunk加入输出列表中去\n  exportFile(callback) {\n    const output = this.options.output;\n    // 根据chunks生成assets内容\n    this.chunks.forEach((chunk) => {\n      const parseFileName = output.filename.replace('[name]', chunk.name);\n      // assets中 { 'main.js': '生成的字符串代码...' }\n      this.assets[parseFileName] = getSourceCode(chunk);\n    });\n    // 调用Plugin emit钩子\n    this.hooks.emit.call();\n    // 先判断目录是否存在 存在直接fs.write 不存在则首先创建\n    if (!fs.existsSync(output.path)) {\n      fs.mkdirSync(output.path);\n    }\n    // files中保存所有的生成文件名\n    this.files = Object.keys(this.assets);\n    // 将assets中的内容生成打包文件 写入文件系统中\n    Object.keys(this.assets).forEach((fileName) => {\n      const filePath = path.join(output.path, fileName);\n      fs.writeFileSync(filePath, this.assets[fileName]);\n    });\n    // 结束之后触发钩子\n    this.hooks.done.call();\n    callback(null, {\n      toJson: () => {\n        return {\n          entries: this.entries,\n          modules: this.modules,\n          files: this.files,\n          chunks: this.chunks,\n          assets: this.assets,\n        };\n      },\n    });\n  }\n")])])]),o("p",[o("code",[e._v("exportFile")]),e._v("做了如下几件事:")]),e._v(" "),o("ul",[o("li",[e._v("首先获取配置参数的输出配置，迭代我们的"),o("code",[e._v("this.chunks")]),e._v("，将"),o("code",[e._v("output.filename")]),e._v("中的"),o("code",[e._v("[name]")]),e._v("替换称为对应的入口文件名称。同时根据"),o("code",[e._v("chunks")]),e._v("的内容为"),o("code",[e._v("this.assets")]),e._v("中添加需要打包生成的文件名和文件内容。")]),e._v(" "),o("li",[e._v("将文件写入磁盘前调用"),o("code",[e._v("plugin")]),e._v("的"),o("code",[e._v("emit")]),e._v("钩子函数。")]),e._v(" "),o("li",[e._v("判断"),o("code",[e._v("output.path")]),e._v("文件夹是否存在，如果不存在，则通过"),o("code",[e._v("fs")]),e._v("新建这个文件夹。")]),e._v(" "),o("li",[e._v("将本次打包生成的所有文件名("),o("code",[e._v("this.assets")]),e._v("的"),o("code",[e._v("key")]),e._v("值组成的数组)存放进入"),o("code",[e._v("files")]),e._v("中去。")]),e._v(" "),o("li",[e._v("循环"),o("code",[e._v("this.assets")]),e._v("，将文件依次写入对应的磁盘中去。")]),e._v(" "),o("li",[e._v("所有打包流程结束，触发"),o("code",[e._v("webpack")]),e._v("插件的"),o("code",[e._v("done")]),e._v("钩子。")]),e._v(" "),o("li",[e._v("同时为"),o("code",[e._v("NodeJs Webpack APi")]),e._v("呼应，调用"),o("code",[e._v("run")]),e._v("方法中外部传入的"),o("code",[e._v("callback")]),e._v("传入两个参数。")])]),e._v(" "),o("h2",{attrs:{id:"getsourcecode方法"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#getsourcecode方法"}},[e._v("#")]),e._v(" getSourceCode方法")]),e._v(" "),o("div",{staticClass:"language-text extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("// webpack/utils/index.js\n\n...\n\n\n/**\n *\n *\n * @param {*} chunk\n * name属性入口文件名称\n * entryModule入口文件module对象\n * modules 依赖模块路径\n */\nfunction getSourceCode(chunk) {\n  const { name, entryModule, modules } = chunk;\n  return `\n  (() => {\n    var __webpack_modules__ = {\n      ${modules\n        .map((module) => {\n          return `\n          '${module.id}': (module) => {\n            ${module._source}\n      }\n        `;\n        })\n        .join(',')}\n    };\n    // The module cache\n    var __webpack_module_cache__ = {};\n\n    // The require function\n    function __webpack_require__(moduleId) {\n      // Check if module is in cache\n      var cachedModule = __webpack_module_cache__[moduleId];\n      if (cachedModule !== undefined) {\n        return cachedModule.exports;\n      }\n      // Create a new module (and put it into the cache)\n      var module = (__webpack_module_cache__[moduleId] = {\n        // no module.id needed\n        // no module.loaded needed\n        exports: {},\n      });\n\n      // Execute the module function\n      __webpack_modules__[moduleId](module, module.exports, __webpack_require__);\n\n      // Return the exports of the module\n      return module.exports;\n    }\n\n    var __webpack_exports__ = {};\n    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.\n    (() => {\n      ${entryModule._source}\n    })();\n  })();\n  `;\n}\n...\n")])])]),o("p",[e._v("就是将chunk中的内容拼接成新的代码，和原本"),o("code",[e._v("webpack")]),e._v("输出一样的代码")]),e._v(" "),o("p",[e._v("这样我们实现了我们自己的webpack了")]),e._v(" "),o("h1",{attrs:{id:"流程图"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#流程图"}},[e._v("#")]),e._v(" 流程图")]),e._v(" "),o("p",[o("img",{attrs:{src:"https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-8d4251b93254298f60b29dd06aa6d1cf_r.jpg",alt:"preview"}})])])}),[],!1,null,null,null);n.default=s.exports}}]);