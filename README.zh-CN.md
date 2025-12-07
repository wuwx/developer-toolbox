<div align="center">

# 🛠️ Developer Toolbox

**开发者的全能工具箱 - 120+ 工具，零服务器上传**

一个现代化、隐私优先的在线工具集合，专为开发者打造。基于 **Nuxt 4** + **Nuxt UI** 构建，采用 **100% 客户端处理**，确保您的数据安全无忧。

[![GitHub stars](https://img.shields.io/github/stars/wuwx/developer-toolbox?style=social)](https://github.com/wuwx/developer-toolbox)
[![GitHub forks](https://img.shields.io/github/forks/wuwx/developer-toolbox?style=social)](https://github.com/wuwx/developer-toolbox)
[![License](https://img.shields.io/github/license/wuwx/developer-toolbox)](https://github.com/wuwx/developer-toolbox/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/wuwx/developer-toolbox/pulls)

[🌐 在线体验](https://wuwx.github.io/developer-toolbox) | [English](README.md) | [简体中文](README.zh-CN.md)

![工具箱预览](public/og-image.png)

</div>

---

## ✨ 为什么选择 Developer Toolbox？

<table>
<tr>
<td width="50%">

### 🔒 **隐私至上**
所有处理都在浏览器中完成。您的敏感数据永不离开设备 - 无服务器、无追踪、无数据收集。

### ⚡️ **极速体验**
基于 Nuxt 4 和 Vue 3 构建，支持 PWA。秒开加载，离线可用，性能极致。

### 🎨 **精美现代**
采用 Nuxt UI 和 TailwindCSS 4 打造的优雅界面。自动适配深色/浅色模式。

</td>
<td width="50%">

### 🔍 **快速访问**
命令面板（`Cmd+K` / `Ctrl+K`）让您秒找任何工具。告别无尽滚动。

### 📱 **随处可用**
完全响应式设计。在桌面、平板和手机上都有完美体验。

### 🌍 **多语言支持**
内置中英文国际化，自动检测浏览器语言。

</td>
</tr>
</table>

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

## 🚀 快速开始

### 在线使用
直接访问 [https://wuwx.github.io/developer-toolbox](https://wuwx.github.io/developer-toolbox) - 无需安装！

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/wuwx/developer-toolbox.git
cd developer-toolbox

# 安装依赖（推荐使用 pnpm）
pnpm install

# 启动开发服务器
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 📦 部署

本项目使用静态站点生成，可部署到任何静态托管平台：

- **GitHub Pages**：通过 GitHub Actions 自动部署（推送到 `main` 分支）
- **Vercel**：一键部署，零配置
- **Netlify**：拖放部署或连接仓库
- **Cloudflare Pages**：全球 CDN 快速部署

```bash
# 构建生产版本
pnpm generate
```

## 🤝 参与贡献

欢迎各种形式的贡献：

- 🐛 提交 Bug 报告
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 添加新工具

欢迎提交 Issue 或 Pull Request。

## 🌟 支持项目

如果这个项目对您有帮助，请考虑：

- ⭐ 给项目点个 Star
- 🐛 报告 Bug 或提出建议
- 📢 分享给其他开发者
- 🤝 贡献代码

## 📄 开源协议

MIT License © 2025 - 可自由用于个人或商业项目。

---

<div align="center">

**用 ❤️ 为开发者打造**

[报告问题](https://github.com/wuwx/developer-toolbox/issues) · [功能建议](https://github.com/wuwx/developer-toolbox/issues) · [项目文档](https://github.com/wuwx/developer-toolbox/wiki)

</div>
