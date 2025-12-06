<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.textStats.title')" :description="$t('pages.textStats.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-chart-pie" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.inputText') }}</h3>
              </div>
              <UButton v-if="inputText" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="inputText = ''">{{ $t('ui.clear') }}</UButton>
            </div>
          </template>
          <UTextarea v-model="inputText" :placeholder="$t('ui.inputPlaceholder')" :rows="15" autoresize :maxrows="25" class="font-mono text-sm leading-relaxed w-full" :ui="{ base: 'p-4' }" />
        </UCard>

        <UCard v-if="wordFrequency.length > 0">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.topWords') }} (Top 20)</h3>
            </div>
          </template>
          <div class="flex flex-wrap gap-2">
            <div v-for="(item, index) in wordFrequency" :key="index" class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm flex items-center gap-2">
              <span class="text-gray-700 dark:text-gray-300">{{ item.word }}</span>
              <span class="bg-primary-500 text-white text-xs px-1.5 rounded-full">{{ item.count }}</span>
            </div>
          </div>
        </UCard>
      </div>

      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ stats.chars }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('ui.totalChars') }}</div>
          </div>
          <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ stats.words }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('ui.words') }}</div>
          </div>
          <div class="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg text-center">
            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ stats.lines }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('ui.lines') }}</div>
          </div>
          <div class="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-lg text-center">
            <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ stats.paragraphs }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('ui.paragraphs') }}</div>
          </div>
        </div>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-calculator" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.detailedStats') }}</h3>
            </div>
          </template>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">{{ $t('ui.chineseChars') }}</span>
              <span class="font-mono font-bold">{{ stats.chinese }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">{{ $t('ui.englishChars') }}</span>
              <span class="font-mono font-bold">{{ stats.english }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">{{ $t('ui.numbers') }}</span>
              <span class="font-mono font-bold">{{ stats.numbers }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">{{ $t('ui.punctuation') }}</span>
              <span class="font-mono font-bold">{{ stats.punctuation }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">{{ $t('ui.whitespace') }}</span>
              <span class="font-mono font-bold">{{ stats.whitespace }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">{{ $t('ui.nonWhitespace') }}</span>
              <span class="font-mono font-bold">{{ stats.nonWhitespace }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600 dark:text-gray-400">{{ $t('ui.byteSize') }} (UTF-8)</span>
              <span class="font-mono font-bold">{{ stats.bytes }}</span>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-clock" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.readingEstimate') }}</h3>
            </div>
          </template>
          <div class="space-y-4">
            <div>
              <div class="text-xs text-gray-500 mb-1">{{ $t('ui.readingTime') }}</div>
              <div class="text-lg font-semibold">{{ readingTime }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-1">{{ $t('ui.speakingTime') }}</div>
              <div class="text-lg font-semibold">{{ speakingTime }}</div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const inputText = ref('')

const stats = computed(() => {
  const text = inputText.value || ''
  
  // 正则表达式匹配
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const english = (text.match(/[a-zA-Z]/g) || []).length
  const numbers = (text.match(/[0-9]/g) || []).length
  const punctuation = (text.match(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~，。？！、；：“”‘’（）《》【】]/g) || []).length
  const whitespace = (text.match(/\s/g) || []).length
  
  // 单词统计 (混合中英文)
  // 英文按空格分，中文按字数
  const words = (text.match(/[a-zA-Z0-9]+|[\u4e00-\u9fa5]/g) || []).length
  
  const lines = text ? text.split(/\r\n|\r|\n/).length : 0
  const paragraphs = text ? text.split(/\r\n\r\n|\n\n/).filter(p => p.trim()).length : 0
  
  // 字节大小
  const bytes = new Blob([text]).size
  
  return {
    chars: text.length,
    words,
    lines,
    paragraphs,
    chinese,
    english,
    numbers,
    punctuation,
    whitespace,
    nonWhitespace: text.length - whitespace,
    bytes: formatBytes(bytes)
  }
})

const wordFrequency = computed(() => {
  if (!inputText.value) return []
  
  const text = inputText.value.toLowerCase()
  // 提取英文单词和中文字符
  const words = text.match(/[a-z]+|[\u4e00-\u9fa5]{2,}/g) || []
  
  const frequency: Record<string, number> = {}
  words.forEach(word => {
    if (word.length > 1) { // 过滤单字
      frequency[word] = (frequency[word] || 0) + 1
    }
  })
  
  return Object.entries(frequency)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
})

const readingTime = computed(() => {
  const wpm = 200 // 平均阅读速度 (词/分钟)
  const minutes = Math.ceil(stats.value.words / wpm)
  return formatTime(minutes)
})

const speakingTime = computed(() => {
  const wpm = 150 // 平均朗读速度 (词/分钟)
  const minutes = Math.ceil(stats.value.words / wpm)
  return formatTime(minutes)
})

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatTime(minutes: number) {
  if (minutes < 1) return t('ui.lessThanMinute')
  if (minutes < 60) return `${minutes} ${t('ui.minutes')}`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours} ${t('ui.hours')} ${mins} ${t('ui.minutes')}`
}

useHead({ title: t('pages.textStats.title'), meta: [{ name: 'description', content: t('pages.textStats.description') }] })
</script>
