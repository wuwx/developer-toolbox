<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">文本统计分析</h1>
      <p class="text-gray-600 dark:text-gray-400">
        全方位的文本分析工具，支持字数统计、词频分析、阅读时间预估
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 输入区域 -->
      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                <h3 class="font-semibold">输入文本</h3>
              </div>
              <div class="flex gap-2">
                <UButton
                  v-if="inputText"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-x-mark"
                  @click="inputText = ''"
                >
                  清空
                </UButton>
              </div>
            </div>
          </template>

          <UTextarea
            v-model="inputText"
            placeholder="在此输入要统计的文本..."
            :rows="15"
            autoresize
            :maxrows="25"
            class="font-mono text-sm leading-relaxed"
          />
        </UCard>

        <!-- 词频分析 -->
        <UCard v-if="wordFrequency.length > 0">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5" />
              <h3 class="font-semibold">高频词汇 (Top 20)</h3>
            </div>
          </template>

          <div class="flex flex-wrap gap-2">
            <div
              v-for="(item, index) in wordFrequency"
              :key="index"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm flex items-center gap-2"
            >
              <span class="text-gray-700 dark:text-gray-300">{{ item.word }}</span>
              <span class="bg-primary-500 text-white text-xs px-1.5 rounded-full">{{ item.count }}</span>
            </div>
          </div>
        </UCard>
      </div>

      <!-- 统计结果 -->
      <div class="space-y-6">
        <!-- 核心指标 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ stats.chars }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">总字符数</div>
          </div>
          <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ stats.words }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">单词/词语</div>
          </div>
          <div class="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg text-center">
            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ stats.lines }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">总行数</div>
          </div>
          <div class="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-lg text-center">
            <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ stats.paragraphs }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">段落数</div>
          </div>
        </div>

        <!-- 详细统计 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-calculator" class="w-5 h-5" />
              <h3 class="font-semibold">详细统计</h3>
            </div>
          </template>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">中文字符</span>
              <span class="font-mono font-bold">{{ stats.chinese }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">英文字符</span>
              <span class="font-mono font-bold">{{ stats.english }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">数字</span>
              <span class="font-mono font-bold">{{ stats.numbers }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">标点符号</span>
              <span class="font-mono font-bold">{{ stats.punctuation }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">空白字符</span>
              <span class="font-mono font-bold">{{ stats.whitespace }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">非空字符</span>
              <span class="font-mono font-bold">{{ stats.nonWhitespace }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600 dark:text-gray-400">字节大小 (UTF-8)</span>
              <span class="font-mono font-bold">{{ stats.bytes }}</span>
            </div>
          </div>
        </UCard>

        <!-- 阅读预估 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-clock" class="w-5 h-5" />
              <h3 class="font-semibold">阅读预估</h3>
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <div class="text-xs text-gray-500 mb-1">阅读时间</div>
              <div class="text-lg font-semibold">{{ readingTime }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-1">朗读时间</div>
              <div class="text-lg font-semibold">{{ speakingTime }}</div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  if (minutes < 1) return '少于 1 分钟'
  if (minutes < 60) return `${minutes} 分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours} 小时 ${mins} 分钟`
}

// SEO
useHead({
  title: '文本统计分析 - 字数统计 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线文本统计工具，支持字数统计、词频分析、行数统计、阅读时间预估。支持中文和英文混合分析。' }
  ]
})
</script>
