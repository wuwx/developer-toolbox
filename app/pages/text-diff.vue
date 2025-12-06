<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="Text Diff 对比"
      description="对比两段文本的差异"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-arrows-right-left" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="space-y-6">
      <!-- 输入区域 -->
      <div class="grid lg:grid-cols-2 gap-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">原始文本 (Old)</h3>
            </div>
          </template>
          <UTextarea
            v-model="oldText"
            placeholder="输入原始文本..."
            :rows="15"
            class="font-mono w-full"
          />
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">新文本 (New)</h3>
            </div>
          </template>
          <UTextarea
            v-model="newText"
            placeholder="输入新文本..."
            :rows="15"
            class="font-mono w-full"
          />
        </UCard>
      </div>

      <!-- 对比结果 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-queue-list" class="w-5 h-5" />
              <h3 class="font-semibold">差异对比</h3>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-sm text-gray-500">
                <span class="text-green-600 font-semibold">+{{ stats.added }}</span>
                <span class="mx-2">/</span>
                <span class="text-red-600 font-semibold">-{{ stats.removed }}</span>
              </div>
              <UButton
                color="primary"
                variant="soft"
                size="sm"
                icon="i-heroicons-arrow-path"
                @click="computeDiff"
              >
                重新对比
              </UButton>
            </div>
          </div>
        </template>

        <div v-if="diffLines.length > 0" class="space-y-1 font-mono text-sm">
          <div
            v-for="(line, index) in diffLines"
            :key="index"
            class="flex items-start gap-2 px-3 py-1"
            :class="{
              'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400': line.type === 'removed',
              'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400': line.type === 'added',
              'text-gray-600 dark:text-gray-400': line.type === 'unchanged'
            }"
          >
            <span class="text-gray-400 w-12 text-right shrink-0">{{ line.lineNum }}</span>
            <span class="font-bold w-6 shrink-0">{{ line.prefix }}</span>
            <span class="break-all">{{ line.content }}</span>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-400">
          <UIcon name="i-heroicons-arrows-right-left" class="w-16 h-16 mx-auto mb-4" />
          <p>输入文本后自动显示差异</p>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const oldText = ref('')
const newText = ref('')

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  lineNum: string
  prefix: string
}

const diffLines = ref<DiffLine[]>([])
const stats = ref({ added: 0, removed: 0 })

function computeDiff() {
  const oldLines = oldText.value.split('\n')
  const newLines = newText.value.split('\n')

  const result: DiffLine[] = []
  let oldIndex = 0
  let newIndex = 0
  let added = 0
  let removed = 0

  // 简单的逐行对比算法（非 LCS，仅作演示）
  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    const oldLine = oldLines[oldIndex]
    const newLine = newLines[newIndex]

    if (oldLine === newLine) {
      result.push({
        type: 'unchanged',
        content: oldLine ?? '',
        lineNum: `${oldIndex + 1}`,
        prefix: ' '
      })
      oldIndex++
      newIndex++
    } else if (oldIndex >= oldLines.length) {
      // 只剩新行
      result.push({
        type: 'added',
        content: newLine ?? '',
        lineNum: '',
        prefix: '+'
      })
      newIndex++
      added++
    } else if (newIndex >= newLines.length) {
      // 只剩旧行
      result.push({
        type: 'removed',
        content: oldLine ?? '',
        lineNum: `${oldIndex + 1}`,
        prefix: '-'
      })
      oldIndex++
      removed++
    } else {
      // 检查下一行是否匹配
      const nextOldMatches = oldLines[oldIndex + 1] === newLine
      const nextNewMatches = newLines[newIndex + 1] === oldLine

      if (nextOldMatches && !nextNewMatches) {
        // 当前旧行被删除
        result.push({
          type: 'removed',
          content: oldLine ?? '',
          lineNum: `${oldIndex + 1}`,
          prefix: '-'
        })
        oldIndex++
        removed++
      } else if (nextNewMatches && !nextOldMatches) {
        // 当前新行被添加
        result.push({
          type: 'added',
          content: newLine ?? '',
          lineNum: '',
          prefix: '+'
        })
        newIndex++
        added++
      } else {
        // 都不匹配，显示为删除+添加
        result.push({
          type: 'removed',
          content: oldLine ?? '',
          lineNum: `${oldIndex + 1}`,
          prefix: '-'
        })
        result.push({
          type: 'added',
          content: newLine ?? '',
          lineNum: '',
          prefix: '+'
        })
        oldIndex++
        newIndex++
        removed++
        added++
      }
    }
  }

  diffLines.value = result
  stats.value = { added, removed }
}

watch([oldText, newText], () => {
  if (oldText.value || newText.value) {
    computeDiff()
  }
}, { immediate: true })

useHead({
  title: 'Text Diff 对比工具 - 文本差异查看器 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线文本差异对比工具，实时显示两段文本的增删改，适合代码 Review 和文档对比。' }
  ]
})
</script>
