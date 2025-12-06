<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="文本差异对比"
      description="对比两段文本的差异，高亮显示新增、删除和修改的内容"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-scale" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 选项 -->
    <div class="mb-6 flex flex-wrap gap-4">
      <UCheckbox v-model="ignoreWhitespace" label="忽略空格" />
      <UCheckbox v-model="ignoreCase" label="忽略大小写" />
      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-path"
        size="sm"
        @click="swapTexts"
      >
        交换文本
      </UButton>
      <UButton
        v-if="leftText || rightText"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-x-mark"
        size="sm"
        @click="clearAll"
      >
        清空全部
      </UButton>
    </div>

    <!-- 统计信息 -->
    <div v-if="leftText && rightText" class="mb-6 grid grid-cols-3 gap-4">
      <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.added }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">新增行</div>
      </div>
      <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.deleted }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">删除行</div>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.unchanged }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">相同行</div>
      </div>
    </div>

    <!-- 差异对比区域 -->
    <div class="grid lg:grid-cols-2 gap-4">
      <!-- 左侧文本 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">原始文本</h3>
            </div>
            <div class="flex items-center gap-2">
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ leftText.split('\n').length }} 行
              </UBadge>
              <UButton
                v-if="leftText"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click="leftText = ''"
              >
                清空
              </UButton>
            </div>
          </div>
        </template>

        <div v-if="!leftText || !rightText" class="relative">
          <UTextarea
            v-model="leftText"
            placeholder="在此输入原始文本..."
            :rows="20"
            autoresize
            :maxrows="30"
            class="font-mono text-sm w-full"
            :ui="{ base: 'p-4' }"
          />
        </div>
        <div v-else class="font-mono text-sm max-h-[600px] overflow-y-auto border border-gray-200 dark:border-gray-800 rounded-lg">
          <div
            v-for="(line, index) in diffResult.left"
            :key="index"
            class="flex border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            :class="{
              'bg-red-50 dark:bg-red-900/20': line.type === 'deleted',
              'bg-gray-50/50 dark:bg-gray-900/20': line.type === 'unchanged'
            }"
          >
            <div class="w-12 flex-shrink-0 px-2 py-1 text-xs text-gray-400 text-right select-none border-r border-gray-200 dark:border-gray-800">
              {{ line.lineNumber }}
            </div>
            <div class="flex-1 px-3 py-1 whitespace-pre-wrap break-all">
              <span v-if="line.type === 'deleted'" class="bg-red-200 dark:bg-red-800">{{ line.text }}</span>
              <span v-else>{{ line.text }}</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- 右侧文本 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">修改后文本</h3>
            </div>
            <div class="flex items-center gap-2">
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ rightText.split('\n').length }} 行
              </UBadge>
              <UButton
                v-if="rightText"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click="rightText = ''"
              >
                清空
              </UButton>
            </div>
          </div>
        </template>

        <div v-if="!leftText || !rightText" class="relative">
          <UTextarea
            v-model="rightText"
            placeholder="在此输入修改后的文本..."
            :rows="20"
            autoresize
            :maxrows="30"
            class="font-mono text-sm w-full"
            :ui="{ base: 'p-4' }"
          />
        </div>
        <div v-else class="font-mono text-sm max-h-[600px] overflow-y-auto border border-gray-200 dark:border-gray-800 rounded-lg">
          <div
            v-for="(line, index) in diffResult.right"
            :key="index"
            class="flex border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            :class="{
              'bg-green-50 dark:bg-green-900/20': line.type === 'added',
              'bg-gray-50/50 dark:bg-gray-900/20': line.type === 'unchanged'
            }"
          >
            <div class="w-12 flex-shrink-0 px-2 py-1 text-xs text-gray-400 text-right select-none border-r border-gray-200 dark:border-gray-800">
              {{ line.lineNumber }}
            </div>
            <div class="flex-1 px-3 py-1 whitespace-pre-wrap break-all">
              <span v-if="line.type === 'added'" class="bg-green-200 dark:bg-green-800">{{ line.text }}</span>
              <span v-else>{{ line.text }}</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
interface DiffLine {
  type: 'added' | 'deleted' | 'unchanged'
  text: string
  lineNumber: number | null
}

const leftText = ref('')
const rightText = ref('')
const ignoreWhitespace = ref(false)
const ignoreCase = ref(false)

// 计算差异
const diffResult = computed(() => {
  if (!leftText.value && !rightText.value) {
    return { left: [], right: [] }
  }

  const leftLines = leftText.value.split('\n')
  const rightLines = rightText.value.split('\n')

  const processedLeft = leftLines.map(line => processLine(line))
  const processedRight = rightLines.map(line => processLine(line))

  const diff = computeDiff(processedLeft, processedRight, leftLines, rightLines)
  return diff
})

// 统计信息
const stats = computed(() => {
  const added = diffResult.value.right.filter(line => line.type === 'added').length
  const deleted = diffResult.value.left.filter(line => line.type === 'deleted').length
  const unchanged = diffResult.value.left.filter(line => line.type === 'unchanged').length
  
  return { added, deleted, unchanged }
})

// 处理单行（应用忽略选项）
function processLine(line: string): string {
  let processed = line
  if (ignoreWhitespace.value) {
    processed = processed.replace(/\s+/g, '')
  }
  if (ignoreCase.value) {
    processed = processed.toLowerCase()
  }
  return processed
}

// 简单的差异算法 (基于行的 LCS)
function computeDiff(
  processedLeft: string[],
  processedRight: string[],
  originalLeft: string[],
  originalRight: string[]
) {
  const m = processedLeft.length
  const n = processedRight.length

  // 构建 LCS 表
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0))
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (processedLeft[i - 1] === processedRight[j - 1]) {
        dp[i]![j] = (dp[i - 1]?.[j - 1] ?? 0) + 1
      } else {
        dp[i]![j] = Math.max(dp[i - 1]?.[j] ?? 0, dp[i]?.[j - 1] ?? 0)
      }
    }
  }

  // 回溯构建差异
  const left: DiffLine[] = []
  const right: DiffLine[] = []
  let i = m
  let j = n
  let leftLineNum = m
  let rightLineNum = n

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && processedLeft[i - 1] === processedRight[j - 1]) {
      left.unshift({ type: 'unchanged', text: originalLeft[i - 1] || '', lineNumber: leftLineNum })
      right.unshift({ type: 'unchanged', text: originalRight[j - 1] || '', lineNumber: rightLineNum })
      i--
      j--
      leftLineNum--
      rightLineNum--
    } else if (j > 0 && (i === 0 || (dp[i]?.[j - 1] ?? 0) >= (dp[i - 1]?.[j] ?? 0))) {
      left.unshift({ type: 'added', text: '', lineNumber: null })
      right.unshift({ type: 'added', text: originalRight[j - 1] || '', lineNumber: rightLineNum })
      j--
      rightLineNum--
    } else {
      left.unshift({ type: 'deleted', text: originalLeft[i - 1] || '', lineNumber: leftLineNum })
      right.unshift({ type: 'deleted', text: '', lineNumber: null })
      i--
      leftLineNum--
    }
  }

  return { left, right }
}

function swapTexts() {
  const temp = leftText.value
  leftText.value = rightText.value
  rightText.value = temp
}

function clearAll() {
  leftText.value = ''
  rightText.value = ''
}

// SEO
useHead({
  title: '文本差异对比工具 - Diff Checker | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线文本差异对比工具，左右分栏显示，高亮新增、删除和修改内容，支持忽略空格和大小写。代码审查必备。' }
  ]
})
</script>
