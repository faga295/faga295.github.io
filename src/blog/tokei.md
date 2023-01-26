# 用rust构建前端工具链
用`rust`、`go`这些语言来写一些前端的工具链其实已经火了有一段时间了， 像`esbuild`, `swc`, `lightingcss`, `turbo`等等, 因此我于去年十月份开始嘴上说要学rust, 并于今年一月份学完rust基础语法...其实一直没有什么动力学rust, 主要是因为没啥灵感, 学了也不知道做啥, 我一直也不太喜欢重复造轮子, 但自身也很少有灵光乍现的时候, 所以也一直就卡在那里。 虽然我没咋学rust, 但好在平常有关注rust的生态, 也算是做了一些积累。
## 灵感来源
灵感最开始来自于一条推特, 应该是bun的作者发了一个截图, 是在命令行打印了bun的代码量相关信息的, 接着就找到了`loc`, 不过`loc`貌似不咋更新了, 接着就找到了类似的项目[tokei](https://github.com/XAMPPRocky/tokei), 这既是一个二进制项目也是一个库项目, 因此我们可以通过它暴露出来的函数, 再结合`napi-rs`, 就可以为node提供使用`tokei`的`api`, 这就是[napi-tokei](https://github.com/faga295/napi-tokei)准备做的事情了。 

## napi-rs
在用rust写前端工具链的时候, [napi-rs](https://napi.rs/)想必是绕不开的话题了, 所以这里先简单讲讲`napi-rs`。

`napi-rs`是一个rust版的[Node-API](https://nodejs.org/api/n-api.html), 它提供了一些api(具体来说是宏), 让我们能够用rust来写js。

以下是官网首页的例子:

```rs
// lib.rs
use napi_derive::napi;
 
#[napi]
fn fibonacci(n: u32) -> u32 {
  match n {
    1 | 2 => 1,
    _ => fibonacci(n - 1) + fibonacci(n - 2),
  }
}
```
通过`napi-rs`, 可以生成一个js文件`index.js`以及相应的`.d.ts`
```js
// main.mjs
import { fibonacci } from './index.js'
 
// output: 5
console.log(fibonacci(5))
```
并且是`esm`, `cjs`兼容的
```js
// main.cjs
const { fibonacci } = require('./index')
 
// output: 5
console.log(fibonacci(5))
```
上面介绍的如何定义一个函数, 当然还能定义数组, 对象, 字符串等等。

接下来看一下`napi-rs`生成的js文件
![](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/20230126160850.png)
大概的思路就是根据不同的操作系统, 不同的CPU架构引用不同的二进制模块就是里面的`.node`文件。在你发布由`napi-rs`创建的包的时候, 同时也会发布不同操作系统不同CPU架构的二进制模块, 你可以在package.json中的`optionalDependencies`字段看到

![](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/20230126161355.png)

## 代码实现
`napi-tokei`只是一个对`tokei`的简单封装, 因此只需要很少的代码量就可以完成。

```rs
#![deny(clippy::all)]
use napi_derive::napi;
use tokei::{Config, Languages};

// js Object
#[napi(object)]
pub struct Langs {
  pub lang: String,
  pub lines: u32,
  pub code: u32,
  pub comments: u32,
  pub blanks: u32,
}

// export function tokei(include: Array<string>, exclude: Array<string>): Array<Langs>
#[napi]
pub fn tokei(include: Vec<String>, exclude: Vec<&str>) -> Vec<Langs> {
  let config = Config::default();
  let mut languages = Languages::new();
  languages.get_statistics(&include, &exclude, &config);
  let mut vec: Vec<Langs> = vec![];

  for item in languages.into_iter() {
    let lang = Langs {
      lang: item.0.to_string(),
      lines: (item.1.lines() as u32),
      code: (item.1.code as u32),
      comments: (item.1.comments as u32),
      blanks: (item.1.blanks as u32),
    };
    vec.push(lang)
  }
  vec
}
```
