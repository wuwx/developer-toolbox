<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="键盘键位码查询"
      description="按下键盘任意键，获取 KeyCode, Code, Key 等信息"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 mb-6 shadow-xl">
          <UIcon name="i-heroicons-command-line" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 主显示区 -->
    <div class="space-y-8">
      <div 
        class="relative min-h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 outline-none focus:border-primary-500 dark:focus:border-primary-500 transition-colors overflow-hidden"
        tabindex="0"
        autofocus
        @keydown.prevent="handleKeydown"
        ref="inputArea"
      >
        <div v-if="!lastEvent" class="text-center text-gray-400">
          <UIcon name="i-heroicons-computer-desktop" class="w-16 h-16 mx-auto mb-4 opacity-50" />
          <div class="text-xl font-medium">按下键盘上的任意键</div>
          <div class="text-sm mt-2">请确保此区域获得焦点</div>
        </div>

        <div v-else class="text-center z-10">
          <div class="text-8xl font-bold text-primary-600 dark:text-primary-400 mb-4 font-mono">
            {{ lastEvent.keyCode }}
          </div>
          <div class="text-2xl font-medium text-gray-900 dark:text-white">
            {{ lastEvent.key === ' ' ? '(Space)' : lastEvent.key }}
          </div>
        </div>

        <!-- 背景装饰 -->
        <div v-if="lastEvent" class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <span class="text-[20rem] font-bold font-mono">{{ lastEvent.key }}</span>
        </div>
      </div>

      <!-- 详细信息 -->
      <div v-if="lastEvent" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UCard>
          <div class="text-xs text-gray-500 mb-1">event.key</div>
          <div class="text-lg font-mono font-bold text-green-600 dark:text-green-400">
            {{ lastEvent.key }}
          </div>
          <div class="text-xs text-gray-400 mt-1">字符值</div>
        </UCard>

        <UCard>
          <div class="text-xs text-gray-500 mb-1">event.code</div>
          <div class="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
            {{ lastEvent.code }}
          </div>
          <div class="text-xs text-gray-400 mt-1">物理按键</div>
        </UCard>

        <UCard>
          <div class="text-xs text-gray-500 mb-1">event.which / keyCode</div>
          <div class="text-lg font-mono font-bold text-purple-600 dark:text-purple-400">
            {{ lastEvent.keyCode }}
          </div>
          <div class="text-xs text-gray-400 mt-1">已弃用但常用</div>
        </UCard>

        <UCard>
          <div class="text-xs text-gray-500 mb-1">event.location</div>
          <div class="text-lg font-mono font-bold text-orange-600 dark:text-orange-400">
            {{ getLocation(lastEvent.location) }}
          </div>
          <div class="text-xs text-gray-400 mt-1">按键位置</div>
        </UCard>
      </div>

      <!-- 修饰键 -->
      <UCard v-if="lastEvent">
        <template #header>
          <h3 class="font-semibold">修饰键状态</h3>
        </template>
        <div class="flex gap-4">
          <UBadge :color="lastEvent.ctrlKey ? 'primary' : 'neutral'" :variant="lastEvent.ctrlKey ? 'solid' : 'soft'">Control</UBadge>
          <UBadge :color="lastEvent.shiftKey ? 'primary' : 'neutral'" :variant="lastEvent.shiftKey ? 'solid' : 'soft'">Shift</UBadge>
          <UBadge :color="lastEvent.altKey ? 'primary' : 'neutral'" :variant="lastEvent.altKey ? 'solid' : 'soft'">Alt / Option</UBadge>
          <UBadge :color="lastEvent.metaKey ? 'primary' : 'neutral'" :variant="lastEvent.metaKey ? 'solid' : 'soft'">Meta / Command</UBadge>
        </div>
      </UCard>

      <!-- 历史记录 -->
      <UCard v-if="history.length > 0">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">历史记录</h3>
            <UButton color="neutral" variant="ghost" size="xs" @click="history = []">清空</UButton>
          </div>
        </template>
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="(item, index) in history" 
            :key="index"
            class="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono"
          >
            <span class="font-bold">{{ item.key === ' ' ? 'Space' : item.key }}</span>
            <span class="text-gray-400 text-xs ml-2">{{ item.keyCode }}</span>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const inputArea = ref<HTMLElement | null>(null)

interface KeyInfo {
  key: string
  code: string
  keyCode: number
  location: number
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  metaKey: boolean
}

const lastEvent = ref<KeyInfo | null>(null)
const history = ref<KeyInfo[]>([])

function handleKeydown(e: KeyboardEvent) {
  const info: KeyInfo = {
    key: e.key,
    code: e.code,
    keyCode: e.keyCode,
    location: e.location,
    ctrlKey: e.ctrlKey,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    metaKey: e.metaKey
  }
  
  lastEvent.value = info
  history.value.unshift(info)
  if (history.value.length > 20) history.value.pop()
}

function getLocation(loc: number) {
  const locations = ['Standard', 'Left', 'Right', 'Numpad']
  return locations[loc] || 'Unknown'
}

onMounted(() => {
  inputArea.value?.focus()
})

// SEO
useHead({
  title: '键盘键位码查询 - KeyCode 检测 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线键盘键位码查询工具，检测 event.key, event.code, keyCode。支持查看修饰键状态和历史记录。' }
  ]
})
</script>
