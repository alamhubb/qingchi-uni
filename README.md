# 清池app交友社区，社交领域开源框架

#### 遵循MIT开源协议，免费商用

## 核心功能
* <font color=red>***重点*** ，为不同的社交软件之间的提供用户授权开放数据的交换互通功能</font>
* 提供已上线运营的清池社交app源码
* 提供社交领域的前后端基础业务组件和用户授权开放的用户数据

### 产品介绍
* 清池交友社区源码，支持小程序和安卓app，日活3000已上线运营中，前后端均已开源
* 本项目已经历了三年的成长过程，未来还会持续维护下去，永不停更

### 愿景，成为社交领域的基础开源框架，朝着（清池 in 社交）像（vue in 前端，spring in java，uni-app in 跨端开发）一样的存在而努力
#### 致力于让社交软件爱好者可通过本项目快速开发一款高完成度的社交软件，并不断追求极致优化，永远朝着更好一点努力，学习springboot和vue-cli一样的0配置，开箱即用，渐进式框架思想

###   功能介绍
- [ ] <font color=red>***重点*** ，提供用户授权开放数据的交换互通功能，(类似于可支撑，探探和soul之间的用户互相聊天发送消息，评论动态的功能)，未支持</font>
- [x] <font color=blue>清池app已运营的生产环境前端源码已开源(vue + uni-app)</font>，已支持
- [x] <font color=blue>清池app已运营的生产环境后端源码已开源(java)</font>，已支持
- [ ] 基础社交领域组件(动态列表组件、动态详情、聊天组件)，未支持
- [ ] 提供用户社交(用户开放的朋友圈动态内容、个人信息内容)，未支持

### 对标和相似产品介绍
#### 业务中台对标产品
* [discuz(社交解决方案)](https://discuz.com/)
* [前端Paas中台](https://www.it120.cc/) ，部分思想类似 
* [thinksns社交网站模板](https://www.thinksns.com/) ，部分功能相似
* [有赞电商模板组件](https://vant-contrib.gitee.io/vant/#/zh-CN/address-edit) ，产品使用方式类似 

#### 数据中台（数据交换中台）对标产品， 
* [微博开放平台](https://open.weibo.com/wiki/%E5%BE%AE%E5%8D%9AAPI) ，开放思想类似
* [DCloud换量联盟](https://ask.dcloud.net.cn/article/13300) ，交换思想类似
* [微信统一登录接口](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/WeChat_Login/Development_Guide.html) ，数据开放方式

### 对标产品区别和对比

#### 前台业务中台区别
* [discuz(社交解决方案)](https://discuz.com/) ，[thinksns社交网站模板](https://www.thinksns.com/) 
     * 他方缺点，php后端，不提供数据支持
     * 我方优点，java后端，提供大量社交数据，完全开源免费
* [前端Paas中台](https://www.it120.cc/)
     * 他方缺点，非专注于社交领域，不提供数据支持
     * 我方优点，专注社交领域，提供大量社交数据支持
* [有赞电商模板组件](https://vant-contrib.gitee.io/vant/#/zh-CN/address-edit) 
     * 他方缺点，全方向ui组件库，只负责UI展示
     * 我方优点，专注社交领域，负责前端、后端、数据层，多端、多层基础业务组件支持

#### 业务中台区别
* [微博开放平台](https://open.weibo.com/wiki/%E5%BE%AE%E5%8D%9AAPI)
     * 他方缺点，只支持微博一方数据，不支持三方数据写入
     * 我方优点，支持符合接口规范、用户隐私协议的所有非敏感用户授权数据交换
* [DCloud换量联盟](https://ask.dcloud.net.cn/article/13300)
     * 他方缺点，他方缺点，仅支持广告
     * 我方优点，专注社交领域数据互通交换，提供大量社交数据
* [微信统一登录接口](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/WeChat_Login/Development_Guide.html)
     * 他方缺点，仅开放了登陆接口和用户名等极少用户信息
     * 我方优点，开放更多社交领域数据，根据oauth2协议，可获取用户授权开放给指定应用的社交数据，如朋友圈动态，部分个人信息等

### 关键词
uniapp chat Community Dating Social app
聊天 社区 社交 交友 app

### 技术架构
* 前端 uniapp + vue + ts
* 后端 java + springboot + mysql


### 下载
插件仅支持git方式下载，不支持zip方式

### 前端源码地址
[清池前端项目 git地址 qingchi-uni](https://github.com/qingchiapp/qingchi-uni.git)

### 后端源码地址
* [清池后端web项目 git地址 qingchi-web](https://github.com/qingchiapp/qingchi-web.git)
* [清池后端基础服务项目 git地址 qingchi-base](https://github.com/qingchiapp/qingchi-base.git)

### 体验

app已上架，应用宝、360、oppo、vivo、小米、阿里应用中心，大家可搜索 清池 自行下载。

也可点击下载链接 [下载app](https://openbox.mobilem.360.cn/index/d/sid/4534383)

已上架，微信小程序、qq小程序、下方有二维码，可扫码体验，也可在小程序中自行搜索 清池

#### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

* 有自己项目，或者想自己做个项目的朋友欢迎入群交流，大家一起讨论变现，接广告，如何做好产品相关问题

<table>
  <thead>
  <tr>
    <th>我微信，可进社交软件app交流群，互相学习，讨论问题</th>
    <th>微信扫码体验（不支持ios）</th>
    <th>QQ扫码体验（支持ios）</th>
  </tr>
  </thead>
  <tbody>
  <tr>
      <td align="center" valign="middle">
        <img width="222px" src="https://cdxapp-1257733245.cos.ap-beijing.myqcloud.com/qingchi/static/wxcode.png">
      </td>
      <td align="center" valign="middle">
        <img width="222px" src="https://cdxapp-1257733245.cos.ap-beijing.myqcloud.com/qingchi/home/qingchiwxcode.jpg!thumbnail">
      </td>
      <td align="center" valign="middle">
         <img width="222px" src="https://cdxapp-1257733245.cos.ap-beijing.myqcloud.com/qingchi/home/qingchiqqcode.png!thumbnail">
      </td>
    </tr>
  <tr></tr>
  </tbody>
</table>
