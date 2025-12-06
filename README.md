# 🛠️ Developer Toolbox

A modern online tool collection designed for developers, featuring **120+** commonly used tools.
Built with **Nuxt 4** + **Nuxt UI**, using **100% pure client-side** technology to ensure data security with no server interaction.

[![GitHub stars](https://img.shields.io/github/stars/wuwx/developer-toolbox?style=social)](https://github.com/wuwx/developer-toolbox)
[![GitHub forks](https://img.shields.io/github/forks/wuwx/developer-toolbox?style=social)](https://github.com/wuwx/developer-toolbox)
[![License](https://img.shields.io/github/license/wuwx/developer-toolbox)](https://github.com/wuwx/developer-toolbox/blob/main/LICENSE)

![Toolbox Preview](public/og-image.png)

English | [简体中文](README.zh-CN.md)

## ✨ Features

- **🔒 Secure & Private**: All data processing is done locally in your browser, never uploaded to servers
- **⚡️ Lightning Fast**: Built on Nuxt 4 and Vue 3, extremely fast loading with PWA support
- **🎨 Modern UI**: Using Nuxt UI and TailwindCSS 4, with automatic dark/light mode switching
- **🔍 Global Search**: Built-in Command Palette (`Cmd+K`) for quick access to any tool
- **📱 Responsive Design**: Perfect adaptation for desktop, tablet, and mobile devices
- **🎯 Smart Grouping**: Tools organized by category with 2-3 level cascading menus for quick discovery
- **🌍 Internationalization**: Support for Chinese and English with automatic browser language detection

## 🧰 Tool List (120+)

### 🔐 Encoding & Encryption (21 tools)
**Common Tools**: MD5, Base64, URL Encode, JWT Decoder, AES Encrypt

**Hash Algorithms**: MD4, SHA1, SHA256, SHA512, NTLM, Bcrypt, File Hash

**Chinese Crypto**: SM3 Hash, SM4 Encrypt

**Encoding Conversion**: Escape, Base32, Hex Encode, ROT13, Gzip, Text Encrypt

### 🎨 Graphics & Visual (18 tools)
**Common Tools**: CSS Gradient, Color Converter, Box Shadow, Flexbox Generator, Color Palette

**CSS Effects**: CSS Filter, CSS Shadow, Text Shadow, Border Radius, Clip Path, Transform

**Layout & Animation**: Grid Generator, Animation Generator, Easing Functions, CSS Unit Converter

**Image & Font**: Gradient, Image to Base64, Font Preview

### 📝 Text & Code (33 tools)
**Common Tools**: JSON Formatter, Regex Tester, Markdown, Text Diff, Text Stats

**Format Conversion**: JSON to TS, XML Formatter, YAML to JSON, CSV to JSON, List Converter, Case Converter

**SQL & Data**: SQL Formatter, SQL Generator, JSON Path, JSON Diff, Markdown Table

**Code Minify**: HTML Minifier, CSS Minifier, JS Minifier, SVG Optimizer

**Text Processing**: HTML Entity, Slugify, Text Deduplicate, Word Filter, ASCII Art, Lorem+

**Regex & Tools**: Regex Cheatsheet, Regex Tester, Text Diff, Meta Tags

**Chinese Processing**: Pinyin Converter, Traditional/Simplified, Morse Code

### 🔄 Format Converter (10 tools)
**Time & Date**: Timestamp Converter

**Number Conversion**: Unit Converter, Base Converter, Number to Words, IPv4 Converter

**Encoding Conversion**: Unicode Converter, Color Converter

**Image Processing**: Image Base64, Image Compress, JSON↔CSV

### 🖥️ DevOps & Network (8 tools)
**Container & DevOps**: Curl Builder, Docker to Compose, Chmod Calculator, CIDR Calculator

**Network Debug**: HTTP Headers, Log Parser

**Code Execution**: Code Sandbox, Benchmark

### 🎲 Data Generator (13 tools)
**Common Tools**: UUID v4, Password Generator, QR Code, Lorem Ipsum, Data Generator

**UUID & ID**: UUID v1, UUID v3, UUID v5, ULID, Nano ID

**Other Generators**: MAC Generator, Random Port, Cron Expression

### 🔍 Query & Helper (17 tools)
**Common Tools**: HTTP Status, URL Parser, Password Strength, QR Scanner, Calculator

**Web & Network**: SSL Cert Decoder, CSR Generator, User-Agent, MIME Types, Keycode

**Security & Data**: Password Checker, Data Mask

**Life Tools**: Pomodoro, BMI Calculator, World Clock, Countdown, Currency Converter

## 🚀 Local Development

```bash
# 1. Clone the project
git clone https://github.com/wuwx/developer-toolbox.git

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev
```

Visit http://localhost:3000 to see the result.

## 📦 Deployment

This project is configured for static site generation (`nuxt generate`) and can be deployed to any static hosting service (GitHub Pages, Vercel, Netlify, etc.).

### GitHub Pages Deployment

The project includes an automatic deployment workflow. Simply push code to the `main` branch, and GitHub Actions will automatically build and deploy to the `gh-pages` branch.

Please set the Pages Source to the `gh-pages` branch in your GitHub repository settings.

## 🌍 Internationalization

The project supports Chinese (Simplified) and English:

- **Automatic Detection**: Automatically detects browser language and switches accordingly
- **Manual Switch**: Users can manually switch languages using the language toggle button in the header
- **Language Persistence**: Selected language is saved in cookies for future visits

## 📄 License

MIT License © 2025
