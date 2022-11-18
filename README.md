![b站banner](https:////i0.hdslb.com/bfs/activity-plat/static/20190409/7d3fbe1b994526c1fae2b51bb7f2b633/S114GfcFE.png)
# 哔哩哔哩视频缓存工具
这个工具可以用来缓存某个哔哩哔哩up主下所有的视频，分P的也可以哦

## 【太长不看】简单粗暴直接用

> 前提是你安装好了nodejs哦，我用的版本是16.14.2

安装依赖:
```
npm i
```
运行程序：
```
npm start
```
输入要缓存视频up的mid：
![输入mid](https://github.com/zhzhch335/downloadAllBilibili/blob/main/img/1_input_mid.png?raw=true)
> mid可以去up主的个人首页找，网址结尾的数字就是。

由于B站的接口限制，如果要缓存1080P视频的话需要输入你的cookie（就相当于你登录了），这里不输入的话就直接缓存1080P下最高画质：
![输入cookie](https://github.com/zhzhch335/downloadAllBilibili/blob/main/img/2_input_cookie.png?raw=true)
要找自己的cookie可以找任意一个有控制台的浏览器，打开network（网络）选项卡后打开B站任意网页（确认你已经在登录状态），然后点开任意一次请求，在展开的侧边栏中找request header（请求标头）【注意】是**request header请求标头**，而**不是response响应标头**，在里面找到cookie这一项，复制里面的内容输入就好了（切记不要泄露，用这个就相当于你登录了）
![寻找cookie](https://github.com/zhzhch335/downloadAllBilibili/blob/main/img/3_find_cookie.png?raw=true)
之后就等着程序执行就行了，缓存的视频会放在目录的download文件夹下。

## 写这个程序的起因

前几天一个关注的up宣布停止虚拟主播活动回归声优本业，并计划删除掉所有虚拟主播相关的视频了，于是我打算把她的视频都缓存下来

~~但是，还是太晚了啊，我没想到她第二天就删掉了视频，明明宣布是明年1月才停止活动的~~

所以说，不要犹豫不要拖延啊，很多我们觉得会存在很久的东西就那么猝不及防地消失了……

## 原理

具体也没什么难的其实，主要就是调用了b站的3个API

- 通过mid获取视频列表： https://api.bilibili.com/x/space/arc/search?mid=3328498&ps=30&tid=0&pn=1&keyword=
- 通过bv号或av号来获取cid：https://api.bilibili.com/x/player/playurl?bvid=BV1Bu411e7YP&cid=567830487&qn=80
- 通过cid来获取视频下载地址：https://api.bilibili.com/x/web-interface/view?bvid=BV1Bu411e7YP

我们知道每个b站视频对应一个唯一av号和bv号，但是分P的视频几个视频也是同一个avbv号，因此实际上每个视频文件对应的还有一个cid，所以获取到cid就可以定位到具体要下载的每个视频的地址。

在获取cid时，如果有登录状态则可以缓存1080P视频，如果登录状态是大会员可以选择1080P+视频。

## 调试

第一次尝试用ts写了node，并且依赖中其实是包含`ts-node`的，如果你需要调试的话，可以使用直接运行ts文件
```
ts-node .\src\index.ts
```
或者你可以使用vscode的调试功能，在工程根目录下创建.vscode/launch.json文件，然后在文件中输入如下内容：
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "debug current ts file",
      "program": "${relativeFile}",
      "request": "launch",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "runtimeArgs": [
        "--loader",
        "ts-node/esm"
      ],
      "type": "node",
      "sourceMaps": true
    }
  ]
}
```
然后就可以使用vscode来调试了
【**注意**】用vscode调试的时候会进入调试控制台而没有终端，因此无法进行输入mid等操作，这时候可以使用`process.stdin.push()`方法将你想要输入的文本传进去：
![在调试控制台中输入](https://github.com/zhzhch335/downloadAllBilibili/blob/main/img/4_stdin_input.png?raw=true)
## TODO List
- [ ] 视频画质选择
- [ ] 选择部分视频缓存（待定）
- [ ] 按照分类缓存（待定）
- [ ] 广大网友们提的其他issue