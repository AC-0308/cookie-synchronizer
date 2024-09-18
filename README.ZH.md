# Cookie Synchronizer

在不同的网站键同步你的数据

<p align="center">
<img width="655" src="./src/assets//doc//option.jpg"><br/>
<sub>配置页面</sub><br/>
</p>

## 使用扩展

### 克隆代码

如果你更希望手动清除git历史

> If you don't have pnpm installed, run: npm install -g pnpm

```bash
npx degit ac-0308/cookie-synchronizer
cd cookie-synchronizer
pnpm i
```

## 使用

### 目录结构

- `src` - 源代码.
  - `contentScript` - 注入到页面的内容脚本.
  - `background` - 插件的后台service worker.
  - `components` - 在popup和option中共享的组件.
  - `styles` - 在popup和option中共享的样式
  - `assets` - 组件使用的静态资源
  - `manifest.ts` - 扩展的manifest文件.
- `extension` - 扩展包的根目录.
  - `assets` - manifest.json使用的静态资源.
  - `dist` - 构建产物.
- `scripts` - 开发和构建的辅助脚本.

### 构建

运行以下脚本以本地构建

```bash
pnpm build
```

然后你的extension文件夹下会出现打包好的文件，你可以打开浏览器的开发者模式并使用“加载解压缩的扩展”来将扩展添加到你的浏览器中

## 感谢

本插件基于 [vitesse-webext
](https://github.com/antfu-collective/vitesse-webext) 开发, 一个可以开发各种浏览器插件的开始模板.
