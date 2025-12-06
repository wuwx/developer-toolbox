# 🛠️ Developer Toolbox

一个专为开发者打造的现代化在线工具集合，包含 **120+** 个常用工具。
基于 **Nuxt 4** + **Nuxt UI** 构建，采用 **100% 纯客户端** 技术实现，确保数据安全，无服务器交互。

[![GitHub stars](https://img.shields.io/github/stars/wuwx/developer-toolbox?style=social)](https://github.com/wuwx/developer-toolbox)
[![GitHub forks](https://img.shields.io/github/forks/wuwx/developer-toolbox?style=social)](https://github.com/wuwx/developer-toolbox)
[![License](https://img.shields.io/github/license/wuwx/developer-toolbox)](https://github.com/wuwx/developer-toolbox/blob/main/LICENSE)

![工具箱预览](public/og-image.png)

[English](README.md) | 简体中文

## ✨ 特性

- **🔒 安全隐私**：所有数据处理均在浏览器本地完成，绝不上传服务器
- **⚡️ 极速响应**：基于 Nuxt 4 和 Vue 3，加载速度极快，支持 PWA
- **🎨 现代化 UI**：使用 Nuxt UI 和 TailwindCSS 4，支持明暗色模式自动切换
- **🔍 全局搜索**：内置 Command Palette (`Cmd+K`)，快速跳转任意工具
- **📱 响应式设计**：完美适配桌面、平板和移动端设备
- **🎯 智能分组**：工具按类别分组，支持二级、三级级联菜单，快速发现和定位
- **🌍 国际化支持**：支持中英文双语，自动检测浏览器语言

## 🧰 工具列表 (120+)

### 🔐 编码加密 (21 个工具)
**常用工具**：MD5、Base64、URL编码、JWT解码、AES加密

**哈希算法**：MD4、SHA1、SHA256、SHA512、NTLM、Bcrypt、文件哈希

**国密算法**：SM3国密哈希、SM4国密加密

**编码转换**：Escape、Base32、Hex编码、ROT13、Gzip、文本加密

### 🎨 图形视觉 (18 个工具)
**常用工具**：CSS渐变、颜色转换器、Box Shadow、Flexbox生成器、调色板

**CSS效果**：CSS滤镜、CSS阴影、Text Shadow、圆角生成、Clip Path、Transform

**布局动画**：Grid生成器、动画生成器、缓动函数、CSS单位转换

**图片字体**：Gradient、Image to Base64、字体预览

### 📝 文本代码 (33 个工具)
**常用工具**：JSON格式化、正则测试、Markdown、文本对比、文本统计

**格式转换**：JSON转TS、XML格式化、YAML转JSON、CSV转JSON、列表转换器、大小写转换

**SQL & 数据**：SQL格式化、SQL生成器、JSON路径提取、JSON对比、Markdown表格

**代码压缩**：HTML压缩、CSS压缩、JS压缩、SVG优化

**文本处理**：HTML实体编码、Slugify转换、文本去重、敏感词过滤、ASCII Art、Lorem+

**正则工具**：正则速查、Regex Tester、Text Diff、Meta标签

**中文处理**：拼音转换、繁简转换、摩斯电码

### 🔄 格式转换 (10 个工具)
**时间日期**：时间戳转换

**数值转换**：单位换算、进制转换、数字转金额、IPv4转换

**编码转换**：Unicode转换、颜色转换

**图片处理**：图片Base64、图片压缩、JSON↔CSV

### 🖥️ 运维网络 (8 个工具)
**容器运维**：Curl构建器、Docker转Compose、Chmod计算器、CIDR计算器

**网络调试**：HTTP Headers、日志解析

**代码运行**：代码沙箱、性能测试

### 🎲 数据生成 (13 个工具)
**常用工具**：UUID v4、随机密码、二维码生成、Lorem Ipsum、数据生成器

**UUID & ID**：UUID v1、UUID v3、UUID v5、ULID生成、Nano ID

**其他生成器**：MAC地址生成、随机端口、Cron表达式

### 🔍 查询辅助 (17 个工具)
**常用工具**：HTTP状态码、URL解析、密码强度、二维码识别、科学计算器

**Web & 网络**：SSL证书解码、CSR生成器、User-Agent、MIME Types、键盘键位

**安全数据**：密码检测、数据脱敏

**生活工具**：番茄钟、BMI计算器、世界时钟、倒计时、汇率换算

## 🚀 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/wuwx/developer-toolbox.git

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

访问 http://localhost:3000 即可看到效果。

## 📦 部署

本项目配置为静态站点生成 (`nuxt generate`)，可以部署到任何静态托管服务（GitHub Pages, Vercel, Netlify 等）。

### GitHub Pages 部署

项目包含自动部署 Workflow。只需将代码推送到 `main` 分支，GitHub Actions 会自动构建并部署到 `gh-pages` 分支。

请在 GitHub 仓库设置中将 Pages Source 设置为 `gh-pages` 分支。

## 🌍 国际化

项目支持简体中文和英文：

- **自动检测**：自动检测浏览器语言并切换
- **手动切换**：用户可通过顶部导航栏的语言切换按钮手动切换语言
- **语言持久化**：选择的语言会保存在 Cookie 中，下次访问时自动应用

## 📄 License

MIT License © 2025
