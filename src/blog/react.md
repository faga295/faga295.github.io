---
date: 2022-03-22 10:30:47
typora-copy-images-to: upload
---

# react源码架构

## React15架构

React15架构分为两层:

* reconciler(协调器)：负责找出组件变化
* renderer(渲染器)：负责操作dom，将变化的地方渲染到页面

### Reconciler

reconciler主要做了这么几件事：

* 执行函数式组件或者class组件的render方法，拿到其返回值的jsx生成虚拟DOM（虚拟DOM其实本质上就是js对象，其中包括了所有dom的属性，以及props，state）
* 通过深度优先遍历比较上次虚拟DOM与这次虚拟DOM的区别
* 通知renderer将变化的虚拟DOM渲染

### Renderer

有虚拟DOM的存在，就可以实现跨平台的功能，通过不同的渲染器，渲染在不同平台上。我们前端最熟悉的是负责在浏览器环境渲染的**Renderer** —— ReactDOM。

* `ReactNative (opens new window)`渲染器，渲染`App`原生组件
* `ReactTest (opens new window)`渲染器，渲染出纯`Js`对象用于测试
* `ReactArt (opens new window)`渲染器，渲染到Canvas, `SVG `或` VML (IE8)`

### React15架构的缺点

由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了16ms，用户交互就会卡顿。因此在React16版本提出了concurrent模式，该模式用可中断的异步更新替代同步更新。

## React16架构

React16架构可以分为三层：

- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入**Reconciler**
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

React16架构是在React15架构上增加了一个Scheduler，Scheduler做的事情就是当浏览器有时间的时候通知我们，因此在协调器里面代码改为了

```
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

通过浏览器是否有时间来判断是否应该终端递归

在React15中Reconciler与Renderer是交替工作的，检查到某个节点更新了就会交给Renderer渲染，在React16中，**Reconciler**与**Renderer**不再是交替工作。当**Scheduler**将任务交给**Reconciler**后，**Reconciler**会为变化的虚拟DOM打上代表增/删/更新的标记，类似这样：

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*    
```

整个**Scheduler**与**Reconciler**的工作都在内存中进行。只有当所有组件都完成**Reconciler**的工作，才会统一交给**Renderer**。

## Fiber结构

在`React15`及以前，`Reconciler`采用递归的方式创建虚拟DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。

为了解决这个问题，`React16`将**递归的无法中断的更新**重构为**异步的可中断更新**，由于曾经用于递归的**虚拟DOM**数据结构已经无法满足需要。于是，全新的`Fiber`架构应运而生。

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性(保存了本次更新该组件改变的状态，要执行的工作)
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

### Fiber双缓存

在React中最多会同时存在两颗`Fiber树`。当前屏幕上显示内容对应的`Fiber树`称为`current Fiber树`，正在内存中构建的`Fiber树`称为`workInProgress Fiber树,他们通过`alternate`属性连接。

```js
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

当`workInProgress Fiber树`构建完成交给`Renderer`渲染在页面上后，应用根节点的`current`指针指向`workInProgress Fiber树`，此时`workInProgress Fiber树`就变为`current Fiber树`。

每次状态更新都会产生新的`workInProgress Fiber树`，通过`current`与`workInProgress`的替换，完成`DOM`更新。

首次执行`ReactDOM.render`会创建`fiberRootNode`（源码中叫`fiberRoot`）和`rootFiber`。其中`fiberRootNode`是整个应用的根节点，`rootFiber`是`<App/>`所在组件树的根节点。

![rootFiber](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/rootfiber.png)

一个应用中只有一个fiberRoot，但可以有多个rootFiber，rootFiber是通过ReactDom.render创建的

## 深入理解jsx

`JSX`在编译时会被`Babel`编译为`React.createElement`方法。

```js
export function createElement(type, config, children) {
  let propName;

  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    // 将 config 处理后赋值给 props
    // ...省略
  }

  const childrenLength = arguments.length - 2;
  // 处理 children，会被赋值给props.children
  // ...省略

  // 处理 defaultProps
  // ...省略

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}

const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // 标记这是个 React Element
    $$typeof: REACT_ELEMENT_TYPE,

    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  };

  return element;
};
```

`React.createElement` 方法会返回一个包含组件数据的对象，对象有个参数`$$typeof: REACT_ELEMENT_TYPE`标记了该对象是个`React Element`

`JSX`是一种描述当前组件内容的数据结构，他不包含组件**schedule**、**reconcile**、**render**所需的相关信息。

比如如下信息就不包括在`JSX`中：

- 组件在更新中的`优先级`
- 组件的`state`
- 组件被打上的用于**Renderer**的`标记`

