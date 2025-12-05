<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="时间戳转换"
      description="Unix 时间戳与日期时间互转，支持秒/毫秒"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 mb-6 shadow-xl">
          <UIcon name="i-heroicons-clock" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 当前时间 -->
    <div class="mb-8 text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
      <h3 class="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">当前 Unix 时间戳</h3>
      <div class="flex flex-col items-center justify-center gap-2">
        <div class="font-mono text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white tracking-tight tabular-nums">
          {{ currentTimestamp }}
        </div>
        <div class="flex items-center gap-2 text-gray-500 mt-2">
          <UIcon name="i-heroicons-play-pause" class="w-4 h-4 animate-pulse" />
          <span class="font-mono text-lg">{{ currentDate }}</span>
        </div>
      </div>
      <div class="mt-6 flex justify-center gap-3">
        <UButton
          v-if="isPaused"
          icon="i-heroicons-play"
          color="success"
          variant="soft"
          @click="togglePause"
        >
          继续
        </UButton>
        <UButton
          v-else
          icon="i-heroicons-pause"
          color="warning"
          variant="soft"
          @click="togglePause"
        >
          暂停
        </UButton>
        <UButton
          icon="i-heroicons-clipboard-document"
          color="neutral"
          variant="soft"
          @click="() => copyToClipboard(currentTimestamp.toString(), '当前时间戳')"
        >
          复制
        </UButton>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-2">
      <!-- 时间戳转日期 -->
      <ToolCard>
        <div class="flex items-center gap-2 mb-6">
          <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
            <UIcon name="i-heroicons-arrow-down-on-square" class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-semibold">时间戳 → 日期</h3>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              Unix 时间戳
            </label>
            <div class="flex gap-2">
              <UInput 
                v-model="inputTimestamp" 
                placeholder="输入时间戳..." 
                class="flex-1 font-mono"
                icon="i-heroicons-hashtag"
              />
              <USelect 
                v-model="timestampUnit" 
                :options="[{ label: '秒 (s)', value: 's' }, { label: '毫秒 (ms)', value: 'ms' }]"
                class="w-32"
              />
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <div class="text-xs text-gray-500 mb-1">转换结果 (本地时间)</div>
            <div class="font-mono text-lg font-medium text-gray-900 dark:text-white break-all">
              {{ formattedDate || '-' }}
            </div>
          </div>
          
          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <div class="text-xs text-gray-500 mb-1">转换结果 (UTC)</div>
            <div class="font-mono text-lg font-medium text-gray-900 dark:text-white break-all">
              {{ formattedDateUTC || '-' }}
            </div>
          </div>
        </div>
      </ToolCard>

      <!-- 日期转时间戳 -->
      <ToolCard>
        <div class="flex items-center gap-2 mb-6">
          <div class="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600">
            <UIcon name="i-heroicons-arrow-up-on-square" class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-semibold">日期 → 时间戳</h3>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
              日期时间
            </label>
            <div class="flex gap-2">
              <UInput 
                type="datetime-local" 
                v-model="inputDate" 
                class="flex-1 font-mono"
                step="1"
              />
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <div class="flex items-center justify-between mb-1">
              <div class="text-xs text-gray-500">时间戳 (秒)</div>
              <UButton 
                v-if="generatedTimestamp"
                icon="i-heroicons-clipboard-document"
                size="xs"
                color="neutral"
                variant="ghost"
                @click="() => copyToClipboard(generatedTimestamp!.toString(), '时间戳(秒)')"
              />
            </div>
            <div class="font-mono text-lg font-medium text-blue-600 dark:text-blue-400">
              {{ generatedTimestamp || '-' }}
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <div class="flex items-center justify-between mb-1">
              <div class="text-xs text-gray-500">时间戳 (毫秒)</div>
              <UButton 
                v-if="generatedTimestampMs"
                icon="i-heroicons-clipboard-document"
                size="xs"
                color="neutral"
                variant="ghost"
                @click="() => copyToClipboard(generatedTimestampMs!.toString(), '时间戳(毫秒)')"
              />
            </div>
            <div class="font-mono text-lg font-medium text-purple-600 dark:text-purple-400">
              {{ generatedTimestampMs || '-' }}
            </div>
          </div>
        </div>
      </ToolCard>
    </div>

    <ToolInfo title="关于时间戳" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const { copyToClipboard } = useToolClipboard()

// 当前时间状态
const now = ref(new Date())
const isPaused = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

// 输入状态
const inputTimestamp = ref('')
const timestampUnit = ref('s')
const inputDate = ref('')

// 计算当前时间戳显示
const currentTimestamp = computed(() => Math.floor(now.value.getTime() / 1000))
const currentDate = computed(() => now.value.toLocaleString())

// 时间戳转日期
const formattedDate = computed(() => {
  if (!inputTimestamp.value) return ''
  const ts = parseInt(inputTimestamp.value)
  if (isNaN(ts)) return '无效的时间戳'
  
  const date = new Date(timestampUnit.value === 's' ? ts * 1000 : ts)
  return date.toLocaleString()
})

const formattedDateUTC = computed(() => {
  if (!inputTimestamp.value) return ''
  const ts = parseInt(inputTimestamp.value)
  if (isNaN(ts)) return '无效的时间戳'
  
  const date = new Date(timestampUnit.value === 's' ? ts * 1000 : ts)
  return date.toUTCString()
})

// 日期转时间戳
const generatedTimestamp = computed(() => {
  if (!inputDate.value) return ''
  const date = new Date(inputDate.value)
  return Math.floor(date.getTime() / 1000)
})

const generatedTimestampMs = computed(() => {
  if (!inputDate.value) return ''
  const date = new Date(inputDate.value)
  return date.getTime()
})

const togglePause = () => {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    if (timer) clearInterval(timer)
  } else {
    now.value = new Date()
    timer = setInterval(() => {
      now.value = new Date()
    }, 1000)
  }
}

const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 Unix 时间戳？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'Unix 时间戳（Unix Timestamp）是从1970年1月1日（UTC/GMT的午夜）开始所经过的秒数，不考虑闰秒。它是计算机系统中表示时间的一种标准方式。'
  },
  {
    slot: 'year2038',
    label: '2038年问题',
    icon: 'i-heroicons-exclamation-triangle',
    content: '使用32位有符号整数表示时间戳的系统，将在2038年1月19日无法继续表示时间，导致时间溢出。现在的64位系统已经解决了这个问题。'
  }
]

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
  
  // 初始化日期输入框为当前时间
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  inputDate.value = d.toISOString().slice(0, 19)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

useHead({
  title: '时间戳转换工具 - Unix Timestamp Converter',
  meta: [
    { name: 'description', content: '免费在线时间戳转换工具，支持 Unix 时间戳与日期时间的相互转换' }
  ]
})
</script>
