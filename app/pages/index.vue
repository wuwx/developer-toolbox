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
          {{ $t('hero.title') }}
        </h1>
        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
          {{ $t('hero.subtitle') }}
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-3">
        <UBadge variant="soft" size="lg" class="rounded-full px-4 py-1">
          <UIcon name="i-heroicons-check-circle" class="mr-1" /> {{ $t('hero.badge1') }}
        </UBadge>
        <UBadge variant="soft" color="primary" size="lg" class="rounded-full px-4 py-1">
          <UIcon name="i-heroicons-bolt" class="mr-1" /> {{ $t('hero.badge2') }}
        </UBadge>
        <UBadge variant="soft" color="neutral" size="lg" class="rounded-full px-4 py-1">
          <UIcon name="i-heroicons-lock-closed" class="mr-1" /> {{ $t('hero.badge3') }}
        </UBadge>
      </div>
    </div>

    <!-- 工具分组展示 -->
    <div class="space-y-16" v-for="group in toolGroups" :key="group.label">
      <!-- 分组标题 -->
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
            <UIcon :name="group.icon" class="w-7 h-7 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ getCategoryLabel(group.label) }}</h2>
          <div class="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-800" />
        </div>

        <!-- 工具网格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink 
            v-for="item in getAllTools(group)" 
            :key="item.to"
            :to="item.to" 
            class="group relative block"
          >
            <UCard class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-primary-500/50 dark:hover:ring-primary-400/50">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300">
                  <UIcon :name="item.icon" class="w-7 h-7" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {{ getToolLabel(item.to) }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {{ getToolDesc(item.to) }}
                  </p>
                </div>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </div>
    </div>

    <USeparator class="my-16 sm:my-24" />

    <!-- 底部信息 -->
    <div class="bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
      <div class="relative z-10">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4">{{ $t('about.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
          {{ $t('about.description') }}
          <span class="font-semibold text-primary-600 dark:text-primary-400">{{ $t('about.highlight') }}</span>{{ $t('about.description2') }}
        </p>
        <div class="flex justify-center gap-4">
          <UButton
            to="https://github.com/wuwx/developer-toolbox"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-simple-icons-github"
          >
            {{ $t('common.github') }}
          </UButton>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { tools } from '~/utils/tools'

definePageMeta({
  layout: 'default'
})

const { t } = useI18n()
const { getToolLabel, getToolDesc, getCategoryLabel } = useToolsI18n()

useHead({
  title: t('hero.title') + ' - ' + t('hero.subtitle'),
  meta: [
    { name: 'description', content: t('about.description') + t('about.highlight') + t('about.description2') }
  ]
})

const toolGroups = tools

// 获取分组下的所有工具（包括 items、leafItems 和 sections 中的工具）
const getAllTools = (group: any) => {
  const allTools = []
  
  // 处理普通的 items
  if (group.items) {
    allTools.push(...group.items)
  }
  
  // 处理 leafItems
  if (group.leafItems) {
    allTools.push(...group.leafItems)
  }
  
  // 处理 sections 中的工具
  if (group.sections) {
    group.sections.forEach((section: any) => {
      allTools.push(...section.items)
    })
  }
  
  return allTools
}
</script>
