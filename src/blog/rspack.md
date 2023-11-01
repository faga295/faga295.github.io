---
title: rspack源码解析 
date: 2023-11-01 
tags: rspack webpack 
---
# rspack源码解析

## Build

webpack的构建流程简单而言就是从`entry dependency`出发开始构建module树，每一个module会先扫描它的`dependency`，这些`dependency`有些是普通的模块js，有些是特殊的`dependency`，例如用于`esm`的`import dependency`, 接着这些模块会递归的进行`dependency`的收集，最终构建出`module graph`以及`chunk graph`, 一般而言，在webpack中一个`chunk`对应一个entry，最终输出的资源也是一个chunk对应一个资源，所以在构建完整个`chunk graph`之后就会遍历每个chunk，对其进行`code generation`， 最后再输出资源

### make

make阶段，首先会有4个队列，一个是`factorize_queue`一个是`add_queue`一个是`build_queue`, 还有一个是`process_dependencies_queue`这四个队列是按顺序清除的，也就是`factorize_queue` 里的每项任务做完再进行`add_queue`里的任务，然后是`build_queue`最后是`process_dependencies_queue`.在make阶段每一个queue里的任务都会新建一个线程来处理，这也是rspack高性能的原因之一

#### factorize_queue

`rspack_entry_plugin`会在make 这个hook添加`force_build_dependency`,最开始的`factorize_queue`是由`entry_dependency`构成的，`factorize_task`首先会创建一个`resource_data`

```rust
pub struct ResourceData {
  /// Resource with absolute path, query and fragment
  pub resource: String,
  /// Absolute resource path only
  pub resource_path: PathBuf,
  /// Resource query with `?` prefix
  pub resource_query: Option<String>,
  /// Resource fragment with `#` prefix
  pub resource_fragment: Option<String>,
  pub resource_description: Option<DescriptionData>,
  pub mimetype: Option<String>,
  pub parameters: Option<String>,
  pub encoding: Option<String>,
  pub encoded_content: Option<String>,
  scheme: OnceCell<Scheme>,
}
```

接着会开始收集loader，loader分为四类，分别是`pre_loaders`, `post_loaders`,`normal_loaders`以及`inline_loaders`,最后构建一个`normal_module`

#### build_queue

之前的`factorize_task`是收集了模块构建需要的信息，例如路径，`loaders`,`build_task`就是真正开始构建，构建第一步就是执行相应的`loader`,loader transform完成后开始解析

```rust
pub struct ParseResult {
  pub dependencies: Vec<BoxDependency>,
  pub presentational_dependencies: Vec<Box<dyn DependencyTemplate>>,
  pub source: BoxSource,
  pub analyze_result: OptimizeAnalyzeResult,
}
```

解析后会得到这个模块包含的依赖，转换后的代码， 以及性能分析结果(?)

#### add_queue

`add_task`主要就是将`module`添加到`module graph`中

#### process_dependencies_queue

`process_dependencies_task`主要是通过之前检测出来的依赖创建下一轮的`factorize_task`

### seal

make后就是在seal阶段去生成最后的代码

#### code generation

因为之前在build阶段已经完成了loader的转换这里主要是针对之前扫描出来的`dependency`, 例如比较常规的`CommonJsDependency`

![image-20231101094701439](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/image-20231101094701439.png)

它会把`require('./answer')`转换为`__webpack_require__("./src/answer.js")`

#### process_runtime_requirements

之前`code generation`每个模块的`CodeGenerationResult`都会有`runtimeRequirements`, 该流程会先以chunk纬度收集这些`runtimeRequirement`, 接着调用`additional_chunk_runtime_requirements`, 这个hook提供了特定情况的一些runtime，例如`CommonJsChunkFormatPlugin`

```rust
fn additional_chunk_runtime_requirements(
    &self,
    _ctx: PluginContext,
    args: &mut AdditionalChunkRuntimeRequirementsArgs,
  ) -> PluginAdditionalChunkRuntimeRequirementsOutput {
    let compilation = &mut args.compilation;
    let chunk_ukey = args.chunk;
    let runtime_requirements = &mut args.runtime_requirements;
    let chunk = compilation
      .chunk_by_ukey
      .get(chunk_ukey)
      .ok_or_else(|| anyhow!("chunk not found"))?;

    if chunk.has_runtime(&compilation.chunk_group_by_ukey) {
      return Ok(());
    }

    if compilation
      .chunk_graph
      .get_number_of_entry_modules(chunk_ukey)
      > 0
    {
      runtime_requirements.insert(RuntimeGlobals::REQUIRE);
      runtime_requirements.insert(RuntimeGlobals::STARTUP_ENTRYPOINT);
      runtime_requirements.insert(RuntimeGlobals::EXTERNAL_INSTALL_CHUNK);
    }

    Ok(())
  }