所以，在组件`mount`时，`Reconciler`根据`JSX`描述的组件内容生成组件对应的`Fiber节点`。

在`update`时，`Reconciler`将`JSX`与`Fiber节点`保存的数据对比，生成组件对应的`Fiber节点`，并根据对比结果为`Fiber节点`打上`标记`

## Render阶段

![react源码8.1](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/20210529105753.png)

`render阶段` 的入口函数是`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot` 这取决于同步更新还是异步更新。

```js
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

`performConcurrentWorkOnRoot` 多了个判断浏览器帧是否有时间。`shouldYield`会终止循环，知道浏览器有空闲时间后再继续遍历。

`performUnitOfWork` 方法会创建下一个Fiber节点，并将workInProgress与其子Fiber节点连接。`performUnitOfwork`分为两个过程，“递”和“归”

**递阶段:**

从`rootFiber`向下深度优先遍历，并调用`beginWork`方法。

该方法做的事情是为传入的Fiber节点创建其子Fiber节点，并将两个Fiber节点连接起来。

当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。

**归过程:**

在“归”阶段会调用`completeWork`处理`Fiber节点`。当某个`Fiber节点`执行完`completeWork`，如果其存在`兄弟Fiber节点`（即`fiber.sibling !== null`），会进入其`兄弟Fiber`的“递”阶段。

如果不存在`兄弟Fiber`，会进入`父级Fiber`的“归”阶段。

“递”和“归”阶段会交错执行直到“归”到`rootFiber`。至此，`render阶段`的工作就结束了。

### beginwork

![image-20220226153155497](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/image-20220226153155497.png)

`beginWork`的工作可以分为两部分：

- `update`时：如果`current`存在，在满足一定条件时可以复用`current`节点，这样就能克隆`current.child`作为`workInProgress.child`，而不需要新建`workInProgress.child`。如果不能复用就进入到reconcileChildren，通过diff算法生成带effectTag的子Fiber节点
- `mount`时：除`fiberRootNode`以外，`current === null`。会根据`fiber.tag`不同，创建不同类型的`子Fiber节点`。mount会直接进入到reconcileChildren函数，并且生成其子节点。

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {

  // update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）
  if (current !== null) {
    // ...省略

    // 复用current
    return bailoutOnAlreadyFinishedWork(
      current,
      workInProgress,
      renderLanes,
    );
  } else {
    didReceiveUpdate = false;
  }

  // mount时：根据tag不同，创建不同的子Fiber节点
  switch (workInProgress.tag) {
    case IndeterminateComponent: 
      // ...省略
    case LazyComponent: 
      // ...省略
    case FunctionComponent: 
      // ...省略
    case ClassComponent: 
      // ...省略
    case HostRoot:
      // ...省略
    case HostComponent:
      // ...省略
    case HostText:
      // ...省略
    // ...省略其他类型
  }
}
```

#### diff算法

diff算法需要判断新节点是不是单节点，单节点只有两种情况oldfiber链是否为空，如果为空那就新建一个节点，如果不为空，就找到和之前key相同的节点，删除其余节点

多节点则需要分为四种情况：节点更新，新增节点，删除节点，节点移动，多节点更新需要经过最多三轮的遍历（不过感觉是两轮的样子），每一轮都是上轮结束的断点的继续。

第一轮遍历会从头开始遍历newChildren，会逐个与oldFiber链中的节点进行比较，如果说key和tag都没有变化，那么就clone props更新的节点，props使用新的props，实现节点更新。

有变化则认为不是节点更新，直接进入下一轮循环。

我们称保留原位的节点为固定节点，第一轮遍历如果没有跳出循环的话就会设置一个lastPlaceIndex，用来记录最右边的固定节点。

旧： A - B - C - `D - E`
新： A - B - C

删除节点：当新节点遍历完之后如果oldFibers还没遍历完，就会删除后续没遍历完的节点。

旧： A - B - C
新： A - B - C - `D - E`

新增节点：和删除节点类似，如果新节点没遍历完，那么新增后续节点。

旧 A - B - `C - D - E - F`
新 A - B - `D - C - E`

节点移动：先将剩余oldFibers放入key为键，值为oldFiber节点的map中，成为existingChildren.	

开始遍历newChildren，如果oldFiber在lastPlaceIndex右边，则代表他对顺序没有影响,则更新lastPlaceIndex = max(index,lastPlaceIndex)，接着删除map中的节点,如果oldFiber的index<lastPlaceIndex,那么认为它是需要移动的，把它移动到最右端，删除map中的节点。如果遍历完成之后，existingChildren中还有节点，那么就直接删除，同样，如果有新的节点（existingChildren中没有的）那么就会新增这个节点。

