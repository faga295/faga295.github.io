---
title: web端上传oss
date: 2022-01-05 11:10:13
tags: oss
---

![](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/p140018.png)

Web端常见的上传方法是用户在浏览器或App端上传文件到应用服务器，应用服务器再把文件上传到OSS。具体流程如下图所示。

和数据直传到OSS相比，以上方法存在以下缺点：

- 上传慢：用户数据需先上传到应用服务器，之后再上传到OSS，网络传输时间比直传到OSS多一倍。如果用户数据不通过应用服务器中转，而是直传到OSS，速度将大大提升。而且OSS采用BGP带宽，能保证各地各运营商之间的传输速度。
- 扩展性差：如果后续用户数量逐渐增加，则应用服务器会成为瓶颈。
- 费用高：需要准备多台应用服务器。由于OSS上行流量是免费的，如果数据直传到OSS，将节省多台应用服务器的费用。

<!--more-->

## 技术方案

目前通过Web端将文件上传到OSS，有以下三种方案：

- 利用OSS Browser.js SDK将文件上传到OSS

  该方案通过OSS Browser.js SDK直传数据到OSS，详细的SDK Demo请参见[上传文件](https://help.aliyun.com/document_detail/64047.htm#concept-64047-zh)。在网络条件不好的状况下可以通过断点续传的方式上传大文件。该方案在个别浏览器上有兼容性问题，目前兼容IE10及以上版本浏览器，主流版本的Edge、Chrome、Firefox、Safari浏览器，以及大部分的Android、iOS、WindowsPhone手机上的浏览器。

- 使用表单上传方式将文件上传到OSS

  利用OSS提供的PostObject接口，通过表单上传的方式将文件上传到OSS。该方案兼容大部分浏览器，但在网络状况不好的时候，如果单个文件上传失败，只能重试上传。操作方法请参见[PostObject上传方案](https://help.aliyun.com/document_detail/31923.htm#concept-iyn-vfy-5db)。

- 通过小程序上传文件到OSS

  通过小程序，如微信小程序和支付宝小程序，利用OSS提供的PostObject接口来实现表单上传。操作方式请参见[微信小程序直传实践](https://help.aliyun.com/document_detail/92883.htm#concept-egs-zv1-kfb)和[支付宝小程序直传实践](https://help.aliyun.com/document_detail/173882.htm#task-2562741)。





以上是阿里云oss文档中的说明。

这里我采用的是第一种方案。

## 后端篇

后端需要做的任务就是调用STS服务的AssumeRole接口来获取临时凭证。

### 搭建STS服务

在搭建之前先介绍一下RAM

#### RAM

RAM (Resource Access Management) 是阿里云提供的资源访问控制服务。RAM用户是代表任意的通过控制台或OpenAPI操作阿里云资源的人、系统或应用程序。RAM允许您在云账号下创建并管理多个用户，每个用户都有唯一的用户名、登录密码或访问密钥。
云账户与RAM用户是一种主子关系。

云账号就是你的阿里云账号，RAM用户是你自己创建出来的，你可以给他指定授权策略来规定它能够云资源的权限。

RAM用户由阿里云账号（主账号）或具有管理员权限的其他RAM用户、RAM角色创建，创建成功后，归属于该阿里云账号，它不是独立的阿里云账号。

![](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/1970786820-5fc49a1643bed_fix732.png)

RAM角色（RAM role）与RAM用户一样，都是RAM身份类型的一种。RAM角色是一种虚拟用户，没有确定的身份认证密钥，需要被一个受信的实体用户扮演才能正常使用。

#### 授权策略

授权策略是一组权限的集合，它以一种策略语言来描述。通过给用户或群组附加授权策略，用户或群组中的所有用户就能获得授权策略中指定的访问权限

![](https://lzc-personal-resource.oss-cn-beijing.aliyuncs.com/images/typora/587166179-5fc49a314bd31_fix732.png)

1）直接使用云账号访问资源
2）使用RAM用户访问资源
3）使用STS令牌访问资源

**STS：**
阿里云STS (Security Token Service) 是为阿里云账号（或RAM用户）提供短期访问权限管理的云服务。通过STS，您可以为联盟用户（您的本地账号系统所管理的用户）颁发一个自定义时效和访问权限的访问凭证(token令牌)。联盟用户可以使用STS短期访问凭证直接调用阿里云服务API，或登录阿里云管理控制台操作被授权访问的资源。
**签名：**
RAM服务会对每个访问的请求进行身份验证，所以无论使用HTTP还是HTTPS协议提交请求，都需要在请求中包含签名（Signature）信息。RAM通过使用Access Key ID和Access Key Secret进行对称加密的方法来验证请求的发送者身份。Access Key ID和Access Key Secret由阿里云官方颁发给访问者（可以通过阿里云官方网站申请和管理），其中Access Key ID用于标识访问者的身份；Access Key Secret是用于加密签名字符串和服务器端验证签名字符串的密钥，必须严格保密，只有阿里云和用户知道。

创建RAM用户和角色具体操作：[使用STS临时访问凭证访问OSS](https://help.aliyun.com/document_detail/100624.htm#concept-xzh-nzk-2gb)

在创建角色的时候记得添加访问oss的权限。

#### nodejs的实现

```
const Core = require('@alicloud/pop-core');

var client = new Core({
  accessKeyId: '<your RAM accessKeyId>',//用户AccessKeyId
  accessKeySecret: '<your RAM accessKeySecret',//用户AccessKeySecret
  endpoint: 'https://sts.aliyuncs.com',
  apiVersion: '2015-04-01'
});
var params = {
  "RegionId": '<your RegionId>'，//cn-beijing
  "RoleArn": '<your RoleArn>'   ，//acs:ram::xxx:role/xxx
  "RoleSessionName": "<your RoleSessionName>"// 角色名称
}

var requestOption = {
  method: 'POST'
};

//发起请求，并得到响应。
exports.getSts = (res)=>{
	//访问AssumeRole接口
    client.request('AssumeRole', params, requestOption).then((result) => {
        res.send({
            code:20000,
            data:result.Credentials
        })
      }, (ex) => {
        console.log(ex);
        res.send({
            code:50000
        })
    })           
}


```

## 前端篇

```
export async function getSecurityToken (){
	const {data} = await axios.get(`${baseURL}/securityToken`)
	if(data.code===20000){
		return data.data;
	}
}
```



```
import OSS from 'ali-oss'
import {getSecurityToken} from '../request.js'

export async function putObject(id,file){
	const sts = await getSecurityToken()
	//获取临时凭证
	const client = new OSS({
		region:'<your region>',//oss-cn-beijing
		accessKeyId: sts.AccessKeyId,
		accessKeySecret: sts.AccessKeySecret,
		stsToken:sts.SecurityToken,
		bucket: '<your bucket>'
	})
	try{
		const result = await client.put(
			`${id}.png`,//这里是oss object的名称，我是以id命名的
			file,//这里传入file对象、Blob数据
		)
		console.log(result)
	}catch(e){
		console.log(e)
	}
}
```

