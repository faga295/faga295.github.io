import{ab as t,B as l,C as d,G as c,A as e,N as n,I as s,ac as i,P as r}from"./app.805b3650.js";import"./vendor.1cc29387.js";const o={},p=i('<h1 id="垃圾回收机制" tabindex="-1"><a class="header-anchor" href="#垃圾回收机制" aria-hidden="true">#</a> 垃圾回收机制</h1><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/1707342869-5c9358c332559.png" alt="image"></p><p>从根出发(全局变量)被引用的对象会被标记，没有被标记的对象都会被删除</p><h4 id="什么是垃圾" tabindex="-1"><a class="header-anchor" href="#什么是垃圾" aria-hidden="true">#</a> 什么是垃圾</h4><p>一般来说没有被引用的对象就是垃圾，就是要被清除， 有个例外如果几个对象引用形成一个环，互相引用，但根访问不到它们，这几个对象也是垃圾，也要被清除。</p>',5),u=i(`<h4 id="如何检垃圾" tabindex="-1"><a class="header-anchor" href="#如何检垃圾" aria-hidden="true">#</a> 如何检垃圾</h4><p>一种算法是标记-清除算法,其策略是：</p><ul><li><p>JavaScript中的垃圾收集器运行时会给<strong>存储在内存中的所有变量</strong>都加上标记；</p></li><li><p>然后去掉环境中的变量以及被环境中的变量引用的变量的标记；</p></li><li><p>此后，再被加上标记的变量被视为准备删除的变量；</p></li><li><p>最后，垃圾收集器完成内存清除，销毁那些带标记的值并回收其占用的内存空间。</p></li></ul><p>局限：</p><ul><li>由于是从根对象(全局对象)开始查找，对于那些无法从根对象查询到的对象都将被清除</li><li>回收后会形成内存碎片，影响后面申请大的连续内存空间</li></ul><p>还有一种是引用计数</p><ul><li>声明一个变量，赋予它一个引用值时，计数+1；</li><li>同一个值被赋予另外一个变量时，引用+1；</li><li>保存对该值引用的变量被其他值覆盖，引用-1；</li><li>引用为0，回收内存；</li></ul><p>局限：</p><p>最重要的是循环引用</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">refProblem</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> a <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> b <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    a<span class="token punctuation">.</span>c <span class="token operator">=</span> b<span class="token punctuation">;</span>
    b<span class="token punctuation">.</span>c <span class="token operator">=</span> a<span class="token punctuation">;</span>  <span class="token comment">//互相引用</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于a,b都被引用，因此a,b都不会被清除，如果频繁的调用改函数，则会造成很严重的内存泄漏。</p><h2 id="v8垃圾回收机制" tabindex="-1"><a class="header-anchor" href="#v8垃圾回收机制" aria-hidden="true">#</a> v8垃圾回收机制</h2><p>v8将堆内存分为了新生代和老生代，新生代属于是生命周期比较短的，而老生代属于是生命周期比较长的，对于这两种区域v8分配了两种不同的垃圾回收器：</p><ul><li>副垃圾回收器 - Scavenge：主要负责新生代的垃圾回收。</li><li>主垃圾回收器 - Mark-Sweep &amp; Mark-Compact：主要负责老生代的垃圾回收。</li></ul><h3 id="新生代垃圾回收器-scavenge" tabindex="-1"><a class="header-anchor" href="#新生代垃圾回收器-scavenge" aria-hidden="true">#</a> 新生代垃圾回收器 - Scavenge</h3><p>新生代垃圾回收器使用的是scavenge算法，一种用空间换时间的算法，对于占用空间不大的场景比较适用，新生代区域由于生命周期短因此给他分配的空间也小，使用scavenge算法非常合适。</p><p>scavenge算法做的事情就是把新生代中的对象标记为活动对象和非活动对象，将新生代区域分成两个部分一个是from-space,一个是to-space，还没进行垃圾回收前新生代对象都是在from-space中的。在标记完成之后，会将活动对象复制到to-space中去，并有序的排列起来。再把from-space和to-space角色互换，有点像fiber双缓存hhh</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20200925123816388.png" alt=""></p><h4 id="新生代对象什么时候变成老生代" tabindex="-1"><a class="header-anchor" href="#新生代对象什么时候变成老生代" aria-hidden="true">#</a> 新生代对象什么时候变成老生代</h4><ol><li>当新生代的To space内存占满25%时，此时再从From space拷贝对象将不会再放入To空间中以防影响后续的新对象分配，而将其直接复制到老生代空间中。</li><li>在进行一次垃圾回收后，第二次GC时，发现已经经历过一次GC的对象在从From空间复制时直接复制到老生代。</li><li>在新对象分配时大部分对象被分配到新生代的From semispace，但当这个对象的体积过大，超过1MB的内存页时，直接分配到老生代中的large Object Space。</li></ol><h3 id="老生代垃圾回收-mark-sweep-mark-compact" tabindex="-1"><a class="header-anchor" href="#老生代垃圾回收-mark-sweep-mark-compact" aria-hidden="true">#</a> 老生代垃圾回收 - Mark-Sweep &amp; Mark-Compact</h3><p>老生代的垃圾回收就不能用scavenge算法了，上面说到过scavenge算法适用于空间占用不大的场景，因此在老生代垃圾回收中我们用了另一种算法：<code>Mark-Sweep</code>(标记清除)和<code>Mark-Compact</code>(标记整理) 算法。</p><h4 id="mark-sweep" tabindex="-1"><a class="header-anchor" href="#mark-sweep" aria-hidden="true">#</a> Mark-Sweep</h4><p>和scavenge算法一样，标记清除算法是先将活动对象标记，然后直接清除非活动对象</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20200925163922575.png" alt=""></p><p>从图中可以看到清除后会有一些空，这些空留着显然很不合理，因为一旦有一些占用空间比较大的对象，这些空就用不上了，因此还需要<code>Mark-Compact</code>算法的帮助，这个算法就是在标记清除之后重新帮忙整理的，将所有的活动对象往一端移动，移动完成后，直接清理掉边界外的内存。这样老生代垃圾回收器就完成啦。</p><h3 id="全停顿" tabindex="-1"><a class="header-anchor" href="#全停顿" aria-hidden="true">#</a> 全停顿</h3><p>垃圾回收算法在执行前，需要将应用逻辑暂停，执行完垃圾回收后再执行应用逻辑，这种行为称为「全停顿」</p><p>如果全停顿时间过长就会造成页面卡顿。</p><p>为了解决全停顿问题，v8做了几点优化：<strong>增量标记</strong>、<strong>惰性清理</strong>、<strong>并发</strong>、<strong>并行</strong></p><h4 id="增量标记" tabindex="-1"><a class="header-anchor" href="#增量标记" aria-hidden="true">#</a> 增量标记</h4><p>增量标记就是把原先标记所有对象的任务分成了几个小任务，穿插在js应用逻辑之间，增量标记在堆大小达到一定量的时候启用，并在每达到一定量时进行标记。</p><h4 id="写屏障" tabindex="-1"><a class="header-anchor" href="#写屏障" aria-hidden="true">#</a> 写屏障</h4><p>写屏障主要功能在于记录引用关系的变化，在增量标记中，由于标记是在和js应用逻辑穿插着来的，就会出现之前标记的在后面js执行后引用关系发生了变化，而写屏障会把这种引用关系变化(包括新建对象)记录下来，将其认为是脏对象，后续增量标记的时候就会去看是否有与脏对象相连的已标记对象</p><h4 id="惰性清理" tabindex="-1"><a class="header-anchor" href="#惰性清理" aria-hidden="true">#</a> 惰性清理</h4><p>假如当前的可用内存足以让我们快速的执行代码，其实我们是没必要立即清理内存的，可以将清理的过程延迟一下，让JavaScript逻辑代码先执行，也无需一次性清理完所有非活动对象内存，垃圾回收器会按需逐一进行清理，直到所有的页都清理完毕。</p><h3 id="并发" tabindex="-1"><a class="header-anchor" href="#并发" aria-hidden="true">#</a> 并发</h3><p>并发式GC允许在在垃圾回收的同时不需要将主线程挂起，两者可以同时进行，只有在个别时候需要短暂停下来让垃圾回收器做一些特殊的操作。但是这种方式也要面对增量回收的问题，就是在垃圾回收过程中，由于JavaScript代码在执行，堆中的对象的引用关系随时可能会变化，所以也要进行<code>写屏障</code>操作。</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20200926003554103.png" alt=""></p><h3 id="并行" tabindex="-1"><a class="header-anchor" href="#并行" aria-hidden="true">#</a> 并行</h3><p>并行式GC允许主线程和辅助线程同时执行同样的GC工作，这样可以让辅助线程来分担主线程的GC工作，使得垃圾回收所耗费的时间等于总时间除以参与的线程数量（加上一些同步开销）。</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20200926004058072.png" alt=""></p><h3 id="目前v8的垃圾回收机制" tabindex="-1"><a class="header-anchor" href="#目前v8的垃圾回收机制" aria-hidden="true">#</a> 目前v8的垃圾回收机制</h3><p>在新生代垃圾回收中，采用并行机制，辅助线程做的事情是复制阶段即从<code>from-space</code>到<code>space-to</code>的过程，由于多个线程竞争一个新生代的堆的内存资源，可能出现有某个活动对象被多个线程进行复制操作的问题，为了解决这个问题，V8在第一个线程对活动对象进行复制并且复制完成后，都必须去维护复制这个活动对象后的指针转发地址，以便于其他协助线程可以找到该活动对象后可以判断该活动对象是否已被复制。</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20200926103100834.png" alt=""></p><p>老生代垃圾回收中，采用的是并发机制，在堆内存空间达到一定大小时会启用并发标记，因此也会启用写屏障机制，当并发标记完成或者动态分配的内存到达极限的时候，主线程会执行最终的快速标记步骤，这个时候主线程会挂起，主线程会再一次的扫描根集以确保所有的对象都完成了标记，确认完成之后，某些辅助线程会进行清理内存操作，某些辅助进程会进行内存整理操作。</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20200926105712369.png" alt=""></p><h1 id="v8引擎" tabindex="-1"><a class="header-anchor" href="#v8引擎" aria-hidden="true">#</a> v8引擎</h1><p>V8由许多子模块构成，其中这4个模块是最重要的：</p>`,49),v=e("li",null,"Parser：负责将JavaScript源码转换为Abstract Syntax Tree (AST)",-1),m=e("li",null,"Ignition：interpreter，即解释器，负责将AST转换为Bytecode，解释执行Bytecode；同时收集TurboFan优化编译所需的信息，比如函数参数的类型；",-1),h=e("li",null,"TurboFan：compiler，即编译器，利用Ignitio所收集的信息，将Bytecode转换为优化的汇编代码；",-1),b={href:"https://blog.fundebug.com/2019/07/03/javascript-garbage-collection/",target:"_blank",rel:"noopener noreferrer"},g=i(`<p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/2019-07-16-ignition-turbofan-pipeline.png" alt=""></p><p>Bytecode可以通过编译器到Machine Code,图中画的不太对</p><p>这里出现了<code>Bytecode</code>和<code>Machine Code</code> (实际上是汇编代码)，Bytecode类似于Machine Code，不过它没有对应的cpu，不需要为每一种cpu都生成不同的代码，引入Bytecode作为中间层，可以简化v8的编译流程。在执行字节码的过程中如果某段代码被执行了多次，就会将其认定为热点代码，编译器就会把热点代码编译为更高效的机器码，这些机器码是对字节码进行优化之后生成的。</p><h2 id="turbofan-编译器" tabindex="-1"><a class="header-anchor" href="#turbofan-编译器" aria-hidden="true">#</a> TurboFan 编译器</h2><p>编译器是根据解释器收集的内容做的优化。这些内容包括哪些呢？</p><p>举个例子：</p><p>js是没有类型的，如果我第一次调用一个add函数，传入的是两个number类型，那么我就收集到了这个函数以后大概率会传入number类型的信息，因此生成machine Code 的时候就不用把把每一个判断数据类型的语句都写上</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>if (isInteger(x) &amp;&amp; isInteger(y)) {    
	// 整数相加
} else if (isFloat(x) &amp;&amp; isFloat(y)) {
    // 浮点数相加
} 
else if (isString(x) &amp;&amp; isString(y)) {    
// 字符串拼接
} else {    // 各种其他情况}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我只需要先写上</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>if (isInteger(x) &amp;&amp; isInteger(y)) {    
// 整数相加
} else {    
	// Deoptimization
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="script标签中的async和defer属性" tabindex="-1"><a class="header-anchor" href="#script标签中的async和defer属性" aria-hidden="true">#</a> script标签中的async和defer属性</h1><h2 id="script" tabindex="-1"><a class="header-anchor" href="#script" aria-hidden="true">#</a> script</h2><p>浏览器在解析 HTML 的时候，如果遇到一个没有任何属性的 script 标签，就会暂停解析，先发送网络请求获取该 JS 脚本的代码内容，然后让 JS 引擎执行该代码，当代码执行完毕后恢复解析。可以看到，script 阻塞了浏览器对 HTML 的解析，如果获取 JS 脚本的网络请求迟迟得不到响应，或者 JS 脚本执行时间过长，都会导致白屏，用户看不到页面内容。</p><h2 id="async-script" tabindex="-1"><a class="header-anchor" href="#async-script" aria-hidden="true">#</a> async script</h2><p>async表示异步，当浏览器遇到带有 async 属性的 script 时，请求该脚本的网络请求是异步的，不会阻塞浏览器解析 HTML，一旦网络请求回来之后，如果此时 HTML 还没有解析完，浏览器会暂停解析，先让 JS 引擎执行代码，执行完毕后再进行解析。当然，如果在 JS 脚本请求回来之前，HTML 已经解析完毕了，那就啥事没有，立即执行 JS 代码，所以 async 是不可控的，因为执行时间不确定，你如果在异步 JS 脚本中获取某个 DOM 元素，有可能获取到也有可能获取不到。而且如果存在多个 async 的时候，它们之间的执行顺序也不确定，完全依赖于网络传输结果，谁先到执行谁。</p><h2 id="defer-script" tabindex="-1"><a class="header-anchor" href="#defer-script" aria-hidden="true">#</a> defer script</h2><p>defer 表示延迟，当浏览器遇到带有 defer 属性的 script 时，获取该脚本的网络请求也是异步的，不会阻塞浏览器解析 HTML，一旦网络请求回来之后，如果此时 HTML 还没有解析完，浏览器不会暂停解析并执行 JS 代码，而是等待 HTML 解析完毕再执行 JS 代码，如果存在多个 defer script 标签，浏览器（IE9及以下除外）会保证它们按照在 HTML 中出现的顺序执行，不会破坏 JS 脚本之间的依赖关系。</p><table><thead><tr><th style="text-align:center;">script标签</th><th style="text-align:center;">js执行顺序</th><th style="text-align:center;">是否阻断解析html</th></tr></thead><tbody><tr><td style="text-align:center;">script</td><td style="text-align:center;">在html中的顺序</td><td style="text-align:center;">阻塞</td></tr><tr><td style="text-align:center;">script async</td><td style="text-align:center;">网络请求返回顺序</td><td style="text-align:center;">可能阻塞，也可能不阻塞</td></tr><tr><td style="text-align:center;">script defer</td><td style="text-align:center;">在html中的顺序</td><td style="text-align:center;">不阻塞</td></tr></tbody></table><h1 id="浏览器渲染流程" tabindex="-1"><a class="header-anchor" href="#浏览器渲染流程" aria-hidden="true">#</a> 浏览器渲染流程</h1><p>从网络传给渲染引擎的 HTML 文件字节流是无法直接被渲染引擎理解的，所以要将其转化为渲染引擎能够理解的内部结构，这个结构就是 DOM。DOM 提供了对 HTML 文档结构化的表述。</p><h2 id="dom树如何生成" tabindex="-1"><a class="header-anchor" href="#dom树如何生成" aria-hidden="true">#</a> DOM树如何生成</h2><p>渲染引擎内部，有一个叫HTML 解析器<code>（HTMLParser）</code>的模块，它的职责就是负责将HTML 字节流转换为 DOM 结构。HTML解析器会随着HTML文档边加载边解析。具体流程是：</p><p>网络进程收到响应头后，看到<code>content-type</code>为<code>text/html</code>时,就会为请求创建一个渲染进程，渲染进程准备好后网络进程和渲染进程之间就会建立一个共享数据的通道，网络进程接收到数据后就往这个管道里面放，而渲染进程则从管道的另外一端不断地读取数据，并同时将读取的数据“喂”给 HTML 解析器.</p><p><strong>字节流转换为DOM</strong></p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/8946fb176bc4f3ff9c160d1d04dd03dc.png" alt=""></p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/709961d9786c7e32781a37f3f1321f05.png" alt=""></p><p>解析HTML会通过分词器将字节流转换为一个一个token，并且按顺序进出栈。</p><p>如果是<code>startTag</code>会压入栈，文本节点不压入栈，如果是<code>endTag</code> HTML解析器会判断栈顶是不是对应的<code>startTag</code>,如果是，那么出栈，就这样构建出DOM树。</p><h2 id="javascript对dom树构建和渲染的影响" tabindex="-1"><a class="header-anchor" href="#javascript对dom树构建和渲染的影响" aria-hidden="true">#</a> JavaScript对Dom树构建和渲染的影响</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;html&gt;
&lt;body&gt;
&lt;div&gt;1&lt;/div&gt;
&lt;script&gt;
let div1 = document.getElementsByTagName(&#39;div&#39;)[0]
div1.innerText = &#39;time.geekbang&#39;
&lt;/script&gt;
&lt;div&gt;test&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/8ecb292b1dacd61f1bc262447f6591ba.png" alt=""></p><p>当DOM树构建过程中遇到了script脚本，那么DOM树构建流程会暂停，因为script脚本可能会对dom进行修改，因此要等待script脚本执行完再接着构建DOM树。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//foo.js
let div1 = document.getElementsByTagName(&#39;div&#39;)[0]
div1.innerText = &#39;time.geekbang&#39;

&lt;html&gt;
&lt;body&gt;
&lt;div&gt;1&lt;/div&gt;
&lt;script type=&quot;text/javascript&quot; src=&#39;foo.js&#39;&gt;&lt;/script&gt;
&lt;div&gt;test&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果是引入js文件，那么还需要一个下载的过程，这样就会更加的耗时。</p><p>不过Chorme浏览器做了很多优化，其中一个优化就是当渲染引擎收到字节流之后会开启预解析线程，用于分析HTML文件中包含的 JavaScript、CSS 等相关文件，解析到相关文件之后，预解析线程会提前下载这些文件。</p><p>如果 JavaScript 文件中没有操作 DOM 相关代码，就可以将该 JavaScript 脚本设置为异步加载，通过 async 或 defer 来标记代码。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;script async type=&quot;text/javascript&quot; src=&#39;foo.js&#39;&gt;&lt;/script&gt;
或者
&lt;script defer type=&quot;text/javascript&quot; src=&#39;foo.js&#39;&gt;&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>html页面中有css样式</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//theme.css
div {color:blue}

&lt;html&gt;
    &lt;head&gt;
    	&lt;style src=&#39;theme.css&#39;&gt;&lt;/style&gt;
    &lt;/head&gt;
&lt;body&gt;
    &lt;div&gt;1&lt;/div&gt;
    &lt;script&gt;
        let div1 = document.getElementsByTagName(&#39;div&#39;)[0]
        div1.innerText = &#39;time.geekbang&#39; // 需要 DOM
        div1.style.color = &#39;red&#39; // 需要 CSSOM
    &lt;/script&gt;
    &lt;div&gt;test&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先不可避免的是要下载，由于在执行<code>js</code>脚本之前，渲染引擎是不知道该脚本是否会操纵<code>CSSOM</code>，不管该脚本是否操纵了 <code>CSSOM</code>，都会执行<code>CSS </code>文件下载，解析操作，再执行 JavaScript 脚本。</p><p><em>和 HTML 一样，渲染引擎也是无法直接理解 <code>CSS</code> 文件内容的，所以需要将其解析成渲染引</em> 擎能够理解的结构，这个结构就是 <code>CSSOM</code>。等 DOM 和 <code>CSSOM </code>都构建好之后，渲染引擎就会构造布局树</p><p>**总结：**CSS不会阻塞DOM树的解析，但是会影响 JavaScript的运行，</p><p>JavaScript 会阻止DOM树的解析，</p><p>最终<code>CSS</code>（<code>CSSOM</code>）会影响DOM树的渲染，也可以说最终会影响布局树的生成</p><p><em><code>CSS</code>不会阻塞DOM解析，但是会阻塞DOM渲染 ,<code>JS</code>会阻塞DOM解析，<code>CSS</code>会阻塞<code>JS</code>的执行</em></p><p>**DOM树和CSSOM树是互斥的还是同时的？**同时的</p><p>**JS脚本阻塞DOM构建，js脚本会不会对CSSOM树影响？**不会阻塞CSSOM树</p><h2 id="重绘与回流" tabindex="-1"><a class="header-anchor" href="#重绘与回流" aria-hidden="true">#</a> 重绘与回流</h2><p>浏览器生成render树后会触发回流和重绘，回流获取节点的几何位置，重绘获取节点的绝对像素，接着会把这些信息发送给GPU，展示在页面上</p><h2 id="回流" tabindex="-1"><a class="header-anchor" href="#回流" aria-hidden="true">#</a> 回流</h2><p>前面我们通过构造渲染树，我们将可见DOM节点以及它对应的样式结合起来，可是我们还需要计算它们在设备视口(viewport)内的确切位置和大小，这个计算的阶段就是回流。</p><h3 id="重绘" tabindex="-1"><a class="header-anchor" href="#重绘" aria-hidden="true">#</a> 重绘</h3><p>最终，我们通过构造渲染树和回流阶段，我们知道了哪些节点是可见的，以及可见节点的样式和具体的几何信息(位置、大小)，那么我们就可以将渲染树的每个节点都转换为屏幕上的实际像素，这个阶段就叫做重绘节点。</p><p>回流一定触发重绘，重绘不一定会回流</p><h3 id="浏览器优化机制" tabindex="-1"><a class="header-anchor" href="#浏览器优化机制" aria-hidden="true">#</a> 浏览器优化机制</h3><p>浏览器会把一些可以一起更新的放在队列里，当队列达到阈值后才会触发回流重绘，但是当我们有获取页面信息的操作时，会强制刷新获取最新的页面信息。</p><h3 id="批量修改dom" tabindex="-1"><a class="header-anchor" href="#批量修改dom" aria-hidden="true">#</a> 批量修改dom</h3><p>可以通过将元素脱离文档流（隐藏比较合适），对其进行批量修改，再带回文档流</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function appendDataToElement(appendToElement, data) {
    let li;
    for (let i = 0; i &lt; data.length; i++) {
    	li = document.createElement(&#39;li&#39;);
        li.textContent = &#39;text&#39;;
        appendToElement.appendChild(li);
    }
}

const ul = document.getElementById(&#39;list&#39;);
appendDataToElement(ul, data);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="浏览器进程" tabindex="-1"><a class="header-anchor" href="#浏览器进程" aria-hidden="true">#</a> 浏览器进程</h1><ol><li>Browser进程：浏览器的主进程（负责协调，主控）</li><li>第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建</li><li>GPU进程：最多一个，用于3D绘制</li><li><strong>浏览器渲染进程（内核）</strong>：默认每个Tab页面一个进程，互不影响，控制页面渲染，脚本执行，事件处理等（有时候会优化，如多个空白tab会合并成一个进程）</li></ol><h2 id="渲染进程" tabindex="-1"><a class="header-anchor" href="#渲染进程" aria-hidden="true">#</a> 渲染进程</h2><p><strong>GUI渲染线程</strong></p><ul><li>负责渲染页面，布局和绘制</li><li>页面需要重绘和回流时，该线程就会执行</li><li>与js引擎线程互斥，防止渲染结果不可预期</li></ul><p><strong>JS引擎线程</strong></p><ul><li>负责处理解析和执行javascript脚本程序</li><li>只有一个JS引擎线程（单线程）</li><li>与GUI渲染线程互斥，防止渲染结果不可预期</li></ul><p><strong>事件触发线程</strong></p><ul><li>用来控制事件循环（鼠标点击、setTimeout、ajax等）</li><li>当处理一些不能立即执行的代码时，会将对应的任务在其可以触发的时机，添加到事件队列的末端</li><li>事件循环机制会在JS引擎线程空闲时，循环访问事件队列的头部，如果有函数，则会将该函数推到执行栈中并立即执行</li></ul><p><strong>定时触发器线程</strong></p><ul><li>setInterval与setTimeout所在的线程</li><li>定时任务并不是由JS引擎计时的，是由定时触发线程来计时的</li><li>计时完毕后，将回调事件放入到事件队列中</li></ul><p><strong>异步http请求线程</strong></p><ul><li>浏览器有一个单独的线程用于处理AJAX请求</li><li>当请求完成时，若有回调函数，将回调事件放入到事件队列中</li></ul><p>异步http请求线程和定时器触发器线程都是通过js引擎线程通知的，在异步http请求线程请求完成后或者定时器等待一段时间后会将回调事件放入事件队列，事件队列是由事件触发线程管理的</p><h1 id="js-数据类型" tabindex="-1"><a class="header-anchor" href="#js-数据类型" aria-hidden="true">#</a> js 数据类型</h1>`,74),k={href:"https://blog.csdn.net/jiangjuanjaun/article/details/80327342",target:"_blank",rel:"noopener noreferrer"},f=i(`<h1 id="http-缓存" tabindex="-1"><a class="header-anchor" href="#http-缓存" aria-hidden="true">#</a> http 缓存</h1><p>http缓存分为强制缓存和协商缓存，强制缓存就是在响应头里告诉你以后多久都可以直接拿缓存了（Expires，Cache-Control）</p><p>协商缓存就是判断是不是更新了，如果没更新就可以直接拿缓存了。(Etag&amp;If-None-Match,Last-Modified&amp;If-Modified-Since)</p><h3 id="强制缓存" tabindex="-1"><a class="header-anchor" href="#强制缓存" aria-hidden="true">#</a> 强制缓存</h3><h4 id="expires头-兼容" tabindex="-1"><a class="header-anchor" href="#expires头-兼容" aria-hidden="true">#</a> Expires头（兼容）</h4><p><code>Expires: Wed, 21 Oct 2000 07:28:00 GMT</code></p><p>表示在这个时间之前你都可以直接拿缓存了</p><h4 id="cache-control-http1-1" tabindex="-1"><a class="header-anchor" href="#cache-control-http1-1" aria-hidden="true">#</a> Cache-Control（http1.1）</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Cache<span class="token operator">-</span>Control<span class="token operator">:</span> max<span class="token operator">-</span>age<span class="token operator">=</span><span class="token number">20000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>max-age表示在这么多时间内也可以直接拿缓存；还有一个immutable属性就是说以后都可以直接用缓存；还有no-cache：使用缓存前，强制要求把请求提交给服务器进行验证(协商缓存验证)。</p><p>no-store：不存储有关客户端请求或服务器响应的任何内容，即不使用任何缓存。</p><p>max-age的优先级大于Expires</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>app.get(&#39;/storage&#39;,(req,res)=&gt;{
      res.setHeader(&#39;Cache-control&#39;,&#39;public,max-age=10&#39;)
      res.send()
})//设置个响应头就可以了
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="协商缓存" tabindex="-1"><a class="header-anchor" href="#协商缓存" aria-hidden="true">#</a> 协商缓存</h3><h4 id="etag-if-none-match" tabindex="-1"><a class="header-anchor" href="#etag-if-none-match" aria-hidden="true">#</a> ETag&amp;If-None-Match</h4><p>ETag放在响应头里告诉客户端此次版本号，客户端拿到了这个ETag和返回值一起存下来，下次请求的时候会使用配套的If-None-Match来判断有无最新版本，如果没有返回304，告诉浏览器直接拿缓存。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token literal-property property">ETag</span><span class="token operator">:</span> <span class="token string">&quot;33a64df551425fcc55e4d42a148795d9f25f89d4&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>If<span class="token operator">-</span>None<span class="token operator">-</span>Match<span class="token operator">:</span> <span class="token string">&quot;33a64df551425fcc55e4d42a148795d9f25f89d4&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>fs.readFile(pathname, function (err, data) {
    let Etag = \`\${data.length.toString(16)}\${stat.mtime.toString(16)}\`//上次修改时间加文件大小
    if((req.headers[&#39;if-modified-since&#39;] === stat.mtime.toUTCString()) || (req.headers[&#39;if-none-match&#39;] === Etag)) {
      statusCode = 304;
    }
    res.writeHead(statusCode, {
      &#39;Content-Type&#39;: headType,
      Etag
    });
    res.end(data);    
  });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="last-modified-if-modified-since" tabindex="-1"><a class="header-anchor" href="#last-modified-if-modified-since" aria-hidden="true">#</a> Last-Modified&amp;If-Modified-Since</h4><p>Last-Modified存放上次修改时间，If-Modified-Since放在请求头中，服务器拿到这个头后判断有无最新版本，如果有，就返回304。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Last<span class="token operator">-</span>Modified<span class="token operator">:</span> Wed<span class="token punctuation">,</span> <span class="token number">21</span> Oct <span class="token number">2000</span> <span class="token number">07</span><span class="token operator">:</span><span class="token number">28</span><span class="token operator">:</span><span class="token number">00</span> <span class="token constant">GMT</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>If<span class="token operator">-</span>Modified<span class="token operator">-</span>Since<span class="token operator">:</span> Wed<span class="token punctuation">,</span> <span class="token number">21</span> Oct <span class="token number">2000</span> <span class="token number">07</span><span class="token operator">:</span><span class="token number">28</span><span class="token operator">:</span><span class="token number">00</span> <span class="token constant">GMT</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>ETag优先级大于Last-Modified</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 省略其他代码
let stat = fs.statSync(pathname);
  fs.readFile(pathname, function (err, data) {
    // 判断请求头的文件修改时间是否等于服务端的文件修改时间
    if(req.headers[&#39;if-modified-since&#39;] === stat.mtime.toUTCString()) { // mtime为文件内容改变的时间戳
      statusCode = 304;
    }
    res.writeHead(statusCode, {
      &#39;Content-Type&#39;: headType,
      &#39;Last-Modified&#39;:stat.mtime.toUTCString()
    });
    res.end(data);    
  });

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="协商缓存和强制缓存的优先级" tabindex="-1"><a class="header-anchor" href="#协商缓存和强制缓存的优先级" aria-hidden="true">#</a> 协商缓存和强制缓存的优先级</h3><p><strong>先判断强制缓存，如果强制缓存生效，直接使用缓存；如果强制缓存失效，再发请求跟服务器协商，看要不要使用缓存</strong>。</p><p>https://segmentfault.com/a/1190000038562294</p><h2 id="浏览器缓存的位置" tabindex="-1"><a class="header-anchor" href="#浏览器缓存的位置" aria-hidden="true">#</a> 浏览器缓存的位置</h2><p>查找浏览器缓存时会按顺序查找: Service Worker–&gt;Memory Cache–&gt;Disk Cache–&gt;Push Cache。</p><h3 id="service-worker" tabindex="-1"><a class="header-anchor" href="#service-worker" aria-hidden="true">#</a> Service Worker</h3><p>是运行在浏览器背后的独立线程,要求请求必须是https，因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全</p><h3 id="memory-cache" tabindex="-1"><a class="header-anchor" href="#memory-cache" aria-hidden="true">#</a> Memory Cache</h3><p>内存中的缓存，主要包含的是当前中页面中已经抓取到的资源，例如页面上已经下载的样式、脚本、图片等。内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。一旦我们关闭 Tab 页面，内存中的缓存也就被释放了。</p><h3 id="disk-cache" tabindex="-1"><a class="header-anchor" href="#disk-cache" aria-hidden="true">#</a> Disk Cache</h3><p>存在磁盘内，容量大，读取速度慢，它会根据 HTTP Herder 中的字段判断哪些资源需要缓存，哪些资源可以不请求直接使用，哪些资源已经过期需要重新请求。</p><h4 id="prefetch-cache" tabindex="-1"><a class="header-anchor" href="#prefetch-cache" aria-hidden="true">#</a> prefetch Cache</h4><p>prefetch是预加载的一种方式，被标记为prefetch的资源，将会被浏览器在空闲时间加载。</p><h3 id="push-cache" tabindex="-1"><a class="header-anchor" href="#push-cache" aria-hidden="true">#</a> Push Cache</h3><p>Push Cache（推送缓存）是 HTTP/2 中的内容，当以上三种缓存都没有命中时，它才会被使用。它只在会话（Session）中存在，一旦会话结束就被释放，并且缓存时间也很短暂，在Chrome浏览器中只有5分钟左右，同时它也并非严格执行HTTP头中的缓存指令。</p><h1 id="websocket" tabindex="-1"><a class="header-anchor" href="#websocket" aria-hidden="true">#</a> websocket</h1><h2 id="优点" tabindex="-1"><a class="header-anchor" href="#优点" aria-hidden="true">#</a> 优点</h2><p>说到优点，这里的对比参照物是HTTP协议，概括地说就是：支持双向通信，更灵活，更高效，可扩展性更好。</p><p>1.支持双向通信，实时性更强。 2.更好的二进制支持。 3.较少的控制开销。连接创建后，ws客户端、服务端进行数据交换时，协议控制的数据包头部较小。在不包含头部的情况下，服务端到客户端的包头只有2~10字节（取决于数据包长度），客户端到服务端的的话，需要加上额外的4字节的掩码。而HTTP协议每次通信都需要携带完整的头部。 4.支持扩展。ws协议定义了扩展，用户可以扩展协议，或者实现自定义的子协议。（比如支持自定义压缩算法等）</p><h2 id="其他特点" tabindex="-1"><a class="header-anchor" href="#其他特点" aria-hidden="true">#</a> 其他特点</h2><p>（1）建立在 TCP 协议之上，服务器端的实现比较容易。</p><p>（2）与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。</p><p>（3）数据格式比较轻量，性能开销小，通信高效。</p><p>（4）可以发送文本，也可以发送二进制数据。</p><p>（5）没有同源限制，客户端可以与任意服务器通信。</p><p>（6）协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。</p><h2 id="如何建立连接" tabindex="-1"><a class="header-anchor" href="#如何建立连接" aria-hidden="true">#</a> 如何建立连接</h2><p>前面提到，WebSocket复用了HTTP的握手通道。具体指的是，客户端通过HTTP请求与WebSocket服务端协商升级协议。协议升级完成后，后续的数据交换则遵照WebSocket的协议。 1、客户端：申请协议升级 首先，客户端发起协议升级请求。可以看到，采用的是标准的HTTP报文格式，且只支持GET方法。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET / HTTP/1.1
Host: localhost:8080
Origin: http://127.0.0.1:3000
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: w4v7O6xFTi36lq3RNcgctw==
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重点请求首部意义如下：</p><p>Connection: Upgrade：表示要升级协议 Upgrade: websocket：表示要升级到websocket协议。 Sec-WebSocket-Version: 13：表示websocket的版本。如果服务端不支持该版本，需要返回一个Sec-WebSocket-Versionheader，里面包含服务端支持的版本号。 Sec-WebSocket-Key：与后面服务端响应首部的Sec-WebSocket-Accept是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。 2、服务端：响应协议升级 服务端返回内容如下，状态代码101表示协议切换。到此完成协议升级，后续的数据交互都按照新的协议来。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>HTTP/1.1 101 Switching Protocols
Connection:Upgrade
Upgrade: websocket
Sec-WebSocket-Accept: Oy4NRAQ13jhfONC7bP8dTKb4PTU=
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="数据帧格式" tabindex="-1"><a class="header-anchor" href="#数据帧格式" aria-hidden="true">#</a> 数据帧格式</h2><p>客户端、服务端数据的交换，离不开数据帧格式的定义。因此，在实际讲解数据交换之前，我们先来看下WebSocket的数据帧格式。</p><p>WebSocket客户端、服务端通信的最小单位是帧（frame），由1个或多个帧组成一条完整的消息（message）。</p><p>发送端：将消息切割成多个帧，并发送给服务端； 接收端：接收消息帧，并将关联的帧重新组装成完整的消息； 本节的重点，就是讲解数据帧的格式。详细定义可参考 RFC6455 5.2节 。</p><p>1、数据帧格式概览 下面给出了WebSocket数据帧的统一格式。熟悉TCP/IP协议的同学对这样的图应该不陌生。</p><p>从左到右，单位是比特。比如FIN、RSV1各占据1比特，opcode占据4比特。 内容包括了标识、操作代码、掩码、数据、数据长度等。（下一小节会展开）</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> 0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-------+-+-------------+-------------------------------+
 |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
 |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
 |N|V|V|V|       |S|             |   (if payload len==126/127)   |
 | |1|2|3|       |K|             |                               |
 +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
 |     Extended payload length continued, if payload len == 127  |
 + - - - - - - - - - - - - - - - +-------------------------------+
 |                               |Masking-key, if MASK set to 1  |
 +-------------------------------+-------------------------------+
 | Masking-key (continued)       |          Payload Data         |
 +-------------------------------- - - - - - - - - - - - - - - - +
 :                     Payload Data continued ...                :
 + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
 |                     Payload Data continued ...                |
 +---------------------------------------------------------------+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>FIN：1个比特。</p><p>如果是1，表示这是消息（message）的最后一个分片（fragment），如果是0，表示不是是消息（message）的最后一个分片（fragment）。</p><p>RSV1, RSV2, RSV3：各占1个比特。</p><p>一般情况下全为0。当客户端、服务端协商采用WebSocket扩展时，这三个标志位可以非0，且值的含义由扩展进行定义。如果出现非零的值，且并没有采用WebSocket扩展，连接出错。</p><p>Opcode: 4个比特。</p><p>操作代码，Opcode的值决定了应该如何解析后续的数据载荷（data payload）。如果操作代码是不认识的，那么接收端应该断开连接（fail the connection）。可选的操作代码如下：</p><p>%x0：表示一个延续帧。当Opcode为0时，表示本次数据传输采用了数据分片，当前收到的数据帧为其中一个数据分片。 %x1：表示这是一个文本帧（frame） %x2：表示这是一个二进制帧（frame） %x3-7：保留的操作代码，用于后续定义的非控制帧。 %x8：表示连接断开。 %x9：表示这是一个ping操作。 %xA：表示这是一个pong操作。 %xB-F：保留的操作代码，用于后续定义的控制帧。 Mask: 1个比特。</p><p>表示是否要对数据载荷进行掩码操作。从客户端向服务端发送数据时，需要对数据进行掩码操作；从服务端向客户端发送数据时，不需要对数据进行掩码操作。</p><p>如果服务端接收到的数据没有进行过掩码操作，服务端需要断开连接。</p><p>如果Mask是1，那么在Masking-key中会定义一个掩码键（masking key），并用这个掩码键来对数据载荷进行反掩码。所有客户端发送到服务端的数据帧，Mask都是1。</p><p>掩码的算法、用途在下一小节讲解。</p><p>Payload length：数据载荷的长度，单位是字节。为7位，或7+16位，或1+64位。</p><p>假设数Payload length === x，如果</p><p>x为0~126：数据的长度为x字节。 x为126：后续2个字节代表一个16位的无符号整数，该无符号整数的值为数据的长度。 x为127：后续8个字节代表一个64位的无符号整数（最高位为0），该无符号整数的值为数据的长度。 此外，如果payload length占用了多个字节的话，payload length的二进制表达采用网络序（big endian，重要的位在前）。</p><p>Masking-key：0或4字节（32位）</p><p>所有从客户端传送到服务端的数据帧，数据载荷都进行了掩码操作，Mask为1，且携带了4字节的Masking-key。如果Mask为0，则没有Masking-key。</p><p>备注：载荷数据的长度，不包括mask key的长度。</p><p>Payload data：(x+y) 字节</p><p>载荷数据：包括了扩展数据、应用数据。其中，扩展数据x字节，应用数据y字节。</p><p>扩展数据：如果没有协商使用扩展的话，扩展数据数据为0字节。所有的扩展都必须声明扩展数据的长度，或者可以如何计算出扩展数据的长度。此外，扩展如何使用必须在握手阶段就协商好。如果扩展数据存在，那么载荷数据长度必须将扩展数据的长度包含在内。</p><p>应用数据：任意的应用数据，在扩展数据之后（如果存在扩展数据），占据了数据帧剩余的位置。载荷数据长度 减去 扩展数据长度，就得到应用数据的长度。</p><h2 id="数据传递" tabindex="-1"><a class="header-anchor" href="#数据传递" aria-hidden="true">#</a> 数据传递</h2><p>一旦WebSocket客户端、服务端建立连接后，后续的操作都是基于数据帧的传递。</p><p>WebSocket根据opcode来区分操作的类型。比如0x8表示断开连接，0x0-0x2表示数据交互。</p><p>1、数据分片 WebSocket的每条消息可能被切分成多个数据帧。当WebSocket的接收方收到一个数据帧时，会根据FIN的值来判断，是否已经收到消息的最后一个数据帧。</p><p>FIN=1表示当前数据帧为消息的最后一个数据帧，此时接收方已经收到完整的消息，可以对消息进行处理。FIN=0，则接收方还需要继续监听接收其余的数据帧。</p><p>此外，opcode在数据交换的场景下，表示的是数据的类型。0x01表示文本，0x02表示二进制。而0x00比较特殊，表示延续帧（continuation frame），顾名思义，就是完整消息对应的数据帧还没接收完。</p><p>2、数据分片例子 直接看例子更形象些。下面例子来自MDN，可以很好地演示数据的分片。客户端向服务端两次发送消息，服务端收到消息后回应客户端，这里主要看客户端往服务端发送的消息。</p><p>第一条消息</p><p>FIN=1, 表示是当前消息的最后一个数据帧。服务端收到当前数据帧后，可以处理消息。opcode=0x1，表示客户端发送的是文本类型。</p><p>第二条消息</p><p>FIN=0，opcode=0x1，表示发送的是文本类型，且消息还没发送完成，还有后续的数据帧。 FIN=0，opcode=0x0，表示消息还没发送完成，还有后续的数据帧，当前的数据帧需要接在上一条数据帧之后。 FIN=1，opcode=0x0，表示消息已经发送完成，没有后续的数据帧，当前的数据帧需要接在上一条数据帧之后。服务端可以将关联的数据帧组装成完整的消息。</p><h2 id="ws的使用" tabindex="-1"><a class="header-anchor" href="#ws的使用" aria-hidden="true">#</a> ws的使用</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>var ws = new WebSocket(&#39;ws://localhost:8080&#39;);//新建websocket实例
ws.onopen=function(){
    ws.send(&#39;hello&#39;)
}//连接成功后的回调函数
ws.onclose()//连接关闭后的回调函数
ws.onmessage()//收到服务器数据后的回调函数
ws.send()//向服务器发送数据
ws.close()//关闭连接
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="less" tabindex="-1"><a class="header-anchor" href="#less" aria-hidden="true">#</a> less</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>@color:#999
@mySelector:#wrap//选择器变量
@borderStyle:border-style//属性变量
@{mySelector}{//使用时需要使用大括号包裹
    @{borderStyle}:xxx//使用时也需要大括号
}
#wrap{
    color:@color
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="http" tabindex="-1"><a class="header-anchor" href="#http" aria-hidden="true">#</a> HTTP</h1><h2 id="request" tabindex="-1"><a class="header-anchor" href="#request" aria-hidden="true">#</a> request</h2><p>客户端发送一个HTTP请求到服务器的请求消息包括以下格式：</p><p>请求行（request line）、请求头部（header）、空行和请求数据四个部分组成。</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/http-request.png" alt="http-request"></p><p>请求行以一个方法符号开头，以空格分开，后面跟着请求的URI和协议的版本。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /562f25980001b1b106000338.jpg HTTP/1.1
Host    img.mukewang.com//目标地址
User-Agent    Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36
Accept    image/webp,image/*,*/*;q=0.8//希望接收的数据
Referer    http://www.imooc.com//来源
Accept-Encoding    gzip, deflate, sdch
Accept-Language    zh-CN,zh;q=0.8
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一部分：请求行，用来说明请求类型,要访问的资源以及所使用的HTTP版本.</p><p>GET说明请求类型为GET,[/562f25980001b1b106000338.jpg]为要访问的资源，该行的最后一部分说明使用的是HTTP1.1版本。</p><p>第二部分：请求头部，紧接着请求行（即第一行）之后的部分，用来说明服务器要使用的附加信息</p><p>从第二行起为请求头部，HOST将指出请求的目的地.User-Agent,服务器端和客户端脚本都能访问它,它是浏览器类型检测逻辑的重要基础.该信息由你的浏览器来定义,并且在每个请求中自动发送等等，User-Agent由你的浏览器来定义，为了给用户更好的体验，例如pc端和移动端是不一样的，浏览器的UA字串的标准格式：浏览器标识 (操作系统标识; 加密等级标识; 浏览器语言) 渲染引擎标识版本信息</p><p>第三部分：空行，请求头部后面的空行是必须的</p><p>即使第四部分的请求数据为空，也必须有空行。</p><p>第四部分：请求数据也叫主体，可以添加任意的其他数据。 这个例子的请求数据为空。</p><h2 id="response" tabindex="-1"><a class="header-anchor" href="#response" aria-hidden="true">#</a> response</h2><p>HTTP 响应与 HTTP 请求相似，HTTP响应也由3个部分构成，分别是：</p><p>状态行 响应头(Response Header) 响应正文 状态行由协议版本、数字形式的状态代码、及相应的状态描述，各元素之间以空格分隔。</p><h4 id="常见的状态码和状态文本" tabindex="-1"><a class="header-anchor" href="#常见的状态码和状态文本" aria-hidden="true">#</a> 常见的状态码和状态文本</h4><ul><li>1 表示临时响应，只包含状态行和部分响应头信息，并以空行结束</li><li>2 表示成功被服务器接收、理解、并接受</li><li>3 表示要完成请求，需要进一步操作。 通常，这些状态代码用来重定向</li><li>4 表示请求错误</li><li>5 表示服务器错误</li></ul><p>100 表示客户端的部分请求已被服务器接收 ，客户端应当继续发送请求的剩余部分，或者如果请求已经完成，忽略这个响应</p><p>101：更换协议，比如<code>websocket</code>和<code>http2</code></p><p>200 OK 客户端请求成功</p><p>201 (已创建) 请求成功并且服务器创建了新的资源</p><p>202（已创建）服务器已经接收请求，但尚未处理</p><p>204 （无内容）服务器成功处理请求，但没有返回任何内容</p><p>206（部分内容）应用于 HTTP 分块下载或断点续传，表示响应返回的 body 数据并不是资源的全部，而是其中的一部分，也是服务器处理成功的状态。</p><p>301 Moved Permanently 永久移动 请求的网页已永久移动到新位置。 服务器返回此响应（对 GET 或 HEAD 请求的响应）时，会自动将请求者转到新位置 302 Moved Temporarily 临时移动 服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求 304 Not Modified 文件未修改，可以直接使用缓存的文件。</p><p>307 （临时重定向） 服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求</p><p>302 重定向后可能会将请求从post变为get，而307不会</p><p>301 302 303 307 是在请求头的location字段中表明重定向的地址</p><p>301 是永久重定向有利于seo，302在规范中是不允许修改请求方式的，但由于浏览器厂商并没有遵循这个规范，它会在302之后用get方式访问重定向地址。在浏览器厂商的这种操作下HTTP1.1推出了303和307。303是重定向后使用get请求访问资源，307是重定向后用原请求方式访问资源。</p><p>301有个重要特性就是会缓存(因为是永久重定向，可以通过cache-control:no-cache禁用缓存)，但是307不会</p><p>400 Bad Request 由于客户端请求有语法错误，不能被服务器所理解。 401 Unauthorized 请求未经授权。对于需要登录的网页，服务器可能返回此响应。 403 Forbidden 服务器收到请求，但是拒绝提供服务。服务器通常会在响应正文中给出不提供服务的原因 404 Not Found 请求的资源不存在，例如，输入了错误的URL 500 Internal Server Error 服务器发生不可预期的错误，导致无法完成客户端的请求。 503 Service Unavailable 服务器当前不能够处理客户端的请求，在一段时间之后，服务器可能会恢复正常。 下面是一个HTTP响应的例子：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>HTTP/1.1 200 OK

Server:Apache Tomcat/5.0.12
Date:Mon,6Oct2003 13:23:42 GMT
Content-Length:112

&lt;html&gt;...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="get和post方法都是安全幂等的吗" tabindex="-1"><a class="header-anchor" href="#get和post方法都是安全幂等的吗" aria-hidden="true">#</a> GET和POST方法都是安全幂等的吗</h3><ul><li><p>在 HTTP 协议里，所谓的「安全」是指请求方法不会「破坏」服务器上的资源。</p></li><li><p>所谓的「幂等」，意思是多次执行相同的操作，结果都是「相同」的。</p></li></ul><p>get是安全幂等的，post会修改服务器上的资源，因此是不安全的，结果一不一定是相同的</p><h2 id="http1-1" tabindex="-1"><a class="header-anchor" href="#http1-1" aria-hidden="true">#</a> http1.1</h2><h3 id="keep-alive" tabindex="-1"><a class="header-anchor" href="#keep-alive" aria-hidden="true">#</a> keep-alive</h3><p>我们知道 HTTP 协议采用“请求-应答”模式，当使用普通模式，即非 Keep-Alive 模式时，每个请求/应答客户和服务器都要新建一个连接，完成之后立即断开连接（HTTP 协议为无连接的协议）；当使用 Keep-Alive 模式（又称持久连接、连接重用）时，Keep-Alive 功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive 功能避免了建立或者重新建立连接。</p><p>在 HTTP 1.0 版本中，并没有官方的标准来规定 Keep-Alive 如何工作，因此实际上它是被附加到 HTTP 1.0协议上，如果客户端浏览器支持 Keep-Alive ，那么就在HTTP请求头中添加一个字段 Connection: Keep-Alive，当服务器收到附带有 Connection: Keep-Alive 的请求时，它也会在响应头中添加一个同样的字段来使用 Keep-Alive 。这样一来，客户端和服务器之间的HTTP连接就会被保持，不会断开（超过 Keep-Alive 规定的时间，意外断电等情况除外），当客户端发送另外一个请求时，就使用这条已经建立的连接。</p><p>在 HTTP 1.1 版本中，默认情况下所有连接都被保持，如果加入 &quot;Connection: close&quot; 才关闭。目前大部分浏览器都使用 HTTP 1.1 协议，也就是说默认都会发起 Keep-Alive 的连接请求了，所以是否能完成一个完整的 Keep-Alive 连接就看服务器设置情况。</p><p>由于 HTTP 1.0 没有官方的 Keep-Alive 规范，并且也已经基本被淘汰，以下讨论均是针对 HTTP 1.1 标准中的 Keep-Alive 展开的。</p><p>注意：</p><p>HTTP Keep-Alive 简单说就是保持当前的TCP连接，避免了重新建立连接。</p><p>HTTP 长连接不可能一直保持，例如 Keep-Alive: timeout=5, max=100，表示这个TCP通道可以保持5秒，max=100，表示这个长连接最多接收100次请求就断开。</p><p>HTTP 是一个无状态协议，这意味着每个请求都是独立的，Keep-Alive 没能改变这个结果。另外，Keep-Alive也不能保证客户端和服务器之间的连接一定是活跃的，在 HTTP1.1 版本中也如此。唯一能保证的就是当连接被关闭时你能得到一个通知，所以不应该让程序依赖于 Keep-Alive 的保持连接特性，否则会有意想不到的后果。</p><p>使用长连接之后，客户端、服务端怎么知道本次传输结束呢？两部分：1. 判断传输数据是否达到了Content-Length 指示的大小；2. 动态生成的文件没有 Content-Length ，它是分块传输（chunked），这时候就要根据 chunked 编码来判断，chunked 编码的数据在最后有一个空 chunked 块，表明本次传输数据结束，详见这里。什么是 chunked 分块传输呢？下面我们就来介绍一下。</p><h3 id="管道传输" tabindex="-1"><a class="header-anchor" href="#管道传输" aria-hidden="true">#</a> 管道传输</h3><p>即可在同一个 TCP 连接里面，客户端可以发起多个请求，只要第一个请求发出去了，不必等其回来，</p><p>就可以发第二个请求出去，可以<strong>减少整体的响应时间。</strong></p><p>举例来说，客户端需要请求两个资源。以前的做法是，在同一个TCP连接里面，先发送 A 请求，然后等</p><p>待服务器做出回应，收到后再发出 B 请求。管道机制则是允许浏览器同时发出 A 请求和 B 请求。</p><p>但是服务器还是按照<strong>顺序</strong>，先回应 A 请求，完成后再回应 B 请求。要是前面的回应特别慢，后面就会</p><p>有许多请求排队等着。这称为「队头堵塞」。</p><h3 id="队头阻塞" tabindex="-1"><a class="header-anchor" href="#队头阻塞" aria-hidden="true">#</a> 队头阻塞</h3><p>因为当顺序发送的请求序列中的一个请求因为某种原因被阻塞时，在后面排队的所有请求也一同被阻塞</p><p>了，会招致客户端一直请求不到数据，这也就是「<strong>队头阻塞</strong>」。</p><h3 id="缓存处理" tabindex="-1"><a class="header-anchor" href="#缓存处理" aria-hidden="true">#</a> 缓存处理</h3><p>在HTTP1.0中主要使用header里的If-Modified-Since,Expires来做为缓存判断的标准，HTTP1.1则引入了更多的缓存控制策略例如Entity tag，If-Unmodified-Since, If-Match, If-None-Match等更多可供选择的缓存头来控制缓存策略。</p><h3 id="range头域" tabindex="-1"><a class="header-anchor" href="#range头域" aria-hidden="true">#</a> range头域</h3><p>HTTP1.0一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持断点续传功能，HTTP1.1则在请求头引入了range头域，它允许只请求资源的某个部分，即返回码是206（Partial Content），这样就方便了开发者自由的选择以便于充分利用带宽和连接。</p><h3 id="新增了24个错误状态响应码" tabindex="-1"><a class="header-anchor" href="#新增了24个错误状态响应码" aria-hidden="true">#</a> 新增了24个错误状态响应码</h3><p>如409（Conflict）表示请求的资源与资源的当前状态发生冲突；410（Gone）表示服务器上的某个资源被永久性的删除。</p><h2 id="transfer-encoding" tabindex="-1"><a class="header-anchor" href="#transfer-encoding" aria-hidden="true">#</a> Transfer-Encoding</h2><p>Transfer-Encoding 是一个用来标示 HTTP 报文传输格式的头部值。尽管这个取值理论上可以有很多，但是当前的 HTTP 规范里实际上只定义了一种传输取值——chunked。</p><p>如果一个HTTP消息（请求消息或应答消息）的Transfer-Encoding消息头的值为chunked，那么，消息体由数量未定的块组成，并以最后一个大小为0的块为结束。</p><p>每一个非空的块都以该块包含数据的字节数（字节数以十六进制表示）开始，跟随一个CRLF （回车及换行），然后是数据本身，最后块CRLF结束。在一些实现中，块大小和CRLF之间填充有白空格（0x20）。</p><p>最后一块是单行，由块大小（0），一些可选的填充白空格，以及CRLF。最后一块不再包含任何数据，但是可以发送可选的尾部，包括消息头字段。消息最后以CRLF结尾。</p><p>一个示例响应如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>HTTP/1.1 200 OK
Content-Type: text/plain
Transfer-Encoding: chunked

25
This is the data in the first chunk

1A
and this is the second one
0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：</p><p>chunked 和 multipart 两个名词在意义上有类似的地方，不过在 HTTP 协议当中这两个概念则不是一个类别的。multipart 是一种 Content-Type，标示 HTTP 报文内容的类型，而 chunked 是一种传输格式，标示报头将以何种方式进行传输。 chunked 传输不能事先知道内容的长度，只能靠最后的空 chunk 块来判断，因此对于下载请</p><p>Cookie 是Web 服务器发送给客户端的一小段信息，客户端请求时可以读取该信息发送到服务器端，进而进行用户的识别。对于客户端的每次请求，服务器都会将 Cookie 发送到客户端,在客户端可以进行保存,以便下次使用。</p><p>客户端可以采用两种方式来保存这个 Cookie 对象，一种方式是保存在客户端内存中，称为临时 Cookie，浏览器关闭后这个 Cookie 对象将消失。另外一种方式是保存在客户机的磁盘上，称为永久 Cookie。以后客户端只要访问该网站，就会将这个 Cookie 再次发送到服务器上，前提是这个 Cookie 在有效期内，这样就实现了对客户的跟踪。</p><p>Cookie 是可以被客户端禁用的。</p><p><strong>缺点：</strong></p><ul><li>不安全，很多安全问题都是由cookie导致的</li><li>数据类型只能是字符串</li><li>数据大小有限制</li></ul><p><strong>优点：</strong></p><ul><li>减少服务器压力</li></ul><p>domain:默认设置为发送请求的那个主域名 path表示主机下的哪些路径可以接受cookie domain和path共同指定cookie应该发送给哪些URL。</p><p>expire time 过期时间 secure cookie只能用https传输 httponly js不能访问cookie</p><h2 id="session" tabindex="-1"><a class="header-anchor" href="#session" aria-hidden="true">#</a> session</h2><p>每一个用户都有一个不同的 session，各个用户之间是不能共享的，是每个用户所独享的，在 session 中可以存放信息。</p><p>在服务器端会创建一个 session 对象，产生一个 sessionID 来标识这个 session 对象，然后将这个 sessionID 放入到 Cookie 中发送到客户端，下一次访问时，sessionID 会发送到服务器，在服务器端进行识别不同的用户。</p><p>Session 的实现依赖于 Cookie，如果 Cookie 被禁用，那么 session 也将失效。</p><p>cookie实际上是一小段的文本信息。客户端请求服务器，如果服务器需要记录该用户的状态，就使用response向客户端浏览器颁发一个cookie。客户端浏览器会把cookie保存起来。当浏览器再次请求该网站时，浏览器就会把请求地址和cookie一同给服务器。服务器检查该cookie，从而判断用户的状态。服务器还可以根据需要修改cookie的内容。 session是另一种记录客户状态的机制。不同的是cookie保存在客户端浏览器中，而session保存在服务器上。客户端浏览器访问服务器的时候，服务器把客户端信息以某种形式记录在服务器上，这就是session。客户端浏览器再次访问时只需要从该session中查找该客户的状态就可以了。 如果说cookie机制是通过检查客户身上的“通信证”，那么session机制就是通过检查服务器上的“客户明细表”来确认客户身份。</p><p><strong>优点：</strong></p><ul><li>安全性高</li><li>大小比cookie大</li><li>数据类型没有限制</li></ul><p>**缺点：**对服务器性能有一定影响</p><h2 id="跨站攻击" tabindex="-1"><a class="header-anchor" href="#跨站攻击" aria-hidden="true">#</a> 跨站攻击</h2><h3 id="csrf" tabindex="-1"><a class="header-anchor" href="#csrf" aria-hidden="true">#</a> CSRF</h3><p>CSRF（Cross-site request forgery，跨站请求伪造）</p><p>CSRF(XSRF) 顾名思义，是伪造请求，冒充用户在站内的正常操作。</p><p>例如，一论坛网站的发贴是通过 GET 请求访问，点击发贴之后 JS 把发贴内容拼接成目标 URL 并访问：</p><p><code>http://example.com/bbs/create_post.php?title=标题&amp;content=内容</code> 那么，我们只需要在论坛中发一帖，包含一链接：</p><p><code>http://example.com/bbs/create_post.php?title=我是脑残&amp;content=哈哈</code> 只要有用户点击了这个链接，那么他们的帐户就会在不知情的情况下发布了这一帖子。可能这只是个恶作剧，但是既然发贴的请求可以伪造，那么删帖、转帐、改密码、发邮件全都可以伪造。</p><p><strong>携带cookie的规则是根据请求的地址来判断，跟页面的地址无关。</strong></p><p>如何防范 CSRF 攻击？可以注意以下几点：</p><p>关键操作只接受 POST 请求</p><p>验证码</p><p>CSRF 攻击的过程，往往是在用户不知情的情况下构造网络请求。所以如果使用验证码，那么每次操作都需要用户进行互动，从而简单有效的防御了CSRF攻击。</p><p>但是如果你在一个网站作出任何举动都要输入验证码会严重影响用户体验，所以验证码一般只出现在特殊操作里面，或者在注册时候使用。</p><p>检测 Referer</p><p>常见的互联网页面与页面之间是存在联系的，比如你在 www.baidu.com 应该是找不到通往www.google.com 的链接的，再比如你在论坛留言，那么不管你留言后重定向到哪里去了，之前的那个网址一定会包含留言的输入框，这个之前的网址就会保留在新页面头文件的 Referer 中</p><p>通过检查 Referer 的值，我们就可以判断这个请求是合法的还是非法的，但是问题出在服务器不是任何时候都能接受到 Referer 的值，所以 Referer Check 一般用于监控 CSRF 攻击的发生，而不用来抵御攻击。</p><p><strong>Token</strong></p><p>目前主流的做法是使用 Token 抵御 CSRF 攻击。下面通过分析 CSRF 攻击来理解为什么 Token 能够有效</p><p>CSRF 攻击要成功的条件在于攻击者能够预测所有的参数从而构造出合法的请求。所以根据不可预测性原则，我们可以对参数进行加密从而防止 CSRF 攻击。</p><p>另一个更通用的做法是保持原有参数不变，另外添加一个参数 Token，其值是随机的。这样攻击者因为不知道 Token 而无法构造出合法的请求进行攻击。</p><p>Token 使用原则</p><p>Token 要足够随机————只有这样才算不可预测 Token 是一次性的，即每次请求成功后要更新Token————这样可以增加攻击难度，增加预测难度 Token 要注意保密性————敏感操作使用 post，防止 Token 出现在 URL 中 注意：过滤用户输入的内容不能阻挡 csrf，我们需要做的是过滤请求的来源。</p><p>CSRF通过外域发送请求，浏览器会自动带上cookie，伪造成用户自己发送的请求。</p><h4 id="策略" tabindex="-1"><a class="header-anchor" href="#策略" aria-hidden="true">#</a> 策略</h4><p>阻止不明外域的访问：</p><ul><li>同源检测</li><li>samesite cookie</li></ul><p>加上只有本域才能获取到的信息</p><ul><li>CSRF Token</li><li>双重cookie验证</li></ul><p>同源检测就是后面造成跨域的原因，他让服务端只能接受来自同源(同一台主机同一个路径同一个端口同一个协议)的请求</p><p>samesite cookie set-cookie新增了Samesite属性，只允许第一方携带cookie</p><p>CSRF Token 这个token不应该放在cookie中，每次请求都需要在header中加上token</p><p>双重cookie验证 利用csrf不能获取cookie的特点，在请求中加上cookie这个参数来再次验证</p><h3 id="xss" tabindex="-1"><a class="header-anchor" href="#xss" aria-hidden="true">#</a> XSS</h3><p>XSS（Cross Site Scripting，跨站脚本攻击）</p><p>XSS 全称“跨站脚本”，是注入攻击的一种。其特点是不对服务器端造成任何伤害，而是通过一些正常的站内交互途径，例如发布评论，提交含有 JavaScript 的内容文本。这时服务器端如果没有过滤或转义掉这些脚本，作为内容发布到了页面上，其他用户访问这个页面的时候就会运行这些脚本。</p><p>运行预期之外的脚本带来的后果有很多中，可能只是简单的恶作剧——一个关不掉的窗口：</p><p>while (true) { alert(&quot;你关不掉我~&quot;); } 也可以是盗号或者其他未授权的操作。</p><p>XSS 是实现 CSRF 的诸多途径中的一条，但绝对不是唯一的一条。一般习惯上把通过 XSS 来实现的 CSRF 称为 XSRF。</p><p>如何防御 XSS 攻击？</p><p>理论上，所有可输入的地方没有对输入数据进行处理的话，都会存在 XSS 漏洞，漏洞的危害取决于攻击代码的威力，攻击代码也不局限于 script。防御 XSS 攻击最简单直接的方法，就是过滤用户的输入。</p><p>如果不需要用户输入 HTML，可以直接对用户的输入进行 HTML escape 。下面一小段脚本：</p><p><code>&lt;script&gt;window.location.href=”http://www.baidu.com”;&lt;/script&gt;</code> 经过 escape 之后就成了：</p><p><code>&amp;lt;script&amp;gt;window.location.href=&amp;quot;http://www.baidu.com&amp;quot;&amp;lt;/script&amp;gt;</code> 它现在会像普通文本一样显示出来，变得无毒无害，不能执行了。</p><p>当我们需要用户输入 HTML 的时候，需要对用户输入的内容做更加小心细致的处理。仅仅粗暴地去掉 script 标签是没有用的，任何一个合法 HTML 标签都可以添加 onclick 一类的事件属性来执行 JavaScript。更好的方法可能是，将用户的输入使用 HTML 解析库进行解析，获取其中的数据。然后根据用户原有的标签属性，重新构建 HTML 元素树。构建的过程中，所有的标签、属性都只从白名单中拿取。</p><h4 id="存储型" tabindex="-1"><a class="header-anchor" href="#存储型" aria-hidden="true">#</a> 存储型</h4><p>存储型xss是通过请求将数据加入数据库，这些数据会展示在页面上，如留言，评论</p><h4 id="反射型" tabindex="-1"><a class="header-anchor" href="#反射型" aria-hidden="true">#</a> 反射型</h4><p>反射型xss是攻击者构造恶意url，当用户访问这个url时，会将url中的数据拼接在html中，当用户点开url就会执行恶意脚本。</p><h4 id="dom型" tabindex="-1"><a class="header-anchor" href="#dom型" aria-hidden="true">#</a> dom型</h4><p>dom主要是因为前端JavaScript自身的漏洞，攻击者构造恶意url，前端javascript取出url中的数据，并执行恶意脚本</p><h4 id="xss预防" tabindex="-1"><a class="header-anchor" href="#xss预防" aria-hidden="true">#</a> xss预防</h4><h5 id="预防存储型和反射型" tabindex="-1"><a class="header-anchor" href="#预防存储型和反射型" aria-hidden="true">#</a> 预防存储型和反射型</h5><p>这两种都是服务端取出恶意代码拼接到html上，主要有两种方法：</p><p>1.纯前端渲染</p><p>2.对html做充分转义</p><p>纯前端渲染就是我们现在常用的，通过ajax发送数据，再把数据渲染在页面上。</p><p>如果html拼接是有必要的，那么需要对html做充分的转义，做好充分的html转义是非常复杂的。</p><h5 id="预防dom型" tabindex="-1"><a class="header-anchor" href="#预防dom型" aria-hidden="true">#</a> 预防dom型</h5><p>尽量不要使用innterHTML,outerHTML,domcument.write，如果是vue或者react，尽量不要使用v-html，dangerouslySetInnerHTML，onclick，location，a的href属性都是可以执行JavaScript代码的，不要将不信任的数据传递给这些api</p><h5 id="其他防范措施" tabindex="-1"><a class="header-anchor" href="#其他防范措施" aria-hidden="true">#</a> 其他防范措施</h5><p>csp，可以防止加载外域脚本；</p><p>限制输入长度</p><p>http-only，无法通过js脚本获取到cookie</p><p>验证码</p><h2 id="http2-0" tabindex="-1"><a class="header-anchor" href="#http2-0" aria-hidden="true">#</a> http2.0</h2><p>http2.0是一种安全高效的下一代http传输协议。安全是因为http2.0建立在https协议的基础上，高效是因为它是通过二进制分帧来进行数据传输。</p><h3 id="二进制分帧" tabindex="-1"><a class="header-anchor" href="#二进制分帧" aria-hidden="true">#</a> 二进制分帧</h3><p>http2.0之所以能够突破http1.X标准的性能限制，改进传输性能，实现低延迟和高吞吐量，就是因为其新增了二进制分帧层。</p><p>帧(frame)包含部分：类型Type, 长度Length, 标记Flags, 流标识Stream和frame payload有效载荷。</p><p>消息(message)：一个完整的请求或者响应，比如请求、响应等，由一个或多个 Frame 组成。</p><p>流是连接中的一个虚拟信道，可以承载双向消息传输，可以承载一条或多条消息。每个流有唯一整数标识符。为了防止两端流ID冲突，客户端发起的流具有奇数ID，服务器端发起的流具有偶数ID。</p><p>流标识是描述二进制frame的格式，使得每个frame能够基于http2发送，与流标识联系的是一个流，每个流是一个逻辑联系，一个独立的双向的frame存在于客户端和服务器端之间的http2连接中。一个http2连接上可包含多个并发打开的流，这个并发流的数量能够由客户端设置。</p><p>在二进制分帧层上，http2.0会将所有传输信息分割为更小的消息和帧，并对它们采用二进制格式的编码将其封装，新增的二进制分帧层同时也能够保证http的各种动词，方法，首部都不受影响，兼容上一代http标准。其中，http1.X中的首部信息header封装到Headers帧中，而request body将被封装到Data帧中。</p><p><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/31/16e208ee1d0caab8~tplv-t2oaga2asx-watermark.awebp" alt="img"></p><h3 id="多路复用-连接共享" tabindex="-1"><a class="header-anchor" href="#多路复用-连接共享" aria-hidden="true">#</a> 多路复用/连接共享</h3><p>在http1.1中，浏览器客户端在同一时间，针对同一域名下的请求有一定数量的限制，超过限制数目的请求会被阻塞。这也是为何一些站点会有多个静态资源 CDN 域名的原因之一。</p><p>而http2.0中的多路复用优化了这一性能。多路复用允许同时通过单一的http/2 连接发起多重的请求-响应消息。有了新的分帧机制后，http/2 不再依赖多个TCP连接去实现多流并行了。每个数据流都拆分成很多互不依赖的帧，而这些帧可以交错（乱序发送），还可以分优先级，最后再在另一端把它们重新组合起来。</p><p>http 2.0 连接都是持久化的，而且客户端与服务器之间也只需要一个连接（每个域名一个连接）即可。http2连接可以承载数十或数百个流的复用，<strong>多路复用意味着来自很多流的数据包能够混合在一起通过同样连接传输</strong>。<strong>当到达终点时，再根据不同帧首部的流标识符重新连接将不同的数据流进行组装。</strong></p><p><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/31/16e208ee1cebfa44~tplv-t2oaga2asx-watermark.awebp" alt="img"></p><p><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/31/16e208ee1e5c87aa~tplv-t2oaga2asx-watermark.awebp" alt="img"></p><h3 id="头部压缩" tabindex="-1"><a class="header-anchor" href="#头部压缩" aria-hidden="true">#</a> 头部压缩</h3><p>http1.x的头带有大量信息，而且每次都要重复发送。http/2使用encoder来减少需要传输的header大小，通讯双方各自缓存一份头部字段表，既避免了重复header的传输，又减小了需要传输的大小。</p><p>对于相同的数据，不再通过每次请求和响应发送，通信期间几乎不会改变通用键-值对(用户代理、可接受的媒体类型，等等)只需发送一次。</p><p>事实上,如果请求中不包含首部(例如对同一资源的轮询请求)，那么，首部开销就是零字节，此时所有首部都自动使用之前请求发送的首部。</p><p>如果首部发生了变化，则只需将变化的部分加入到header帧中，改变的部分会加入到头部字段表中，首部表在 http 2.0 的连接存续期内始终存在，由客户端和服务器共同渐进地更新。</p><p>需要注意的是，http 2.0关注的是首部压缩，而我们常用的gzip等是报文内容（body）的压缩，二者不仅不冲突，且能够一起达到更好的压缩效果。</p><h4 id="压缩原理" tabindex="-1"><a class="header-anchor" href="#压缩原理" aria-hidden="true">#</a> 压缩原理</h4><p>用header字段表里的索引代替实际的header。</p><p>http/2的HPACK算法使用一份索引表来定义常用的http Header，把常用的 http Header 存放在表里，请求的时候便只需要发送在表里的索引位置即可。</p><p><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/31/16e208ee3d18e3b3~tplv-t2oaga2asx-watermark.awebp" alt="img"></p><p>因为索引表的大小的是有限的，它仅保存了一些常用的 http Header，同时每次请求还可以在表的末尾动态追加新的 http Header 缓存，动态部分称之为 Dynamic Table。Static Table 和 Dynamic Table 在一起组合成了索引表</p><h3 id="请求优先级" tabindex="-1"><a class="header-anchor" href="#请求优先级" aria-hidden="true">#</a> 请求优先级</h3><p>把http消息分为很多独立帧之后，就可以通过优化这些帧的交错和传输顺序进一步优化性能。每个流都可以带有一个31比特的优先值：0 表示最高优先级；2的31次方-1 表示最低优先级。</p><p>服务器可以根据流的优先级，控制资源分配（CPU、内存、带宽），而在响应数据准备好之后，优先将最高优先级的帧发送给客户端。高优先级的流都应该优先发送，但又不会绝对的。绝对地准守，可能又会引入首队阻塞的问题：高优先级的请求慢导致阻塞其他资源交付。</p><p>分配处理资源和客户端与服务器间的带宽，不同优先级的混合也是必须的。客户端会指定哪个流是最重要的，有一些依赖参数，这样一个流可以依赖另外一个流。优先级别可以在运行时动态改变，当用户滚动页面时，可以告诉浏览器哪个图像是最重要的，你也可以在一组流中进行优先筛选，能够突然抓住重点流。</p><p>●优先级最高：主要的html</p><p>●优先级高：CSS文件</p><p>●优先级中：js文件</p><p>●优先级低：图片</p><h3 id="服务端推送" tabindex="-1"><a class="header-anchor" href="#服务端推送" aria-hidden="true">#</a> 服务端推送</h3><p>服务器可以对一个客户端请求发送多个响应，服务器向客户端推送资源无需客户端明确地请求。并且，服务端推送能把客户端所需要的资源伴随着index.html一起发送到客户端，省去了客户端重复请求的步骤。</p><p>正因为没有发起请求，建立连接等操作，所以静态资源通过服务端推送的方式可以极大地提升速度。Server Push 让 http1.x 时代使用内嵌资源的优化手段变得没有意义；如果一个请求是由你的主页发起的，服务器很可能会响应主页内容、logo 以及样式表，因为它知道客户端会用到这些东西，这相当于在一个 HTML 文档内集合了所有的资源。</p><p>不过与之相比，服务器推送还有一个很大的优势：可以缓存！也让在遵循同源的情况下，不同页面之间可以共享缓存资源成为可能。</p><p>注意两点：</p><p>1、推送遵循同源策略；</p><p>2、这种服务端的推送是基于客户端的请求响应来确定的。</p><p>当服务端需要主动推送某个资源时，便会发送一个 Frame Type 为 PUSH_PROMISE 的 Frame，里面带了 PUSH 需要新建的 Stream ID。意思是告诉客户端：接下来我要用这个 ID 向你发送东西，客户端准备好接着。客户端解析 Frame 时，发现它是一个 PUSH_PROMISE 类型，便会准备接收服务端要推送的流。</p><h3 id="个人理解" tabindex="-1"><a class="header-anchor" href="#个人理解" aria-hidden="true">#</a> 个人理解</h3><p>http2.0安全且高效，安全是因为http2.0是建立在https协议基础上的，高效是因为它采用了二进制分帧来进行数据传输。http2.0新增了二进制分帧层，流是连接中的通道，每个流都有唯一标识符，流标识是描述二进制帧的，与流标识联系的是同一个流，http1.x中的头部放在Headers帧中，请求体放在Data帧中。http2.0的多路复用使得每次传输不需要发起多个请求，把数据流分成互不依赖的帧，最后再在另一端重组。头部压缩主要依靠头部字段表，一开始的头部字段表会放一些常见的，如果有不存在的字段就会在表末尾追加新的http header缓存。将http消息分成很多独立帧之后会存在优先级，优先级从高到低：主要的html，css，js，图片。服务端可以实现在没有请求的时候发送响应，当服务器需要向客户端主动发送响应时，会先发送Frame Type为PUSH_PROMISE的Frame，里面含有PUSH的流ID，客户端解析Frame发现时PUSH_PROMISE时，便会准备接受服务端推送的流</p><h2 id="https" tabindex="-1"><a class="header-anchor" href="#https" aria-hidden="true">#</a> https</h2><p><strong>一般http中存在如下问题：</strong></p><p>请求信息明文传输，容易被窃听截取。</p><p>数据的完整性未校验，容易被篡改</p><p>没有验证对方身份，存在冒充危险</p><p>https可以理解为http+ssl/tls，通过SSL证书验证服务器身份，并为浏览器和服务器之间的通信加密</p><h3 id="https做了什么" tabindex="-1"><a class="header-anchor" href="#https做了什么" aria-hidden="true">#</a> https做了什么</h3><p>HTTPS 协议提供了三个关键的指标</p><ul><li><code>加密(Encryption)</code>， HTTPS 通过对数据加密来使其免受窃听者对数据的监听，这就意味着当用户在浏览网站时，没有人能够监听他和网站之间的信息交换，或者跟踪用户的活动，访问记录等，从而窃取用户信息。</li><li><code>数据一致性(Data integrity)</code>，数据在传输的过程中不会被窃听者所修改，用户发送的数据会<code>完整</code>的传输到服务端，保证用户发的是什么，服务器接收的就是什么。</li><li><code>身份认证(Authentication)</code>，是指确认对方的真实身份，也就是<code>证明你是你</code>（可以比作人脸识别），它可以防止中间人攻击并建立用户信任。</li></ul><h2 id="握手阶段" tabindex="-1"><a class="header-anchor" href="#握手阶段" aria-hidden="true">#</a> 握手阶段</h2><p>握手阶段</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/2771952479-5e1ad3408e724_fix732.webp" alt=""></p><p>非对称加密用在生成这个随机字符串上，属于握手阶段。</p><p>对称加密是在真正的加密环节中使用的，key是在握手阶段协商的key</p><h3 id="浏览器在使用https传输数据的流程是什么" tabindex="-1"><a class="header-anchor" href="#浏览器在使用https传输数据的流程是什么" aria-hidden="true">#</a> 浏览器在使用HTTPS传输数据的流程是什么</h3><ol><li>首先客户端通过URL访问服务器建立SSL连接。</li><li>服务端收到客户端请求后，会将网站支持的证书信息（证书中包含公钥）传送一份给客户端。</li><li>客户端的服务器开始协商SSL连接的安全等级，也就是信息加密的等级。</li><li>客户端的浏览器根据双方同意的安全等级，建立会话密钥(session key,是对称加密的)，然后利用网站的公钥将会话密钥加密，并传送给服务器。</li><li>服务器利用自己的私钥解密出会话密钥。</li><li>服务器利用会话密钥加密与客户端之间的通信。</li></ol><h3 id="ssl-tls是如何加密的" tabindex="-1"><a class="header-anchor" href="#ssl-tls是如何加密的" aria-hidden="true">#</a> SSL/TLS是如何加密的</h3><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/20220203215335.png" alt=""></p><p>RSA (一种非对称加密算法)的运算速度非常慢，而 AES(一种对称加密算法) 的加密速度比较快，而 TLS 正是使用了这种<code>混合加密</code>方式。在通信刚开始的时候使用非对称算法，比如 RSA、ECDHE ，首先解决<code>密钥交换</code>的问题。然后用随机数产生对称算法使用的<code>会话密钥（session key）</code>，再用<code>公钥加密</code>。对方拿到密文后用<code>私钥解密</code>，取出会话密钥。这样，双方就实现了对称密钥的安全交换。</p><p>加密和解密都是依靠会话密钥的，会话密钥是由公钥加密私钥解密的</p><h3 id="https是如何保证数据的完整性的" tabindex="-1"><a class="header-anchor" href="#https是如何保证数据的完整性的" aria-hidden="true">#</a> https是如何保证数据的完整性的</h3><p>在 TLS 中，实现完整性的手段主要是 <code>摘要算法(Digest Algorithm)</code>，MD5 可用于从任意长度的字符串创建 128 位字符串值。MD5 最常用于<code>验证文件</code>的完整性。</p><p>除了常用的 MD5 是加密算法外，<code>SHA-1(Secure Hash Algorithm 1)</code> 也是一种常用的加密算法。目前 TLS 推荐使用的是 SHA-1 的后继者：<code>SHA-2</code>。不过 SHA-2 是基于明文的加密方式，还是不够安全，那应该用什么呢？</p><p>安全性更高的加密方式是使用 <code>HMAC</code></p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20220203224326950.png" alt="image-20220203224326950"></p><p>我们只要在原文后附上它的摘要，就能够保证数据的完整性</p><h3 id="https如何进行身份认证" tabindex="-1"><a class="header-anchor" href="#https如何进行身份认证" aria-hidden="true">#</a> https如何进行身份认证</h3><p>首先服务器会发来自己的数字证书，这个数字证书是由CA颁发的，这个数字证书内的信息包括：</p><p>签发者，证书用途，公钥，加密算法，hash算法，证书到期时间等。</p><p>但是如果就这样把证书交给了浏览器，则无法保证证书是否会被人篡改，因此我们需要对以上内容进行一次hash，得到固定长度，再用CA私钥加密该hash，就得到了数字签名，放在证书末尾，任何对证书的篡改操作都会被签名发现。</p><p>浏览器拿到证书后，查找操作系统内置的ca公钥，用这个公钥解密数字签名，拿到原始HASHs，再根据证书中hash算法算出一个HASHc，如果两者相等，那么认证成功</p><p>https可以在控制台或者抓包到明文吗？可以，控制台属于应用层，加密解密都是在安全层，因此看到的是明文，抓包看到明文实际上是一个代理服务器，并且他有一个证书，客户端信任他的证书。</p><h2 id="中间人攻击" tabindex="-1"><a class="header-anchor" href="#中间人攻击" aria-hidden="true">#</a> 中间人攻击</h2><p>在握手阶段完成之后，由于有对称加密，传输过程就不会出现问题，但是在握手阶段，客户端没办法知道公钥一定是服务器的，也可能是被别人替换了的。</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-c181b1f7cf755605bf950dff0182674a_720w.jpg" alt=""></p><p>中间人可以在这个过程中替换掉公钥，这样就可以通过中间人自己这边的私钥解密出premaster（因为客户端的公钥也是中间人给的）并且计算出会话密钥</p><h2 id="udp" tabindex="-1"><a class="header-anchor" href="#udp" aria-hidden="true">#</a> UDP</h2><p>UDP不提供复杂的控制机制，利用IP提供面向无连接的通信服务。并且它是将应用程序发来的数据在收到的那一刻，立刻按照原样发送到网络上的一种机制。即使出现了网络拥堵，UDP也无法进行流量控制等避免网络拥塞的行为。此外，传输途中即使出现了丢包，UDP也不负责重发。甚至包的顺序乱掉时也没有纠正的功能。如果需要这些细节控制，就需要UDP的应用程序来处理。</p><h4 id="udp如何实现可靠传输" tabindex="-1"><a class="header-anchor" href="#udp如何实现可靠传输" aria-hidden="true">#</a> UDP如何实现可靠传输</h4><p>最简单的方式是在应用层模仿传输层TCP的可靠性传输。下面不考虑拥塞处理，可靠UDP的简单设计。</p><ul><li>1、添加seq/ack机制，确保数据发送到对端</li><li>2、添加发送和接收缓冲区，主要是用户超时重传。</li><li>3、添加超时重传机制。</li></ul><p>详细说明：发送端发送数据时，生成一个随机seq=x，然后每一片按照数据大小分配seq。数据到达接收端后接收端放入缓存，并发送一个ack=x的包，表示对方已经收到了数据。发送端收到了ack包后，删除缓冲区对应的数据。时间到后，定时任务检查是否需要重传数据。</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-c01a6511abf81f867fd0e531bd51af2c_720w.jpg" alt="img"></p><h2 id="tcp" tabindex="-1"><a class="header-anchor" href="#tcp" aria-hidden="true">#</a> TCP</h2><p>UDP是一种没有复杂控制，提供面向无连接通信服务的一种协议。换句话说，他将部分控制转移给应用程序去处理，自己却只能提供作为传输层协议的最基本功能。TCP与UDP相差相当大。它充分的实现了数据传输时各种控制功能。它会在丢包时重发，对次序乱掉的包纠正。</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-3bd45a13afe868cae6225d75b85e9c36_720w.jpg" alt="img"></p><p>数据偏移：其实就是首部长度</p><p>控制位包括：CWR，ECE，URG，ACK，PSH，RST，SYN，FIN。</p><p>**ACK：**该位设为 1，确认应答的字段有效，TCP规定除了最初建立连接时的 SYN 包之外该位必须设为 1；</p><p>**SYN：**用于建立连接，该位设为 1，表示希望建立连接，并在其序列号的字段进行序列号初值设定；</p><p>**FIN：**该位设为 1，表示今后不再有数据发送，希望断开连接。当通信结束希望断开连接时，通信双方的主机之间就可以相互交换 FIN 位置为 1 的 TCP 段。</p><p>每个主机又对对方的 FIN 包进行确认应答之后可以断开连接。不过，主机收到 FIN 设置为 1 的 TCP 段之后不必马上回复一个 FIN 包，而是可以等到缓冲区中的所有数据都因为已成功发送而被自动删除之后再发 FIN 包；</p><h3 id="三次握手" tabindex="-1"><a class="header-anchor" href="#三次握手" aria-hidden="true">#</a> 三次握手</h3><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-0673bbc84fe4440aed9d1dadc67ae79b_720w.jpg" alt="img"></p><p>假设 A 为客户端，B 为服务器端。</p><p>首先 B 处于 LISTEN（监听）状态，等待客户的连接请求。</p><ul><li>A 向 B 发送连接请求报文，SYN=1，ACK=0，选择一个初始的序号 x。</li><li>B 收到连接请求报文，如果同意建立连接，则向 A 发送连接确认报文，SYN=1，ACK=1，确认号为 x+1，同时也选择一个初始的序号 y。</li><li>A 收到 B 的连接确认报文后，还要向 B 发出确认，确认号为 y+1。</li></ul><p>B 收到 A 的确认后，连接建立。</p><h4 id="为什么是三次" tabindex="-1"><a class="header-anchor" href="#为什么是三次" aria-hidden="true">#</a> 为什么是三次</h4><p>1、第三次握手是为了防止失效的连接请求到达服务器，让服务器错误打开连接。</p><p>如果是两次，假设有一次发送端没有收到接收端的确认报文，那发送端将再一次发送SYN=1的请求报文，这次他收到了并且建立了连接，不久后有断开了了连接，但是如果是只是当初第一次发送的请求报文只是太慢了呢，它在断开连接之后，有一次发送到了接收端，这时如果是两次连接服务端就会打开连接，而客户端则一脸懵逼，因为这时他还是个listen状态，而服务端只需要在listen状态下收到一个请求报文就会打开。</p><p>2、双方都能明确自己和对方的收、发能力是正常的。</p><p>第一次握手服务端知道了客户端发送能力和服务端接收能力是正常的</p><p>第二次握手客户端知道自己发送接受能力和服务端发送接受能力是正常的</p><p>第三次握手服务端知道自己发送接收能力和客户端发送接收能力是正常的</p><h3 id="四次挥手" tabindex="-1"><a class="header-anchor" href="#四次挥手" aria-hidden="true">#</a> 四次挥手</h3><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-8bf6f231cdd87b2613554f54424e8201_720w.jpg" alt="img"></p><p>在tcp连接建立之后，双方的地位是平等的，双方都可以发送数据，也可以接收数据，因此，当客户端收到确认报文之后，服务端还是可以接着发送数据，因为服务端并没有想断开连接，等到服务端想断开连接时，服务端才会发送一个FIN段，客户端收到FIN后在等待2msl(报文最大生存空间)后才会断开连接。</p><h4 id="为什么会有2msl" tabindex="-1"><a class="header-anchor" href="#为什么会有2msl" aria-hidden="true">#</a> 为什么会有2msl</h4><p>1.如果客户端马上断开了连接，此时都还不知道服务端收没收到ack，如果服务端没有收到ack，超时重传机制服务端就会不断地发送FIN，但客户端也不是不能接受，但是会出现异常，接着服务端就一直不能正常关闭。</p><p>2.如果有一些报文段因为网络延时没有送达，如果马上断开连接的话，那么在下次建立连接，或者建立连接后就会就会出现一系列未知的异常，比如说有个syn包，那么下次连接就开始了，在2msl的时间内足以让这些报文段到达。</p><h3 id="tcp如何实现可靠传输" tabindex="-1"><a class="header-anchor" href="#tcp如何实现可靠传输" aria-hidden="true">#</a> TCP如何实现可靠传输</h3><p>TCP通过校验和，序列号，确认应答，重发控制，连接管理以及窗口控制等机制实现可靠传输。</p><ol><li>应用数据被分割成 TCP 认为最适合发送的数据块。</li><li>TCP 给发送的每一个包进行编号，接收方对数据包进行排序，把有序数据传送给应用层。</li><li>**校验和：**TCP 将保持它首部和数据的检验和。这是一个端到端的检验和，目的是检测数据在传输过程中的任何变化。如果收到段的检验和有差错，TCP 将丢弃这个报文段和不确认收到此报文段。</li><li>TCP 的接收端会丢弃重复的数据。</li><li>**流量控制：**TCP 连接的每一方都有固定大小的缓冲空间，TCP的接收端只允许发送端发送接收端缓冲区能接纳的数据。当接收方来不及处理发送方的数据，能提示发送方降低发送的速率，防止包丢失。TCP 使用的流量控制协议是可变大小的滑动窗口协议。 （TCP 利用滑动窗口实现流量控制）</li><li>**拥塞控制：**当网络拥塞时，减少数据的发送。</li><li>**ARQ协议：**也是为了实现可靠传输的，它的基本原理就是每发完一个分组就停止发送，等待对方确认。在收到确认后再发下一个分组。</li><li>**超时重传：**当 TCP 发出一个段后，它启动一个定时器，等待目的端确认收到这个报文段。如果不能及时收到一个确认，将重发这个报文段。</li></ol><h4 id="通过序列号与确认应答提高可靠性" tabindex="-1"><a class="header-anchor" href="#通过序列号与确认应答提高可靠性" aria-hidden="true">#</a> 通过序列号与确认应答提高可靠性</h4><p>在TCP中，发送端数据到达接收端主机值，接收端主机会返回一个已收到消息的通知，这个消息叫做确认应答（ACK).由于有时候确认应答会丢包，因此我们引入了序列号，就是按顺序给发送数据的每一个字节都标上号码，在确认应答的时候就发送确认应答号来告诉发送端下一次要发什么（虽然我至今还是没有搞明白这个序列号怎么解决的丢包的问题的）(回来解决：如果接收端返回了带有这个序列号的ack包，那么这个就代表这个包已经收到了，如果没有这个序列号的话是不知道哪个包有没有丢了，毕竟发送数据并不会等待上一个报确认后再发，而是发好几个，发多少的话是根据双方的接受能力定的)</p><h4 id="滑动窗口" tabindex="-1"><a class="header-anchor" href="#滑动窗口" aria-hidden="true">#</a> 滑动窗口</h4><p>是流量控制的手段，我们不再是发送端等到接收端发回确认应答再接着发，而是依靠一个滑动窗口，每次发送端发送完数据后将这部分数据加入到缓冲区中，并且接着发送下面的数据，当收到确认请求后清空缓冲区中这块数据。</p><h4 id="窗口控制与重发控制" tabindex="-1"><a class="header-anchor" href="#窗口控制与重发控制" aria-hidden="true">#</a> 窗口控制与重发控制</h4><p>有了窗口控制后，发送端不会因为没有收到确认应答而重发，因为有可能会是接收端收到了但是确认应答丢失了，因此如果是某一个序列号的包丢失了，接收端会在每次收到数据时发送同一个序列号的确认应答，发送端收到三次相同的确认应答就会重发<img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20220410102502702.png" alt="image-20220410102502702"></p><p>在某一报文段丢失后，发送端会一直收到序号为（1001）的确认应答，告诉发送端1001这块报文段丢失了，如果发送端收到了三次同一个确认应答就会重发。</p><h4 id="拥塞控制" tabindex="-1"><a class="header-anchor" href="#拥塞控制" aria-hidden="true">#</a> 拥塞控制</h4><p>在通信刚开始的时候就发送大量数据会引发其他问题，TCP为了防止该问题，在通信一开始就会通过一个叫慢启动的算法得出的数值，对发送数据量进行控制，为了在发送端调节所要发的数据量，定义了一个叫‘拥塞窗口’的概念。**慢启动：**一开始拥塞窗口会设置成1MSS，每次收到确认应答都会加1，拥塞窗口就会以1，2，4指数式增长，为了防止这些引入了慢启动阈值。<strong>拥塞避免</strong>：只要拥塞窗口的值超过了慢启动阈值，只允许以1个数据段的字节数*1个数据段的字节数/拥塞窗口字节数的比例增大。**快恢复：**TCP的通信一开始并没有设置阈值，而是在超时重发时，才会设置为当前拥塞窗口的一半，重复确认应答进行高速重发控制，也会将阈值设为拥塞窗口的一半，接着会把拥塞窗口设置成慢启动阈值+3个数据段大小，这样TCP的吞吐量就可以随着网络的拥塞情况发生改变。</p><h4 id="快重传、快恢复" tabindex="-1"><a class="header-anchor" href="#快重传、快恢复" aria-hidden="true">#</a> 快重传、快恢复</h4><p>快重传算法规定，发送方只要一连收到三个重复确认就应当立即重传对方尚未收到的报文段，而不必继续等待设置的重传计时器时间到期。</p><p><strong>快恢复：<strong>当发送方连续收到三个重复确认时，就执行</strong>乘法减小</strong>算法，把拥塞窗口阈值减半（为了预防网络发生拥塞）。但是接下去并不执行慢开始算法，而是将当前发送的窗口设置为拥塞窗口阈值减半后的值，然后执行拥塞避免算法。</p><h1 id="ip协议" tabindex="-1"><a class="header-anchor" href="#ip协议" aria-hidden="true">#</a> IP协议</h1><p>IP相当于是OSI参考模型的第三层-----网络层</p><p>在之前的数据链路层，我们可以通过交换机，可以将两个数据链路连接起来，但是这只局限于同一种数据链路，如果要将不同种数据链路(以太网、无线LAN亦或是PPP)连接起来的话，就需要借助网络层(中的路由器)，路由器是网络层的核心人物，配置有ip地址但没有路由控制的设备称为主机，配置有ip地址并且同时又路由控制的设备称为路由器，节点是路由器和主机的总称。MAC地址是用来标识同一链路不同计算机的，IP地址用于在连接到网络中的所有主机中识别出进行通信的目标地址。因此想要发送数据到任意IP地址，需要如下流程（ip层面）：首先发送方会通过子网掩码来判断目标ip地址与自己是否在同一局域网内，如果不在就会发给默认网关(即路由器的ip地址)，路由器有一张路由控制表，路由控制表会将端口与下一跳的子网对应起来，接着只需要传给对应端口就好了。当然数据链路层是不知道IP地址的，他们只知道mac地址，那么就需要一张mac与ip地址对应的表，这就叫arp缓存表。比如说我想要将跳到默认网关，默认网关是一个ip地址，这时候就需要arp表，通过arp表得到mac地址，通过交换机或者其他交换设备，就可以把数据包发送给默认网关。</p><h2 id="ipv6" tabindex="-1"><a class="header-anchor" href="#ipv6" aria-hidden="true">#</a> IPv6</h2><h3 id="ipv6的必要性" tabindex="-1"><a class="header-anchor" href="#ipv6的必要性" aria-hidden="true">#</a> IPv6的必要性</h3><p>IPv6是为了根本解决IPv4地址耗尽的问题而被标准化的网际协议，IPv4的地址长度为32比特，而IPv6地址长度是128比特，IPv6不仅仅能解决IPv4地址耗尽的问题它甚至试图弥补IPv4绝大多数缺陷。</p><ul><li>IP地址的扩大和路由控制表的聚合</li><li>性能提升</li><li>采用认证和加密功能，应对伪造IP地址的网络安全功能以及防止线路窃听的功能</li></ul><h1 id="dns" tabindex="-1"><a class="header-anchor" href="#dns" aria-hidden="true">#</a> dns</h1><p>1.在浏览器中输入www . qq .com 域名，操作系统会先检查自己本地的hosts文件是否有这个网址映射关系，如果有，就先调用这个IP地址映射，完成域名解析。</p><p>2.如果hosts里没有这个域名的映射，则查找本地DNS解析器缓存，是否有这个网址映射关系，如果有，直接返回，完成域名解析。</p><p>3.如果hosts与本地DNS解析器缓存都没有相应的网址映射关系，首先会找TCP/ip参数中设置的首选DNS服务器，在此我们叫它本地DNS服务器，此服务器收到查询时，如果要查询的域名，包含在本地配置区域资源中，则返回解析结果给客户机，完成域名解析，此解析具有权威性。</p><p>4.如果要查询的域名，不由本地DNS服务器区域解析，但该服务器已缓存了此网址映射关系，则调用这个IP地址映射，完成域名解析，此解析不具有权威性。</p><p>5.如果本地DNS服务器本地区域文件与缓存解析都失效，则根据本地DNS服务器的设置（是否设置转发器）进行查询，如果未用转发模式，本地DNS就把请求发至13台根DNS，根DNS服务器收到请求后会判断这个域名(.com)是谁来授权管理，并会返回一个负责该顶级域名服务器的一个IP。本地DNS服务器收到IP信息后，将会联系负责.com域的这台服务器。这台负责.com域的服务器收到请求后，如果自己无法解析，它就会找一个管理.com域的下一级DNS服务器地址http://qq.com给本地DNS服务器。当本地DNS服务器收到这个地址后，就会找http://qq.com域服务器，重复上面的动作，进行查询，直至找到www . qq .com主机。</p><p>6.如果用的是转发模式，此DNS服务器就会把请求转发至上一级DNS服务器，由上一级服务器进行解析，上一级服务器如果不能解析，或找根DNS或把转请求转至上上级，以此循环。不管是本地DNS服务器用是是转发，还是根提示，最后都是把结果返回给本地DNS服务器，由此DNS服务器再返回给客户机。 从客户端到本地DNS服务器是属于递归查询，而DNS服务器之间就是的交互查询就是迭代查询。</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/464291-20170703113844956-354755333.jpg" alt="img"></p><p>在通过<strong>浏览器缓存</strong>（为加快访问速度，有些浏览器会缓存dns记录）及<strong>host文件</strong>都无法解析域名的情况下，OS会将这个域名发送给计算机网络配置中DNS对应的地址（LDNS），即本地区的域名服务器。这个DNS通常都提供给你本地互联网接入的一个DNS解析服务，假如是在学校接入的互联网，那么这个本地区的域名服务器基本上是在学校中；如果是在小区接入的互联网，那么这个本地区的域名服务器就是提供给你接入互联网的应用服务上，也就是电信或联通。</p><h1 id="cdn" tabindex="-1"><a class="header-anchor" href="#cdn" aria-hidden="true">#</a> cdn</h1><p>CDN 的工作原理就是将您源站的资源缓存到位于全球各地的 CDN 节点上，用户请求资源时，就近返回节点上缓存的资源，而不需要每个用户的请求都回您的源站获取，避免网络拥塞、缓解源站压力，保证用户访问资源的速度和体验。</p><ol><li>当用户点击网站页面上的内容URL，经过本地DNS系统解析，DNS系统会最终将域名的解析权交给CNAME指向的CDN专用DNS服务器。</li><li>CDN的DNS服务器将CDN的全局负载均衡设备IP地址返回用户。</li><li>用户向CDN的全局负载均衡设备发起内容URL访问请求。</li><li>CDN全局负载均衡设备根据用户IP地址，以及用户请求的内容URL，选择一台用户所属区域的区域负载均衡设备，告诉用户向这台设备发起请求。</li><li>区域负载均衡设备会为用户选择一台合适的缓存服务器提供服务，选择的依据包括：根据用户IP地址，判断哪一台服务器距用户最近；根据用户所请求的URL中携带的内容名称，判断哪一台服务器上有用户所需内容；查询各个服务器当前的负载情况，判断哪一台服务器尚有服务能力。基于以上这些条件的综合分析之后，区域负载均衡设备会向全局负载均衡设备返回一台缓存服务器的IP地址。</li><li>全局负载均衡设备把服务器的IP地址返回给用户。</li><li>用户向缓存服务器发起请求，缓存服务器响应用户请求，将用户所需内容传送到用户终端。如果这台缓存服务器上并没有用户想要的内容，而区域均衡设备依然将它分配给了用户，那么这台服务器就要向它的上一级缓存服务器请求内容，直至追溯到网站的源服务器将内容拉到本地。</li></ol><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-5793aec83fc645e002a1cd70ab7209a3_720w.jpg" alt="img"></p><p>使用A记录和CNAME进行域名解析的区别</p><p>A记录就是把一个域名解析到一个IP地址（Address，特制数字IP地址），而 CNAME记录就是把域名解析到另外一个域名。其功能是差不多，CNAME将几个主机名指向一个别名，其实跟指向IP地址是一样的，因为这个别名也要做一个A记录的。</p><h1 id="原型链" tabindex="-1"><a class="header-anchor" href="#原型链" aria-hidden="true">#</a> 原型链</h1><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/原型链.jpg" alt="image"> Foo和Object都是函数，函数都是由Function构造出来的，Function是函数的构造函数，但是不常用，函数独有prototype,指向其原型对象，任何对象都有_proto_属性，指向构造该对象的构造函数的原型。图中Foo.prototype和Function.prototype都是一个对象，他们的_proto_(隐式原型)指向Object.prototype</p><h1 id="flex" tabindex="-1"><a class="header-anchor" href="#flex" aria-hidden="true">#</a> flex</h1><p>flex:1 是指 flex:1 1 auto 1 1 auto分别指flex-grow:1 flex-shrink:1 flex-basis:1 flex-grow:分配给该项目剩余空间的比例 默认值为0，如果只有该项目是1，则全分给该项目 flex-shrink:该项目缩小的比例，默认值为1，项目宽度(高度)之和大于容器宽度，则缩小 flex-basis:给上面两个属性分配多余空间之前, 计算项目是否有多余空间, 默认值为 auto, 即项目本身的大小</p><p>子元素的原始宽度是由<code>flex-basis</code>来决定的，<code>flex-basis:auto</code>表示子元素原始宽度为子元素自身的宽度。</p><p><code>flex-grow</code> 表示如果容器还剩有宽度，那么剩余空间将会按照flex-grow的比例来分配</p><p>同理<code>flex-shrink</code> 表示如果所有项的原始宽度大于容器宽度，那么元素缩小比例也会按照<code>flex-shrink</code>来分配</p><p>flex:xxx如果去百分比或者长度(px)则表示flex-grow:1 flex-shrink:1</p><p>所有 flex 元素都会有下列行为：</p>`,416),x=e("li",null,[n("元素排列为一行 ("),e("code",null,"flex-direction"),n(" 属性的初始值是 "),e("code",null,"row"),n(")。")],-1),y=e("li",null,"元素从主轴的起始线开始。",-1),S=e("li",null,"元素不会在主维度方向拉伸，但是可以缩小。",-1),w=e("li",null,"元素被拉伸来填充交叉轴大小。",-1),T={href:"https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-basis",target:"_blank",rel:"noopener noreferrer"},C=e("code",null,"flex-basis",-1),P=e("code",null,"auto",-1),j={href:"https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-wrap",target:"_blank",rel:"noopener noreferrer"},_=e("code",null,"flex-wrap",-1),q=e("code",null,"nowrap",-1),M=i(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;div class=&quot;container&quot;&gt;
        &lt;div style=&quot;height: 100px&quot;&gt;&lt;/div&gt;
        &lt;div style=&quot;min-height: 10px;&quot;&gt;&lt;/div&gt;
    &lt;/div&gt;
    &lt;style&gt;
        .container{
            display: flex;
        }
        .container &gt; div{
            width: 100px;
        }
    &lt;/style&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二个元素高度？100px</p><p>因为交叉轴会被拉伸来填充交叉轴大小，前提是元素高度或者宽度没确定</p><p>order属性用来对元素排序</p><p>不设置默认是0</p><p>数字越小排在月前面</p><h1 id="bfc-块级格式上下文" tabindex="-1"><a class="header-anchor" href="#bfc-块级格式上下文" aria-hidden="true">#</a> BFC(块级格式上下文)</h1><p>只要元素满足下面任一条件即可触发 BFC 特性：</p><ul><li>body 根元素</li><li>浮动元素：float 除 none 以外的值</li><li>绝对定位元素：position (absolute、fixed)</li><li>display 为 inline-block、table-cells、flex</li><li>overflow 除了 visible 以外的值 (hidden、auto、scroll)</li></ul><h2 id="bfc特性" tabindex="-1"><a class="header-anchor" href="#bfc特性" aria-hidden="true">#</a> BFC特性</h2><p>1.内部的Box会在垂直方向上一个接一个的放置。 2.垂直方向上的距离由margin决定 3.bfc的区域不会与float的元素区域重叠。 4.计算bfc的高度时，浮动元素也参与计算 5.bfc就是页面上的一个独立容器，容器里面的子元素不会影响外面元素。</p><p><strong>解决外边距折叠</strong></p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>把两个盒子放在bfc容器中就可以解决外边距折叠的问题。</p><p><strong>清除浮动</strong></p><p><strong>不被浮动元素覆盖</strong></p><p>二栏布局，左边宽度固定，右边宽度自适应，把右边设置为bfc就可以实现</p><p>还可以防止字体环绕</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/948888-20171119222632796-1452266331.png" alt="img"></p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/948888-20171119222701452-741699368.png" alt=""></p><h1 id="清除浮动的几种方法" tabindex="-1"><a class="header-anchor" href="#清除浮动的几种方法" aria-hidden="true">#</a> 清除浮动的几种方法</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;div class=&quot;topDiv&quot;&gt;
    &lt;div class=&quot;floatDiv&quot;&gt;float left&lt;/div&gt;
    &lt;div class=&quot;textDiv&quot;&gt;...&lt;/div&gt;
&lt;/div&gt;
&lt;div class=&quot;bottomDiv&quot;&gt;...&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>添加clear样式</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.textDiv {
    color: blue;
    border: 2px solid blue;

    clear: left;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>告诉浏览器，其左边不允许有浮动元素存在</p><p><strong>添加一个清除浮动的块级元素</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;div class=&quot;topDiv&quot;&gt;
    &lt;div class=&quot;textDiv&quot;&gt;...&lt;/div&gt;
    &lt;div class=&quot;floatDiv&quot;&gt;float left&lt;/div&gt;
    &lt;div class=&quot;blankDiv&quot;&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;div class=&quot;bottomDiv&quot;&gt;...&lt;/div&gt;


.blankDiv {
    clear: both; // or left
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>:after</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;div class=&quot;topDiv clearfix&quot;&gt;
    &lt;div class=&quot;textDiv&quot;&gt;...&lt;/div&gt;
    &lt;div class=&quot;floatDiv&quot;&gt;float left&lt;/div&gt;
&lt;/div&gt;
&lt;div class=&quot;bottomDiv&quot;&gt;...&lt;/div&gt;

.clearfix:after {
    content: &#39;.&#39;;
    height: 0;
    display: block;
    clear: both;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和上面的方法差不多</p><p><strong>利用overflow</strong></p><p>其本质使用bfc来实现</p><h1 id="react" tabindex="-1"><a class="header-anchor" href="#react" aria-hidden="true">#</a> React</h1><h2 id="react中方法this指向问题" tabindex="-1"><a class="header-anchor" href="#react中方法this指向问题" aria-hidden="true">#</a> react中方法this指向问题</h2><p>在react中类式组件中的方法会放在该类的原型对象上，供实例使用 类中的方法默认开启局部严格模式，this指向undefined</p><h2 id="受控组件" tabindex="-1"><a class="header-anchor" href="#受控组件" aria-hidden="true">#</a> 受控组件</h2><p>在HTML表单元素中，它们通常自己维护一套<code>state</code>,并随着用户的输入改变UI，如果我们把react的state和表单元素建立依赖关系，再通过<code>onChange</code>和<code>setState</code>结合更新state属性，就能达到控制用户输入过程中表单发生的操作。</p><h1 id="事件循环机制" tabindex="-1"><a class="header-anchor" href="#事件循环机制" aria-hidden="true">#</a> 事件循环机制</h1><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/事件循环1.webp" alt="image"> 同步和异步任务分别进入不同的执行&quot;场所&quot;，同步的进入主线程，异步的进入Event Table并注册函数。</p><p>当指定的事情完成时，Event Table会将这个函数移入Event Queue。</p><p>主线程内的任务执行完毕为空，会去Event Queue读取对应的函数，进入主线程执行。</p><p>上述过程会不断重复，也就是常说的Event Loop(事件循环)。 <img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/事件循环2.webp" alt="image"> macro-task(宏任务)：包括整体代码script，setTimeout，setInterval，dom时间，requestAnimationFrame</p><p>micro-task(微任务)：Promise，process.nextTick（在下一次事件循环开始之前）</p><p>进入整体代码(宏任务)后，开始第一次循环。接着执行所有的微任务。然后再次从宏任务(一个)开始，找到其中一个任务队列执行完毕，再执行所有的微任务。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>console.log(&#39;1&#39;);

setTimeout(function() {
    console.log(&#39;2&#39;);
    process.nextTick(function() {
        console.log(&#39;3&#39;);
    })
    new Promise(function(resolve) {
        console.log(&#39;4&#39;);
        resolve();
    }).then(function() {
        console.log(&#39;5&#39;)
    })
})
process.nextTick(function() {
    console.log(&#39;6&#39;);
})
new Promise(function(resolve) {
    console.log(&#39;7&#39;);
    resolve();
}).then(function() {
    console.log(&#39;8&#39;)
})

setTimeout(function() {
    console.log(&#39;9&#39;);
    process.nextTick(function() {
        console.log(&#39;10&#39;);
    })
    new Promise(function(resolve) {
        console.log(&#39;11&#39;);
        resolve();
    }).then(function() {
        console.log(&#39;12&#39;)
    })
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终结果:1，7，6，8，2，4，3，5，9，11，10，12</p><h1 id="跨域" tabindex="-1"><a class="header-anchor" href="#跨域" aria-hidden="true">#</a> 跨域</h1><p>有一个小小的东西叫cookie大家应该知道，一般用来处理登录等场景，目的是让服务端知道谁发出的这次请求。如果你请求了接口进行登录，服务端验证通过后会在响应头加入Set-Cookie字段，然后下次再发请求的时候，浏览器会自动将cookie附加在HTTP请求的头字段Cookie中，服务端就能知道这个用户已经登录过了。知道这个之后，我们来看场景： 1.你准备去清空你的购物车，于是打开了买买买网站www.maimaimai.com，然后登录成功，一看，购物车东西这么少，不行，还得买多点。 2.你在看有什么东西买的过程中，你的好基友发给你一个链接www.nidongde.com，一脸yin笑地跟你说：“你懂的”，你毫不犹豫打开了。 3.你饶有兴致地浏览着www.nidongde.com，谁知这个网站暗地里做了些不可描述的事情！由于没有同源策略的限制，它向www.maimaimai.com发起了请求！聪明的你一定想到上面的话“服务端验证通过后会在响应头加入Set-Cookie字段，然后下次再发请求的时候，浏览器会自动将cookie附加在HTTP请求的头字段Cookie中”，这样一来，这个不法网站就相当于登录了你的账号，可以为所欲为了！如果这不是一个买买买账号，而是你的银行账号，那…… 1.jsonp 在HTML标签里，一些标签比如script、img这样的获取资源的标签是没有跨域限制的，利用这一点，我们可以这样干： 在发送请求的时候创建一个script标签，接着把在请求的回调函数中移除这个标签</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> const script = document.createElement(&#39;script&#39;)
    // 接口返回的数据获取
    window.jsonpCb = (res) =&gt; {
      document.body.removeChild(script)
      delete window.jsonpCb
      resolve(res)
    }
    script.src = \`\${url}?\${handleData(data)}&amp;cb=jsonpCb\`
    document.body.appendChild(script)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,49),N={href:"https://www.cnblogs.com/leegent/p/7499532.html",target:"_blank",rel:"noopener noreferrer"},H=i('<p>网页：当HTTP请求同时满足以下两种情况时，浏览器认为是简单跨请求</p><p>1)，请求的方法是get，head或者post，同时Content-Type是application/x-www-form-urlencoded, multipart/form-data 或 text/plain中的一个值，或者不设置也可以，一般默认就是application/x-www-form-urlencoded。</p><p>2)，请求中没有自定义的HTTP头部，如x-token。(应该是这几种头部 Accept，Accept-Language，Content-Language，Last-Event-ID，Content-Type）</p><p>浏览器：把客户端脚本所在的域填充到Origin header里，向其他域的服务器请求资源。</p><p>服务器：根据资源权限配置，在响应头中添加Access-Control-Allow-Origin Header，返回结果</p><p>浏览器：观察服务器是否有返回Access-Control-Allow-Origin Header以及Access-Control-Allow-Origin Header是否与origin相同,如果是，则接受这个内容。否则浏览器忽略此次响应。 二：带预检(Preflighted)的跨域请求，流程如下</p><p>网页：当HTTP请求出现以下两种情况时之一，浏览器认为是带预检(Preflighted)的跨域请求：</p><p>1），请求的方法不是 GET, HEAD或者POST三种，或者是这三种，但是Content-Type不是application/x-www-form-urlencoded, multipart/form-data或text/plain中的一种。</p><p>2），请求中有自定义HTTP头部。</p><p>浏览器：发现请求属于以上两种情况，向服务器发送一个OPTIONS预检请求，检测服务器端是否支持真实请求进行跨域资源访问，浏览器会在发送OPTIONS请求时会自动添加Origin Header 、Access-Control-Request-Method Header(将实际请求的方法告诉服务器)和Access-Control-Request-Headers Header。</p><p>服务器：响应OPTIONS请求，会在responseHeader里添加Access-Control-Allow-Methods head。这其中的method的值是服务器给的默认值，可能不同的服务器添加的值不一样。服务器还会添加Access-Control-Allow-Origin Header和Access-Control-Allow-Headers Header。这些取决于服务器对OPTIONS请求具体如何做出响应。如果服务器对OPTIONS响应不合你的要求，你可以手动在服务器配置OPTIONS响应，以应对带预检的跨域请求。在配置服务器OPTIONS的响应时，可以添加Access-Control-Max-Age head告诉浏览器在一定时间内无需再次发送预检请求，但是如果浏览器禁用缓存则无效。</p><p>浏览器：接到OPTIONS的响应，先判断状态码是不是200，比较真实请求的method是否属于返回的Access-Control-Allow-Methods head的值之一，还有origin, head也会进行比较是否匹配。如果通过，浏览器就继续向服务器发送真实请求。 否则就会报预检错误，如下几种：</p><p>请求来源不被options响应允许：Failed to load...Response to preflight request doesn&#39;t pass access control check: No &#39;Access-Control-Allow-Origin&#39; header is present on the requested resource. Origin http://127.0.0.1:8080 is therefore not allowed access.</p><p>请求方法不被options响应允许：Method PUT is not allowed by Access-Control-Allow-Methods in preflight response.</p><p>请求中有自定义header不被options响应允许：Failed to load... Request header field myHeader is not allowed by Access-Control-Allow-Headers in preflight response.</p><p>服务器：响应真实请求，在响应头中放入Access-Control-Allow-Origin Header、Access-Control-Allow-Methods和Access-Control-Allow-Headers Header，分别表示允许跨域资源请求的域、请求方法和请求头，并返回数据。(如果服务器对真实请求的响应另外设置有Access-Control-Allow-Methods，它的值不会生效，个人理解是因为刚刚在服务器响应OPTIONS响应时，就已经验证过真实请求的method是属于Access-Control-Allow-Methods head的值之一）。也可以在响应真实请求时添加Access-Control-Max-Age head。</p><p>浏览器：接受服务器对真实请求的返回结果，返回给网页</p><p>网页：收到返回结果或者浏览器的错误提示。</p><p>个人理解:简单请求的话请求的方法和请求头都是已经满足要求了的，所以服务器只需要对请求域进行设置。带预检的跨域请求由于请求方法和请求头都没有被限制过因此需要先发送options请求告诉服务器我们实际发送请求的时候会使用到什么方法，和header，接着服务器就会在响应头中告诉我们他们允许 什么方法 什么域 什么头。 <img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/cors1.webp" alt="image"><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/cors2.webp" alt="image"></p><h2 id="nginx反向代理" tabindex="-1"><a class="header-anchor" href="#nginx反向代理" aria-hidden="true">#</a> nginx反向代理</h2><h1 id="正向代理和反向代理" tabindex="-1"><a class="header-anchor" href="#正向代理和反向代理" aria-hidden="true">#</a> 正向代理和反向代理</h1>',21),A={href:"https://cloud.tencent.com/developer/article/1418457",target:"_blank",rel:"noopener noreferrer"},O=i(`<h1 id="class" tabindex="-1"><a class="header-anchor" href="#class" aria-hidden="true">#</a> Class</h1><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/class1.png" alt="image"></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>class Animal {

  constructor(name) {
    this.speed = 0;
    this.name = name;
  }

  run(speed) {
    this.speed += speed;
    alert(\`\${this.name} runs with speed \${this.speed}.\`);
  }

  stop() {
    this.speed = 0;
    alert(\`\${this.name} stopped.\`);
  }

}


// Inherit from Animal
class Rabbit extends Animal {
 constructor(name, earLength) {

    super(name);

    this.earLength = earLength;
  }//重写构造函数
  hide() {
    alert(\`\${this.name} hides!\`);
  }
  stop(){
  	super.stop()//如果想调用之前的方法的话
  	this.hide()
  }//重写方法
}


let rabbit = new Rabbit(&quot;White Rabbit&quot;);

rabbit.run(5); // White Rabbit runs with speed 5.
rabbit.hide(); // White Rabbit hides!
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="继承的几种方法" tabindex="-1"><a class="header-anchor" href="#继承的几种方法" aria-hidden="true">#</a> 继承的几种方法</h2><p><strong>1.原型链继承</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>  //父类型
       function Person(name, age) {
           this.name = name,
           this.age = age,
           this.play = [1, 2, 3]
           this.setName = function () { }
       }
       Person.prototype.setAge = function () { }
       //子类型
       function Student(price) {
           this.price = price
           this.setScore = function () { }
       }
       Student.prototype = new Person() // 子类型的原型为父类型的一个实例对象
       var s1 = new Student(15000)
       var s2 = new Student(14000)
       console.log(s1,s2)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/3174701-5d19207f790f301f.png" alt=""></p><p>将子类的原型指向父类的实例，子类的实例就可以通过<code>__proto__</code>访问Student.prototype也就是父类的实例，再通过一次<code>__protp__</code>就可以得到父类原型上的方法。</p><p>不过由于Student不同实例的原型是同一个Preson实例，因此如果修改实例的引用数据类型将会影响到其他子类实例。</p><div class="language-sqf line-numbers-mode" data-ext="sqf"><pre class="language-sqf"><code>		s1<span class="token punctuation">.</span>play<span class="token punctuation">.</span>push<span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span>
       	console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>s1<span class="token punctuation">.</span>play<span class="token punctuation">,</span> s2<span class="token punctuation">.</span>play<span class="token punctuation">)</span>
       	console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>s1<span class="token punctuation">.</span>__proto__ <span class="token operator">==</span><span class="token operator">=</span> s2<span class="token punctuation">.</span>__proto__<span class="token punctuation">)</span><span class="token comment">//true</span>
       	console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>s1<span class="token punctuation">.</span>__proto__<span class="token punctuation">.</span>__proto__ <span class="token operator">==</span><span class="token operator">=</span> s2<span class="token punctuation">.</span>__proto__<span class="token punctuation">.</span>__proto__<span class="token punctuation">)</span><span class="token comment">//true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果修改的不是引用数据类型，将会直接在子类上添加一个新的属性，并不会去原型链上查找这个属性。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>s1.name=&#39;2&#39;
console.log(s1,s2)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20220223173105008.png" alt="image-20220223173105008"></p><p><strong>特点</strong>：</p><ul><li>父类新增原型方法/原型属性，子类都能访问到</li><li>简单，易于实现</li></ul><p><strong>缺点</strong>：</p><ul><li>无法实现多继承</li><li>来自原型对象的所有属性被所有实例共享</li><li>创建子类实例时，无法向父类构造函数传参</li><li>要想为子类新增属性和方法，必须要在<code>Student.prototype = new Person()</code> 之后执行，不能放到构造器中</li></ul><p><strong>2.借用构造函数继承</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function Woman(name){
 //继承了People
  People.call(this); //People.call(this，&#39;wangxiaoxia&#39;); 
  this.name = name || &#39;renbo&#39;
}
let womanObj = new Woman();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>能这么做的原理又是另外一道经典面试题：<code>new操作符都做了什么</code>，很简单，就<code>4</code>点：</p><p>1.创建一个空对象</p><p>2.把该对象的<code>__proto__</code>属性指向<code>Sub.prototype</code></p><p>3.让构造函数里的<code>this</code>指向新对象，然后执行构造函数，</p><p>4.返回该对象</p><p>所以<code>People.call(this)</code>的<code>this</code>指的就是这个新创建的对象，那么就会把父类的实例属性/方法都添加到该对象上。</p><p><strong>特点</strong>：</p><ul><li>解决了原型链继承中子类实例共享父类引用属性的问题</li><li>创建子类实例时，可以向父类传递参数</li><li>可以实现多继承(call多个父类对象)</li></ul><p><strong>缺点</strong>：</p><ul><li>实例并不是父类的实例，只是子类的 实例</li><li>只能继承父类的实例属性和方法，不能继承原型属性和方法</li><li>无法实现函数复用，每个子类都有父类实例函数的副本，影响性能</li></ul><p><strong>3.原型链+借用构造函数的组合继承</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>		function Person(name, age) {
            this.name = name,
            this.age = age,
            this.setAge = function () { }
        }
        Person.prototype.setAge = function () {
            console.log(&quot;111&quot;)
        }
        function Student(name, age, price) {
            Person.call(this,name,age)
            this.price = price
            this.setScore = function () { }
        }
        Student.prototype = new Person()
        Student.prototype.constructor = Student
        //组合继承也是需要修复构造函数指向的，否则s1.constructor会指向Person
        Student.prototype.sayHello = function () { }
        var s1 = new Student(&#39;Tom&#39;, 20, 15000)
        var s2 = new Student(&#39;Jack&#39;, 22, 14000)
        console.log(s1)
        console.log(s1.constructor) //Student
        console.log(p1.constructor) //Person
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>优点</strong>：</p><ul><li>可以继承实例属性/方法，也可以继承原型属性/方法</li><li>不存在引用属性共享问题</li><li>可传参</li><li>函数可复用</li></ul><p><strong>缺点</strong>：</p><ul><li>调用了两次父类构造函数，生成了两份实例</li></ul><p><strong>4.组合继承优化</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>       <span class="token keyword">function</span> <span class="token function">Person</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">,</span>
                <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">,</span>
                <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function-variable function">setAge</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">setAge</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;111&quot;</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">function</span> <span class="token function">Student</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age<span class="token punctuation">,</span> price</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">Person</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> name<span class="token punctuation">,</span> age<span class="token punctuation">)</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>price <span class="token operator">=</span> price
            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function-variable function">setScore</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">Student</span><span class="token punctuation">.</span>prototype <span class="token operator">=</span> <span class="token class-name">Person</span><span class="token punctuation">.</span>prototype
		<span class="token class-name">Student</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>constructor <span class="token operator">=</span> Student<span class="token comment">//这里也需要重新指挥Student</span>
        <span class="token class-name">Student</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">sayHello</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>
        <span class="token keyword">var</span> s1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Student</span><span class="token punctuation">(</span><span class="token string">&#39;Tom&#39;</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">,</span> <span class="token number">15000</span><span class="token punctuation">)</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>s1<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不知道实例是子类还是父类实例化</p><div class="language-arcade line-numbers-mode" data-ext="arcade"><pre class="language-arcade"><code>console.log(s1 instanceof Student, s1 instanceof Person)//true true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>优点</strong>：</p><ul><li>不会初始化两次实例方法/属性，避免的组合继承的缺点</li></ul><p><strong>缺点</strong>：</p><ul><li>没办法辨别是实例是子类还是父类创造的，子类和父类的构造函数指向是同一个。</li></ul><p><strong>原型式继承</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function object( o ){
   var G = function(){};
   G.prototype = o;
   return new G();
  }
  var obj = {
   skills : [ &#39;php&#39;, &#39;javascript&#39; ]
  };
  var obj2 = object( obj );
  obj2.skills.push( &#39;python&#39; );
  var obj3 = object( obj );
  console.log( obj3.skills ); //php,javascript,python
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>寄生继承</strong>（在原型式继承的基础上加了一层封装）</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> var person={
    name:&#39;ccdida&#39;,
    friends:[&#39;shelly&#39;,&#39;Bob&#39;]
  }
  function createAnother(original){
    //clone.__proto__===original
    var clone=Object.create(original)
    //增强对象，添加属于自己的方法
    clone.sayHi=function(){
      console.log(&#39;hi&#39;)
    }

    return clone

  }
  var person1=createAnother(person)
  var person2=createAnother(person)
  person1.friends.push(&#39;shmily&#39;)
  console.log(person2.friends)//[&quot;shelly&quot;, &quot;Bob&quot;,&quot;shmily&quot;]
  person1.sayHi() //hi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>5.组合继承优化2(组合寄生继承)</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">Person</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">,</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age
        <span class="token punctuation">}</span>
        <span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">setAge</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;111&quot;</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">function</span> <span class="token function">Student</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age<span class="token punctuation">,</span> price</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">Person</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> name<span class="token punctuation">,</span> age<span class="token punctuation">)</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>price <span class="token operator">=</span> price
            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function-variable function">setScore</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">Student</span><span class="token punctuation">.</span>prototype <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token class-name">Person</span><span class="token punctuation">.</span>prototype<span class="token punctuation">)</span><span class="token comment">//核心代码，Object.create()会将返回的对象的__proto__指向函数的第一个参数</span>
        <span class="token class-name">Student</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>constructor <span class="token operator">=</span> Student<span class="token comment">//核心代码</span>
        <span class="token keyword">var</span> s1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Student</span><span class="token punctuation">(</span><span class="token string">&#39;Tom&#39;</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">,</span> <span class="token number">15000</span><span class="token punctuation">)</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>s1 <span class="token keyword">instanceof</span> <span class="token class-name">Student</span><span class="token punctuation">,</span> s1 <span class="token keyword">instanceof</span> <span class="token class-name">Person</span><span class="token punctuation">)</span> <span class="token comment">// true true</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>s1<span class="token punctuation">.</span>constructor<span class="token punctuation">)</span> <span class="token comment">//Student</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>s1<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>6.ES6中class的继承</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>
            <span class="token comment">//调用类的构造方法</span>
            <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name
                <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age
            <span class="token punctuation">}</span>
            <span class="token comment">//定义一般的方法</span>
            <span class="token function">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;调用父类的方法&quot;</span><span class="token punctuation">)</span>
                console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>name<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>age<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">let</span> p1 <span class="token operator">=</span> <span class="token keyword">new</span>  <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">&#39;kobe&#39;</span><span class="token punctuation">,</span> <span class="token number">39</span><span class="token punctuation">)</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>p1<span class="token punctuation">)</span>
        <span class="token comment">//定义一个子类</span>
        <span class="token keyword">class</span> <span class="token class-name">Student</span> <span class="token keyword">extends</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>
            <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age<span class="token punctuation">,</span> salary</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">super</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token comment">//通过super调用父类的构造方法</span>
                <span class="token keyword">this</span><span class="token punctuation">.</span>salary <span class="token operator">=</span> salary
            <span class="token punctuation">}</span>
            <span class="token function">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">//在子类自身定义方法</span>
                console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;调用子类的方法&quot;</span><span class="token punctuation">)</span>
                console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>name<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>age<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>salary<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">let</span> s1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Student</span><span class="token punctuation">(</span><span class="token string">&#39;wade&#39;</span><span class="token punctuation">,</span> <span class="token number">38</span><span class="token punctuation">,</span> <span class="token number">1000000000</span><span class="token punctuation">)</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>s1<span class="token punctuation">)</span>
        s1<span class="token punctuation">.</span><span class="token function">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="es5和es6继承的区别" tabindex="-1"><a class="header-anchor" href="#es5和es6继承的区别" aria-hidden="true">#</a> ES5和ES6继承的区别</h2><p>**区别1：**ES6里的构造函数就是一个普通的函数，可以使用new调用，也可以直接调用，而ES6的class不能当作普通函数调用，必须使用new操作符调用。</p><p><strong>区别2：</strong><code>ES5</code>的原型方法和静态方法默认是可枚举的，而class的默认不可枚举，如果想要获取不可枚举的属性可以使用<code>Object.getOwnPropertyNames</code>方法</p><p>**区别3：**子类可以直接通过<code>__proto__</code>找到父类，而ES5是指向<code>Function.prototype</code>：</p><p>ES6：<code>Sub.__proto__ === Sup</code></p><p>ES5：<code>Sub.__proto__ === Function.prototype</code></p><p>**区别4：**ES5的继承，实质是先创造子类的实例对象<code>this</code>，然后再执行父类的构造函数给它添加实例方法和属性(不执行也无所谓）。而ES6的继承机制完全不同，实质是先创造父类的实例对象<code>this</code>（当然它的<code>__proto__</code>指向的是子类的<code>prototype</code>），然后再用子类的构造函数修改<code>this</code>。</p><p>这就是为啥使用<code>class</code>继承在<code>constructor</code>函数里必须调用<code>super</code>，因为子类压根没有自己的<code>this</code>，另外不能在<code>super</code>执行前访问<code>this</code>的原因也很明显了，因为调用了<code>super</code>后，<code>this</code>才有值。</p><p>**区别5：**class不存在变量提升，所以父类必须在子类之前定义</p><h1 id="vue底层实现原理" tabindex="-1"><a class="header-anchor" href="#vue底层实现原理" aria-hidden="true">#</a> Vue底层实现原理</h1><h2 id="object-defineproperty" tabindex="-1"><a class="header-anchor" href="#object-defineproperty" aria-hidden="true">#</a> Object.defineProperty</h2><p>Object.defineProperty()的作用就是直接在一个对象上定义一个新属性，或者修改一个已经存在的属性</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code>Object.<span class="token function">defineProperty</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> prop<span class="token punctuation">,</span> desc<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>obj：哪个对象，</p><p>prop：哪个属性，</p><p>desc：属性描述符</p><p>属性描述符有两种</p><p>第一种：数据描述符</p><div class="language-csharp line-numbers-mode" data-ext="cs"><pre class="language-csharp"><code><span class="token keyword">let</span> Person <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>Person<span class="token punctuation">,</span> &#39;name&#39;<span class="token punctuation">,</span> <span class="token punctuation">{</span>
   <span class="token keyword">value</span><span class="token punctuation">:</span> &#39;jack&#39;<span class="token punctuation">,</span>
   <span class="token named-parameter punctuation">writable</span><span class="token punctuation">:</span> <span class="token boolean">true</span> <span class="token comment">// 是否可以改变</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://upload-images.jianshu.io/upload_images/5016475-9cd41a36735b667d.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp" alt="img"></p><p>第二种：存取描述符</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">let</span> Person <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token keyword">let</span> temp <span class="token operator">=</span> <span class="token keyword">null</span>
Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>Person<span class="token punctuation">,</span> <span class="token string">&#39;name&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token function-variable function">get</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> temp
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function-variable function">set</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    temp <span class="token operator">=</span> val
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>get:给属性提供getter方法</p><p>set：给属性提供setter方法</p><h2 id="数据劫持" tabindex="-1"><a class="header-anchor" href="#数据劫持" aria-hidden="true">#</a> 数据劫持</h2><p>vue.js采用<strong>数据劫持结合发布者-订阅者模式</strong>的方式，通过<strong>Object.defineProperty()来劫持各个属性的setter和getter，在数据变动时发布消息给订阅者，触发相应的监听回调</strong>。</p><h1 id="严格模式" tabindex="-1"><a class="header-anchor" href="#严格模式" aria-hidden="true">#</a> 严格模式</h1><p>严格模式的变化通常分为这几类：将问题直接转化为错误（如语法错误或运行时错误）, 简化了如何为给定名称的特定变量计算，简化了 eval 以及 arguments, 将写&quot;安全“JavaScript 的步骤变得更简单，以及改变了预测未来 ECMAScript 行为的方式。</p><h2 id="_1-1将过失转化为异常" tabindex="-1"><a class="header-anchor" href="#_1-1将过失转化为异常" aria-hidden="true">#</a> 1.1将过失转化为异常</h2><ul><li>严格模式下无法再意外创建全局变量。</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&quot;use strict&quot;;
// ReferenceError
mistypedVaraible = 17;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>严格模式会使引起静默失败的赋值操作抛出异常(给不可写属性赋值，给只读属性赋值，给不可拓展对象的新属性赋值)</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>var obj1 = {};
Object.defineProperty(obj1, &quot;x&quot;, { value: 42, writable: false });
obj1.x = 9; // 抛出TypeError错误
// 给只读属性赋值
var obj2 = {
  get x() {
    return 17;
  },
};
obj2.x = 5; 
// 给不可扩展对象的新属性赋值
var fixed = {};
Object.preventExtensions(fixed);
fixed.newProp = &quot;ohai&quot;; // 抛出TypeError错误
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>在严格模式下, 试图删除不可删除的属性时会抛出异常</li><li>严格模式要求函数的参数名唯一（严格模式要求函数的参数名唯一）</li><li>严格模式禁止八进制数字语法，在 ECMAScript 6 中支持为一个数字加&quot;0o&quot;的前缀来表示八进制数.</li><li>ECMAScript 6 中的严格模式禁止设置 primitive 值的属性（false,数字，字符串...）</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> &quot;use strict&quot;;

  false.true = &quot;&quot;; //TypeError
  (14).sailing = &quot;home&quot;; //TypeError
  &quot;with&quot;.you = &quot;far away&quot;; //TypeError
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1-2简化变量的使用" tabindex="-1"><a class="header-anchor" href="#_1-2简化变量的使用" aria-hidden="true">#</a> 1.2简化变量的使用</h2><ul><li><p>严格模式禁用 with</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// with的用处,用来延长作用域链，但是貌似没什么实质性的用处
var people={
	name:&#39;lzc&#39;
}
function yanchang(){
	with(people){
		console.log(name)
	}
}
yanchang()//&#39;lzc&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>严格模式下 eval 不再为上层范围引入新变量</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&quot;use strict&quot;
var x=1
eval(&quot;var x =42&quot;)//eval() 函数会将传入的字符串当做 JavaScript 代码进行执行。
console.log(x);//1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>var x=1
eval(&quot;var x =42&quot;)
console.log(x);//42
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>严格模式禁止删除声明变量</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&quot;use strict&quot;;

var x;
delete x; // !!! 语法错误
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1-3让eval和arguments变得简单" tabindex="-1"><a class="header-anchor" href="#_1-3让eval和arguments变得简单" aria-hidden="true">#</a> 1.3让eval和arguments变得简单</h2><ul><li>严格模式下，参数的值不会随 arguments 对象的值的改变而变化。</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&#39;use strict&#39;
function a(b){
    b=1
    console.log(b,arguments[0]);
}
a(2)// 1 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function a(b){
    b=1
    console.log(b,arguments[0]);
}
a(2)// 1 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>不再支持 arguments.callee</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&#39;use strict&#39;
var f = function () {
    return arguments.callee;//它可以用于引用该函数的函数体内当前正在执行的函数
  };
  console.log(f()); // 抛出类型错误 ,正常情况返回f
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li></ul><h2 id="_1-4-安全的javascript" tabindex="-1"><a class="header-anchor" href="#_1-4-安全的javascript" aria-hidden="true">#</a> 1.4 安全的javascript</h2><ul><li><p>在严格模式下通过 this 传递给一个函数的值不会被强制转换为一个对象。</p></li><li><p>在严格模式中再也不能通过广泛实现的 ECMAScript 扩展“游走于”JavaScript 的栈中。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function restricted() {
  &quot;use strict&quot;;
  restricted.caller; // 抛出类型错误
  restricted.arguments; // 抛出类型错误
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>严格模式下的 arguments 不会再提供访问与调用这个函数相关的变量的途径。</p></li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&quot;use strict&quot;;
function fun(a, b) {
  &quot;use strict&quot;;
  var v = 12;
  return arguments.caller; // 抛出类型错误
}
fun(1, 2); // 不会暴露v（或者a，或者b）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1-5-为未来的-ecmascript-版本铺平道路" tabindex="-1"><a class="header-anchor" href="#_1-5-为未来的-ecmascript-版本铺平道路" aria-hidden="true">#</a> 1.5 为未来的 ECMAScript 版本铺平道路</h2><ul><li><p>在严格模式中一部分字符变成了保留的关键字。</p></li><li><p>严格模式禁止了不在脚本或者函数层面上的函数声明。</p></li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&quot;use strict&quot;;
if (true) {
  function f() {} // 语法错误
  f();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="网络安全" tabindex="-1"><a class="header-anchor" href="#网络安全" aria-hidden="true">#</a> 网络安全</h1><h2 id="csp" tabindex="-1"><a class="header-anchor" href="#csp" aria-hidden="true">#</a> CSP</h2><p>CSP 的实质就是白名单制度，开发者明确告诉客户端，哪些外部资源可以加载和执行，等同于提供白名单。它的实现和执行全部由浏览器完成，开发者只需提供配置。</p><p>CSP 的主要目标是减少和报告 XSS 攻击 ，XSS 攻击利用了浏览器对于从服务器所获取的内容的信任。恶意脚本在受害者的浏览器中得以运行，因为浏览器信任其内容来源，即使有的时候这些脚本并非来自于它本该来的地方。</p><p>除限制可以加载内容的域，服务器还可指明哪种协议允许使用；比如 (从理想化的安全角度来说)，服务器可指定所有内容必须通过HTTPS加载。</p><p>为使CSP可用, 你需要配置你的网络服务器返回 Content-Security-Policy HTTP头部</p><p>除此之外, <meta>元素也可以被用来配置该策略, 例如</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;meta http-equiv=&quot;Content-Security-Policy&quot; content=&quot;default-src &#39;self&#39;; img-src https://*; child-src &#39;none&#39;;&quot;&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p>只允许加载本站资源</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Content-Security-Policy:default-src &#39;self&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>只允许加载 HTTPS 协议图片</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Content-Security-Policy: img-src https://*
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>允许加载任何来源框架</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Content-Security-Policy: child-src &#39;none&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ul><h1 id="css" tabindex="-1"><a class="header-anchor" href="#css" aria-hidden="true">#</a> CSS</h1><h2 id="标准盒模型和ie盒模型的区别" tabindex="-1"><a class="header-anchor" href="#标准盒模型和ie盒模型的区别" aria-hidden="true">#</a> 标准盒模型和ie盒模型的区别</h2><p>标准盒模型的的高宽就是内容的高宽，ie盒模型高度和宽度是内容+padding+border的总和</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>box-sizing:content-box;//标准盒模型
box-sizing:border-box;// ie盒模型
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="行内元素的margin和padding" tabindex="-1"><a class="header-anchor" href="#行内元素的margin和padding" aria-hidden="true">#</a> 行内元素的margin和padding</h2><p>水平方向：水平方向上，都有效；</p><p>垂直方向：垂直方向上，都无效；（padding-top 和 padding-bottom 会显 示出效果，但是高度不会撑开，不会对周围元素有影响）</p><p><img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/19/167c55be3a1eecdb~tplv-t2oaga2asx-watermark.awebp" alt="image"></p><h2 id="ele-first-child的误解" tabindex="-1"><a class="header-anchor" href="#ele-first-child的误解" aria-hidden="true">#</a> Ele:first-child的误解</h2><p>很多人认为:first-child是Ele元素的第一个子元素。或者是认为选中Ele元素的父元素的第一个Ele元素。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;!--误解一--&gt;
&lt;style&gt;
div:first-child{color: red;}
&lt;/style&gt;

&lt;div class=&quot;demo&quot;&gt;
&lt;a&gt;一个链接&lt;/a&gt;
&lt;a&gt;一个链接&lt;/a&gt;
&lt;a&gt;一个链接&lt;/a&gt;
&lt;a&gt;一个链接&lt;/a&gt;
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;!--误解二--&gt;
&lt;style&gt;
div a:first-child{color: red;}
&lt;/style&gt;

&lt;div class=&quot;demo&quot;&gt;
&lt;p&gt;一个段落&lt;/p&gt;
&lt;a&gt;一个链接&lt;/a&gt;
&lt;a&gt;一个链接&lt;/a&gt;
&lt;a&gt;一个链接&lt;/a&gt;
&lt;a&gt;一个链接&lt;/a&gt;
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>正确的理解应该是：<strong>只要Ele元素是它的父级的第一个子元素，就选中</strong>。</p><h2 id="单行多行文本省略" tabindex="-1"><a class="header-anchor" href="#单行多行文本省略" aria-hidden="true">#</a> 单行多行文本省略</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.line{
      display: inline-block;
      width: 50px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  //多行
    .multi-line {
      display: -webkit-box;
      width: 50px;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>-webkit-box-orient 和-webkit-line-clamp是webkit是chrome、safari私有属性，webkit是用来浏览器绘制网页的排版引擎，因此需要display:-webkit-box;</p><h2 id="css3新特性" tabindex="-1"><a class="header-anchor" href="#css3新特性" aria-hidden="true">#</a> CSS3新特性</h2><ul><li>border-radius</li><li>box-shadow</li><li>border-image</li><li>background-clip、background-origin、background-size和background-break</li><li>word-wrap</li><li>text-overflow</li><li>text-decoration</li><li>rgba、hala</li><li>transition</li><li>animation</li><li>linear-gradient、linear-gradient</li><li>flex、grid</li></ul><h2 id="grid" tabindex="-1"><a class="header-anchor" href="#grid" aria-hidden="true">#</a> grid</h2><p><code>grid-template-columns</code> 属性设置列宽，<code>grid-template-rows</code> 属性设置行高</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.wrapper {
  display: grid;
  /*  声明了三列，宽度分别为 200px 100px 200px */
  grid-template-columns: 200px 100px 200px;
  grid-gap: 5px;
  /*  声明了两行，行高分别为 50px 50px  */
  grid-template-rows: 50px 50px;//也可以用repeat(2,50px)
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>autofill</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.wrapper-2 {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);//不管有几个，只要能放得下就放着元素
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>fr</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.wrapper-3 {
  display: grid;
  grid-template-columns: 200px 1fr 2fr;//网格容器剩余可用空间的一等份
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>。。。</p><h2 id="伪类伪元素" tabindex="-1"><a class="header-anchor" href="#伪类伪元素" aria-hidden="true">#</a> 伪类伪元素</h2><p>1、伪类是类，所以跟css选择器有关，不存在与dom中 2、CSS伪类是用来添加一些选择器的特殊效果的 3、伪类前面之后一个冒号**:first-child**</p><p>伪元素是创造文档树之外的对象。伪元素也是元素，只不过不存在与dom对象中，但是浏览器审查元素的时候能看得到的，比如::before ::after</p><h2 id="position-sticky" tabindex="-1"><a class="header-anchor" href="#position-sticky" aria-hidden="true">#</a> position:sticky</h2><p>sticky属性是relative和fixed的结合，你可以设置top，bottom，left，right实现粘滞的效果，sticky的任意父元素必须是overflow:visible,如果是overflow:hidden，那么该父元素无法滚动。sticky会相对上一个定位过的父元素进行定位</p><h2 id="transition-animation-transform" tabindex="-1"><a class="header-anchor" href="#transition-animation-transform" aria-hidden="true">#</a> transition animation transform</h2><h3 id="transition" tabindex="-1"><a class="header-anchor" href="#transition" aria-hidden="true">#</a> transition</h3><p>transition指的是过渡，从一个状态到另一个状态的过渡，如果不设置transition就会像平常一样状态时瞬间变化的，transition就是做了一个状态到另一个状态的过渡，可以指定过渡的属性(transition-property)，过渡的时间(transition-duration)，延迟过渡的时间(transition-delay),过渡动画类型(transition-timing-function:linear(线性过渡),ease-in(由慢到快),ease-out(由快到慢),ease-in-out(由慢到快再到慢))</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> transition: background-color 0.3s ease;//可以和在一起写
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="transform" tabindex="-1"><a class="header-anchor" href="#transform" aria-hidden="true">#</a> transform</h3><p><code>transform</code>就是指的这个东西，拉伸(scale)，倾斜(skew)，旋转(rotate)，偏移 (translate)</p><p>还可以实现3d变化</p><h3 id="animation" tabindex="-1"><a class="header-anchor" href="#animation" aria-hidden="true">#</a> animation</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>@keyframes pulse {
  0%, 100% {
    background-color: yellow;
  }
  50% {
    background-color: red;
  }
}// 可以通过@keyframes来定义动画，0%表示动画的初始状态，100%表示动画的最终状态，可以在中间添加关键帧比如50%
// 某个元素想要用这个动画的话就可以添加animation-name:pulse
// animation是以下属性的简写方式
// animation-name: 指定一个 @keyframes 的名称，动画将要使用这个@keyframes定义。
// animation-duration: 整个动画需要的时长。
// animation-timing-function: 动画进行中的时速控制，比如 ease 或 linear.
// animation-delay: 动画延迟时间。
// animation-direction: 动画重复执行时运动的方向。normal每次动画结束动画重置到起点重新开始，alternate动画交替进行，reverse反向进行，alternate-reverse动画交替进行但第一次时反向的
// animation-iteration-count: 动画循环执行的次数。
// animation-fill-mode: 设置动画执行完成后(是否保留最后一帧状态)forwards/开始执行前的状态(是否应用第一帧状态)backwords，比如，你可以让动画执行完成后停留在最后一幕，或恢复到初始状态。
// animation-play-state: 暂停/启动动画。
// 因此我们如果想给某个元素添加动画
.element{
	animation: 
        pulse
        1.5s
        ease-out
        0
        alternate
        infinite
        none
        running;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="前端性能优化" tabindex="-1"><a class="header-anchor" href="#前端性能优化" aria-hidden="true">#</a> 前端性能优化</h1><ul><li>减少http请求</li><li>静态资源使用cdn</li><li>css文件放在头部，js文件放在底部</li><li>使用iconfont代替图片图标</li><li>善用缓存</li><li>用插件压缩文件(webpack)</li><li>图片懒加载(图片出现在可视区域再加载)</li><li>降低图片质量(使用插件压缩)</li><li>尽量使用css3效果代替图片</li><li>使用webp格式的图片</li><li>通过webpack按需加载代码</li><li>减少回流重绘</li><li>使用事件委托</li><li>使用flex布局而不是较早的布局模型</li></ul><h1 id="js" tabindex="-1"><a class="header-anchor" href="#js" aria-hidden="true">#</a> JS</h1><h2 id="async-await-如何通过同步的方式实现异步" tabindex="-1"><a class="header-anchor" href="#async-await-如何通过同步的方式实现异步" aria-hidden="true">#</a> Async/await 如何通过同步的方式实现异步</h2><p>Async/Await 是一个自执行的 generate 函数。利用 generate 函数的特性把异步的 代码写成“同步”的形式。</p><h3 id="generator" tabindex="-1"><a class="header-anchor" href="#generator" aria-hidden="true">#</a> Generator</h3><p>Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function* gen(x){
  var y = yield x + 2;
  return y;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Generator函数不同于其他函数是可以暂停执行的，所以函数名之前要加星号，以示区别。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>var g = gen(1);
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面代码中，调用 Generator 函数，会返回一个内部指针（即遍历器）g 。这是 Generator 函数不同于普通函数的另一个地方，即执行它不会返回结果，返回的是指针对象。调用指针 g 的 next 方法，会移动内部指针（即执行异步任务的第一段），指向第一个遇到的 yield 语句，上例是执行到 x + 2 为止。</p><p>换言之，next 方法的作用是分阶段执行 Generator 函数。每次调用 next 方法，会返回一个对象，表示当前阶段的信息（ value 属性和 done 属性）。value 属性是 yield 语句后面表达式的值，表示当前阶段的值；done 属性是一个布尔值，表示 Generator 函数是否执行完毕，即是否还有下一个阶段。</p><h2 id="隐式类型转换" tabindex="-1"><a class="header-anchor" href="#隐式类型转换" aria-hidden="true">#</a> 隐式类型转换</h2><h3 id="数学运算符中的类型转换" tabindex="-1"><a class="header-anchor" href="#数学运算符中的类型转换" aria-hidden="true">#</a> 数学运算符中的类型转换</h3><p><strong>1.减乘除</strong></p><p>对非Number类型运用<code>- * /</code>时，会先将非Number类型转换为Number类型</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token number">1</span> <span class="token operator">-</span> <span class="token boolean">true</span> <span class="token comment">// 0， 首先把 true 转换为数字 1， 然后执行 1 - 1</span>
<span class="token number">1</span> <span class="token operator">-</span> <span class="token keyword">null</span> <span class="token comment">// 1,  首先把 null 转换为数字 0， 然后执行 1 - 0</span>
<span class="token number">1</span> <span class="token operator">*</span> <span class="token keyword">undefined</span> <span class="token comment">//  NaN, undefined 转换为数字是 NaN</span>
<span class="token number">2</span> <span class="token operator">*</span> <span class="token punctuation">[</span><span class="token string">&#39;5&#39;</span><span class="token punctuation">]</span> <span class="token comment">//  10， [&#39;5&#39;]首先会变成 &#39;5&#39;, 然后再变成数字 5</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2.加法</strong></p><p>由于<code>+</code>可以用来拼接字符串，因此加法比较特殊。</p><ul><li><p>当一侧为<code>String</code> 类型时，被识别为字符串拼接，并会优先将另一侧转换为字符串类型。</p></li><li><p>当一侧为<code>Number</code>类型，另一侧为原始类型，则将原始类型转换为<code>Number</code>类型。</p></li></ul><ul><li>当一侧为<code>Number</code>类型，另一侧为引用类型，将引用类型和<code>Number</code>类型转换成字符串后拼接。</li></ul><h3 id="逻辑语句中的类型转换" tabindex="-1"><a class="header-anchor" href="#逻辑语句中的类型转换" aria-hidden="true">#</a> 逻辑语句中的类型转换</h3><p>使用<code>if while for</code>时，我们希望里面是个<code>Bollean</code>。</p><p><strong>1.单个变量</strong></p><p>如果是单个变量时，会将其转换为<code>Bollean</code></p><p>**规则：**只有 <code>null</code> <code>undefined</code> <code>&#39;&#39;</code> <code>NaN</code> <code>0</code> <code>false</code> 这几个是 <code>false</code>，其他的情况都是 <code>true</code>，比如 <code>{}</code> , <code>[]</code>。</p><p><strong>2.使用==比较中的五条规则</strong></p><ul><li><p><code>NAN</code> 和其他类型比较永远返回false(包括自己)</p></li><li><p><code>Boolean</code> 和其他任何类型比较，<code>Boolean</code> 首先被转换为 <code>Number</code> 类型。</p></li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token boolean">true</span> <span class="token operator">==</span> <span class="token number">1</span>  <span class="token comment">// true </span>
<span class="token boolean">true</span> <span class="token operator">==</span> <span class="token string">&#39;2&#39;</span>  <span class="token comment">// false, 先把 true 变成 1，而不是把 &#39;2&#39; 变成 true</span>
<span class="token boolean">true</span> <span class="token operator">==</span> <span class="token punctuation">[</span><span class="token string">&#39;1&#39;</span><span class="token punctuation">]</span>  <span class="token comment">// true, 先把 true 变成 1， [&#39;1&#39;]拆箱成 &#39;1&#39;, 再参考规则3</span>
<span class="token boolean">true</span> <span class="token operator">==</span> <span class="token punctuation">[</span><span class="token string">&#39;2&#39;</span><span class="token punctuation">]</span>  <span class="token comment">// false, 同上</span>
<span class="token keyword">undefined</span> <span class="token operator">==</span> <span class="token boolean">false</span> <span class="token comment">// false ，首先 false 变成 0，然后参考规则4</span>
<span class="token keyword">null</span> <span class="token operator">==</span> <span class="token boolean">false</span> <span class="token comment">// false，同上</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>String</code>和<code>Number</code>比较，先将<code>String</code>转换为<code>Number</code>类型。</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token number">123</span> <span class="token operator">==</span> <span class="token string">&#39;123&#39;</span> <span class="token comment">// true, &#39;123&#39; 会先变成 123</span>
<span class="token string">&#39;&#39;</span> <span class="token operator">==</span> <span class="token number">0</span> <span class="token comment">// true, &#39;&#39; 会首先变成 0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>null == undefined</code>比较结果是<code>true</code>，除此之外，<code>null</code>、<code>undefined</code>和其他任何结果的比较值都为<code>false</code>。</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">null</span> <span class="token operator">==</span> <span class="token keyword">undefined</span> <span class="token comment">// true</span>
<span class="token keyword">null</span> <span class="token operator">==</span> <span class="token string">&#39;&#39;</span> <span class="token comment">// false</span>
<span class="token keyword">null</span> <span class="token operator">==</span> <span class="token number">0</span> <span class="token comment">// false</span>
<span class="token keyword">null</span> <span class="token operator">==</span> <span class="token boolean">false</span> <span class="token comment">// false</span>
<span class="token keyword">undefined</span> <span class="token operator">==</span> <span class="token string">&#39;&#39;</span> <span class="token comment">// false</span>
<span class="token keyword">undefined</span> <span class="token operator">==</span> <span class="token number">0</span> <span class="token comment">// false</span>
<span class="token keyword">undefined</span> <span class="token operator">==</span> <span class="token boolean">false</span> <span class="token comment">// false</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>原始类型</code>和<code>引用类型</code>做比较时，引用类型会依照<code>ToPrimitive</code>规则转换为原始类型。它遵循先<code>valueOf</code>后<code>toString</code>的模式期望得到一个原始类型。</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token string">&#39;[object Object]&#39;</span> <span class="token operator">==</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> 
<span class="token comment">// true, 对象和字符串比较，对象通过 toString 得到一个基本类型值</span>
<span class="token string">&#39;1,2,3&#39;</span> <span class="token operator">==</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span> 
<span class="token comment">// true, 同上  [1, 2, 3]通过 toString 得到一个基本类型值</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>valueof</code>规则</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// Array：返回数组对象本身
var array = [&quot;ABC&quot;, true, 12, -5];
console.log(array.valueOf() === array);   // true
  11, 59, 230);
console.log(date.valueOf());   // 1376838719230

// Number：返回数字值
var num =  15.26540;
console.log(num.valueOf());   // 15.2654

// 布尔：返回布尔值true或false
var bool = true;
console.log(bool.valueOf() === bool);   // true

// new一个Boolean对象
var newBool = new Boolean(true);
// valueOf()返回的是true，两者的值相等
console.log(newBool.valueOf() == newBool);   // true
// 但是不全等，两者类型不相等，前者是boolean类型，后者是object类型
console.log(newBool.valueOf() === newBool);   // false

// Function：返回函数本身
function foo(){}
console.log( foo.valueOf() === foo );   // true
var foo2 =  new Function(&quot;x&quot;, &quot;y&quot;, &quot;return x + y;&quot;);
console.log( foo2.valueOf() );
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>toString</code>规则</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>let num = 1
let str = &#39;a&#39;
let bool = true
let obj = {}
let date = new Date()
let reg = /\\d/
let arr = [1, 2, 3]
let fun = function () {
}

console.log(num.toString())   // &#39;1&#39;
console.log(str.toString())   // &#39;a&#39;
console.log(bool.toString())  // &#39;true&#39;
console.log(obj.toString())   // &#39;[object Object]&#39;
console.log(date.toString())  // &#39;Thu Mar 28 2019 17:07:40 GMT+0800 (中国标准时间)&#39;
console.log(reg.toString())   // &#39;/\\d/&#39;
console.log(arr.toString())   // &#39;1,2,3&#39;
console.log(fun.toString())   // &#39;function(){}&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>toString()</code>也可以判断对象类型，但是我们需要用Object原型上的方法，每个对象都会继承Object，但是由于有些对象会修改<code>toString()</code>,因此，如果想用<code>toString()</code>来判断对象类型的话，必须使用原型链上的方法。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>var toString = Object.prototype.toString;

toString.call(new Date); // [object Date]
toString.call(new String); // [object String]
toString.call(Math); // [object Math]

//Since JavaScript 1.8.5
toString.call(undefined); // [object Undefined]
toString.call(null); // [object Null]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="typeof" tabindex="-1"><a class="header-anchor" href="#typeof" aria-hidden="true">#</a> typeof</h3><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/2191646980-57a0ac0c57fc5_fix732.webp" alt="2191646980-57a0ac0c57fc5_fix732"></p><h2 id="迭代器" tabindex="-1"><a class="header-anchor" href="#迭代器" aria-hidden="true">#</a> 迭代器</h2><p>迭代器有一个next方法</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>{
    value: 表示当前的值,
    done: 表示遍历是否结束
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>内部有一个指针，指向数据结构的起始位置。每调用一次next()方法，指针都会向后移动一个位置，直到指向最后一个位置。</p><h3 id="生成器" tabindex="-1"><a class="header-anchor" href="#生成器" aria-hidden="true">#</a> 生成器</h3>`,191),D={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*",target:"_blank",rel:"noopener noreferrer"},I=e("code",null,"function*",-1),E=i(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function* makeRangeIterator(start = 0, end = Infinity, step = 1) {
    for (let i = start; i &lt; end; i += step) {
        yield i;
    }
}
var a = makeRangeIterator(1,10,2)
a.next() // {value: 1, done: false}
a.next() // {value: 3, done: false}
a.next() // {value: 5, done: false}
a.next() // {value: 7, done: false}
a.next() // {value: 9, done: false}
a.next() // {value: undefined, done: true}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="可迭代对象" tabindex="-1"><a class="header-anchor" href="#可迭代对象" aria-hidden="true">#</a> 可迭代对象</h3><p>可迭代对象包括数组，Set集合，Map集合和字符串都是可迭代数组</p><h3 id="map" tabindex="-1"><a class="header-anchor" href="#map" aria-hidden="true">#</a> map</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>map.has(key)//是否含有
map.delete(key)
map.set(key,value)
map.get(key)
map.keys()//返回map的键迭代器
map.values()//返回map的值迭代器
map.entries()//返回map的键和值的迭代器
map.forEach((value,key)=&gt;{})//遍历map
map.size()
[...map.keys()]//迭代器转换成数组
map.keys().next().value//获取第一个键
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>map的另一种创建方式：</strong> <code>new Map(iterable)</code> 传入的是一个可迭代对象，并且每个值是[key,value],例如：</p><p><code>[[&#39;1&#39;,&#39;str1&#39;],[1,&#39;num1&#39;],[true,&#39;bool1&#39;]]</code></p><h4 id="map与obj转换" tabindex="-1"><a class="header-anchor" href="#map与obj转换" aria-hidden="true">#</a> map与obj转换</h4><ul><li>从对象转为 Map ：<code>new Map(Object.entries(obj))</code></li><li>从 Map 转为对象：<code>Object.fromEntries(map)</code></li></ul><p><code>Object.entries()</code> 能够将对象转换为entries的数组，由map的另一种创建方式，我们就可以通过<code>new Map(Obj.entried(obj))</code>的方式将对象转为map。</p><p><code>Object.fromEntries(iterable)</code> 是<code>Object.entries</code>的反向操作，因此可以通过这种方式将map转换为对象</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>let map = new Map([
  [&#39;1&#39;,  &#39;str1&#39;],
  [1,    &#39;num1&#39;],
  [true, &#39;bool1&#39;]
]);

Object.fromEntries(map)
// {
//   &quot;1&quot;: &quot;num1&quot;,
//   &quot;true&quot;: &quot;bool1&quot;
// }
// 对象的属性只有字符串或者Symbol两种，因此非Symbol和非字符串的key都会转换为字符串
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="set" tabindex="-1"><a class="header-anchor" href="#set" aria-hidden="true">#</a> set</h3><p>与map类似，<code>set.keys()</code>与<code>set.values()</code>相同返回的都是value值，<code>set.entries()</code> 每个值都是[value, value]，为了与map对齐。</p><h2 id="weakmap和weakset" tabindex="-1"><a class="header-anchor" href="#weakmap和weakset" aria-hidden="true">#</a> weakMap和weakSet</h2><h3 id="weakmap" tabindex="-1"><a class="header-anchor" href="#weakmap" aria-hidden="true">#</a> weakMap</h3><p>只能用对象作为key，并且不会对weakMap里的key做引用</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>let john = { name: &quot;John&quot; };

let weakMap = new WeakMap();
weakMap.set(john, &quot;...&quot;);

john = null; // 覆盖引用

// john 被从内存中删除了！
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>weakMap不支持迭代以及 <code>keys()</code>，<code>values()</code> 和 <code>entries()</code> 方法。</p><h3 id="weakset" tabindex="-1"><a class="header-anchor" href="#weakset" aria-hidden="true">#</a> weakSet</h3><p>只能用来存储对象，对象不计入垃圾回收的引入</p><p>不支持<code>size()</code>和<code>keys()</code>,并不支持迭代</p><h3 id="for-of" tabindex="-1"><a class="header-anchor" href="#for-of" aria-hidden="true">#</a> for of</h3><p>为什么需要for of forEach不能break continue for...in的缺点是不仅遍历数字键名，还会遍历手动添加的自定义键，甚至包括原型链上的键。for...in主要还是为遍历对象而设计的，并不太适用于遍历数组。 Iterator 接口主要供for...of消费。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>for(let v of arr) {
    console.log(v); // 1 2 3 4
}
for(let v of str) {
    console.log(v); // a b c d e
}
for(let v of map) {
    console.log(v);
    // (2) [&quot;first&quot;, &quot;第一&quot;]
    // (2) [&quot;second&quot;, &quot;第二&quot;]
    // (2) [&quot;third&quot;, &quot;第三&quot;]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="数组" tabindex="-1"><a class="header-anchor" href="#数组" aria-hidden="true">#</a> 数组</h2>`,26),L={href:"https://github.com/csjiabin/hexo-theme-next/blob/master/source/_posts/js%E6%95%B0%E7%BB%84%E8%AF%A6%E7%BB%86%E6%93%8D%E4%BD%9C%E6%96%B9%E6%B3%95%E5%8F%8A%E8%A7%A3%E6%9E%90%E5%90%88%E9%9B%86.md",target:"_blank",rel:"noopener noreferrer"},F=i(`<h1 id="nan" tabindex="-1"><a class="header-anchor" href="#nan" aria-hidden="true">#</a> NAN</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>typeof NaN //number
// NaN和任何值比较==或===都为false，包括NaN
// 如何判断一个值为NAN Number.isNaN()或isNaN()
Number.NaN//NaN是Number上的一个静态属性，可以用来得到NaN
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="es6" tabindex="-1"><a class="header-anchor" href="#es6" aria-hidden="true">#</a> es6</h1><p>let const 解构 模板字符串 扩展运算符 for of Object.is Object.assign</p><p>字符串:str.repeat() str.startsWith() str.endsWith() includes()</p><p>数组：Array.from() Array.of() find() findIndex() includes() flat()</p><h1 id="变量提升" tabindex="-1"><a class="header-anchor" href="#变量提升" aria-hidden="true">#</a> 变量提升</h1><p>变量提升实际上是在编译阶段会将函数和变量放到Lexical Environment(词法环境)这么个数据结构中</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sayHi() // Hi there!

function sayHi() {
    console.log(&#39;Hi there!&#39;)
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在执行到sayHi时会去看此法环境中找这个函数并执行他。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>console.log(name)   // &#39;undefined&#39;
var name = &#39;John Doe&#39;
console.log(name)   // John Doe
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是变量为什么没有呢？那么是因为编译阶段时碰到var就会在词法环境中存一个undefined，在执行到var语句的时候会给变量附上值</p><p>let 和 const 就不会再词法环境中加上undefined，因此会出现语法错误(还有class)</p><h1 id="执行上下文" tabindex="-1"><a class="header-anchor" href="#执行上下文" aria-hidden="true">#</a> 执行上下文</h1><p>在函数执行时会将函数的执行上下文压入执行上下文栈，在函数执行结束会出栈，最开始的是一个全局执行上下文，全局执行上下文只有在应用程序执行完毕之后才会清除。</p><p>首先看下执行上下文是由什么组成的吧。(变量对象，作用域链，this)</p><div class="language-dts line-numbers-mode" data-ext="dts"><pre class="language-dts"><code>checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        a: 1
    },
    Scope: [AO, [[Scope]]]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>AO</code>表示变量对象，scope是作用域链，scope的顶端是自己的变量对象，函数在使用变量的时候会按照作用域链来一层一层查找。</p><p>js作用域是在定义的时候确定的,作用域确定了使用变量的权限或者说是查找变量的途径</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>var a = 1
function out(){
    var a = 2
    inner()
}
function inner(){
    console.log(a)
}
out()  //====&gt;  1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-stylus line-numbers-mode" data-ext="styl"><pre class="language-stylus"><code><span class="token property-declaration"><span class="token property">var</span> a <span class="token operator">=</span> <span class="token number">1</span></span>
function <span class="token func"><span class="token function">out</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
    <span class="token property-declaration"><span class="token property">var</span> a <span class="token operator">=</span> <span class="token number">2</span></span>
    <span class="token func"><span class="token function">inner</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
    function <span class="token func"><span class="token function">inner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
        console<span class="token punctuation">.</span><span class="token func"><span class="token function">log</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span></span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token func"><span class="token function">out</span><span class="token punctuation">(</span><span class="token punctuation">)</span>  <span class="token comment">//====&gt;  2</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数的作用域链在定义的时候会先放在函数的[[scope]]属性上，在函数执行的时候，创建完执行上下文，执行上下文的Scope属性就会复制函数的[[scope]]属性，并把变量对象放在顶端。</p><p>https://segmentfault.com/a/1190000013915935</p><h2 id="this指向" tabindex="-1"><a class="header-anchor" href="#this指向" aria-hidden="true">#</a> this指向</h2><h2 id="for循环中let和var的区别" tabindex="-1"><a class="header-anchor" href="#for循环中let和var的区别" aria-hidden="true">#</a> for循环中let和var的区别</h2><p>在es6中新增了一个块级作用域，在es6之前，在while，if这些语句中使用var都是会声明在全局作用域或者函数作用域中，let和const就可以在while，if中声明一个变量，并且有一个块级作用域。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>for(var i=0;i&lt;10;i++){
    setTimeout(()=&gt;{
        console.log(i + &quot;随机数&quot; + Math.random())
    },0)
}
for(let i=0;i&lt;10;i++){
    setTimeout(()=&gt;{
        console.log(i + &quot;随机数&quot; + Math.random())
    },0)
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在for循环中，可以理解成使用let会在每次循环时创建一个块级作用域，而使用var变量会放在全局作用域或者函数作用域中，因此调用回调使用let的就会找到自己块级作用域下的正确的i，而var会找到全局或者函数作用域下的i(10)</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20220305214516815.png" alt="image-20220305214516815"></p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20220305214543717.png" alt="image-20220305214543717"></p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20220305214822677.png" alt="image-20220305214822677"></p><h1 id="hash路由和history路由" tabindex="-1"><a class="header-anchor" href="#hash路由和history路由" aria-hidden="true">#</a> hash路由和history路由</h1><h2 id="hash路由" tabindex="-1"><a class="header-anchor" href="#hash路由" aria-hidden="true">#</a> hash路由</h2><p>hash路由就是#号后面跟的hash值，通过hashChange事件就可以监听路由变化，从而实现不同路由对应不同组件的效果</p><p>优点：</p><p>1.只需要前端配置路由表, 不需要后端的参与</p><p>2.兼容性好, 浏览器都能支持</p><p>3.hash值改变不会向后端发送请求, 完全属于前端路由</p><p>缺点：</p><p>hash值前面加#号，不符合url规范，不美观，不能使用锚点</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;script type=&quot;text/javascript&quot;&gt;
    // 第一次加载的时候，不会执行 hashchange 监听事件，默认执行一次
    // DOMContentLoaded 为浏览器 DOM 加载完成时触发
    window.addEventListener(&#39;DOMContentLoaded&#39;, Load)
    window.addEventListener(&#39;hashchange&#39;, HashChange)
    // 展示页面组件的节点
    var routeView = null
    function Load() {
      routeView = document.getElementById(&#39;route-view&#39;)
      HashChange()
    }
    function HashChange() {
      // 每次触发 hashchange 事件，通过 location.hash 拿到当前浏览器地址的 hash 值
      // 根据不同的路径展示不同的内容
      switch(location.hash) {
      case &#39;#/page1&#39;:
        routeView.innerHTML = &#39;page1&#39;
        return
      case &#39;#/page2&#39;:
        routeView.innerHTML = &#39;page2&#39;
        return
      default:
        routeView.innerHTML = &#39;page1&#39;
        return
      }
    }
  &lt;/script&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过监听hashchange加载不同的组件</p><h2 id="history路由" tabindex="-1"><a class="header-anchor" href="#history路由" aria-hidden="true">#</a> history路由</h2><p><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b0d880981714fe080f4e2bb678e32ab~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp" alt="img"></p><p>我们使用history路由访问某个网站，按照常理说应该是访问服务器的某个资源，如我们访问user/123435 ,如果服务器没有这个资源就会报404，因此使用history路由是需要后台配置的，在访问不存在域名的时候，就会重定向到index.html上。</p><p>history是依靠history.pushState(replaceState)完成URL跳转但是不重新加载页面(不发送请求)</p><h1 id="箭头函数" tabindex="-1"><a class="header-anchor" href="#箭头函数" aria-hidden="true">#</a> 箭头函数</h1><ul><li>箭头函数this在定义时绑定，它只会从自己的作用域链的上一层继承this</li><li>.call()/.apply()/.bind()无法改变this指向</li><li>不能作为构造函数，因为new 的本质就是改变this的指向</li><li>箭头函数没有自己的arguments，在箭头函数访问arguments实际上获得的是外层局部(函数)执行环境中的值</li><li>箭头函数没有原型</li><li>箭头函数不能用作Generator函数，不能使用yeild关键字</li></ul><h1 id="flux" tabindex="-1"><a class="header-anchor" href="#flux" aria-hidden="true">#</a> flux</h1><p>Flux 不是一个框架（Framework）或库（Library），而是一种架构（Architecture）</p><ul><li><strong>View</strong>： 视图层</li><li><strong>Action</strong>（动作）：视图层发出的消息（比如mouseClick）</li><li><strong>Dispatcher</strong>（派发器）：用来接收Actions、执行回调函数</li><li><strong>Store</strong>（数据层）：用来存放应用的状态，一旦发生变动，就提醒Views要更新页面</li></ul><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/bg2016011503.png" alt="bg2016011503"></p><h1 id="bigint" tabindex="-1"><a class="header-anchor" href="#bigint" aria-hidden="true">#</a> BigInt</h1>`,53),R=e("strong",null,[e("code",null,"BigInt")],-1),B=e("code",null,"2^53 - 1",-1),z={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number",target:"_blank",rel:"noopener noreferrer"},U=e("code",null,"Number",-1),J=e("strong",null,[e("code",null,"BigInt")],-1),G=i(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const theBiggestInt = 9007199254740991n;

const alsoHuge = BigInt(9007199254740991);
// ↪ 9007199254740991n

const hugeString = BigInt(&quot;9007199254740991&quot;);
// ↪ 9007199254740991n
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不能使用Math中的方法，在和Number类型进行计算时需要转换为同一种数据类型，在BigInt转换为Number可能会丢失精度</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>typeof 1n === &#39;bigint&#39;; // true
typeof BigInt(&#39;1&#39;) === &#39;bigint&#39;; // true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><code>/</code> 操作符对于整数的运算也没问题。可是因为这些变量是 <code>BigInt</code> 而不是 <code>BigDecimal</code> ，该操作符结果会向零取整，也就是说不会返回小数部分。</p>`,4),W=e("code",null,"BigInt",-1),K={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number",target:"_blank",rel:"noopener noreferrer"},V=e("code",null,"Number",-1),X={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number",target:"_blank",rel:"noopener noreferrer"},$=e("code",null,"Number",-1),Y=e("code",null,"BigInt",-1);function Q(Z,ee){const a=r("ExternalLinkIcon");return l(),d("div",null,[p,c("more"),u,e("ul",null,[v,m,h,e("li",null,[n("Orinoco：garbage collector，"),e("a",b,[n("垃圾回收"),s(a)]),n("模块，负责将程序不再需要的内存空间回收；")])]),g,e("p",null,[e("a",k,[n("https://blog.csdn.net/jiangjuanjaun/article/details/80327342"),s(a)])]),f,e("ul",null,[x,y,S,w,e("li",null,[e("a",T,[C,s(a)]),n(" 属性为 "),P,n("。")]),e("li",null,[e("a",j,[_,s(a)]),n(" 属性为 "),q,n("。")])]),M,e("p",null,[e("a",N,[n("https://www.cnblogs.com/leegent/p/7499532.html"),s(a)]),n(" 2.空iframe加form 细心的朋友可能发现，JSONP只能发GET请求，因为本质上script加载资源就是GET，那么如果要发POST请求怎么办呢？ 通过form来发送post请求 3.cors 一：简单的跨域请求，流程如下")]),H,e("p",null,[e("a",A,[n("https://cloud.tencent.com/developer/article/1418457"),s(a)])]),O,e("p",null,[n("生成器函数使用 "),e("a",D,[I,s(a)]),n("语法编写。 最初调用时，生成器函数不执行任何代码，而是返回一种称为Generator的迭代器。 通过调用生成器的下一个方法消耗值时，Generator函数将执行，直到遇到yield关键字。")]),E,e("p",null,[e("a",L,[n("数组详细操作方法及解析"),s(a)])]),F,e("p",null,[R,n(" 是一种内置对象，它提供了一种方法来表示大于 "),B,n(" 的整数。这原本是 Javascript中可以用 "),e("a",z,[U,s(a)]),n(" 表示的最大数字。"),J,n(" 可以表示任意大的整数。可以通过在数字后面加n或者调用函数BigInt来定义大数")]),G,e("p",null,[W,n(" 和 "),e("a",K,[V,s(a)]),n(" 不是严格相等的，但是宽松相等的。")]),e("p",null,[e("a",X,[$,s(a)]),n(" 和 "),Y,n(" 可以进行比较。两者也可以混在一个数组内并排序。")])])}const se=t(o,[["render",Q],["__file","interview.html.vue"]]);export{se as default};