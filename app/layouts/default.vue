<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-6">
            <!-- Logo -->
            <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div class="text-3xl">🛠️</div>
              <div class="font-bold text-lg text-gray-900 dark:text-white">开发者工具箱</div>
            </NuxtLink>

            <!-- 导航链接 -->
            <nav class="hidden md:flex items-center gap-1">
              <NuxtLink 
                to="/" 
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-all"
                exact-active-class="text-primary-600 dark:text-primary-400 bg-gray-50 dark:bg-gray-800/50"
              >
                首页
              </NuxtLink>
              
              <!-- 遍历每个分类，生成独立的下拉菜单 -->
              <UPopover 
                v-for="group in toolGroups" 
                :key="group.label"
                mode="hover" 
                :ui="{ content: 'min-w-[280px]' }"
              >
                <UButton 
                  color="neutral" 
                  variant="ghost" 
                  trailing-icon="i-heroicons-chevron-down"
                  size="sm"
                >
                  {{ group.label }}
                </UButton>

                <template #content>
                  <div class="p-2">
                    <NuxtLink
                      v-for="item in group.items"
                      :key="item.to"
                      :to="item.to"
                      class="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      active-class="bg-gray-50 dark:bg-gray-800"
                    >
                      <div class="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors shrink-0">
                        <UIcon v-if="item.icon" :name="item.icon" class="w-4 h-4" />
                      </div>
                      <div class="min-w-0">
                        <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                          {{ item.label }}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {{ item.desc }}
                        </div>
                      </div>
                    </NuxtLink>
                  </div>
                </template>
              </UPopover>
            </nav>
          </div>

          <div class="flex items-center gap-3">
            <!-- 搜索触发按钮 -->
            <UButton
              color="neutral"
              variant="soft"
              icon="i-heroicons-magnifying-glass"
              class="hidden sm:flex lg:w-48 justify-between"
              @click="isOpen = true"
            >
              <span class="hidden lg:inline">搜索工具...</span>
              <div class="flex items-center gap-1 text-xs text-gray-500">
                <UKbd>{{ metaSymbol }}</UKbd>
                <UKbd>K</UKbd>
              </div>
            </UButton>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-magnifying-glass"
              class="sm:hidden"
              @click="isOpen = true"
            />

            <!-- 主题切换按钮 -->
            <UColorModeButton />
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main>
      <slot />
    </main>

    <!-- 全局页脚 -->
    <footer class="border-t border-gray-200 dark:border-gray-800 py-8 mt-auto bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
        <p> 2025 开发者工具箱. All rights reserved.</p>
      </div>
    </footer>

    <!-- 命令面板 -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-gray-900/80 backdrop-blur-sm"
        @click="isOpen = false"
      >
        <div 
          class="w-full max-w-2xl mx-4 animate-fade-in"
          @click.stop
        >
          <UCommandPalette
            :groups="[{ id: 'tools', label: '工具列表', commands: flatTools }]"
            placeholder="搜索工具..."
            icon="i-heroicons-magnifying-glass"
            :ui="{ 
              root: 'rounded-xl shadow-2xl overflow-hidden',
              input: 'h-14 text-base'
            }"
            @update:model-value="onSelect"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { tools as toolGroups, flatTools } from '~/utils/tools'

const isOpen = ref(false)
const router = useRouter()

// 检测操作系统，显示正确的快捷键符号
const isMac = computed(() => {
  if (process.client) {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0
  }
  return false
})
const metaSymbol = computed(() => isMac.value ? '⌘' : 'Ctrl')

// 注册快捷键
defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value
    }
  }
})

// 处理选择
const onSelect = (option: any) => {
  isOpen.value = false
  if (option.to) {
    router.push(option.to)
  }
}
</script>
