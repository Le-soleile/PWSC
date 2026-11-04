# PWSC · Le-soleile 个人网站

一个用于整理个人经历、展示作品与记录产品探索的网站。

- **个人经历**：教育、科创竞赛、开源实习与论文记录。
- **World of Agents**：面向大规模多智能体深度强化学习的仿真训练平台构想。
- **CleanBot**：面向高校食堂的智能清洁机器人产品探索，包含场景、功能、技术学习记录及产品需求文档。

在线访问：[people-ai-chat.cn](https://people-ai-chat.cn/)

## 项目结构

```text
 dist/                 可直接部署的静态网站及图片、字体、视频等资源
 site-optimization/    可编辑的页面模块、样式与构建脚本
   restaurant/         CleanBot 文案、触屏示意与 PRD 源稿
   world-agents/       World of Agents 文案
```

网站无需后端服务或数据库。当前代码基于保留的 React 编译产物与可编辑模块构建，不是完整的原始 React 工程，无需执行 npm 安装。

修改页面后，在仓库根目录运行以下命令更新 `dist/`，仅需 Python 3 标准库：

```bash
python3 site-optimization/build.py
```

CleanBot PRD 可直接编辑 `site-optimization/restaurant/prd.md`，构建时会同步生成网页。请保留 `dist/assets/index-c7332d4c5fbd.js`，它是构建所需的基线文件。

## 部署到全新服务器

以下以 Ubuntu / Debian 服务器为例，使用具有 sudo 权限的账号操作。直接部署仓库中的 `dist/` 即可，无需先构建。

**1. 安装 Nginx 并下载项目**

```bash
sudo apt update
sudo apt install -y nginx git
sudo git clone https://github.com/Le-soleile/PWSC.git /opt/PWSC
sudo mkdir -p /var/www/pwsc
sudo cp -a /opt/PWSC/dist/. /var/www/pwsc/
sudo chmod -R a+rX /var/www/pwsc
```

**2. 配置站点**

将以下内容保存到 `/etc/nginx/sites-available/pwsc`。将 `example.com` 换成自己的域名；还没有域名时，可换成服务器公网 IP。

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/pwsc;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
```

启用配置并启动服务：

```bash
sudo ln -s /etc/nginx/sites-available/pwsc /etc/nginx/sites-enabled/pwsc
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
```

在云服务器安全组中放行 TCP 80 端口；若启用了系统防火墙，也需放行。随后通过 `http://你的域名` 或 `http://服务器公网IP` 访问。使用域名时，先将 DNS 的 A 记录指向服务器公网 IP。

需要 HTTPS 时，域名解析生效后放行 TCP 443 端口并执行：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

**3. 后续更新**

```bash
sudo git -C /opt/PWSC pull --ff-only
sudo cp -a /opt/PWSC/dist/. /var/www/pwsc/
sudo chmod -R a+rX /var/www/pwsc
```

仓库未配置自动部署，推送代码后需在服务器执行更新。如果只修改了可编辑模块而未提交新的 `dist/`，请先安装 Python 3，在 `/opt/PWSC` 下运行构建命令，再复制部署文件。
