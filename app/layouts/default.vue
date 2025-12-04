<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo 和标题 -->
          <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div class="text-3xl">🛠️</div>
            <div class="font-bold text-lg text-gray-900 dark:text-white">开发者工具箱</div>
          </NuxtLink>

          <!-- 导航链接 -->
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink 
              to="/" 
              class="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              exact-active-class="text-blue-600 dark:text-blue-400"
            >
              首页
            </NuxtLink>
            <NuxtLink 
              to="/md5" 
              class="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              active-class="text-blue-600 dark:text-blue-400"
            >
              MD5 工具
            </NuxtLink>
          </nav>

          <!-- 主题切换按钮 -->
          <UColorModeButton class="hidden md:block" />
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main>
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="mt-auto py-8 border-t border-gray-200 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 开发者工具箱 · 所有工具均在本地运行</p>
        </div>
      </div>
    </footer>
  </div>
</template>