#### effectTag

`effectTag`是Fiber的一个属性，记录了commit阶段需要对其进行的操作。

```js
// DOM需要插入到页面中
export const Placement = /*                */ 0b00000000000010;
// DOM需要更新
export const Update = /*                   */ 0b00000000000100;
// DOM需要插入到页面中并更新
export const PlacementAndUpdate = /*       */ 0b00000000000110;
// DOM需要删除
export const Deletion = /*                 */ 0b00000000001000;
```

如果想要通知`Renderer`要操作Fiber对应的DOM节点，那么就需要你有fiber有对应的DOM节点以及effectTag上有对应的操作，但是在mount时`fiber.stateNode===null`,并且在`reconcileChildren`中也没有为其添加effectTag，那么首屏渲染该如何完成呢？

fiber.stateNode会在completeWork的时候创建，但mount时是不会给每个Fiber的`effectTag`赋值`placement`的，因为在commit阶段每次进行一次插入操作的效率是很低的，为了解决这个问题，在`mount`时只有`rootFiber`会赋值`Placement effectTag`，在`commit阶段`只会执行一次插入操作。

### completeWork

#### update

update时Fiber节点已经存在对应DOM节点，因此只需要处理props，比如：

- `onClick`、`onChange`等回调函数的注册
- 处理`style prop`
- 处理`DANGEROUSLY_SET_INNER_HTML prop`
- 处理`children prop`

```js
if (current !== null && workInProgress.stateNode != null) {
  // update的情况
  updateHostComponent(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance,
  );
}
```

被处理完的props会被赋值给`workInProgress.updateQueue`,并最终会在commit阶段被渲染在页面上。

```ts
workInProgress.updateQueue = (updatePayload: any);
```

`updatePayload`为数组形式，偶数记录了props的key，奇数记录了props的value

#### mount

同样，我们省略了不相关的逻辑。可以看到，`mount`时的主要逻辑包括三个：

- 为`Fiber节点`生成对应的`DOM节点`
- 将子孙`DOM节点`插入刚生成的`DOM节点`中
- 与`update`逻辑中的`updateHostComponent`类似的处理`props`的过程

```js
const currentHostContext = getHostContext();
// 为fiber创建对应DOM节点
const instance = createInstance(
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
    workInProgress,
  );
// 将子孙DOM节点插入刚生成的DOM节点中
appendAllChildren(instance, workInProgress, false, false);
// DOM节点赋值给fiber.stateNode
workInProgress.stateNode = instance;

// 与update逻辑中的updateHostComponent类似的处理props的过程
if (
  finalizeInitialChildren(
    instance,
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
  )
) {
  markUpdate(workInProgress);
}
```

在归操作的过程中每次都会将生成自己的DOM节点，接着把子DOM节点插入刚生成的DOM节点中，这样在归操作结束后，我们就已经构建好了一个DOM树，这时只需要在rootFiber加上Placement effectTag就可以把整颗DOM树添加到页面中去了。

#### effectList

有一个问题：commit阶段的任务是修改的需要操作的Fiber节点对应的DOM节点，但是commit阶段需要再次遍历Fiber树查看其effectTag来判断需要如何更新吗，显然这样效率很低。

为了解决这个问题，在`completeWork`的上层函数`completeUnitOfWork`中，每个执行完`completeWork`且存在`effectTag`的`Fiber节点`会被保存在一条被称为`effectList`的单向链表中。

render阶段流程结束，将fiberRoot传入`commitRoot()`中，开始commit阶段

## commit阶段

`commit`阶段的主要工作（即`Renderer`的工作流程）分为三部分：

- before mutation阶段（执行`DOM`操作前）
- mutation阶段（执行`DOM`操作）
- layout阶段（执行`DOM`操作后）

# 合成事件

## 为什么需要有合成事件

* 进行浏览器兼容，实现更好的跨平台

  React 采用的是顶层事件代理机制，能够保证冒泡一致性，可以跨浏览器执行。React 提供的合成事件用来抹平不同浏览器事件对象之间的差异，将不同平台事件模拟合成事件。

* 避免垃圾回收

  事件对象可能会被频繁创建和回收，因此 React 引入**事件池**，在事件池中获取或释放事件对象。**即 React 事件对象不会被释放掉，而是存放进一个数组中，当事件触发，就从这个数组中弹出，避免频繁地去创建和销毁(垃圾回收)**。

* 方便事件统一管理和事务机制



