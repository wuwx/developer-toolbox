<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="正则表达式测试器"
      description="实时测试正则表达式，高亮显示匹配结果，提供常用正则模板"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket-square" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 左侧主要区域 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 正则表达式输入 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
              <h3 class="font-semibold">正则表达式</h3>
            </div>
          </template>

          <div class="space-y-4">
            <div class="flex gap-2">
              <div class="flex-1 relative">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-lg">/</div>
                <UInput
                  v-model="pattern"
                  placeholder="输入正则表达式..."
                  size="lg"
                  class="font-mono pl-8 pr-8"
                  :color="regexError ? 'error' : 'primary'"
                />
                <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-lg">/{{ flags }}</div>
              </div>
            </div>

            <!-- 标志选项 -->
            <div class="flex flex-wrap gap-2">
              <UCheckbox v-model="globalFlag" label="g - 全局匹配" />
              <UCheckbox v-model="multilineFlag" label="m - 多行模式" />
              <UCheckbox v-model="insensitiveFlag" label="i - 忽略大小写" />
              <UCheckbox v-model="singlelineFlag" label="s - 单行模式" />
            </div>

            <!-- 错误提示 -->
            <div v-if="regexError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div class="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 mt-0.5 shrink-0" />
                <span>{{ regexError }}</span>
              </div>
            </div>
          </div>
        </UCard>

        <!-- 测试文本 -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                <h3 class="font-semibold">测试文本</h3>
              </div>
              <div class="flex items-center gap-2">
                <UBadge v-if="matches.length > 0" color="success" variant="subtle">
                  {{ matches.length }} 个匹配
                </UBadge>
                <UButton
                  v-if="testText"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-x-mark"
                  @click="testText = ''"
                >
                  清空
                </UButton>
              </div>
            </div>
          </template>

          <UTextarea
            v-model="testText"
            placeholder="在此输入要测试的文本..."
            :rows="12"
            autoresize
            :maxrows="20"
            size="lg"
            class="font-mono text-sm w-full"
            :ui="{ base: 'p-4' }"
          />

          <!-- 高亮显示匹配结果 -->
          <div v-if="testText && matches.length > 0" class="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">匹配预览：</div>
            <div class="font-mono text-sm whitespace-pre-wrap break-words" v-html="highlightedText" />
          </div>
        </UCard>

        <!-- 匹配详情 -->
        <UCard v-if="matches.length > 0">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-list-bullet" class="w-5 h-5" />
              <h3 class="font-semibold">匹配详情</h3>
            </div>
          </template>

          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div
              v-for="(match, index) in matches"
              :key="index"
              class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <UBadge color="primary" variant="subtle" size="sm">匹配 {{ index + 1 }}</UBadge>
                    <span class="text-xs text-gray-500">位置: {{ match.index }}</span>
                  </div>
                  <div class="font-mono text-sm text-gray-900 dark:text-white break-all">
                    {{ match[0] }}
                  </div>
                  <!-- 捕获组 -->
                  <div v-if="match.length > 1" class="mt-2 space-y-1">
                    <div
                      v-for="(group, groupIndex) in match.slice(1)"
                      :key="groupIndex"
                      class="text-xs"
                    >
                      <span class="text-gray-500">组 {{ groupIndex + 1 }}:</span>
                      <span class="font-mono text-gray-700 dark:text-gray-300 ml-2">{{ group || '(无)' }}</span>
                    </div>
                  </div>
                </div>
                <UButton
                  color="neutral"
                  variant="soft"
                  size="xs"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(match[0], '匹配结果')"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- 右侧常用正则模板 -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
              <h3 class="font-semibold">常用正则</h3>
            </div>
          </template>

          <div class="space-y-2">
            <button
              v-for="template in regexTemplates"
              :key="template.name"
              class="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
              @click="applyTemplate(template)"
            >
              <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {{ template.name }}
              </div>
              <div class="text-xs font-mono text-gray-500 dark:text-gray-400 break-all">
                {{ template.pattern }}
              </div>
            </button>
          </div>
        </UCard>

        <!-- 快速参考 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-academic-cap" class="w-5 h-5" />
              <h3 class="font-semibold">快速参考</h3>
            </div>
          </template>

          <div class="space-y-3 text-sm">
            <div>
              <div class="font-semibold text-gray-700 dark:text-gray-300 mb-1">字符类</div>
              <div class="space-y-1 text-xs font-mono text-gray-600 dark:text-gray-400">
                <div>\d - 数字</div>
                <div>\w - 单词字符</div>
                <div>\s - 空白字符</div>
                <div>. - 任意字符</div>
              </div>
            </div>
            <div>
              <div class="font-semibold text-gray-700 dark:text-gray-300 mb-1">量词</div>
              <div class="space-y-1 text-xs font-mono text-gray-600 dark:text-gray-400">
                <div>* - 0次或多次</div>
                <div>+ - 1次或多次</div>
                <div>? - 0次或1次</div>
                <div>{n,m} - n到m次</div>
              </div>
            </div>
            <div>
              <div class="font-semibold text-gray-700 dark:text-gray-300 mb-1">位置</div>
              <div class="space-y-1 text-xs font-mono text-gray-600 dark:text-gray-400">
                <div>^ - 行首</div>
                <div>$ - 行尾</div>
                <div>\b - 单词边界</div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

