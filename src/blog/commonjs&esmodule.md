---
title: commonjs和esmodule的区别
date: 2022-02-13 18:39:15
tags: es6
---

# commonjs的出现

在最开始网站的业务没那么复杂，js只是作为一门脚本语言，它不需要引入其他文件就可以解决已有业务，但随着业务需求越来越复杂，越来越需要模块化，commonjs就这样诞生了。再到后来es6把import，export加入了它们的关键字当中，也就有了现在的esmodule。首先这两个最大的不同之处在于：commonjs的module 和 require 只是对象和方法而已，而esmodule的import，export它们是关键字，es6新加的。

# commonjs和es6模块的差异

* CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
* CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

# commonjs具体实现

先看一个例子

```javascript
// a.js
let val = 1;

const setVal = (newVal) => {
  val = newVal
}

module.exports = {
  val,
  setVal
}

// b.js
const { val, setVal } = require('./a.js')

console.log(val);// 1

setVal(101);

console.log(val);// 1

```

我们可以这样子理解：

```
const myModule = {
  exports: {}
}

let val = 1;

const setVal = (newVal) => {
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

```

这里我们就可以理解什么叫值的拷贝了

我们的val和模块里的val是不一样的所以使用setVal修改没有效果

在es module中就不是输出对象的拷贝了，而是值的引用

```
// a.js
import { foo } from './b';
console.log(foo);
setTimeout(() => {
  console.log(foo);
  import('./b').then(({ foo }) => {
    console.log(foo);
  });
}, 1000);

// b.js
export let foo = 1;
setTimeout(() => {
  foo = 2;
}, 500);
// 执行：babel-node a.js
// 执行结果：
// 1
// 2
// 2
```



知道了module大概是个什么东西之后，我们来看看commonjs的具体实现

首先我们定义一个自己的module，每个文件都有一个module对象

```
function MyModule(id = '') {
  this.id = id;             // 模块路径
  this.exports = {};        // 导出的东西放这里，初始化为空对象
  this.loaded = false;      // 用来标识当前模块是否已经加载
}
```

## require方法

```
MyModule.prototype.require = function (id) {
  return MyModule._load(id);
}
```

load方法用来判断require的模块是否已经加入到缓存，并且返回需要加载的模块的exports

```

MyModule._load = function (request) {    // request是传入的路径
  const filename = MyModule._resolveFilename(request);

  // 先检查缓存，如果缓存存在且已经加载，直接返回缓存
  const cachedModule = MyModule._cache[filename];
  if (cachedModule) {
    return cachedModule.exports;
  }

  // 如果缓存不存在，我们就加载这个模块
  const module = new MyModule(filename);

  // load之前就将这个模块缓存下来，这样如果有循环引用就会拿到这个缓存，但是这个缓存里面的exports可能还没有或者不完整
  MyModule._cache[filename] = module;

  // 如果 load 失败，需要将 _cache 中相应的缓存删掉。这里简单起见，不做这个处理
  module.load(filename);

  return module.exports;
}
```

里面的MyModule._resolveFileName不做过多解释，重点解释MyModule.prototype.load

这个函数就是用来获取文件后缀，并且采取相应的方法加载，这里我们只对.js的加载进行解析

```
MyModule.prototype.load = function (filename) {
  // 获取文件后缀名
  const extname = path.extname(filename);

  // 调用后缀名对应的处理函数来处理，当前实现只支持 JS
  MyModule._extensions[extname](this, filename);

  this.loaded = true;
}

```

如果后缀名是.js会调用MyModule.prototype._compile

```
MyModule._extensions['.js'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  module._compile(content, filename);
}

```

### _compile的实现

首先我们思考,我们思考为什么可以在文件中使用`exports`, `require`, `module`, `__dirname`, `__filename`....这是因为我们在加载文件的时候，Mymodule.prototype. _compile把整个代码外面套了一个函数，函数里面传入了`exports`, `require`, `module`, `__dirname`, `__filename`,然后把这个函数执行一遍，就可以拿到exports了



## 为什么commonjs相互引用没有产生类似死锁的问题

观察MyModule._load我们可以发现其中的关键在于加载模块和加入缓存的顺序

即：

```
MyModule._cache[filename] = module;
module.load(filename);
```

假设a.js和b.js相互引用

若先加载a.js,缓存中没有a.js，那么就会把a.js加入缓存，接着加载a.js，加载a.js的时候发现里面require了b.js，那么又会把b.js加入缓存，加载b.js，b.js发现里面require了a.js，a.js这时已经缓存了，但是还没有module.exports，因为这是a.js还没加载完，这时我们就引入了一个空对象，那么就不会出现循环调用的情况。

# es module

前面说ESM编译时输出接口，是因为它的模块解析发生在编译阶段，而commonjs模块解析发生在执行阶段，毕竟module也只是一个对象。

import 优先执行

```
// a.js
console.log('a.js')
import { foo } from './b';

// b.js
export let foo = 1;
console.log('b.js 先执行');

// 执行结果:
// b.js 先执行
// a.js
```



export 会变量提升，这样就可以避免循环引用造成死锁

```
// a.js
import { foo } from './b';
console.log('a.js');
export const bar = 1;
export const bar2 = () => {
  console.log('bar2');
}
export function bar3() {
  console.log('bar3');
}

// b.js
export let foo = 1;
import * as a from './a';
console.log(a);

// 执行结果:
// { bar: undefined, bar2: undefined, bar3: [Function: bar3] }
// a.js
```

