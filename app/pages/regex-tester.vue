<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="正则表达式测试器"
      description="测试和调试正则表达式，实时显示匹配结果"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-magnifying-glass" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 配置区域 -->
      <div class="lg:col-span-1 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
              <h3 class="font-semibold">正则表达式</h3>
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium mb-2 block">表达式</label>
              <UInput
                v-model="pattern"
                placeholder="/pattern/flags"
                size="xl"
                class="font-mono"
              />
            </div>

            <!-- 标志 -->
            <div class="space-y-2">
              <label class="text-sm font-medium">标志 (Flags)</label>
              <div class="space-y-2">
                <UCheckbox v-model="flags.g" label="g - 全局匹配" />
                <UCheckbox v-model="flags.i" label="i - 忽略大小写" />
                <UCheckbox v-model="flags.m" label="m - 多行模式" />
                <UCheckbox v-model="flags.s" label="s - 单行模式 (dotAll)" />
                <UCheckbox v-model="flags.u" label="u - Unicode" />
              </div>
            </div>
          </div>
        </UCard>

        <!-- 快速参考 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
              <h3 class="font-semibold">快速参考</h3>
            </div>
          </template>

          <div class="text-xs space-y-2 font-mono">
            <div><span class="text-primary-600">\d</span> - 数字</div>
            <div><span class="text-primary-600">\w</span> - 单词字符</div>
            <div><span class="text-primary-600">\s</span> - 空白字符</div>
            <div><span class="text-primary-600">.</span> - 任意字符</div>
            <div><span class="text-primary-600">^</span> - 行首</div>
            <div><span class="text-primary-600">$</span> - 行尾</div>
            <div><span class="text-primary-600">*</span> - 0 或多次</div>
            <div><span class="text-primary-600">+</span> - 1 或多次</div>
            <div><span class="text-primary-600">?</span> - 0 或 1 次</div>
            <div><span class="text-primary-600">{'{'}n{'}'}</span> - 恰好 n 次</div>
            <div><span class="text-primary-600">()</span> - 捕获组</div>
            <div><span class="text-primary-600">[]</span> - 字符集</div>
          </div>
        </UCard>
      </div>

      <!-- 测试区域 -->
      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">测试文本</h3>
            </div>
          </template>

          <UTextarea
            v-model="testText"
            placeholder="输入测试文本..."
            :rows="10"
            class="font-mono"
          />
        </UCard>

        <!-- 匹配结果 -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
                <h3 class="font-semibold">匹配结果</h3>
              </div>
              <UBadge
                :color="matches.length > 0 ? 'success' : 'neutral'"
                variant="subtle"
              >
                {{ matches.length }} 个匹配
              </UBadge>
            </div>
          </template>

          <!-- 高亮显示 -->
          <div v-if="testText" class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
            <div class="font-mono text-sm whitespace-pre-wrap break-all" v-html="highlightedText"></div>
          </div>

          <!-- 匹配详情 -->
          <div v-if="matches.length > 0" class="space-y-2">
            <div
              v-for="(match, index) in matches"
              :key="index"
              class="p-3 bg-success-50 dark:bg-success-950/30 rounded-lg"
            >
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-medium text-gray-500">匹配 #{{ index + 1 }}</span>
                <span class="text-xs text-gray-500">位置: {{ match.index }}</span>
              </div>
              <div class="font-mono text-sm break-all">{{ match.value }}</div>
              
              <div v-if="match.groups && match.groups.length > 0" class="mt-2 space-y-1">
                <div
                  v-for="(group, gi) in match.groups"
                  :key="gi"
                  class="text-xs text-gray-600 dark:text-gray-400"
                >
                  <span class="font-medium">捕获组 {{ gi + 1 }}:</span> {{ group }}
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="error" class="p-4 bg-error-50 dark:bg-error-950/30 rounded-lg">
            <div class="flex items-center gap-2 text-error-600 dark:text-error-400">
              <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5" />
              <span class="font-medium">{{ error }}</span>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-400">
            <p>输入正则表达式和测试文本查看匹配结果</p>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const pattern = ref('')
const testText = ref('')
const flags = reactive({
  g: true,
  i: false,
  m: false,
  s: false,
  u: false
})

interface Match {
  value: string
  index: number
  groups: string[]
}

const matches = ref<Match[]>([])
const error = ref('')

const flagsString = computed(() => {
  return Object.entries(flags)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join('')
})

const highlightedText = computed(() => {
  if (!testText.value || matches.value.length === 0) {
    return testText.value
  }

  let result = ''
  let lastIndex = 0

  // 按位置排序匹配项
  const sorted = [...matches.value].sort((a, b) => a.index - b.index)

  sorted.forEach(match => {
    // 添加匹配前的文本
    result += escapeHtml(testText.value.substring(lastIndex, match.index))
    // 添加高亮的匹配文本
    result += `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${escapeHtml(match.value)}</mark>`
    lastIndex = match.index + match.value.length
  })

  // 添加剩余文本
  result += escapeHtml(testText.value.substring(lastIndex))

  return result
})

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function testRegex() {
  matches.value = []
  error.value = ''

  if (!pattern.value || !testText.value) {
    return
  }

  try {
    const regex = new RegExp(pattern.value, flagsString.value)
    const results: Match[] = []

    if (flags.g) {
      let match
      while ((match = regex.exec(testText.value)) !== null) {
        results.push({
          value: match[0],
          index: match.index,
          groups: match.slice(1)
        })
        // 防止无限循环
        if (regex.lastIndex === match.index) {
          regex.lastIndex++
        }
      }
    } else {
      const match = regex.exec(testText.value)
      if (match) {
        results.push({
          value: match[0],
          index: match.index,
          groups: match.slice(1)
        })
      }
    }

    matches.value = results
  } catch (e) {
    error.value = (e as Error).message
  }
}

watch([pattern, testText, flags], () => {
  testRegex()
}, { deep: true })

useHead({
  title: '正则表达式测试器 - Regex Tester | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线正则表达式测试工具，实时显示匹配结果和捕获组，支持多种标志位。' }
  ]
})
</script>