* |                  |               原生事件               |               React 事件               |
  | ---------------- | :----------------------------------: | :------------------------------------: |
  | 事件名称命名方式 | 名称全部小写<br/>（onclick, onblur） | 名称采用小驼峰<br/>（onClick, onBlur） |
  | 事件处理函数语法 |                字符串                |                  函数                  |
  | 阻止默认行为方式 |           事件返回 `false`           |     使用 `e.preventDefault()` 方法     |

## 合成事件触发流程

当真实 DOM 元素触发事件，会冒泡到 `document` 对象后，再处理 React 事件；所以会先执行原生事件，然后处理 React 事件；最后真正执行 `document` 上挂载的事件。采用的是事件委托。

## React事件池

每次我们使用事件对象，在函数执行后会通过releaseTopLevelCallbackBookKeeping将事件对象释放到事件池中，这样的好处就是	不用每次都创建事件对象，可以从事件池中取出一个事件源对象进行复用，在事件处理函数执行完毕后,会释放事件对象到事件池中，清空属性，这就是`setTimeout`中打印为什么是`null`的原因了。

## 事件注册

在源码中提到过，render阶段的`completeWork`会对Fiber节点的props进行处理,这里就包括了对事件的处理

```javascript
function setInitialDOMProperties(
  tag: string,
  domElement: Element,
  rootContainerElement: Element | Document,
  nextProps: Object,
  isCustomComponentTag: boolean,
): void {
  for (const propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) {
      ...
    } else if (registrationNameDependencies.hasOwnProperty(propKey)) {
        // 如果propKey属于事件类型，则进行事件绑定
        ensureListeningTo(rootContainerElement, propKey, domElement);
      }
    }
  }
}
```

> registrationNameDependencies是一个对象，用来判断该props是否为一个事件。

`ensureListerningTo()`函数来执行事件绑定，他会通过事件名称创建不同的优先级Listener（root上绑定的就是这个带有优先级的监听器），还会根据名称判断是在捕获还是冒泡阶段触发

```javascript
  // 根据事件名称，创建不同优先级的事件监听器。
  let listener = createEventListenerWrapperWithPriority(
    targetContainer,
    domEventName,
    eventSystemFlags,
    listenerPriority,
  );

  // 绑定事件
  if (isCapturePhaseListener) {
    ...
    unsubscribeListener = addEventCaptureListener(
      targetContainer,
      domEventName,
      listener,
    );
  } else {
    ...
    unsubscribeListener = addEventBubbleListener(
      targetContainer,
      domEventName,
      listener,
    );

  }
```

## 事件触发

事件触发的流程：首先是对事件对象的合成

```javascript
  // 构造合成事件对象
  const event = new SyntheticEvent(
    reactName,
    null,
    nativeEvent,
    nativeEventTarget,
    EventInterface,
  );
```

原生事件只是合成事件的一个属性，它还包括更多的属性，但说白了这和就是用来描述这个事件的，比如说位置啊，组件名啊啥的。**事件对象合成**完毕之后，会从触发该事件的节点一直往上，判断是否有绑定这个事件，如果有那就把它的事件处理函数收集起来push进一个数组（**执行路径**）中，**事件执行**时这些事件处理函数会共用这同一个合成事件，并且改变其currentTarget，以及阻止其冒泡。

当我们点击了一个按钮，listener就调用了`dispatchEventsForPlugins`函数

```javascript
function dispatchEventsForPlugins(
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  nativeEvent: AnyNativeEvent,
  targetInst: null | Fiber,
  targetContainer: EventTarget,
): void {
  const nativeEventTarget = getEventTarget(nativeEvent);
  const dispatchQueue: DispatchQueue = [];

  // 事件对象的合成，收集事件到执行路径上
  extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer,
  );

  // 执行收集到的组件中真正的事件
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}
```

这个函数体可看成两部分：**事件对象的合成和事件收集** 、 **事件执行**，涵盖了上述三个过程。

`dispatchQueue`，它承载了本次合成的事件对象和收集到事件执行路径上的事件处理函数。

`extractEvents()`做了两件事：构造合成事件以及收集事件路径上的事件处理函数

`accumulateSinglePhaseListeners`用来事件收集

