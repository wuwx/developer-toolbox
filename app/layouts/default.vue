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

              <!-- 自定义 hover 下拉，每个分组一个相对容器 -->
              <div
                v-for="group in navGroups"
                :key="group.label"
                class="relative"
                @mouseenter="openGroup = group.label"
                @mouseleave="openGroup = openGroup === group.label ? null : openGroup"
              >
                <UButton 
                  color="neutral" 
                  variant="ghost" 
                  trailing-icon="i-heroicons-chevron-down"
                  size="sm"
                >
                  {{ group.label }}
                </UButton>

                <!-- 连接桥梁：消除按钮和面板之间的空隙 -->
                <div
                  v-if="openGroup === group.label"
                  class="absolute left-0 top-full w-full h-2 z-40"
                />

                <!-- 分组下拉面板：始终在同一个容器内，避免鼠标移入三级时关闭 -->
                <div
                  v-if="openGroup === group.label"
                  class="absolute left-0 top-full mt-2 z-40"
                >
                  <!-- 有 leafItems/sections 的分组：二级 + 右侧第三级级联菜单 -->
                  <div
                    v-if="group.leafItems || group.sections"
                    class="p-2 w-[320px] space-y-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800"
                  >
                      <!-- 直接作为二级的常用工具 -->
                      <NuxtLink
                        v-for="item in group.leafItems"
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

                      <div
                        v-if="group.leafItems && group.leafItems.length && group.sections && group.sections.length"
                        class="my-1 h-px bg-gray-100 dark:bg-gray-800"
                      />

                      <!-- 有下级的二级条目：每一行自身是一个 hover 组，右侧绝对定位第三级面板 -->
                      <div
                        v-for="section in group.sections"
                        :key="section.label"
                        class="relative group"
                      >
                        <button
                          type="button"
                          class="group flex items-start gap-3 p-2.5 rounded-lg text-left w-full transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 relative z-10"
                        >
                          <div class="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors shrink-0">
                            <UIcon name="i-heroicons-folder" class="w-4 h-4" />
                          </div>
                          <div class="min-w-0 flex-1">
                            <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                              {{ section.label }}
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              文本代码相关工具
                            </div>
                          </div>
                          <!-- 展开箭头图标 -->
                          <div class="flex items-center text-gray-400 group-hover:text-primary-500 transition-colors">
                            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
                          </div>
                        </button>

                        <!-- 连接桥梁：不可见的hover区域，连接二级和三级 -->
                        <div class="hidden group-hover:block absolute left-full top-0 w-1 h-full z-5" />

                        <!-- 第三级面板：在当前二级行右侧悬浮，使用 group-hover 保持展开状态 -->
                        <div
                          class="hidden group-hover:block absolute left-full top-0 ml-1 w-[280px] p-2 space-y-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 z-[60]"
                        >
                          <NuxtLink
                            v-for="item in section.items"
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
                      </div>
                  </div>

                  <!-- 普通分组：保持简单单列列表 -->
                  <div
                    v-else-if="group.items"
                    class="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800"
                  >
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
                </div>
              </div>
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

const navGroups = computed(() => {
  return toolGroups.map(group => {
    // 如果分组已经有 leafItems 和 sections（如「文本代码」），直接使用
    if (group.leafItems || group.sections) {
      return group
    }

    // 其他普通分组：只有 items，直接使用
    return group
  })
})

const openGroup = ref<string | null>(null)

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
