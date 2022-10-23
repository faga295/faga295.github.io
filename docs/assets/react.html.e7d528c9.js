import{ab as n,B as s,C as a,ac as e}from"./app.2fcbcb26.js";import"./vendor.3bc2edde.js";const t={},p=e(`<h1 id="react源码架构" tabindex="-1"><a class="header-anchor" href="#react源码架构" aria-hidden="true">#</a> react源码架构</h1><h2 id="react15架构" tabindex="-1"><a class="header-anchor" href="#react15架构" aria-hidden="true">#</a> React15架构</h2><p>React15架构分为两层:</p><ul><li>reconciler(协调器)：负责找出组件变化</li><li>renderer(渲染器)：负责操作dom，将变化的地方渲染到页面</li></ul><h3 id="reconciler" tabindex="-1"><a class="header-anchor" href="#reconciler" aria-hidden="true">#</a> Reconciler</h3><p>reconciler主要做了这么几件事：</p><ul><li>执行函数式组件或者class组件的render方法，拿到其返回值的jsx生成虚拟DOM（虚拟DOM其实本质上就是js对象，其中包括了所有dom的属性，以及props，state）</li><li>通过深度优先遍历比较上次虚拟DOM与这次虚拟DOM的区别</li><li>通知renderer将变化的虚拟DOM渲染</li></ul><h3 id="renderer" tabindex="-1"><a class="header-anchor" href="#renderer" aria-hidden="true">#</a> Renderer</h3><p>有虚拟DOM的存在，就可以实现跨平台的功能，通过不同的渲染器，渲染在不同平台上。我们前端最熟悉的是负责在浏览器环境渲染的<strong>Renderer</strong> —— ReactDOM。</p><ul><li><code>ReactNative (opens new window)</code>渲染器，渲染<code>App</code>原生组件</li><li><code>ReactTest (opens new window)</code>渲染器，渲染出纯<code>Js</code>对象用于测试</li><li><code>ReactArt (opens new window)</code>渲染器，渲染到Canvas, <code>SVG </code>或<code> VML (IE8)</code></li></ul><h3 id="react15架构的缺点" tabindex="-1"><a class="header-anchor" href="#react15架构的缺点" aria-hidden="true">#</a> React15架构的缺点</h3><p>由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了16ms，用户交互就会卡顿。因此在React16版本提出了concurrent模式，该模式用可中断的异步更新替代同步更新。</p><h2 id="react16架构" tabindex="-1"><a class="header-anchor" href="#react16架构" aria-hidden="true">#</a> React16架构</h2><p>React16架构可以分为三层：</p><ul><li>Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入<strong>Reconciler</strong></li><li>Reconciler（协调器）—— 负责找出变化的组件</li><li>Renderer（渲染器）—— 负责将变化的组件渲染到页面上</li></ul><p>React16架构是在React15架构上增加了一个Scheduler，Scheduler做的事情就是当浏览器有时间的时候通知我们，因此在协调器里面代码改为了</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null &amp;&amp; !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过浏览器是否有时间来判断是否应该终端递归</p><p>在React15中Reconciler与Renderer是交替工作的，检查到某个节点更新了就会交给Renderer渲染，在React16中，<strong>Reconciler</strong>与<strong>Renderer</strong>不再是交替工作。当<strong>Scheduler</strong>将任务交给<strong>Reconciler</strong>后，<strong>Reconciler</strong>会为变化的虚拟DOM打上代表增/删/更新的标记，类似这样：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> Placement <span class="token operator">=</span> <span class="token comment">/*             */</span> <span class="token number">0b0000000000010</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Update <span class="token operator">=</span> <span class="token comment">/*                */</span> <span class="token number">0b0000000000100</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> PlacementAndUpdate <span class="token operator">=</span> <span class="token comment">/*    */</span> <span class="token number">0b0000000000110</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Deletion <span class="token operator">=</span> <span class="token comment">/*    
</span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>整个<strong>Scheduler</strong>与<strong>Reconciler</strong>的工作都在内存中进行。只有当所有组件都完成<strong>Reconciler</strong>的工作，才会统一交给<strong>Renderer</strong>。</p><h2 id="fiber结构" tabindex="-1"><a class="header-anchor" href="#fiber结构" aria-hidden="true">#</a> Fiber结构</h2><p>在<code>React15</code>及以前，<code>Reconciler</code>采用递归的方式创建虚拟DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。</p><p>为了解决这个问题，<code>React16</code>将<strong>递归的无法中断的更新</strong>重构为<strong>异步的可中断更新</strong>，由于曾经用于递归的<strong>虚拟DOM</strong>数据结构已经无法满足需要。于是，全新的<code>Fiber</code>架构应运而生。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">FiberNode</span><span class="token punctuation">(</span>
  <span class="token parameter"><span class="token literal-property property">tag</span><span class="token operator">:</span> WorkTag<span class="token punctuation">,</span>
  <span class="token literal-property property">pendingProps</span><span class="token operator">:</span> mixed<span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token keyword">null</span> <span class="token operator">|</span> string<span class="token punctuation">,</span>
  <span class="token literal-property property">mode</span><span class="token operator">:</span> TypeOfMode<span class="token punctuation">,</span></span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 作为静态数据结构的属性</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>tag <span class="token operator">=</span> tag<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>key <span class="token operator">=</span> key<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>elementType <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>type <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>stateNode <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 用于连接其他Fiber节点形成Fiber树</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>return <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>child <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>sibling <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

  <span class="token keyword">this</span><span class="token punctuation">.</span>ref <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 作为动态的工作单元的属性(保存了本次更新该组件改变的状态，要执行的工作)</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>pendingProps <span class="token operator">=</span> pendingProps<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>memoizedProps <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>dependencies <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token keyword">this</span><span class="token punctuation">.</span>mode <span class="token operator">=</span> mode<span class="token punctuation">;</span>

  <span class="token keyword">this</span><span class="token punctuation">.</span>effectTag <span class="token operator">=</span> NoEffect<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>nextEffect <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token keyword">this</span><span class="token punctuation">.</span>firstEffect <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>lastEffect <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 调度优先级相关</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>lanes <span class="token operator">=</span> NoLanes<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>childLanes <span class="token operator">=</span> NoLanes<span class="token punctuation">;</span>

  <span class="token comment">// 指向该fiber在另一次更新时对应的fiber</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>alternate <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="fiber双缓存" tabindex="-1"><a class="header-anchor" href="#fiber双缓存" aria-hidden="true">#</a> Fiber双缓存</h3><p>在React中最多会同时存在两颗<code>Fiber树</code>。当前屏幕上显示内容对应的<code>Fiber树</code>称为<code>current Fiber树</code>，正在内存中构建的<code>Fiber树</code>称为<code>workInProgress Fiber树,他们通过</code>alternate\`属性连接。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>currentFiber<span class="token punctuation">.</span>alternate <span class="token operator">===</span> workInProgressFiber<span class="token punctuation">;</span>
workInProgressFiber<span class="token punctuation">.</span>alternate <span class="token operator">===</span> currentFiber<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>当<code>workInProgress Fiber树</code>构建完成交给<code>Renderer</code>渲染在页面上后，应用根节点的<code>current</code>指针指向<code>workInProgress Fiber树</code>，此时<code>workInProgress Fiber树</code>就变为<code>current Fiber树</code>。</p><p>每次状态更新都会产生新的<code>workInProgress Fiber树</code>，通过<code>current</code>与<code>workInProgress</code>的替换，完成<code>DOM</code>更新。</p><p>首次执行<code>ReactDOM.render</code>会创建<code>fiberRootNode</code>（源码中叫<code>fiberRoot</code>）和<code>rootFiber</code>。其中<code>fiberRootNode</code>是整个应用的根节点，<code>rootFiber</code>是<code>&lt;App/&gt;</code>所在组件树的根节点。</p><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/rootfiber.png" alt="rootFiber"></p><p>一个应用中只有一个fiberRoot，但可以有多个rootFiber，rootFiber是通过ReactDom.render创建的</p><h2 id="深入理解jsx" tabindex="-1"><a class="header-anchor" href="#深入理解jsx" aria-hidden="true">#</a> 深入理解jsx</h2><p><code>JSX</code>在编译时会被<code>Babel</code>编译为<code>React.createElement</code>方法。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createElement</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> config<span class="token punctuation">,</span> children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> propName<span class="token punctuation">;</span>

  <span class="token keyword">const</span> props <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">let</span> key <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> ref <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> self <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> source <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>config <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 将 config 处理后赋值给 props</span>
    <span class="token comment">// ...省略</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">const</span> childrenLength <span class="token operator">=</span> arguments<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">2</span><span class="token punctuation">;</span>
  <span class="token comment">// 处理 children，会被赋值给props.children</span>
  <span class="token comment">// ...省略</span>

  <span class="token comment">// 处理 defaultProps</span>
  <span class="token comment">// ...省略</span>

  <span class="token keyword">return</span> <span class="token function">ReactElement</span><span class="token punctuation">(</span>
    type<span class="token punctuation">,</span>
    key<span class="token punctuation">,</span>
    ref<span class="token punctuation">,</span>
    self<span class="token punctuation">,</span>
    source<span class="token punctuation">,</span>
    ReactCurrentOwner<span class="token punctuation">.</span>current<span class="token punctuation">,</span>
    props<span class="token punctuation">,</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> <span class="token function-variable function">ReactElement</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> key<span class="token punctuation">,</span> ref<span class="token punctuation">,</span> self<span class="token punctuation">,</span> source<span class="token punctuation">,</span> owner<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token comment">// 标记这是个 React Element</span>
    $$<span class="token keyword">typeof</span><span class="token operator">:</span> <span class="token constant">REACT_ELEMENT_TYPE</span><span class="token punctuation">,</span>

    <span class="token literal-property property">type</span><span class="token operator">:</span> type<span class="token punctuation">,</span>
    <span class="token literal-property property">key</span><span class="token operator">:</span> key<span class="token punctuation">,</span>
    <span class="token literal-property property">ref</span><span class="token operator">:</span> ref<span class="token punctuation">,</span>
    <span class="token literal-property property">props</span><span class="token operator">:</span> props<span class="token punctuation">,</span>
    <span class="token literal-property property">_owner</span><span class="token operator">:</span> owner<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> element<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>React.createElement</code> 方法会返回一个包含组件数据的对象，对象有个参数<code>$$typeof: REACT_ELEMENT_TYPE</code>标记了该对象是个<code>React Element</code></p><p><code>JSX</code>是一种描述当前组件内容的数据结构，他不包含组件<strong>schedule</strong>、<strong>reconcile</strong>、<strong>render</strong>所需的相关信息。</p><p>比如如下信息就不包括在<code>JSX</code>中：</p><ul><li>组件在更新中的<code>优先级</code></li><li>组件的<code>state</code></li><li>组件被打上的用于<strong>Renderer</strong>的<code>标记</code></li></ul><p>所以，在组件<code>mount</code>时，<code>Reconciler</code>根据<code>JSX</code>描述的组件内容生成组件对应的<code>Fiber节点</code>。</p><p>在<code>update</code>时，<code>Reconciler</code>将<code>JSX</code>与<code>Fiber节点</code>保存的数据对比，生成组件对应的<code>Fiber节点</code>，并根据对比结果为<code>Fiber节点</code>打上<code>标记</code></p><h2 id="render阶段" tabindex="-1"><a class="header-anchor" href="#render阶段" aria-hidden="true">#</a> Render阶段</h2><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/20210529105753.png" alt="react源码8.1"></p><p><code>render阶段</code> 的入口函数是<code>performSyncWorkOnRoot</code>或<code>performConcurrentWorkOnRoot</code> 这取决于同步更新还是异步更新。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// performSyncWorkOnRoot会调用该方法</span>
<span class="token keyword">function</span> <span class="token function">workLoopSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// performConcurrentWorkOnRoot会调用该方法</span>
<span class="token keyword">function</span> <span class="token function">workLoopConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token function">shouldYield</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>performConcurrentWorkOnRoot</code> 多了个判断浏览器帧是否有时间。<code>shouldYield</code>会终止循环，知道浏览器有空闲时间后再继续遍历。</p><p><code>performUnitOfWork</code> 方法会创建下一个Fiber节点，并将workInProgress与其子Fiber节点连接。<code>performUnitOfwork</code>分为两个过程，“递”和“归”</p><p><strong>递阶段:</strong></p><p>从<code>rootFiber</code>向下深度优先遍历，并调用<code>beginWork</code>方法。</p><p>该方法做的事情是为传入的Fiber节点创建其子Fiber节点，并将两个Fiber节点连接起来。</p><p>当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。</p><p><strong>归过程:</strong></p><p>在“归”阶段会调用<code>completeWork</code>处理<code>Fiber节点</code>。当某个<code>Fiber节点</code>执行完<code>completeWork</code>，如果其存在<code>兄弟Fiber节点</code>（即<code>fiber.sibling !== null</code>），会进入其<code>兄弟Fiber</code>的“递”阶段。</p><p>如果不存在<code>兄弟Fiber</code>，会进入<code>父级Fiber</code>的“归”阶段。</p><p>“递”和“归”阶段会交错执行直到“归”到<code>rootFiber</code>。至此，<code>render阶段</code>的工作就结束了。</p><h3 id="beginwork" tabindex="-1"><a class="header-anchor" href="#beginwork" aria-hidden="true">#</a> beginwork</h3><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20220226153155497.png" alt="image-20220226153155497"></p><p><code>beginWork</code>的工作可以分为两部分：</p><ul><li><code>update</code>时：如果<code>current</code>存在，在满足一定条件时可以复用<code>current</code>节点，这样就能克隆<code>current.child</code>作为<code>workInProgress.child</code>，而不需要新建<code>workInProgress.child</code>。如果不能复用就进入到reconcileChildren，通过diff算法生成带effectTag的子Fiber节点</li><li><code>mount</code>时：除<code>fiberRootNode</code>以外，<code>current === null</code>。会根据<code>fiber.tag</code>不同，创建不同类型的<code>子Fiber节点</code>。mount会直接进入到reconcileChildren函数，并且生成其子节点。</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">beginWork</span><span class="token punctuation">(</span>
  <span class="token parameter"><span class="token literal-property property">current</span><span class="token operator">:</span> Fiber <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token literal-property property">workInProgress</span><span class="token operator">:</span> Fiber<span class="token punctuation">,</span>
  <span class="token literal-property property">renderLanes</span><span class="token operator">:</span> Lanes</span>
<span class="token punctuation">)</span><span class="token operator">:</span> Fiber <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token punctuation">{</span>

  <span class="token comment">// update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...省略</span>

    <span class="token comment">// 复用current</span>
    <span class="token keyword">return</span> <span class="token function">bailoutOnAlreadyFinishedWork</span><span class="token punctuation">(</span>
      current<span class="token punctuation">,</span>
      workInProgress<span class="token punctuation">,</span>
      renderLanes<span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    didReceiveUpdate <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// mount时：根据tag不同，创建不同的子Fiber节点</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>workInProgress<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">IndeterminateComponent</span><span class="token operator">:</span> 
      <span class="token comment">// ...省略</span>
    <span class="token keyword">case</span> <span class="token literal-property property">LazyComponent</span><span class="token operator">:</span> 
      <span class="token comment">// ...省略</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span> 
      <span class="token comment">// ...省略</span>
    <span class="token keyword">case</span> <span class="token literal-property property">ClassComponent</span><span class="token operator">:</span> 
      <span class="token comment">// ...省略</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span>
      <span class="token comment">// ...省略</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span>
      <span class="token comment">// ...省略</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostText</span><span class="token operator">:</span>
      <span class="token comment">// ...省略</span>
    <span class="token comment">// ...省略其他类型</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="diff算法" tabindex="-1"><a class="header-anchor" href="#diff算法" aria-hidden="true">#</a> diff算法</h4><p>diff算法需要判断新节点是不是单节点，单节点只有两种情况oldfiber链是否为空，如果为空那就新建一个节点，如果不为空，就找到和之前key相同的节点，删除其余节点</p><p>多节点则需要分为四种情况：节点更新，新增节点，删除节点，节点移动，多节点更新需要经过最多三轮的遍历（不过感觉是两轮的样子），每一轮都是上轮结束的断点的继续。</p><p>第一轮遍历会从头开始遍历newChildren，会逐个与oldFiber链中的节点进行比较，如果说key和tag都没有变化，那么就clone props更新的节点，props使用新的props，实现节点更新。</p><p>有变化则认为不是节点更新，直接进入下一轮循环。</p><p>我们称保留原位的节点为固定节点，第一轮遍历如果没有跳出循环的话就会设置一个lastPlaceIndex，用来记录最右边的固定节点。</p><p>旧： A - B - C - <code>D - E</code> 新： A - B - C</p><p>删除节点：当新节点遍历完之后如果oldFibers还没遍历完，就会删除后续没遍历完的节点。</p><p>旧： A - B - C 新： A - B - C - <code>D - E</code></p><p>新增节点：和删除节点类似，如果新节点没遍历完，那么新增后续节点。</p><p>旧 A - B - <code>C - D - E - F</code> 新 A - B - <code>D - C - E</code></p><p>节点移动：先将剩余oldFibers放入key为键，值为oldFiber节点的map中，成为existingChildren.</p><p>开始遍历newChildren，如果oldFiber在lastPlaceIndex右边，则代表他对顺序没有影响,则更新lastPlaceIndex = max(index,lastPlaceIndex)，接着删除map中的节点,如果oldFiber的index&lt;lastPlaceIndex,那么认为它是需要移动的，把它移动到最右端，删除map中的节点。如果遍历完成之后，existingChildren中还有节点，那么就直接删除，同样，如果有新的节点（existingChildren中没有的）那么就会新增这个节点。</p><h4 id="effecttag" tabindex="-1"><a class="header-anchor" href="#effecttag" aria-hidden="true">#</a> effectTag</h4><p><code>effectTag</code>是Fiber的一个属性，记录了commit阶段需要对其进行的操作。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// DOM需要插入到页面中</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Placement <span class="token operator">=</span> <span class="token comment">/*                */</span> <span class="token number">0b00000000000010</span><span class="token punctuation">;</span>
<span class="token comment">// DOM需要更新</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Update <span class="token operator">=</span> <span class="token comment">/*                   */</span> <span class="token number">0b00000000000100</span><span class="token punctuation">;</span>
<span class="token comment">// DOM需要插入到页面中并更新</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> PlacementAndUpdate <span class="token operator">=</span> <span class="token comment">/*       */</span> <span class="token number">0b00000000000110</span><span class="token punctuation">;</span>
<span class="token comment">// DOM需要删除</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Deletion <span class="token operator">=</span> <span class="token comment">/*                 */</span> <span class="token number">0b00000000001000</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果想要通知<code>Renderer</code>要操作Fiber对应的DOM节点，那么就需要你有fiber有对应的DOM节点以及effectTag上有对应的操作，但是在mount时<code>fiber.stateNode===null</code>,并且在<code>reconcileChildren</code>中也没有为其添加effectTag，那么首屏渲染该如何完成呢？</p><p>fiber.stateNode会在completeWork的时候创建，但mount时是不会给每个Fiber的<code>effectTag</code>赋值<code>placement</code>的，因为在commit阶段每次进行一次插入操作的效率是很低的，为了解决这个问题，在<code>mount</code>时只有<code>rootFiber</code>会赋值<code>Placement effectTag</code>，在<code>commit阶段</code>只会执行一次插入操作。</p><h3 id="completework" tabindex="-1"><a class="header-anchor" href="#completework" aria-hidden="true">#</a> completeWork</h3><h4 id="update" tabindex="-1"><a class="header-anchor" href="#update" aria-hidden="true">#</a> update</h4><p>update时Fiber节点已经存在对应DOM节点，因此只需要处理props，比如：</p><ul><li><code>onClick</code>、<code>onChange</code>等回调函数的注册</li><li>处理<code>style prop</code></li><li>处理<code>DANGEROUSLY_SET_INNER_HTML prop</code></li><li>处理<code>children prop</code></li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// update的情况</span>
  <span class="token function">updateHostComponent</span><span class="token punctuation">(</span>
    current<span class="token punctuation">,</span>
    workInProgress<span class="token punctuation">,</span>
    type<span class="token punctuation">,</span>
    newProps<span class="token punctuation">,</span>
    rootContainerInstance<span class="token punctuation">,</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>被处理完的props会被赋值给<code>workInProgress.updateQueue</code>,并最终会在commit阶段被渲染在页面上。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>workInProgress<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> <span class="token punctuation">(</span>updatePayload<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code>updatePayload</code>为数组形式，偶数记录了props的key，奇数记录了props的value</p><h4 id="mount" tabindex="-1"><a class="header-anchor" href="#mount" aria-hidden="true">#</a> mount</h4><p>同样，我们省略了不相关的逻辑。可以看到，<code>mount</code>时的主要逻辑包括三个：</p><ul><li>为<code>Fiber节点</code>生成对应的<code>DOM节点</code></li><li>将子孙<code>DOM节点</code>插入刚生成的<code>DOM节点</code>中</li><li>与<code>update</code>逻辑中的<code>updateHostComponent</code>类似的处理<code>props</code>的过程</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> currentHostContext <span class="token operator">=</span> <span class="token function">getHostContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 为fiber创建对应DOM节点</span>
<span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token function">createInstance</span><span class="token punctuation">(</span>
    type<span class="token punctuation">,</span>
    newProps<span class="token punctuation">,</span>
    rootContainerInstance<span class="token punctuation">,</span>
    currentHostContext<span class="token punctuation">,</span>
    workInProgress<span class="token punctuation">,</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 将子孙DOM节点插入刚生成的DOM节点中</span>
<span class="token function">appendAllChildren</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// DOM节点赋值给fiber.stateNode</span>
workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> instance<span class="token punctuation">;</span>

<span class="token comment">// 与update逻辑中的updateHostComponent类似的处理props的过程</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>
  <span class="token function">finalizeInitialChildren</span><span class="token punctuation">(</span>
    instance<span class="token punctuation">,</span>
    type<span class="token punctuation">,</span>
    newProps<span class="token punctuation">,</span>
    rootContainerInstance<span class="token punctuation">,</span>
    currentHostContext<span class="token punctuation">,</span>
  <span class="token punctuation">)</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">markUpdate</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在归操作的过程中每次都会将生成自己的DOM节点，接着把子DOM节点插入刚生成的DOM节点中，这样在归操作结束后，我们就已经构建好了一个DOM树，这时只需要在rootFiber加上Placement effectTag就可以把整颗DOM树添加到页面中去了。</p><h4 id="effectlist" tabindex="-1"><a class="header-anchor" href="#effectlist" aria-hidden="true">#</a> effectList</h4><p>有一个问题：commit阶段的任务是修改的需要操作的Fiber节点对应的DOM节点，但是commit阶段需要再次遍历Fiber树查看其effectTag来判断需要如何更新吗，显然这样效率很低。</p><p>为了解决这个问题，在<code>completeWork</code>的上层函数<code>completeUnitOfWork</code>中，每个执行完<code>completeWork</code>且存在<code>effectTag</code>的<code>Fiber节点</code>会被保存在一条被称为<code>effectList</code>的单向链表中。</p><p>render阶段流程结束，将fiberRoot传入<code>commitRoot()</code>中，开始commit阶段</p><h2 id="commit阶段" tabindex="-1"><a class="header-anchor" href="#commit阶段" aria-hidden="true">#</a> commit阶段</h2><p><code>commit</code>阶段的主要工作（即<code>Renderer</code>的工作流程）分为三部分：</p><ul><li>before mutation阶段（执行<code>DOM</code>操作前）</li><li>mutation阶段（执行<code>DOM</code>操作）</li><li>layout阶段（执行<code>DOM</code>操作后）</li></ul><h1 id="合成事件" tabindex="-1"><a class="header-anchor" href="#合成事件" aria-hidden="true">#</a> 合成事件</h1><h2 id="为什么需要有合成事件" tabindex="-1"><a class="header-anchor" href="#为什么需要有合成事件" aria-hidden="true">#</a> 为什么需要有合成事件</h2><ul><li><p>进行浏览器兼容，实现更好的跨平台</p><p>React 采用的是顶层事件代理机制，能够保证冒泡一致性，可以跨浏览器执行。React 提供的合成事件用来抹平不同浏览器事件对象之间的差异，将不同平台事件模拟合成事件。</p></li><li><p>避免垃圾回收</p><p>事件对象可能会被频繁创建和回收，因此 React 引入<strong>事件池</strong>，在事件池中获取或释放事件对象。<strong>即 React 事件对象不会被释放掉，而是存放进一个数组中，当事件触发，就从这个数组中弹出，避免频繁地去创建和销毁(垃圾回收)</strong>。</p></li><li><p>方便事件统一管理和事务机制</p></li><li><table><thead><tr><th></th><th style="text-align:center;">原生事件</th><th style="text-align:center;">React 事件</th></tr></thead><tbody><tr><td>事件名称命名方式</td><td style="text-align:center;">名称全部小写<br>（onclick, onblur）</td><td style="text-align:center;">名称采用小驼峰<br>（onClick, onBlur）</td></tr><tr><td>事件处理函数语法</td><td style="text-align:center;">字符串</td><td style="text-align:center;">函数</td></tr><tr><td>阻止默认行为方式</td><td style="text-align:center;">事件返回 <code>false</code></td><td style="text-align:center;">使用 <code>e.preventDefault()</code> 方法</td></tr></tbody></table></li></ul><h2 id="合成事件触发流程" tabindex="-1"><a class="header-anchor" href="#合成事件触发流程" aria-hidden="true">#</a> 合成事件触发流程</h2><p>当真实 DOM 元素触发事件，会冒泡到 <code>document</code> 对象后，再处理 React 事件；所以会先执行原生事件，然后处理 React 事件；最后真正执行 <code>document</code> 上挂载的事件。采用的是事件委托。</p><h2 id="react事件池" tabindex="-1"><a class="header-anchor" href="#react事件池" aria-hidden="true">#</a> React事件池</h2><p>每次我们使用事件对象，在函数执行后会通过releaseTopLevelCallbackBookKeeping将事件对象释放到事件池中，这样的好处就是 不用每次都创建事件对象，可以从事件池中取出一个事件源对象进行复用，在事件处理函数执行完毕后,会释放事件对象到事件池中，清空属性，这就是<code>setTimeout</code>中打印为什么是<code>null</code>的原因了。</p><h2 id="事件注册" tabindex="-1"><a class="header-anchor" href="#事件注册" aria-hidden="true">#</a> 事件注册</h2><p>在源码中提到过，render阶段的<code>completeWork</code>会对Fiber节点的props进行处理,这里就包括了对事件的处理</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">setInitialDOMProperties</span><span class="token punctuation">(</span>
  <span class="token parameter"><span class="token literal-property property">tag</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
  <span class="token literal-property property">domElement</span><span class="token operator">:</span> Element<span class="token punctuation">,</span>
  <span class="token literal-property property">rootContainerElement</span><span class="token operator">:</span> Element <span class="token operator">|</span> Document<span class="token punctuation">,</span>
  <span class="token literal-property property">nextProps</span><span class="token operator">:</span> Object<span class="token punctuation">,</span>
  <span class="token literal-property property">isCustomComponentTag</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span></span>
<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> propKey <span class="token keyword">in</span> nextProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>nextProps<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propKey<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token operator">...</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>registrationNameDependencies<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propKey<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 如果propKey属于事件类型，则进行事件绑定</span>
        <span class="token function">ensureListeningTo</span><span class="token punctuation">(</span>rootContainerElement<span class="token punctuation">,</span> propKey<span class="token punctuation">,</span> domElement<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>registrationNameDependencies是一个对象，用来判断该props是否为一个事件。</p></blockquote><p><code>ensureListerningTo()</code>函数来执行事件绑定，他会通过事件名称创建不同的优先级Listener（root上绑定的就是这个带有优先级的监听器），还会根据名称判断是在捕获还是冒泡阶段触发</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>  <span class="token comment">// 根据事件名称，创建不同优先级的事件监听器。</span>
  <span class="token keyword">let</span> listener <span class="token operator">=</span> <span class="token function">createEventListenerWrapperWithPriority</span><span class="token punctuation">(</span>
    targetContainer<span class="token punctuation">,</span>
    domEventName<span class="token punctuation">,</span>
    eventSystemFlags<span class="token punctuation">,</span>
    listenerPriority<span class="token punctuation">,</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 绑定事件</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>isCapturePhaseListener<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>
    unsubscribeListener <span class="token operator">=</span> <span class="token function">addEventCaptureListener</span><span class="token punctuation">(</span>
      targetContainer<span class="token punctuation">,</span>
      domEventName<span class="token punctuation">,</span>
      listener<span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>
    unsubscribeListener <span class="token operator">=</span> <span class="token function">addEventBubbleListener</span><span class="token punctuation">(</span>
      targetContainer<span class="token punctuation">,</span>
      domEventName<span class="token punctuation">,</span>
      listener<span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="事件触发" tabindex="-1"><a class="header-anchor" href="#事件触发" aria-hidden="true">#</a> 事件触发</h2><p>事件触发的流程：首先是对事件对象的合成</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>  <span class="token comment">// 构造合成事件对象</span>
  <span class="token keyword">const</span> event <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SyntheticEvent</span><span class="token punctuation">(</span>
    reactName<span class="token punctuation">,</span>
    <span class="token keyword">null</span><span class="token punctuation">,</span>
    nativeEvent<span class="token punctuation">,</span>
    nativeEventTarget<span class="token punctuation">,</span>
    EventInterface<span class="token punctuation">,</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>原生事件只是合成事件的一个属性，它还包括更多的属性，但说白了这和就是用来描述这个事件的，比如说位置啊，组件名啊啥的。<strong>事件对象合成</strong>完毕之后，会从触发该事件的节点一直往上，判断是否有绑定这个事件，如果有那就把它的事件处理函数收集起来push进一个数组（<strong>执行路径</strong>）中，<strong>事件执行</strong>时这些事件处理函数会共用这同一个合成事件，并且改变其currentTarget，以及阻止其冒泡。</p><p>当我们点击了一个按钮，listener就调用了<code>dispatchEventsForPlugins</code>函数</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">dispatchEventsForPlugins</span><span class="token punctuation">(</span>
  <span class="token parameter"><span class="token literal-property property">domEventName</span><span class="token operator">:</span> DOMEventName<span class="token punctuation">,</span>
  <span class="token literal-property property">eventSystemFlags</span><span class="token operator">:</span> EventSystemFlags<span class="token punctuation">,</span>
  <span class="token literal-property property">nativeEvent</span><span class="token operator">:</span> AnyNativeEvent<span class="token punctuation">,</span>
  <span class="token literal-property property">targetInst</span><span class="token operator">:</span> <span class="token keyword">null</span> <span class="token operator">|</span> Fiber<span class="token punctuation">,</span>
  <span class="token literal-property property">targetContainer</span><span class="token operator">:</span> EventTarget<span class="token punctuation">,</span></span>
<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> nativeEventTarget <span class="token operator">=</span> <span class="token function">getEventTarget</span><span class="token punctuation">(</span>nativeEvent<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token literal-property property">dispatchQueue</span><span class="token operator">:</span> DispatchQueue <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

  <span class="token comment">// 事件对象的合成，收集事件到执行路径上</span>
  <span class="token function">extractEvents</span><span class="token punctuation">(</span>
    dispatchQueue<span class="token punctuation">,</span>
    domEventName<span class="token punctuation">,</span>
    targetInst<span class="token punctuation">,</span>
    nativeEvent<span class="token punctuation">,</span>
    nativeEventTarget<span class="token punctuation">,</span>
    eventSystemFlags<span class="token punctuation">,</span>
    targetContainer<span class="token punctuation">,</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 执行收集到的组件中真正的事件</span>
  <span class="token function">processDispatchQueue</span><span class="token punctuation">(</span>dispatchQueue<span class="token punctuation">,</span> eventSystemFlags<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个函数体可看成两部分：<strong>事件对象的合成和事件收集</strong> 、 <strong>事件执行</strong>，涵盖了上述三个过程。</p><p><code>dispatchQueue</code>，它承载了本次合成的事件对象和收集到事件执行路径上的事件处理函数。</p><p><code>extractEvents()</code>做了两件事：构造合成事件以及收集事件路径上的事件处理函数</p><p><code>accumulateSinglePhaseListeners</code>用来事件收集</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">accumulateSinglePhaseListeners</span><span class="token punctuation">(</span>
  <span class="token parameter"><span class="token literal-property property">targetFiber</span><span class="token operator">:</span> Fiber <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token literal-property property">dispatchQueue</span><span class="token operator">:</span> DispatchQueue<span class="token punctuation">,</span>
  <span class="token literal-property property">event</span><span class="token operator">:</span> ReactSyntheticEvent<span class="token punctuation">,</span>
  <span class="token literal-property property">inCapturePhase</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
  <span class="token literal-property property">accumulateTargetOnly</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span></span>
<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>

  <span class="token comment">// 根据事件名来识别是冒泡阶段的事件还是捕获阶段的事件</span>
  <span class="token keyword">const</span> bubbled <span class="token operator">=</span> event<span class="token punctuation">.</span>_reactName<span class="token punctuation">;</span>
  <span class="token keyword">const</span> captured <span class="token operator">=</span> bubbled <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">?</span> bubbled <span class="token operator">+</span> <span class="token string">&#39;Capture&#39;</span> <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 声明存放事件监听的数组</span>
  <span class="token keyword">const</span> <span class="token literal-property property">listeners</span><span class="token operator">:</span> Array<span class="token operator">&lt;</span>DispatchListener<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

  <span class="token comment">// 找到目标元素</span>
  <span class="token keyword">let</span> instance <span class="token operator">=</span> targetFiber<span class="token punctuation">;</span>

  <span class="token comment">// 从目标元素开始一直到root，累加所有的fiber对象和事件监听。</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>instance <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span>stateNode<span class="token punctuation">,</span> tag<span class="token punctuation">}</span> <span class="token operator">=</span> instance<span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>tag <span class="token operator">===</span> HostComponent <span class="token operator">&amp;&amp;</span> stateNode <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> currentTarget <span class="token operator">=</span> stateNode<span class="token punctuation">;</span>

      <span class="token comment">// 事件捕获</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>captured <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> inCapturePhase<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 从fiber中获取事件处理函数</span>
        <span class="token keyword">const</span> captureListener <span class="token operator">=</span> <span class="token function">getListener</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> captured<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>captureListener <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          listeners<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>
            <span class="token function">createDispatchListener</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> captureListener<span class="token punctuation">,</span> currentTarget<span class="token punctuation">)</span><span class="token punctuation">,</span>
          <span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 事件冒泡</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>bubbled <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>inCapturePhase<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 从fiber中获取事件处理函数</span>
        <span class="token keyword">const</span> bubbleListener <span class="token operator">=</span> <span class="token function">getListener</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> bubbled<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>bubbleListener <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          listeners<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>
            <span class="token function">createDispatchListener</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> bubbleListener<span class="token punctuation">,</span> currentTarget<span class="token punctuation">)</span><span class="token punctuation">,</span>
          <span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    instance <span class="token operator">=</span> instance<span class="token punctuation">.</span>return<span class="token punctuation">;</span><span class="token comment">// 其父节点</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 收集事件对象</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>listeners<span class="token punctuation">.</span>length <span class="token operator">!==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    dispatchQueue<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token function">createDispatchEntry</span><span class="token punctuation">(</span>event<span class="token punctuation">,</span> listeners<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>dispatchQueue的机构：</p><div class="language-dts line-numbers-mode" data-ext="dts"><pre class="language-dts"><code>[
  {
    event: SyntheticEvent,
    listeners: [ listener1, listener2, ... ]
  }
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>listeren就是遍历得到的事件处理函数，由于是同一个事件，listener会共享这个事件，比如传参的时候就会传入这个事件处理函数。</p><p>合成事件会将事件都绑定到root上，react17之前是document，在render阶段的completeWork阶段时会判断该prop是不是事件进行相应处理。在绑定过程中，会在root上绑定带有优先级的listerner，带有targetContainer,domEventName,listerner(这个listerner带有容器名和事件名)，在接下来触发事件的时候会有一个数组称他为执行路径，触发事件时，会从触发事件的那个元素开始一直往上收集绑定在fiber节点身上的事件，并push到执行路径里，事件收集完毕，事件开始执行，事件执行会根据是事件冒泡还是事件捕获来确定遍历顺序，每执行一个事件监听函数，就可以更改公用的合成事件上的currentTarget.</p><p>https://segmentfault.com/a/1190000039108951</p><h1 id="对函数式组件的理解" tabindex="-1"><a class="header-anchor" href="#对函数式组件的理解" aria-hidden="true">#</a> 对函数式组件的理解</h1><p>函数式组件的本质只是一个函数而已，只是经过react的封装，让他能够渲染成dom，因此每次更新和创建组件都是执行一次该函数，所以对hooks更应该从执行函数的角度来理解。函数式组件应该是一个纯函数。</p><h1 id="useeffect" tabindex="-1"><a class="header-anchor" href="#useeffect" aria-hidden="true">#</a> useEffect</h1><p>先提供一段简单的useEffect的代码</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> React<span class="token punctuation">,</span> <span class="token punctuation">{</span> useState<span class="token punctuation">,</span> useEffect <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react&quot;</span><span class="token punctuation">;</span>

<span class="token comment">// 该组件定时从服务器获取好友的在线状态</span>
<span class="token keyword">function</span> <span class="token function">FriendStatus</span><span class="token punctuation">(</span><span class="token parameter">props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>isOnline<span class="token punctuation">,</span> setIsOnline<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">function</span> <span class="token function">handleStatusChange</span><span class="token punctuation">(</span><span class="token parameter">status</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">setIsOnline</span><span class="token punctuation">(</span>status<span class="token punctuation">.</span>isOnline<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 在浏览器渲染结束后执行</span>
    ChatAPI<span class="token punctuation">.</span><span class="token function">subscribeToFriendStatus</span><span class="token punctuation">(</span>props<span class="token punctuation">.</span>friend<span class="token punctuation">.</span>id<span class="token punctuation">,</span> handleStatusChange<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 在每次渲染产生的 effect 执行之前执行</span>
    <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token function">cleanup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      ChatAPI<span class="token punctuation">.</span><span class="token function">unsubscribeFromFriendStatus</span><span class="token punctuation">(</span>props<span class="token punctuation">.</span>friend<span class="token punctuation">.</span>id<span class="token punctuation">,</span> handleStatusChange<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token comment">// 只有 props.friend.id 更新了才会重新执行这个 hook</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>props<span class="token punctuation">.</span>friend<span class="token punctuation">.</span>id<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>isOnline <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;Loading...&quot;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> isOnline <span class="token operator">?</span> <span class="token string">&quot;Online&quot;</span> <span class="token operator">:</span> <span class="token string">&quot;Offline&quot;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>useEffect可以看作是<code>componentDidMount/componentDidUpdate/componentWillUnmount</code> 这三个生命周期函数的替代。但不是完全相同。</p><p>useEffect叫做副作用函数，因此他应该是放副作用函数的hook，函数式组件是一个纯函数，因此，在有副作用的时候我们就需要用到useEffect，因此我们不能把useEffect和<code>componentDidMount/componentDidUpdate/componentWillUnmount</code> 这三个生命周期函数等同起来。</p><p>useEffect是异步调用的，componenDidMount是同步调用的。</p><p>react源码分为三个部分：</p><p>调度器</p><p>协调器</p><p>渲染器</p><p>协调器会为需要更新的fiber打上标签，并生成一条effectList，渲染器根据effectList执行对应的操作。当渲染器遍历到该fiber,并且有passive标记，那么就会执行其useEffect</p><p>而协调器会从上往下一次遍历，再从下往上遍历，在从下往上的过程中会生成effectList，因此effectList的顺序是从下往上的，因此当一个组件创建之后，会从下往上调用useEffect</p><p>useEffect有两个参数，第一个参数传入一个函数，第二个参数传入一个依赖数组，当依赖数组中的内容变化时，（可以简单地理解为vue中的watch，即使好多人认为不能这么理解）将会执行第一个参数中的函数，第一个参数的return必须是一个函数，用于组件销毁时调用。</p><p>依赖数组为空和不传入第二个参数的区别，不传入第二个参数就会在每次组件创建和组件更新时调用，而依赖数组为空只会在组件刚创建的时候调用。</p><h3 id="源码分析useeffect和uselayouteffect" tabindex="-1"><a class="header-anchor" href="#源码分析useeffect和uselayouteffect" aria-hidden="true">#</a> 源码分析useEffect和useLayoutEffect</h3><h4 id="hooks链表" tabindex="-1"><a class="header-anchor" href="#hooks链表" aria-hidden="true">#</a> hooks链表</h4><p>当函数组件进入render阶段时，会被<code>renderWithHooks</code>函数处理。函数组件作为一个函数，它的渲染其实就是函数调用，而函数组件又会调用React提供的hooks函数。初始挂载和更新时，所用的hooks函数是不同的，比如初次挂载时调用的<code>useEffect</code>，和后续更新时调用的<code>useEffect</code>，虽然都是同一个hook，但是因为在两个不同的渲染过程中调用它们，所以本质上他们两个是不一样的。这种不一样来源于函数组件要维护一个hooks的链表，初次挂载时要创建链表，后续更新的时候要更新链表。</p><p>每次函数组件调用hooks函数的时候，都会生成一个hook对象</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// hook对象</span>
<span class="token punctuation">{</span>
    <span class="token literal-property property">baseQueue</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">baseState</span><span class="token operator">:</span> <span class="token string">&#39;hook1&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">memoizedState</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">queue</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">baseQueue</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
        <span class="token literal-property property">baseState</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
        <span class="token literal-property property">memoizedState</span><span class="token operator">:</span> <span class="token string">&#39;hook2&#39;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token keyword">null</span>
        <span class="token literal-property property">queue</span><span class="token operator">:</span> <span class="token keyword">null</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每个hook对象的next指向下一个生成的hook对象形成一个hooks链表，hooks链表最终会放到fiber节点的memoizedState属性上。</p><p>挂载时，组件上没有任何hooks的信息，所以，这个过程主要是在fiber上创建hooks链表。</p><p>更新时，这时已经有了一个current 树，因此我们可以通过workInProgress.alternate,获取到current节点，再拿到memoizedState上的hooks链表，这样就可以获取到之前创建的hook对象，新的hook对象可以根据它来构建，还可以获得一些信息，比如useEffect的依赖项。</p><h4 id="effect数据结构" tabindex="-1"><a class="header-anchor" href="#effect数据结构" aria-hidden="true">#</a> Effect数据结构</h4><p>use(Layout)Effect会在调用后会创建一个effect对象，存储到hook.memorizedState上，不同的hooks函数放在memorizedState上的值是不同的</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token function-variable function">UseEffectExp</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">[</span> text<span class="token punctuation">,</span> setText <span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token string">&#39;hello&#39;</span><span class="token punctuation">)</span>
    <span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;effect1&#39;</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;destory1&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token function">useLayoutEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;effect2&#39;</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;destory2&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>effect<span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-497307089d2121befb7663e56d617989_r.jpg" alt="preview"></p><p>useState放的就是state值，而use(Layout)Effect放的就是effect对象</p><p>单个的effect对象包括以下几个属性：</p><ul><li>create: 传入use（Layout）Effect函数的第一个参数，即回调函数</li><li>destroy: 回调函数return的函数，在该effect销毁的时候执行</li><li>deps: 依赖项</li><li>next: 指向下一个effect</li><li>tag: effect的类型，区分是useEffect还是useLayoutEffect，以及是否需要更新</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>fiber.memoizedState ---&gt; useState hook
                             |
                             |
                            next
                             |
                             ↓
                        useEffect hook
                        memoizedState: useEffect的effect对象 ---&gt; useLayoutEffect的effect对象
                             |              ↑__________________________________|
                             |
                            next
                             |
                             ↓
                        useLayoutffect hook
                        memoizedState: useLayoutEffect的effect对象 ---&gt; useEffect的effect对象
                                            ↑___________________________________|
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>effect对象除了会挂载到fiber.memoizedState上,还会保存在fiber的updateQueue,updateQueue链表是在completeWork阶段根据props的不同而创建的链表，将来如果这个节点需要更新，那么就会遍历这个fiber节点的updateQueue。updateQueue是一个环状链表，挂载或者更新时会把effect链表放到updateQueue后面</p><h4 id="流程概述" tabindex="-1"><a class="header-anchor" href="#流程概述" aria-hidden="true">#</a> 流程概述</h4><p>基于上面的数据结构，对于use（Layout）Effect来说，React做的事情就是</p><ul><li>render阶段：函数组件开始渲染的时候，创建出对应的hook链表挂载到workInProgress的memoizedState上，并创建effect链表，但是基于上次和本次依赖项的比较结果， 创建的effect是有差异的。这一点暂且可以理解为：依赖项有变化，effect可以被处理，否则不会被处理。</li><li>commit阶段：异步调度useEffect，layout阶段同步处理useLayoutEffect的effect。等到commit阶段完成，更新应用到页面上之后，开始处理useEffect产生的effect。</li></ul><p>第二点提到了一个重点，就是useEffect和useLayoutEffect的执行时机不一样，前者被异步调度，当页面渲染完成后再去执行，不会阻塞页面渲染。 后者是在commit阶段新的DOM准备完成，但还未渲染到屏幕之前，同步执行。</p><h4 id="实现细节" tabindex="-1"><a class="header-anchor" href="#实现细节" aria-hidden="true">#</a> 实现细节</h4><p>在commit阶段,会有三个地方调度useEffect：</p><ul><li>commit开始时：这和useEffect异步调度的特点有关，它以一般的优先级被调度，这就意味着一旦上一次更新有更高优先级的任务进入到commit阶段，上一次任务的useEffect就有可能没得到执行。所以在本次更新开始前，需要先将之前的useEffect都执行掉，以保证本次调度的useEffect都是本次更新产生的。</li><li>beforeMutation阶段：这个是实打实地针对effectList上有副作用的节点，去异步调度useEffect。在实现上利用scheduler的异步调度函数：<code>scheduleCallback</code>，将执行useEffect的动作作为一个任务去调度，这个任务会异步调用。</li><li>layout阶段layout阶段填充effect执行数组：真正useEffect执行的时候，实际上是先执行上一次effect的销毁，再执行本次effect的创建。React用两个数组来分别存储销毁函数和 创建函数，这两个数组的填充就是在layout阶段，到时候循环释放执行两个数组中的函数即可。</li></ul><p>在填充effect执行数组时，只把有HasEffect tag的才会被添加进执行数组，这是因为在生成effect对象的时候，会根据依赖项是否有变化，来确定tag，如果没有变化，那么tag就是hooksFlags(useEffect或者useLayoutEffect),如果变化了就是HasEffect tag。</p><h4 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h4><p>在每次执行useEffect函数时，都会创建一个effect对象，但是挂载和更新时调用的是两个函数，render阶段，在挂载时会直接创建一个hook对象，并且创建effect对象挂载到hook对象还有updateQueue上，在更新时会根据hook对象上的effect对比前后两次的依赖项，如果依赖项有变化tag就会加入HookHasEffect标志位，接着把effect挂载到upateQueue上。commit阶段，在commit开始时由于useEffect是一般优先级被调度，因此可能会被打断，因此要先把之前的useEffect执行掉，beforeMutation会异步调度effectList上有副作用的节点，layout阶段会根据tag是否有HasEffectTag判断是否加入执行数组，先循环destory函数，再循环create函数。useLayoutEffect的destory和create分别在mutation和layout阶段同步执行。</p><p>https://zhuanlan.zhihu.com/p/346696902</p><h1 id="usememo和usecallback" tabindex="-1"><a class="header-anchor" href="#usememo和usecallback" aria-hidden="true">#</a> useMemo和useCallback</h1><p>useMemo和useCallback都是用来缓存的，由于每次状态改变都会重新执行一次App函数，但如果修改的状态和我们想要传递的值无关，我们就希望将其缓存起来</p><p>useCallback</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> useState<span class="token punctuation">,</span> useMemo <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">&quot;./styles.css&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>count<span class="token punctuation">,</span> setCount<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>total<span class="token punctuation">,</span> setTotal<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 没有使用 useMemo，即使是更新 total, countToString 也会重新计算</span>
  <span class="token keyword">const</span> countToString <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;countToString 被调用&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> count<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 使用了 useMemo, 只有 total 改变，才会重新计算</span>
  <span class="token keyword">const</span> totalToStringByMemo <span class="token operator">=</span> <span class="token function">useMemo</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;totalToStringByMemo 被调用&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> total <span class="token operator">+</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>total<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;App&quot;</span><span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span>h3<span class="token operator">&gt;</span>countToString<span class="token operator">:</span> <span class="token punctuation">{</span>countToString<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>h3<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span>h3<span class="token operator">&gt;</span>countToString<span class="token operator">:</span> <span class="token punctuation">{</span>totalToStringByMemo<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>h3<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span>button
        onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          <span class="token function">setCount</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">count</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> count <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">}</span>
      <span class="token operator">&gt;</span>
        Add Count
      <span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span>br <span class="token operator">/</span><span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span>button
        onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          <span class="token function">setTotal</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">total</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> total <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">}</span>
      <span class="token operator">&gt;</span>
        Add Total
      <span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>useMemo</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> React<span class="token punctuation">,</span> <span class="token punctuation">{</span> useCallback<span class="token punctuation">,</span> useEffect<span class="token punctuation">,</span> useState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">&quot;./styles.css&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>count<span class="token punctuation">,</span> setCount<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 使用 useCallBack 缓存</span>
  <span class="token keyword">const</span> handleCountAddByCallBack <span class="token operator">=</span> <span class="token function">useCallback</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">setCount</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">count</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> count <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 不缓存，每次 count 更新时都会重新创建</span>
  <span class="token keyword">const</span> <span class="token function-variable function">handleCountAdd</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">setCount</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">count</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> count <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>App<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h3</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">CountAddByChild1: </span><span class="token punctuation">{</span>count<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h3</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Child1</span></span> <span class="token attr-name">addByCallBack</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>handleCountAddByCallBack<span class="token punctuation">}</span></span> <span class="token attr-name">add</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>handleCountAdd<span class="token punctuation">}</span></span> <span class="token punctuation">/&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> Child1 <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">memo</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> add<span class="token punctuation">,</span> addByCallBack <span class="token punctuation">}</span> <span class="token operator">=</span> props<span class="token punctuation">;</span>
  
  <span class="token comment">// 没有缓存，由于每次都创建，memo 认为两次地址都不同，属于不同的函数，所以会触发 useEffect</span>
  <span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;Child1----addFcUpdate&quot;</span><span class="token punctuation">,</span> props<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>add<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 有缓存，memo 判定两次地址都相同，所以不触发 useEffect</span>
  <span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;Child1----addByCallBackFcUpdate&quot;</span><span class="token punctuation">,</span> props<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>addByCallBack<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>props<span class="token punctuation">.</span>add<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">+1</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span> <span class="token punctuation">/&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>props<span class="token punctuation">.</span>addByCallBack<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">+1(addByCallBack)</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="useref" tabindex="-1"><a class="header-anchor" href="#useref" aria-hidden="true">#</a> useRef</h1><p>我们点击按钮让stateNumber和numRef都加1</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function incrementAndDelayLogging() {
		  // 点击按钮 stateNumber + 1
        setStateNumber(stateNumber + 1)
		  // 同时 ref 对象的 current 属性值也 + 1
        numRef.current++
		  // 定时器函数中产生了闭包, 这里 stateNumber 的是组件更新前的 stateNumber 对象, 所以值一直会滞后 1(setState是异步的)
        setTimeout(
            () =&gt; alert(\`state: \${stateNumber} | ref: \${numRef.current}\`),
            1000
        )
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>useRef就是一个容器，它可以放dom节点,也可以放数据，在用来放数据的时候主要是用来获取由于异步操作加闭包造成的渲染不及时的问题，并且修改ref不会造成组件重新render。</p><h1 id="react-memo" tabindex="-1"><a class="header-anchor" href="#react-memo" aria-hidden="true">#</a> React.memo</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果组件在传入props相同情况下返回的是相同的，那么我们可以使用就React.memo。</p><p>React.memo和useCallback一定要搭配使用，缺少了一个可能会导致性能不降反升。</p><h1 id="usereducer" tabindex="-1"><a class="header-anchor" href="#usereducer" aria-hidden="true">#</a> useReducer</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const DemoUseReducer = ()=&gt;{
    /* number为更新后的state值,  dispatchNumbner 为当前的派发函数 */
   const [ number , dispatchNumbner ] = useReducer((state,action)=&gt;{
       const { payload , name  } = action
       /* return的值为新的state */
       switch(name){
           case &#39;add&#39;:
               return state + 1
           case &#39;sub&#39;:
               return state - 1 
           case &#39;reset&#39;:
             return payload       
       }
       return state
   },0)
   return &lt;div&gt;
      当前值：{ number }
      { /* 派发更新 */ }
      &lt;button onClick={()=&gt;dispatchNumbner({ name:&#39;add&#39; })} &gt;增加&lt;/button&gt;
      &lt;button onClick={()=&gt;dispatchNumbner({ name:&#39;sub&#39; })} &gt;减少&lt;/button&gt;
      &lt;button onClick={()=&gt;dispatchNumbner({ name:&#39;reset&#39; ,payload:666 })} &gt;赋值&lt;/button&gt;
      { /* 把dispatch 和 state 传递给子组件  */ }
      &lt;MyChildren  dispatch={ dispatchNumbner } State={{ number }} /&gt;
   &lt;/div&gt;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>useReducer会返回一个数组，数组的第一个是状态，第二个是dispatch，需要给useReducer传入一个回调函数，回调函数第一个是state，第二个是dispatch传入的数据，回调函数的返回值是新state</p><h1 id="usecontext" tabindex="-1"><a class="header-anchor" href="#usecontext" aria-hidden="true">#</a> useContext</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import React, { createContext, useContext, useReducer, useState } from &#39;react&#39;
import ReactDOM from &#39;react-dom&#39;

// 创造一个上下文
const C = createContext(null);

function App(){
  const [n,setN] = useState(0)
  return(
    // 指定上下文使用范围，使用provider,并传入读数据和写入据
    &lt;C.Provider value={{n,setN}}&gt;
      这是爷爷
      &lt;Baba&gt;&lt;/Baba&gt;
    &lt;/C.Provider&gt;
  )
}

function Baba(){
  return(
    &lt;div&gt;
      这是爸爸
      &lt;Child&gt;&lt;/Child&gt;
    &lt;/div&gt;
  )
}
function Child(){
  // 使用上下文，因为传入的是对象，则接受也应该是对象
  const {n,setN} = useContext(C)
  const add=()=&gt;{
    setN(n=&gt;n+1)
  };
  return(
    &lt;div&gt;
      这是儿子:n:{n}
      &lt;button onClick={add}&gt;+1&lt;/button&gt;
    &lt;/div&gt;
  )
}


ReactDOM.render(&lt;App /&gt;,document.getElementById(&#39;root&#39;));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="usestate" tabindex="-1"><a class="header-anchor" href="#usestate" aria-hidden="true">#</a> useState</h1><p>useState可以传入函数，其初始state是函数执行的返回值</p><h1 id="react-activation" tabindex="-1"><a class="header-anchor" href="#react-activation" aria-hidden="true">#</a> react-activation</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import React, { Component, createContext } from &#39;react&#39;

const { Provider, Consumer } = createContext()
const withScope = WrappedComponent =&gt; props =&gt; (
  &lt;Consumer&gt;{keep =&gt; &lt;WrappedComponent {...props} keep={keep} /&gt;}&lt;/Consumer&gt;
)
// 使用Context 拿到keep函数，用来修改AliveScope的state

export class AliveScope extends Component {
  nodes = {}
  state = {}

  keep = (id, children) =&gt;
    new Promise(resolve =&gt;
      this.setState(
        {
          [id]: { id, children }
        },
        () =&gt; resolve(this.nodes[id])
      )
    )

  render() {
    return (
      &lt;Provider value={this.keep}&gt;
        {this.props.children}
        // 将想要keepalive的组件打破层级关系，与app同层级渲染，后面会在keepalive组件中下面这个ref，并把下面的元素放到keepalive里面
        {Object.values(this.state).map(({ id, children }) =&gt; (
          &lt;div
            key={id}
            ref={node =&gt; {
              this.nodes[id] = node
            }}
          &gt;
             {children}
          &lt;/div&gt;
        ))}
      &lt;/Provider&gt;
    )
  }
}

@withScope // 高阶组件
class KeepAlive extends Component {
  constructor(props) {
    super(props)
    this.init(props)
  }

  init = async ({ id, children, keep }) =&gt; {
    const realContent = await keep(id, children)
    // 给div添加保存在Alivescope的children
    this.placeholder.appendChild(realContent)
  }

  render() {
    return (
    // 在这里div里面并没有内容，内容来源于init
      &lt;div
        ref={node =&gt; {
          this.placeholder = node
        }}
      /&gt;
    )
  }
}

export default KeepAlive

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>把keepalive 的children 保存到最上层的AliveScope里，再把keepalive的children渲染到和app同一层级下，接着在keepalive中拿到dom，通过appendChild放回keepalive组件中</p><h1 id="错误边界" tabindex="-1"><a class="header-anchor" href="#错误边界" aria-hidden="true">#</a> 错误边界</h1><p>过去，组件内的 JavaScript 错误会导致 React 的内部状态被破坏，并且在下一次渲染时产生可能无法追踪的错误。</p><p>部分 UI 的 JavaScript 错误不应该导致整个应用崩溃，为了解决这个问题，React 16 引入了一个新的概念 —— 错误边界。</p><p>相当于js的catch 但他是一个组件，如果一个class组件定义了getDerivedStateFromError()或componentDidCatch()生命周期，那么它就会被认定为是一个错误边界。当抛出错误后，请使用 <code>static getDerivedStateFromError()</code> 渲染备用 UI ，使用 <code>componentDidCatch()</code> 打印错误信息。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return &lt;h1&gt;Something went wrong.&lt;/h1&gt;;
    }

    return this.props.children; 
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后你可以将它作为一个常规组件去使用：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;ErrorBoundary&gt;
  &lt;MyWidget /&gt;
&lt;/ErrorBoundary&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,203),o=[p];function c(i,l){return s(),a("div",null,o)}const d=n(t,[["render",c],["__file","react.html.vue"]]);export{d as default};
