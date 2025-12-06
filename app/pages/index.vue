<template>
  <UContainer class="py-12 sm:py-20">
    <!-- Hero 区域 -->
    <div class="text-center mb-16 sm:mb-24 space-y-8 relative">
      <!-- 装饰性背景元素 -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/30 to-purple-400/30 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <div class="inline-block mb-4 animate-bounce">
        <span class="text-8xl filter drop-shadow-lg">🛠️</span>
      </div>
      
      <div class="space-y-4">
        <h1 class="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
          开发者工具箱
        </h1>
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
          一站式在线开发工具集合，快速高效，安全可靠
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-3">
        <UBadge variant="soft" size="lg" class="rounded-full px-4 py-1">
          <UIcon name="i-heroicons-check-circle" class="mr-1" /> 完全免费
        </UBadge>
        <UBadge variant="soft" color="primary" size="lg" class="rounded-full px-4 py-1">
          <UIcon name="i-heroicons-bolt" class="mr-1" /> 即开即用
        </UBadge>
        <UBadge variant="soft" color="neutral" size="lg" class="rounded-full px-4 py-1">
          <UIcon name="i-heroicons-lock-closed" class="mr-1" /> 本地运行
        </UBadge>
      </div>
    </div>

    <!-- 工具网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      <!-- MD4 工具 -->
      <NuxtLink to="/md4" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-slate-500/50 dark:hover:ring-slate-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-hashtag" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">MD4 哈希</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                生成 MD4 哈希值，早期哈希算法，仅供研究。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- MD5 工具 -->
      <NuxtLink to="/md5" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-blue-500/50 dark:hover:ring-blue-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-lock-closed" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">MD5 哈希</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                快速生成 MD5 哈希值，支持任意文本输入，适用于数据完整性校验。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- SHA1 工具 -->
      <NuxtLink to="/sha1" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-green-500/50 dark:hover:ring-green-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-shield-check" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">SHA1 哈希</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                生成 160 位 SHA1 散列值，常用于版本控制和数字签名验证。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- Base64 工具 -->
      <NuxtLink to="/base64" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-orange-500/50 dark:hover:ring-orange-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-arrows-right-left" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Base64 编码</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                在线 Base64 编码和解码工具，支持文本与 Base64 格式的相互转换。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- JSON 工具 -->
      <NuxtLink to="/json" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-indigo-500/50 dark:hover:ring-indigo-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-code-bracket" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">JSON 格式化</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                JSON 数据格式化、压缩和语法验证，支持错误提示和一键复制。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- URL 工具 -->
      <NuxtLink to="/url" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-pink-500/50 dark:hover:ring-pink-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-link" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">URL 编码</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                对 URL 参数进行编码或解码，支持处理特殊字符和中文内容。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- UUID 工具 -->
      <NuxtLink to="/uuid" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-cyan-500/50 dark:hover:ring-cyan-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-finger-print" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">UUID 生成</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                批量生成 UUID v4 唯一标识符，支持一键复制和自定义数量。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 时间戳工具 -->
      <NuxtLink to="/timestamp" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-yellow-500/50 dark:hover:ring-yellow-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-clock" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">时间戳转换</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Unix 时间戳与日期时间互转，支持秒和毫秒精度，实时显示当前时间。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>
      <!-- JWT 工具 -->
      <NuxtLink to="/jwt" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-fuchsia-500/50 dark:hover:ring-fuchsia-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-key" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">JWT 解码</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                解析 JWT Token，查看 Header 和 Payload 信息，支持时间戳自动转换。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- NTLM 工具 -->
      <NuxtLink to="/ntlm" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-cyan-500/50 dark:hover:ring-cyan-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-window" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">NTLM 哈希</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                生成 Windows NTLM 哈希值，用于密码测试。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 图片 Base64 工具 -->
      <NuxtLink to="/image-base64" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-indigo-500/50 dark:hover:ring-indigo-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-photo" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">图片转 Base64</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                将图片转换为 Base64 编码，生成 CSS 背景或 HTML 标签，支持拖拽上传。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 二维码工具 -->
      <NuxtLink to="/qrcode" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-gray-500/50 dark:hover:ring-gray-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-qr-code" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">二维码生成</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                生成自定义二维码，支持调节颜色、尺寸和容错率，一键下载。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 颜色转换工具 -->
      <NuxtLink to="/color" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-pink-500/50 dark:hover:ring-pink-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-swatch" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">颜色转换</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                HEX、RGB、HSL 格式互转，取色器，对比度检测，前端开发必备。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 正则测试工具 -->
      <NuxtLink to="/regex" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-orange-500/50 dark:hover:ring-orange-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-code-bracket" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">正则测试</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                实时测试正则表达式，高亮显示匹配结果，提供常用模板库。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 文本对比工具 -->
      <NuxtLink to="/diff" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-cyan-500/50 dark:hover:ring-cyan-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-document-duplicate" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">文本对比</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                对比两段文本的差异，高亮显示新增、删除和修改内容。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- Markdown 预览工具 -->
      <NuxtLink to="/markdown" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-teal-500/50 dark:hover:ring-teal-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-document-text" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Markdown 预览</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                实时预览 Markdown 文档，支持分栏显示，写文档必备工具。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- SHA256 哈希工具 -->
      <NuxtLink to="/sha256" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-blue-500/50 dark:hover:ring-blue-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-lock-closed" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">SHA256 哈希</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                生成 SHA256 哈希值，用于文件校验、密码存储。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- SHA512 哈希工具 -->
      <NuxtLink to="/sha512" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-purple-500/50 dark:hover:ring-purple-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-shield-check" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">SHA512 哈希</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                生成 512 位 SHA512 散列值，更高安全性。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- SM3 工具 -->
      <NuxtLink to="/sm3" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-red-500/50 dark:hover:ring-red-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-shield-check" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">SM3 国密哈希</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                生成 SM3 国密哈希值，中国国家标准算法。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- SM4 工具 -->
      <NuxtLink to="/sm4" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-orange-500/50 dark:hover:ring-orange-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-lock-closed" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">SM4 国密加密</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                SM4 国密对称加密/解密，支持自定义密钥。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 进制转换工具 -->
      <NuxtLink to="/base-converter" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-lime-500/50 dark:hover:ring-lime-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-lime-50 dark:bg-lime-900/20 text-lime-600 dark:text-lime-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-calculator" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">进制转换</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                支持二进制、八进制、十进制、十六进制之间的相互转换。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- Cron 表达式工具 -->
      <NuxtLink to="/cron" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-amber-500/50 dark:hover:ring-amber-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-clock" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Cron 表达式</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                可视化配置定时任务，生成标准 Cron 表达式，支持常用模板。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- CSV JSON 转换工具 -->
      <NuxtLink to="/csv-json" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-violet-500/50 dark:hover:ring-violet-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-table-cells" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">CSV JSON 转换</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                CSV 和 JSON 格式互转，支持自定义分隔符，数据处理必备。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- CSS 渐变工具 -->
      <NuxtLink to="/css-gradient" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-rose-500/50 dark:hover:ring-rose-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-swatch" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">CSS 渐变</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                可视化调节线性/径向渐变，实时预览并生成 CSS 代码。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- CSS 滤镜工具 -->
      <NuxtLink to="/css-filter" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-emerald-500/50 dark:hover:ring-emerald-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">CSS 滤镜</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                调节图片模糊、亮度、对比度等 Filter 效果，生成 CSS 代码。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- CSS 阴影工具 -->
      <NuxtLink to="/css-shadow" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-slate-500/50 dark:hover:ring-slate-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-square-3-stack-3d" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">CSS 阴影</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                可视化配置 Box Shadow，支持多层阴影叠加效果。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 圆角生成工具 -->
      <NuxtLink to="/border-radius" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-cyan-500/50 dark:hover:ring-cyan-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-stop" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">圆角生成</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                生成复杂的 Border Radius 形状，支持 8 值不规则圆角。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- JSON 转 TS 工具 -->
      <NuxtLink to="/json-to-types" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-sky-500/50 dark:hover:ring-sky-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-command-line" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">JSON 转 TS</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                将 JSON 对象自动转换为 TypeScript Interface 定义。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- SQL 格式化工具 -->
      <NuxtLink to="/sql-formatter" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-blue-500/50 dark:hover:ring-blue-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-table-cells" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">SQL 格式化</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                美化 SQL 语句，支持多种数据库方言，提高可读性。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- YAML JSON 转换工具 -->
      <NuxtLink to="/yaml-json" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-fuchsia-500/50 dark:hover:ring-fuchsia-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-arrows-right-left" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">YAML JSON</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                YAML 和 JSON 配置文件格式互转，支持 Kubernetes 配置。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 数字转金额工具 -->
      <NuxtLink to="/number-converter" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-yellow-500/50 dark:hover:ring-yellow-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-banknotes" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">数字转金额</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                将数字转换为中文大写金额、中文数字和英文数字。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 键盘键位工具 -->
      <NuxtLink to="/keycode" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-indigo-500/50 dark:hover:ring-indigo-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-computer-desktop" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">键盘键位</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                在线检测 KeyCode、Event Code 和键盘修饰键状态。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 番茄钟工具 -->
      <NuxtLink to="/pomodoro" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-red-500/50 dark:hover:ring-red-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-clock" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">番茄钟</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                在线专注时钟，支持自定义工作/休息时长和桌面通知。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- CSS 渐变工具 -->
      <NuxtLink to="/css-gradient" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-rose-500/50 dark:hover:ring-rose-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-swatch" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">CSS 渐变</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                可视化调节线性/径向渐变，实时预览并生成 CSS 代码。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- CSS 滤镜工具 -->
      <NuxtLink to="/css-filter" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-emerald-500/50 dark:hover:ring-emerald-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">CSS 滤镜</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                调节图片模糊、亮度、对比度等 Filter 效果，生成 CSS 代码。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- CSS 阴影工具 -->
      <NuxtLink to="/css-shadow" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-slate-500/50 dark:hover:ring-slate-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-square-3-stack-3d" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">CSS 阴影</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                可视化配置 Box Shadow，支持多层阴影叠加效果。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 圆角生成工具 -->
      <NuxtLink to="/border-radius" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-cyan-500/50 dark:hover:ring-cyan-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-stop" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">圆角生成</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                生成复杂的 Border Radius 形状，支持 8 值不规则圆角。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- JSON 转 TS 工具 -->
      <NuxtLink to="/json-to-types" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-sky-500/50 dark:hover:ring-sky-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-command-line" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">JSON 转 TS</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                将 JSON 对象自动转换为 TypeScript Interface 定义。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- SQL 格式化工具 -->
      <NuxtLink to="/sql-formatter" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-blue-500/50 dark:hover:ring-blue-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-table-cells" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">SQL 格式化</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                美化 SQL 语句，支持多种数据库方言，提高可读性。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- YAML JSON 转换工具 -->
      <NuxtLink to="/yaml-json" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-fuchsia-500/50 dark:hover:ring-fuchsia-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-arrows-right-left" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">YAML JSON</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                YAML 和 JSON 配置文件格式互转，支持 Kubernetes 配置。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 数字转金额工具 -->
      <NuxtLink to="/number-converter" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-yellow-500/50 dark:hover:ring-yellow-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-banknotes" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">数字转金额</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                将数字转换为中文大写金额、中文数字和英文数字。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 键盘键位工具 -->
      <NuxtLink to="/keycode" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-indigo-500/50 dark:hover:ring-indigo-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-computer-desktop" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">键盘键位</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                在线检测 KeyCode、Event Code 和键盘修饰键状态。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 番茄钟工具 -->
      <NuxtLink to="/pomodoro" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-red-500/50 dark:hover:ring-red-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-clock" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">番茄钟</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                在线专注时钟，支持自定义工作/休息时长和桌面通知。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- Chmod 计算器 -->
      <NuxtLink to="/chmod" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-amber-500/50 dark:hover:ring-amber-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-command-line" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Chmod 计算器</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Linux 文件权限计算工具，可视化生成 755/644 权限码。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- CIDR 计算器 -->
      <NuxtLink to="/cidr" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-blue-500/50 dark:hover:ring-blue-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-server-stack" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">CIDR 计算器</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                计算 IP 子网掩码、广播地址和可用 IP 范围。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- HTML 实体编码 -->
      <NuxtLink to="/html-entity" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-orange-500/50 dark:hover:ring-orange-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-code-bracket" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">HTML 实体编码</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                HTML 特殊字符编码解码，防止 XSS 攻击。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- XML 格式化 -->
      <NuxtLink to="/xml-formatter" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-amber-500/50 dark:hover:ring-amber-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-code-bracket" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">XML 格式化</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                在线美化和压缩 XML 数据，提高可读性。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- Curl 构建器 -->
      <NuxtLink to="/curl-builder" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-gray-500/50 dark:hover:ring-gray-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-command-line" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">Curl 构建器</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                图形化配置 HTTP 请求，自动生成 Curl 命令。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- Docker 转 Compose -->
      <NuxtLink to="/docker-run-to-compose" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-sky-500/50 dark:hover:ring-sky-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-cube" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Docker 转 Compose</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                将 docker run 命令转换为 Docker Compose YAML。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- ULID 生成器 -->
      <NuxtLink to="/ulid" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-violet-500/50 dark:hover:ring-violet-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-bars-arrow-down" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">ULID 生成器</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                可排序的唯一标识符，UUID 的现代替代方案。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 列表转换器 -->
      <NuxtLink to="/list-converter" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-teal-500/50 dark:hover:ring-teal-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-list-bullet" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">列表转换器</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                将文本列表转换为 JSON、SQL、CSV 等格式。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- JSON 路径提取 -->
      <NuxtLink to="/json-path" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-yellow-500/50 dark:hover:ring-yellow-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-magnifying-glass-circle" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">JSON 路径提取</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                使用路径语法快速提取 JSON 数据中的特定值。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- IPv4 转换器 -->
      <NuxtLink to="/ipv4-converter" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-sky-500/50 dark:hover:ring-sky-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-globe-alt" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">IPv4 转换器</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                IP 地址在十进制、二进制、十六进制间相互转换。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 单位换算器 -->
      <NuxtLink to="/unit-converter" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-slate-500/50 dark:hover:ring-slate-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-scale" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">单位换算器</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                数据存储、长度、重量等常用单位快速转换。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- Slugify 转换 -->
      <NuxtLink to="/slugify" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-green-500/50 dark:hover:ring-green-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-link" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Slugify 转换</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                将文本转换为 URL 友好的 Slug 格式。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- MAC 地址生成 -->
      <NuxtLink to="/mac-generator" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-gray-500/50 dark:hover:ring-gray-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-cpu-chip" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">MAC 地址生成</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                随机生成 MAC 地址，支持自定义分隔符。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- 随机端口 -->
      <NuxtLink to="/random-port" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-cyan-500/50 dark:hover:ring-cyan-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-arrows-right-left" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">随机端口生成</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                生成随机可用端口号，避免开发测试冲突。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <!-- CSS 单位转换 -->
      <NuxtLink to="/css-unit" class="group relative block">
        <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-pink-500/50 dark:hover:ring-pink-400/50">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-arrows-right-left" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">CSS 单位转换</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                PX、REM、EM、百分比等 CSS 单位互相转换。
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <USeparator class="my-16 sm:my-24" />

    <!-- 底部信息 -->
    <div class="bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
      <div class="relative z-10">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4">关于此工具箱</h2>
        <p class="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
          这是一个专为开发者打造的在线工具集合。我们深知数据安全的重要性，因此所有工具均采用 
          <span class="font-semibold text-primary-600 dark:text-primary-400">纯前端技术实现</span>，
          您的任何数据都不会上传到服务器，完全在您的浏览器本地处理。
        </p>
        <div class="flex justify-center gap-4">
          <UButton
            to="https://github.com/wuwx/developer-toolbox"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-simple-icons-github"
          >
            GitHub
          </UButton>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: '开发者工具箱 - 在线开发工具集合',
  meta: [
    { name: 'description', content: '免费的在线开发工具集合，包括 MD5 哈希、编码转换等实用工具' }
  ]
})
</script>