```javascript
export function accumulateSinglePhaseListeners(
  targetFiber: Fiber | null,
  dispatchQueue: DispatchQueue,
  event: ReactSyntheticEvent,
  inCapturePhase: boolean,
  accumulateTargetOnly: boolean,
): void {

  // 根据事件名来识别是冒泡阶段的事件还是捕获阶段的事件
  const bubbled = event._reactName;
  const captured = bubbled !== null ? bubbled + 'Capture' : null;

  // 声明存放事件监听的数组
  const listeners: Array<DispatchListener> = [];

  // 找到目标元素
  let instance = targetFiber;

  // 从目标元素开始一直到root，累加所有的fiber对象和事件监听。
  while (instance !== null) {
    const {stateNode, tag} = instance;

    if (tag === HostComponent && stateNode !== null) {
      const currentTarget = stateNode;

      // 事件捕获
      if (captured !== null && inCapturePhase) {
        // 从fiber中获取事件处理函数
        const captureListener = getListener(instance, captured);
        if (captureListener != null) {
          listeners.push(
            createDispatchListener(instance, captureListener, currentTarget),
          );
        }
      }

      // 事件冒泡
      if (bubbled !== null && !inCapturePhase) {
        // 从fiber中获取事件处理函数
        const bubbleListener = getListener(instance, bubbled);
        if (bubbleListener != null) {
          listeners.push(
            createDispatchListener(instance, bubbleListener, currentTarget),
          );
        }
      }
    }
    instance = instance.return;// 其父节点
  }
  // 收集事件对象
  if (listeners.length !== 0) {
    dispatchQueue.push(createDispatchEntry(event, listeners));
  }
}
```

dispatchQueue的机构：

```dts
[
  {
    event: SyntheticEvent,
    listeners: [ listener1, listener2, ... ]
  }
]
```

listeren就是遍历得到的事件处理函数，由于是同一个事件，listener会共享这个事件，比如传参的时候就会传入这个事件处理函数。



合成事件会将事件都绑定到root上，react17之前是document，在render阶段的completeWork阶段时会判断该prop是不是事件进行相应处理。在绑定过程中，会在root上绑定带有优先级的listerner，带有targetContainer,domEventName,listerner(这个listerner带有容器名和事件名)，在接下来触发事件的时候会有一个数组称他为执行路径，触发事件时，会从触发事件的那个元素开始一直往上收集绑定在fiber节点身上的事件，并push到执行路径里，事件收集完毕，事件开始执行，事件执行会根据是事件冒泡还是事件捕获来确定遍历顺序，每执行一个事件监听函数，就可以更改公用的合成事件上的currentTarget.

https://segmentfault.com/a/1190000039108951

# 对函数式组件的理解

函数式组件的本质只是一个函数而已，只是经过react的封装，让他能够渲染成dom，因此每次更新和创建组件都是执行一次该函数，所以对hooks更应该从执行函数的角度来理解。函数式组件应该是一个纯函数。

# useEffect

先提供一段简单的useEffect的代码

```javascript
import React, { useState, useEffect } from "react";

// 该组件定时从服务器获取好友的在线状态
function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    // 在浏览器渲染结束后执行
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    // 在每次渲染产生的 effect 执行之前执行
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };

    // 只有 props.friend.id 更新了才会重新执行这个 hook
  }, [props.friend.id]);

  if (isOnline === null) {
    return "Loading...";
  }
  return isOnline ? "Online" : "Offline";
}
```

useEffect可以看作是`componentDidMount/componentDidUpdate/componentWillUnmount` 这三个生命周期函数的替代。但不是完全相同。

useEffect叫做副作用函数，因此他应该是放副作用函数的hook，函数式组件是一个纯函数，因此，在有副作用的时候我们就需要用到useEffect，因此我们不能把useEffect和`componentDidMount/componentDidUpdate/componentWillUnmount` 这三个生命周期函数等同起来。

useEffect是异步调用的，componenDidMount是同步调用的。

react源码分为三个部分：

调度器

协调器

渲染器

协调器会为需要更新的fiber打上标签，并生成一条effectList，渲染器根据effectList执行对应的操作。当渲染器遍历到该fiber,并且有passive标记，那么就会执行其useEffect

而协调器会从上往下一次遍历，再从下往上遍历，在从下往上的过程中会生成effectList，因此effectList的顺序是从下往上的，因此当一个组件创建之后，会从下往上调用useEffect

useEffect有两个参数，第一个参数传入一个函数，第二个参数传入一个依赖数组，当依赖数组中的内容变化时，（可以简单地理解为vue中的watch，即使好多人认为不能这么理解）将会执行第一个参数中的函数，第一个参数的return必须是一个函数，用于组件销毁时调用。

依赖数组为空和不传入第二个参数的区别，不传入第二个参数就会在每次组件创建和组件更新时调用，而依赖数组为空只会在组件刚创建的时候调用。

### 源码分析useEffect和useLayoutEffect

#### hooks链表

当函数组件进入render阶段时，会被`renderWithHooks`函数处理。函数组件作为一个函数，它的渲染其实就是函数调用，而函数组件又会调用React提供的hooks函数。初始挂载和更新时，所用的hooks函数是不同的，比如初次挂载时调用的`useEffect`，和后续更新时调用的`useEffect`，虽然都是同一个hook，但是因为在两个不同的渲染过程中调用它们，所以本质上他们两个是不一样的。这种不一样来源于函数组件要维护一个hooks的链表，初次挂载时要创建链表，后续更新的时候要更新链表。

