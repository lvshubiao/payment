
# 支付项目

> 赫美支付，主要使用React Native作为App的开发语言。集成了React-Redux状态管理，redux-thunk、redux-logger中间等。

## 安装

运行命令：
```
yarn install 
```
or 
```
npm install 
```

链接字体文件
```
react-native link react-native-vector-icons
```

自动链接npm资源，eg：添加图片选择控件
```
react-native link
```

运行启动：
```
react-native run-ios  or react-native run-android
```


## 1. 项目结构

项目结构主要是针对javascript代码部分，不包括原生代码。

index.js  入口文件，负责注册组件
App.js    这个是跟组件，类似于主窗口的意思
js 目录，这里是重点
resource 资源目录

### js 目录

```
|--actions                 react-redux action 目录
    |--creator.js          action 对象创建帮助类，所有的action创建统一用这个来创建
    |--types.js            action 类型定义，定义规则：统一用 ‘ACTION_TYPE’ 开头 + 对应的CURD操作类型 + action动作名
    |--index.js            统一导出 action 文件，外面引用 action 不需要具体到文件，只需要具体到 actions 目录就可以了
    |--demo.js             一个 action demo 样例 
|--api                     restful api call 目录
    |--ajax.js             ajax 异步呼叫封装类，包括自动带上 token 验证，请求响应拦截等
    |--index.js            这里是用来统一导出restful接口的，也就是具体的restful api
    |--demo.js             一个demo版的restful api定义用例
|--common                  公共的帮助类库
    |--stylesheet.js       改造过的创建样式文件的帮助方法，要用这个来代替自带的 StyleSheet.create     
|--components              react component 组件目录
    |--demo.js             组件用例，组件应该是非常单一、并且是简单的。大多数情况应该都是接受一个props渲染UI即可
|--containers              react comoponent 容器组件，相对于页面
    |--main.js             容器组件代码
    |--login.js    
|--constants               系统常量定义的目录
    |--index.js            常量统一导出
|--navigators              路由目录
    |--tabBarItem.js       tab icon 选中效果处理组件
    |--index.js
|--reducers                react-redux reducer 目录
    |--demo.js
    |--index.js            reducer combine 导出
|--store                   react-redux store 目录
    |--configureStore.js   创建 store 对象， 包含中间件
    |--array.js            自定义中间件
    |--analyics.js
    |--track.js
|--utils                   全局使用的uitl方法
    |--index.js
|--config.js               全局的配置文件，包括环境切换等

### resource 目录

|--image     项目的静态图片资源存放的目录
|--style     项目公共的样式文件存放目录
|--index.js  这个是统一导出resource资源的文件，所有的资源会被合并成一个对象导出，外面访问只需要操作该对象即可

```

## 2. 编码规范

#### 1）文件、文件夹命名规范

文件名、文件夹统一用小写命名，多个单词用下划线 ‘_’ 分开。

#### 2）模块导出导入规范

模块导出统一用 es6 的 import 与 export，不用混着 node 的 require 与 module.exports 与 exports 用

#### 3）样式、js代码规范

这个参考Airbnb：
https://github.com/airbnb/javascript

## 3. 路由

路由统一定义在 navigators 目录的 index 文件里面，如果项目太大，路由太多的情况下，可以考虑不同的路由文件，但是最后还是需要在 index.js 
文件导入，再统一导出
当然，如果还有其他跟路由相关的文件的话，也可以放到这里来，看具体情况

## 4. containers 容器

容器目录，主要是放容器组件。一个容器其实就是包含多个组件component合成的一个页面。通常，容器里面不应该有UI渲染相关的逻辑，它的主要工作应该是连接多个展示组件，包括组件直接的协调通信，布局等。还有就是跟 react-redux 连接，state 到 props， dispatch 到 props 等等这些映射定义。

## 5. component 组件

组件，每个组件就是一个小的功能。组件内部展示逻辑应该全部用props来处理，由上级的容器组件把 props 传入。尽量少用 state 。

## 6. restful api 定义

Restful API 封装直接返回一个接口的操作对象，而不是一个http url之类的。统一封装的目的是方便管理、升级。对组件、redux等等都是分离的，互不相干。可以认为是一个独立的层，包括 ajax 请求等等都是隐藏的。这样封装起来，其实是非常通用的，甚至放到 h5 那边都可以用。

## 7. action 

### action 定义需要注意几个点：

1. action 的创建统一用creator的帮助方法来完成，要统一，不要自己定义。
2. action 的类型应该统一定义到types.js文件里面，命名规则：统一用 ‘ACTION_TYPE’ 开头 + 对应的CURD操作类型 + action动作名，eg： ACTION_TYPE_POST_LOGGED_IN
3. 每个action动作应该包含 3 个状态 （loading、success、failed）
4. 最后需要在index.js文件统一导出给外面引用


## 8. reducer

需要遵循reducer函数的规范：

1. reducer 的处理就没有其他特别的，主要还是参考标准的处理方式，只不过action那边多了个status，所以，我们需要处理不同的status。
2. 另外，reducer 函数应该是一个纯函数，相同的输入，应该总是得到同样的输出结果。
3. 千万不要在reducer函数里面修改state，要返回一个新的state对象，UI才会重新渲染。创建新对接可以自己用对象字面量的创建方式 {} 或者 Object.assign() 函数来创建。

## 9. store

store 主要就是中间件的添加、异步数据本地化达到离线可用等等配置。track 追踪用户行为，日志分析等中间件的集成使用。

## 10. 中间件

中间件我们主要采用：
redux-thunk
redux-logger
还有自定义相干的 track、array 等
他们的具体使用方式可以查看官方文档

## 11. 工具方法

工具方法的定义，这个没什么好说的。根据项目需要提取出来的公共方法。当然很多时候我们都是通过 npm 安装其他的lib，譬如： moment、lodash 等

## 12. 常量定义

常量，其实就是系统里面需要用到的一些全局的数据。统一起来是为了方便管理而已。


## 13. 后期升级：

1. 单元测试
2. 语法规范强检查，实时编译错误提示等等
3. 抽象一些更高级别的通用组件，跟项目无关这种
4. H5 与 APP 模块通用，主要是 Redux层，Component也可以抽象

## 14. 常见问题：

启动错误：

1. 字体文件的错误记得link一下
react-native link react-native-vector-icons

2. 安卓版本编译问题

如果js文件没有更新：

参考：http://www.jianshu.com/p/1380d4c8b596

生成release版本的APK：
现在可以生成签名版的APK 了：进入项目的根目录，在终端运行React Native 包管理器：
$ npm start
然后根目录在次运行下列命令：
$  mkdir -p android/app/src/main/assets
$ curl -k "http://localhost:8081/index.android.bundle" >android/app/src/main/assets/index.android.bundle  
$ cd android && ./gradlew assembleRelease

注意，需要index.android.js文件

如果资源文件没有更新：

参考：http://blog.csdn.net/u010411264/article/details/60595427

运行命令：

react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/



## 15. 参考资源

1. https://f8-app.liaohuqiu.net/#content
2. https://reactjs.org/docs/hello-world.html
3. http://reactnative.cn/docs/next/getting-started.html
4. https://segmentfault.com/a/1190000007248878
5. https://juejin.im/entry/58fdb7b3a0bb9f0065c7ff6e
6. http://www.jianshu.com/p/34468f13263c