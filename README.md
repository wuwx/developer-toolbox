# 🛠️ Developer Toolbox

一个专为开发者打造的现代化在线工具集合，包含 **40+** 个常用工具。
基于 **Nuxt 4** + **Nuxt UI** 构建，采用 **100% 纯客户端** 技术实现，确保数据安全，无服务器交互。

[![GitHub stars](https://img.shields.io/github/stars/wuwx/developer-toolbox?style=social)](https://github.com/wuwx/developer-toolbox)
[![GitHub forks](https://img.shields.io/github/forks/wuwx/developer-toolbox?style=social)](https://github.com/wuwx/developer-toolbox)
[![License](https://img.shields.io/github/license/wuwx/developer-toolbox)](https://github.com/wuwx/developer-toolbox/blob/main/LICENSE)

![工具箱预览](public/og-image.png)

## ✨ 特性

- **🔒 安全隐私**：所有数据处理均在浏览器本地完成，绝不上传服务器。
- **⚡️ 极速响应**：基于 Nuxt 4 和 Vue 3，加载速度极快，支持 PWA。
- **🎨 现代化 UI**：使用 Nuxt UI 和 TailwindCSS 4，支持明暗色模式自动切换。
- **🔍 全局搜索**：内置 Command Palette (`Cmd+K`)，快速跳转任意工具。
- **📱 响应式设计**：完美适配桌面、平板和移动端设备。

## 🧰 工具列表 (40+)

### 🔐 编码加密
- **MD5 哈希**: 生成 MD5 散列值
- **SHA1 哈希**: 生成 SHA1 散列值
- **SHA256 哈希**: 生成 SHA256/SHA512 安全哈希
- **AES 加密**: AES-256-GCM 对称加密/解密
- **Base64 编码**: 文本与 Base64 互转
- **URL 编码**: URL 参数编码解码
- **JWT 解码**: 解析 JWT Token (Header/Payload)

### 🎨 图形视觉
- **CSS 渐变**: 可视化线性/径向渐变生成器
- **CSS 滤镜**: 实时调节图片 Filter 属性
- **CSS 阴影**: 多层 Box Shadow 可视化配置
- **圆角生成**: 复杂 Border Radius 形状生成

### 📝 文本代码
- **JSON 格式化**: JSON 美化、压缩与校验
- **JSON 转 TS**: 自动生成 TypeScript Interface
- **SQL 格式化**: 美化 SQL 语句，支持多种方言
- **YAML ↔ JSON**: 配置文件格式互转
- **CSV ↔ JSON**: 表格数据格式互转
- **正则测试**: 实时正则表达式匹配测试
- **文本对比**: Diff Checker，高亮显示差异
- **Markdown 预览**: 实时 Markdown 编辑与预览
- **文本统计**: 字数、词频、阅读时间分析
- **文本去重**: 列表去重、排序、过滤
- **大小写转换**: Camel, Snake, Kebab, Pascal 等互转

### 🔄 格式转换
- **时间戳转换**: Unix 时间戳与日期互转
- **进制转换**: 2/8/10/16 进制数值互转
- **数字转金额**: 人民币大写、中英文数字转换
- **Unicode 转换**: 字符与 Unicode 编码互转
- **颜色转换**: HEX, RGB, HSL 互转与取色
- **图片转 Base64**: 图片转 Data URL
- **图片压缩**: 纯前端 JPG/PNG/WebP 压缩

### 🎲 数据生成
- **UUID 生成**: 批量生成 UUID v4
- **随机密码**: 高强度随机密码生成器
- **Lorem Ipsum**: 占位文本/段落生成
- **Cron 表达式**: 可视化定时任务配置
- **二维码生成**: 自定义颜色和纠错率

### 🔍 查询辅助
- **URL 解析**: 拆解 URL 各个部分
- **User-Agent**: 解析浏览器/系统信息
- **HTTP 状态码**: 状态码含义与解决方案速查
- **键盘键位**: KeyCode 与修饰键检测
- **密码强度**: 密码安全性评估与建议
- **番茄钟**: 专注工作计时器

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

## 📄 License

MIT License © 2025
