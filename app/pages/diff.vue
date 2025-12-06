<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.diff.title')" :description="$t('pages.diff.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-scale" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="mb-6 flex flex-wrap gap-4">
      <UCheckbox v-model="ignoreWhitespace" label="Ignore whitespace" />
      <UCheckbox v-model="ignoreCase" label="Ignore case" />
      <UButton color="neutral" variant="soft" icon="i-heroicons-arrow-path" size="sm" @click="swapTexts">Swap</UButton>
      <UButton v-if="leftText || rightText" color="neutral" variant="ghost" icon="i-heroicons-x-mark" size="sm" @click="clearAll">{{ $t('ui.clear') }}</UButton>
    </div>

    <div v-if="leftText && rightText" class="mb-6 grid grid-cols-3 gap-4">
      <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.added }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Added</div>
      </div>
      <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.deleted }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Deleted</div>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.unchanged }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Unchanged</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-4">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">Original</h3>
            </div>
            <UBadge color="neutral" variant="subtle" size="sm">{{ leftText.split('\n').length }} lines</UBadge>
          </div>
        </template>
        <div v-if="!leftText || !rightText" class="relative">
          <UTextarea v-model="leftText" :placeholder="$t('ui.inputPlaceholder')" :rows="20" autoresize :maxrows="30" class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" />
        </div>
        <div v-else class="font-mono text-sm max-h-[600px] overflow-y-auto border border-gray-200 dark:border-gray-800 rounded-lg">
          <div v-for="(line, index) in diffResult.left" :key="index" class="flex border-b border-gray-100 dark:border-gray-800 last:border-b-0" :class="{ 'bg-red-50 dark:bg-red-900/20': line.type === 'deleted', 'bg-gray-50/50 dark:bg-gray-900/20': line.type === 'unchanged' }">
            <div class="w-12 flex-shrink-0 px-2 py-1 text-xs text-gray-400 text-right select-none border-r border-gray-200 dark:border-gray-800">{{ line.lineNumber }}</div>
            <div class="flex-1 px-3 py-1 whitespace-pre-wrap break-all">
              <span v-if="line.type === 'deleted'" class="bg-red-200 dark:bg-red-800">{{ line.text }}</span>
              <span v-else>{{ line.text }}</span>
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">Modified</h3>
            </div>
            <UBadge color="neutral" variant="subtle" size="sm">{{ rightText.split('\n').length }} lines</UBadge>
          </div>
        </template>
        <div v-if="!leftText || !rightText" class="relative">
          <UTextarea v-model="rightText" :placeholder="$t('ui.inputPlaceholder')" :rows="20" autoresize :maxrows="30" class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" />
        </div>
        <div v-else class="font-mono text-sm max-h-[600px] overflow-y-auto border border-gray-200 dark:border-gray-800 rounded-lg">
          <div v-for="(line, index) in diffResult.right" :key="index" class="flex border-b border-gray-100 dark:border-gray-800 last:border-b-0" :class="{ 'bg-green-50 dark:bg-green-900/20': line.type === 'added', 'bg-gray-50/50 dark:bg-gray-900/20': line.type === 'unchanged' }">
            <div class="w-12 flex-shrink-0 px-2 py-1 text-xs text-gray-400 text-right select-none border-r border-gray-200 dark:border-gray-800">{{ line.lineNumber }}</div>
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
definePageMeta({ layout: 'default' })

const { t } = useI18n()

interface DiffLine { type: 'added' | 'deleted' | 'unchanged'; text: string; lineNumber: number | null }

const leftText = ref('')
const rightText = ref('')
const ignoreWhitespace = ref(false)
const ignoreCase = ref(false)

const diffResult = computed(() => {
  if (!leftText.value && !rightText.value) return { left: [], right: [] }
  const leftLines = leftText.value.split('\n')
  const rightLines = rightText.value.split('\n')
  const processedLeft = leftLines.map(line => processLine(line))
  const processedRight = rightLines.map(line => processLine(line))
  return computeDiff(processedLeft, processedRight, leftLines, rightLines)
})

const stats = computed(() => ({
  added: diffResult.value.right.filter(line => line.type === 'added').length,
  deleted: diffResult.value.left.filter(line => line.type === 'deleted').length,
  unchanged: diffResult.value.left.filter(line => line.type === 'unchanged').length
}))

function processLine(line: string): string {
  let processed = line
  if (ignoreWhitespace.value) processed = processed.replace(/\s+/g, '')
  if (ignoreCase.value) processed = processed.toLowerCase()
  return processed
}

function computeDiff(processedLeft: string[], processedRight: string[], originalLeft: string[], originalRight: string[]) {
  const m = processedLeft.length, n = processedRight.length
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (processedLeft[i - 1] === processedRight[j - 1]) dp[i]![j] = (dp[i - 1]?.[j - 1] ?? 0) + 1
      else dp[i]![j] = Math.max(dp[i - 1]?.[j] ?? 0, dp[i]?.[j - 1] ?? 0)
    }
  }
  const left: DiffLine[] = [], right: DiffLine[] = []
  let i = m, j = n, leftLineNum = m, rightLineNum = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && processedLeft[i - 1] === processedRight[j - 1]) {
      left.unshift({ type: 'unchanged', text: originalLeft[i - 1] || '', lineNumber: leftLineNum })
      right.unshift({ type: 'unchanged', text: originalRight[j - 1] || '', lineNumber: rightLineNum })
      i--; j--; leftLineNum--; rightLineNum--
    } else if (j > 0 && (i === 0 || (dp[i]?.[j - 1] ?? 0) >= (dp[i - 1]?.[j] ?? 0))) {
      left.unshift({ type: 'added', text: '', lineNumber: null })
      right.unshift({ type: 'added', text: originalRight[j - 1] || '', lineNumber: rightLineNum })
      j--; rightLineNum--
    } else {
      left.unshift({ type: 'deleted', text: originalLeft[i - 1] || '', lineNumber: leftLineNum })
      right.unshift({ type: 'deleted', text: '', lineNumber: null })
      i--; leftLineNum--
    }
  }
  return { left, right }
}

function swapTexts() { const temp = leftText.value; leftText.value = rightText.value; rightText.value = temp }
function clearAll() { leftText.value = ''; rightText.value = '' }

useHead({ title: t('pages.diff.title'), meta: [{ name: 'description', content: t('pages.diff.description') }] })
</script>
