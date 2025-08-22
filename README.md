# BlueArchiveStyleSiteNavigator

## Description 介绍

BASSN is an website navigation page with Blue Archive style. Now it's at in-dev state, welcome to fork this repo and star it!

BASSN是一个蔚蓝档案剧情选择界面风格的网址导航，目前正处于开发阶段，欢迎fork & star！

## Build 构建

First, clone this repo to your local device:

首先，将此仓库克隆到本地：

`git clone https://github.com/MoyuZJ-LinearTeam/BlueArchiveStyleSiteNavigator`

Then, run a web server or open `index.html` with browser which you prefer:

接着，运行一个本地web服务器或使用你喜欢的浏览器打开`index.html`。

Finally, you will see it!

最后，你就可以看到这个页面了！

<img width="2880" height="1588" alt="10fd1121dbbf06f26979b4919b17c53d" src="https://github.com/user-attachments/assets/bfa5294f-44ea-4be4-ab37-7243c00b5279" />

## Customize 自定义

### Edit cards and links 修改卡片内容和链接

Edit `script.js`, focus on list `storyCardData`, replace `标题x` and `链接x` with the title of the website you need and the link of it(http:// and https:// needed).You can add or remove items in the anytime!

打开`script.js`，修改其中的`storyCardData`列表，将`标题x`替换为你需要的网站列表的标题或介绍，`链接x`替换为网址（需要http://或https://），列表可自由扩展！

### Change BGM 修改背景音乐

Edit `script.js`, focus on class `APlayerManager`, replace var `defaultSongId` with any Netease Cloud Music id.

打开`script.js`，找到`APlayerManager`类，修改变量`defaultSongId`为任意网易云音乐歌曲ID即可！