// 正则表达式状态
const pattern = ref('')
const testText = ref('')
const globalFlag = ref(true)
const multilineFlag = ref(false)
const insensitiveFlag = ref(false)
const singlelineFlag = ref(false)
const regexError = ref('')

// 计算标志字符串
const flags = computed(() => {
  let f = ''
  if (globalFlag.value) f += 'g'
  if (multilineFlag.value) f += 'm'
  if (insensitiveFlag.value) f += 'i'
  if (singlelineFlag.value) f += 's'
  return f
})

// 编译正则表达式
const regex = computed(() => {
  if (!pattern.value) return null
  try {
    regexError.value = ''
    return new RegExp(pattern.value, flags.value)
  } catch (e) {
    regexError.value = e instanceof Error ? e.message : '正则表达式语法错误'
    return null
  }
})

// 匹配结果
const matches = computed(() => {
  if (!regex.value || !testText.value) return []
  
  const results: RegExpExecArray[] = []
  if (globalFlag.value) {
    let match
    while ((match = regex.value.exec(testText.value)) !== null) {
      results.push(match)
      if (match.index === regex.value.lastIndex) {
        regex.value.lastIndex++
      }
    }
  } else {
    const match = regex.value.exec(testText.value)
    if (match) results.push(match)
  }
  
  return results
})

// 高亮显示文本
const highlightedText = computed(() => {
  if (!testText.value || matches.value.length === 0) return testText.value
  
  let result = ''
  let lastIndex = 0
  
  matches.value.forEach(match => {
    const start = match.index
    const end = start + match[0].length
    
    result += escapeHtml(testText.value.slice(lastIndex, start))
    result += `<mark class="bg-yellow-200 dark:bg-yellow-700 px-1 rounded">${escapeHtml(match[0])}</mark>`
    lastIndex = end
  })
  
  result += escapeHtml(testText.value.slice(lastIndex))
  return result
})

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// 常用正则模板
const regexTemplates = [
  { name: '邮箱', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
  { name: '手机号', pattern: '^1[3-9]\\d{9}$' },
  { name: 'URL', pattern: 'https?://[^\\s]+' },
  { name: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { name: '日期 (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
  { name: '时间 (HH:MM:SS)', pattern: '\\d{2}:\\d{2}:\\d{2}' },
  { name: '十六进制颜色', pattern: '#[0-9a-fA-F]{6}\\b' },
  { name: '身份证号', pattern: '\\d{17}[\\dXx]' },
  { name: '数字 (整数)', pattern: '-?\\d+' },
  { name: '数字 (小数)', pattern: '-?\\d+\\.\\d+' },
  { name: 'HTML 标签', pattern: '<[^>]+>' },
  { name: '空白行', pattern: '^\\s*$' }
]

function applyTemplate(template: typeof regexTemplates[0]) {
  pattern.value = template.pattern
  globalFlag.value = true
  multilineFlag.value = false
  insensitiveFlag.value = false
}

// SEO
useHead({
  title: '正则表达式测试器 - 在线正则测试工具 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线正则表达式测试工具，支持实时匹配，高亮显示结果，提供常用正则模板库。开发者必备的正则调试工具。' }
  ]
})
</script>
