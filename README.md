# PWSC · Le-soleile 个人网站

个人作品集，包含经历介绍、World of Agents、CleanBot 产品页及 CleanBot PRD。

## 本地预览

需要 Python 3，无需安装 Python 第三方依赖。在仓库根目录执行：

```bash
python3 -m http.server 8000 --directory dist
```

打开 http://localhost:8000 。

- 主页：`/`
- CleanBot：`/#product/cleanbot`
- World of Agents：`/#product/world-of-agents`
- PRD：`/docs/cleanbot-prd.html`

## 编辑与构建

```bash
python3 site-optimization/build.py
```

构建会更新 `dist/` 的版本化 JS、CSS 和 PRD，然后按上面的方式预览。

| 内容 | 文件（相对于 site-optimization/） |
| --- | --- |
| 首页标题 | `hero.js` |
| 经历与详情弹窗 | `about.js`、`reader.css` |
| 产品练习卡片 | `projects.js` |
| CleanBot 页面 | `restaurant.js`、`restaurant.css` |
| CleanBot 文案 | `restaurant/content.json` |
| 触屏示意 | `restaurant/touchscreen.js` |
| CleanBot PRD | `restaurant/prd.md` |
| World of Agents | `world-agents.js`、`world-agents.css`、`world-agents/content.json` |
| 已公开的联系方式 | `contact.json` |

## 工程现状

当前工程由保留的 React 编译产物和后续可编辑模块组成，并非完整的原始 Vite/React 源码工程。`build.py` 将模块合入基线 `dist/assets/index-c7332d4c5fbd.js`，请保留该文件。现阶段没有 `npm install` 或 `npm run build` 步骤。

`dist/` 包含可直接托管的静态站点、图片、字体、视频和证书资源；原始证书文件保持原样。仓库未包含服务器 SSH 私钥、线上备份、历史调试截图或服务器专属部署配置。

## 发布

将构建后的 `dist/` 内容发布到静态网站根目录。修改仓库本身不会自动更新线上网站，仓库当前未配置自动部署。建议入口 HTML 不长期缓存，带哈希的资源可使用长期缓存。