```

接着会出发`runtime_requirement_in_tree`, 这个hook主要是根据已有`runtime_requirements`注入其他有关联的`runtime_requirements`, 接着为该chunk 添加`runtime modules`

#### create_chunk_assets

这几步做完之后就是真正创建资源了，这些资源就是将来要输出的文件

我们之前对每一个模块进行了`code generation` 以及为每一个chunk添加需要的`runtime module`

接下来就是需要去调用`render_manifest`hook，对于js资源，这个hook先是需要拿到输出文件的文件名，根据用户的[filename_template](https://webpack.js.org/configuration/output/#outputfilename) 拿到用户想要的文件名

最后就是模块代码的大整合

```rust
pub async fn render_main(&self, args: &rspack_core::RenderManifestArgs<'_>) -> Result<BoxSource> {
    let compilation = args.compilation;
    let chunk = args.chunk();
    let runtime_requirements = compilation
      .chunk_graph
      .get_tree_runtime_requirements(&args.chunk_ukey);
    let (module_source, chunk_init_fragments) =
      render_chunk_modules(compilation, &args.chunk_ukey)?;
    let (header, startup) = self.render_bootstrap(&args.chunk_ukey, args.compilation);
    let mut sources = ConcatSource::default();
    sources.add(RawSource::from("var __webpack_modules__ = "));
    sources.add(module_source);
    sources.add(RawSource::from("\n"));
    sources.add(header);
    sources.add(render_runtime_modules(compilation, &args.chunk_ukey)?);
    if chunk.has_entry_module(&compilation.chunk_graph) {
      let last_entry_module = compilation
        .chunk_graph
        .get_chunk_entry_modules_with_chunk_group_iterable(&chunk.ukey)
        .keys()
        .last()
        .expect("should have last entry module");
      if let Some(source) = compilation
        .plugin_driver
        .render_startup(RenderStartupArgs {
          compilation,
          chunk: &chunk.ukey,
          module: *last_entry_module,
          source: startup,
        })?
      {
        sources.add(source);
      }
      if runtime_requirements.contains(RuntimeGlobals::RETURN_EXPORTS_FROM_RUNTIME) {
        sources.add(RawSource::from("return __webpack_exports__;\n"));
      }
    }
    let mut final_source = if compilation.options.output.iife {
      render_iife(sources.boxed())
    } else {
      sources.boxed()
    };
    final_source = render_init_fragments(
      final_source,
      chunk_init_fragments,
      &mut ChunkRenderContext {},
    )?;
    if let Some(source) = compilation.plugin_driver.render(RenderArgs {
      compilation,
      chunk: &args.chunk_ukey,
      source: &final_source,
    })? {
      return Ok(source);
    }
    Ok(final_source)
  }
```

`render_manifest`后就可以通过`emit_asset`添加资源了

#### process_assets(hook)

在最后输出到文件系统之前，需要对assets进行一些处理，例如minify就是通过这个hook对资源进行压缩的

## Runtime module

在我们使用`rspack`构建完一个项目后, 我们可以看到这样的模块

![image-20231028151550264](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/image-20231028151550264.png)

这些模块就是`runtime module`, 它是为了让打包后的产物能够正常在浏览器上运行的模块

我们可以看到这样的`runtime requirement`，每一个`requirement`就是一个`runtime module`, 在整个构建过程中会添加`runtime requirement`, 最后在`RuntimePlugin` 里通过`runtime_requirements_in_tree`为chunk添加`runtime module`

![image-20231028151933331](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/image-20231028151933331.png)

### runtimeChunk

[runtimeChunk](https://www.rspack.dev/config/optimization.html#optimizationruntimechunk)是一种优化策略，它的可以把runtimeChunk单独分成一个chunk，我们可以通过配置中的`optimization.runtimeChunk` 进行配置，也可以给`entry option`添加一个`runtime`属性用来配置`runtime chunk`的name，实际上`optimization.runtimeChunk`也是通过对`entry.runtime`配置为`entryName`实现的

在seal阶段会进行codeSplit, 在正式codeSplit之前会进行`prepare_input_entrypoints_and_modules`, 这里会添加`namedChunk`，建立`chunkGroup`, 创建`runtimeChunk`,如果没有设置`entry.runtime`，这个`runtimeChunk`就是它自己