每次函数组件调用hooks函数的时候，都会生成一个hook对象

```js
// hook对象
{
    baseQueue: null,
    baseState: 'hook1',
    memoizedState: null,
    queue: null,
    next: {
        baseQueue: null,
        baseState: null,
        memoizedState: 'hook2',
        next: null
        queue: null
    }
}
```

每个hook对象的next指向下一个生成的hook对象形成一个hooks链表，hooks链表最终会放到fiber节点的memoizedState属性上。

挂载时，组件上没有任何hooks的信息，所以，这个过程主要是在fiber上创建hooks链表。

更新时，这时已经有了一个current 树，因此我们可以通过workInProgress.alternate,获取到current节点，再拿到memoizedState上的hooks链表，这样就可以获取到之前创建的hook对象，新的hook对象可以根据它来构建，还可以获得一些信息，比如useEffect的依赖项。

#### Effect数据结构

use(Layout)Effect会在调用后会创建一个effect对象，存储到hook.memorizedState上，不同的hooks函数放在memorizedState上的值是不同的

```js
const UseEffectExp = () => {
    const [ text, setText ] = useState('hello')
    useEffect(() => {
        console.log('effect1')
        return () => {
            console.log('destory1');
        }
    })
    useLayoutEffect(() => {
        console.log('effect2')
        return () => {
            console.log('destory2');
        }
    })
    return <div>effect</div>
}
```

![preview](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/v2-497307089d2121befb7663e56d617989_r.jpg)

useState放的就是state值，而use(Layout)Effect放的就是effect对象

单个的effect对象包括以下几个属性：

- create: 传入use（Layout）Effect函数的第一个参数，即回调函数
- destroy: 回调函数return的函数，在该effect销毁的时候执行
- deps: 依赖项
- next: 指向下一个effect
- tag: effect的类型，区分是useEffect还是useLayoutEffect，以及是否需要更新

```text
fiber.memoizedState ---> useState hook
                             |
                             |
                            next
                             |
                             ↓
                        useEffect hook
                        memoizedState: useEffect的effect对象 ---> useLayoutEffect的effect对象
                             |              ↑__________________________________|
                             |
                            next
                             |
                             ↓
                        useLayoutffect hook
                        memoizedState: useLayoutEffect的effect对象 ---> useEffect的effect对象
                                            ↑___________________________________|
```

effect对象除了会挂载到fiber.memoizedState上,还会保存在fiber的updateQueue,updateQueue链表是在completeWork阶段根据props的不同而创建的链表，将来如果这个节点需要更新，那么就会遍历这个fiber节点的updateQueue。updateQueue是一个环状链表，挂载或者更新时会把effect链表放到updateQueue后面



#### 流程概述

基于上面的数据结构，对于use（Layout）Effect来说，React做的事情就是

- render阶段：函数组件开始渲染的时候，创建出对应的hook链表挂载到workInProgress的memoizedState上，并创建effect链表，但是基于上次和本次依赖项的比较结果， 创建的effect是有差异的。这一点暂且可以理解为：依赖项有变化，effect可以被处理，否则不会被处理。
- commit阶段：异步调度useEffect，layout阶段同步处理useLayoutEffect的effect。等到commit阶段完成，更新应用到页面上之后，开始处理useEffect产生的effect。

第二点提到了一个重点，就是useEffect和useLayoutEffect的执行时机不一样，前者被异步调度，当页面渲染完成后再去执行，不会阻塞页面渲染。 后者是在commit阶段新的DOM准备完成，但还未渲染到屏幕之前，同步执行。

#### 实现细节

在commit阶段,会有三个地方调度useEffect：

* commit开始时：这和useEffect异步调度的特点有关，它以一般的优先级被调度，这就意味着一旦上一次更新有更高优先级的任务进入到commit阶段，上一次任务的useEffect就有可能没得到执行。所以在本次更新开始前，需要先将之前的useEffect都执行掉，以保证本次调度的useEffect都是本次更新产生的。
* beforeMutation阶段：这个是实打实地针对effectList上有副作用的节点，去异步调度useEffect。在实现上利用scheduler的异步调度函数：`scheduleCallback`，将执行useEffect的动作作为一个任务去调度，这个任务会异步调用。
* layout阶段layout阶段填充effect执行数组：真正useEffect执行的时候，实际上是先执行上一次effect的销毁，再执行本次effect的创建。React用两个数组来分别存储销毁函数和 创建函数，这两个数组的填充就是在layout阶段，到时候循环释放执行两个数组中的函数即可。

在填充effect执行数组时，只把有HasEffect tag的才会被添加进执行数组，这是因为在生成effect对象的时候，会根据依赖项是否有变化，来确定tag，如果没有变化，那么tag就是hooksFlags(useEffect或者useLayoutEffect),如果变化了就是HasEffect tag。

#### 总结

在每次执行useEffect函数时，都会创建一个effect对象，但是挂载和更新时调用的是两个函数，render阶段，在挂载时会直接创建一个hook对象，并且创建effect对象挂载到hook对象还有updateQueue上，在更新时会根据hook对象上的effect对比前后两次的依赖项，如果依赖项有变化tag就会加入HookHasEffect标志位，接着把effect挂载到upateQueue上。commit阶段，在commit开始时由于useEffect是一般优先级被调度，因此可能会被打断，因此要先把之前的useEffect执行掉，beforeMutation会异步调度effectList上有副作用的节点，layout阶段会根据tag是否有HasEffectTag判断是否加入执行数组，先循环destory函数，再循环create函数。useLayoutEffect的destory和create分别在mutation和layout阶段同步执行。

https://zhuanlan.zhihu.com/p/346696902

# useMemo和useCallback

useMemo和useCallback都是用来缓存的，由于每次状态改变都会重新执行一次App函数，但如果修改的状态和我们想要传递的值无关，我们就希望将其缓存起来



useCallback

```javascript
import { useState, useMemo } from "react";
import "./styles.css";

export default function App() {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  // 没有使用 useMemo，即使是更新 total, countToString 也会重新计算
  const countToString = (() => {
    console.log("countToString 被调用");
    return count.toString();
  })();

  // 使用了 useMemo, 只有 total 改变，才会重新计算
  const totalToStringByMemo = useMemo(() => {
    console.log("totalToStringByMemo 被调用");
    return total + "";
  }, [total]);

  return (
    <div className="App">
      <h3>countToString: {countToString}</h3>
      <h3>countToString: {totalToStringByMemo}</h3>
      <button
        onClick={() => {
          setCount((count) => count + 1);
        }}
      >
        Add Count
      </button>
      <br />
      <button
        onClick={() => {
          setTotal((total) => total + 1);
        }}
      >
        Add Total
      </button>
    </div>
  );
}
```

useMemo

```jsx
import React, { useCallback, useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [count, setCount] = useState(0);

  // 使用 useCallBack 缓存
  const handleCountAddByCallBack = useCallback(() => {
    setCount((count) => count + 1);
  }, []);

  // 不缓存，每次 count 更新时都会重新创建
  const handleCountAdd = () => {
    setCount((count) => count + 1);
  };

  return (
    <div className="App">
      <h3>CountAddByChild1: {count}</h3>
      <Child1 addByCallBack={handleCountAddByCallBack} add={handleCountAdd} />
    </div>
  );
}

const Child1 = React.memo(function (props) {
  const { add, addByCallBack } = props;
  
  // 没有缓存，由于每次都创建，memo 认为两次地址都不同，属于不同的函数，所以会触发 useEffect
  useEffect(() => {
    console.log("Child1----addFcUpdate", props);
  }, [add]);

  // 有缓存，memo 判定两次地址都相同，所以不触发 useEffect
  useEffect(() => {
    console.log("Child1----addByCallBackFcUpdate", props);
  }, [addByCallBack]);

  return (
    <div>
      <button onClick={props.add}>+1</button>
      <br />
      <button onClick={props.addByCallBack}>+1(addByCallBack)</button>
    </div>
  );
});
```

# useRef

我们点击按钮让stateNumber和numRef都加1

```
function incrementAndDelayLogging() {
		  // 点击按钮 stateNumber + 1
        setStateNumber(stateNumber + 1)
		  // 同时 ref 对象的 current 属性值也 + 1
        numRef.current++
		  // 定时器函数中产生了闭包, 这里 stateNumber 的是组件更新前的 stateNumber 对象, 所以值一直会滞后 1(setState是异步的)
        setTimeout(
            () => alert(`state: ${stateNumber} | ref: ${numRef.current}`),
            1000
        )
 }
```

useRef就是一个容器，它可以放dom节点,也可以放数据，在用来放数据的时候主要是用来获取由于异步操作加闭包造成的渲染不及时的问题，并且修改ref不会造成组件重新render。

# React.memo

```
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
```

如果组件在传入props相同情况下返回的是相同的，那么我们可以使用就React.memo。

React.memo和useCallback一定要搭配使用，缺少了一个可能会导致性能不降反升。

# useReducer

```
const DemoUseReducer = ()=>{
    /* number为更新后的state值,  dispatchNumbner 为当前的派发函数 */
   const [ number , dispatchNumbner ] = useReducer((state,action)=>{
       const { payload , name  } = action
       /* return的值为新的state */
       switch(name){
           case 'add':
               return state + 1
           case 'sub':
               return state - 1 
           case 'reset':
             return payload       
       }
       return state
   },0)
   return <div>
      当前值：{ number }
      { /* 派发更新 */ }
      <button onClick={()=>dispatchNumbner({ name:'add' })} >增加</button>
      <button onClick={()=>dispatchNumbner({ name:'sub' })} >减少</button>
      <button onClick={()=>dispatchNumbner({ name:'reset' ,payload:666 })} >赋值</button>
      { /* 把dispatch 和 state 传递给子组件  */ }
      <MyChildren  dispatch={ dispatchNumbner } State={{ number }} />
   </div>
}

```

useReducer会返回一个数组，数组的第一个是状态，第二个是dispatch，需要给useReducer传入一个回调函数，回调函数第一个是state，第二个是dispatch传入的数据，回调函数的返回值是新state

# useContext

```
import React, { createContext, useContext, useReducer, useState } from 'react'
import ReactDOM from 'react-dom'

// 创造一个上下文
const C = createContext(null);

function App(){
  const [n,setN] = useState(0)
  return(
    // 指定上下文使用范围，使用provider,并传入读数据和写入据
    <C.Provider value={{n,setN}}>
      这是爷爷
      <Baba></Baba>
    </C.Provider>
  )
}

function Baba(){
  return(
    <div>
      这是爸爸
      <Child></Child>
    </div>
  )
}
function Child(){
  // 使用上下文，因为传入的是对象，则接受也应该是对象
  const {n,setN} = useContext(C)
  const add=()=>{
    setN(n=>n+1)
  };
  return(
    <div>
      这是儿子:n:{n}
      <button onClick={add}>+1</button>
    </div>
  )
}


ReactDOM.render(<App />,document.getElementById('root'));
```

# useState

useState可以传入函数，其初始state是函数执行的返回值



# react-activation

```
import React, { Component, createContext } from 'react'

const { Provider, Consumer } = createContext()
const withScope = WrappedComponent => props => (
  <Consumer>{keep => <WrappedComponent {...props} keep={keep} />}</Consumer>
)
// 使用Context 拿到keep函数，用来修改AliveScope的state

export class AliveScope extends Component {
  nodes = {}
  state = {}

  keep = (id, children) =>
    new Promise(resolve =>
      this.setState(
        {
          [id]: { id, children }
        },
        () => resolve(this.nodes[id])
      )
    )

  render() {
    return (
      <Provider value={this.keep}>
        {this.props.children}
        // 将想要keepalive的组件打破层级关系，与app同层级渲染，后面会在keepalive组件中下面这个ref，并把下面的元素放到keepalive里面
        {Object.values(this.state).map(({ id, children }) => (
          <div
            key={id}
            ref={node => {
              this.nodes[id] = node
            }}
          >
             {children}
          </div>
        ))}
      </Provider>
    )
  }
}

@withScope // 高阶组件
class KeepAlive extends Component {
  constructor(props) {
    super(props)
    this.init(props)
  }

  init = async ({ id, children, keep }) => {
    const realContent = await keep(id, children)
    // 给div添加保存在Alivescope的children
    this.placeholder.appendChild(realContent)
  }

  render() {
    return (
    // 在这里div里面并没有内容，内容来源于init
      <div
        ref={node => {
          this.placeholder = node
        }}
      />
    )
  }
}

export default KeepAlive

```

把keepalive 的children 保存到最上层的AliveScope里，再把keepalive的children渲染到和app同一层级下，接着在keepalive中拿到dom，通过appendChild放回keepalive组件中

# 错误边界

过去，组件内的 JavaScript 错误会导致 React 的内部状态被破坏，并且在下一次渲染时产生可能无法追踪的错误。

部分 UI 的 JavaScript 错误不应该导致整个应用崩溃，为了解决这个问题，React 16 引入了一个新的概念 —— 错误边界。

相当于js的catch 但他是一个组件，如果一个class组件定义了getDerivedStateFromError()或componentDidCatch()生命周期，那么它就会被认定为是一个错误边界。当抛出错误后，请使用 `static getDerivedStateFromError()` 渲染备用 UI ，使用 `componentDidCatch()` 打印错误信息。

```
class ErrorBoundary extends React.Component {
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
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

然后你可以将它作为一个常规组件去使用：

```
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```
