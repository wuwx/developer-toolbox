<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.textDiff.title')" :description="$t('pages.textDiff.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-arrows-right-left" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="space-y-6">
      <div class="grid lg:grid-cols-2 gap-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">Old</h3>
            </div>
          </template>
          <UTextarea v-model="oldText" :placeholder="$t('ui.inputPlaceholder')" :rows="15" class="font-mono w-full" />
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">New</h3>
            </div>
          </template>
          <UTextarea v-model="newText" :placeholder="$t('ui.inputPlaceholder')" :rows="15" class="font-mono w-full" />
        </UCard>
      </div>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-queue-list" class="w-5 h-5" />
              <h3 class="font-semibold">Diff</h3>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-sm text-gray-500">
                <span class="text-green-600 font-semibold">+{{ stats.added }}</span>
                <span class="mx-2">/</span>
                <span class="text-red-600 font-semibold">-{{ stats.removed }}</span>
              </div>
              <UButton color="primary" variant="soft" size="sm" icon="i-heroicons-arrow-path" @click="computeDiff">{{ $t('ui.regenerate') }}</UButton>
            </div>
          </div>
        </template>

        <div v-if="diffLines.length > 0" class="space-y-1 font-mono text-sm">
          <div v-for="(line, index) in diffLines" :key="index" class="flex items-start gap-2 px-3 py-1" :class="{ 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400': line.type === 'removed', 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400': line.type === 'added', 'text-gray-600 dark:text-gray-400': line.type === 'unchanged' }">
            <span class="text-gray-400 w-12 text-right shrink-0">{{ line.lineNum }}</span>
            <span class="font-bold w-6 shrink-0">{{ line.prefix }}</span>
            <span class="break-all">{{ line.content }}</span>
          </div>
        </div>
        <div v-else class="text-center py-12 text-gray-400">
          <UIcon name="i-heroicons-arrows-right-left" class="w-16 h-16 mx-auto mb-4" />
          <p>Enter text to see diff</p>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const oldText = ref('')
const newText = ref('')

interface DiffLine { type: 'added' | 'removed' | 'unchanged'; content: string; lineNum: string; prefix: string }
const diffLines = ref<DiffLine[]>([])
const stats = ref({ added: 0, removed: 0 })

function computeDiff() {
  const oldLines = oldText.value.split('\n')
  const newLines = newText.value.split('\n')
  const result: DiffLine[] = []
  let oldIndex = 0, newIndex = 0, added = 0, removed = 0

  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    const oldLine = oldLines[oldIndex]
    const newLine = newLines[newIndex]
    if (oldLine === newLine) {
      result.push({ type: 'unchanged', content: oldLine ?? '', lineNum: `${oldIndex + 1}`, prefix: ' ' })
      oldIndex++; newIndex++
    } else if (oldIndex >= oldLines.length) {
      result.push({ type: 'added', content: newLine ?? '', lineNum: '', prefix: '+' })
      newIndex++; added++
    } else if (newIndex >= newLines.length) {
      result.push({ type: 'removed', content: oldLine ?? '', lineNum: `${oldIndex + 1}`, prefix: '-' })
      oldIndex++; removed++
    } else {
      const nextOldMatches = oldLines[oldIndex + 1] === newLine
      const nextNewMatches = newLines[newIndex + 1] === oldLine
      if (nextOldMatches && !nextNewMatches) {
        result.push({ type: 'removed', content: oldLine ?? '', lineNum: `${oldIndex + 1}`, prefix: '-' })
        oldIndex++; removed++
      } else if (nextNewMatches && !nextOldMatches) {
        result.push({ type: 'added', content: newLine ?? '', lineNum: '', prefix: '+' })
        newIndex++; added++
      } else {
        result.push({ type: 'removed', content: oldLine ?? '', lineNum: `${oldIndex + 1}`, prefix: '-' })
        result.push({ type: 'added', content: newLine ?? '', lineNum: '', prefix: '+' })
        oldIndex++; newIndex++; removed++; added++
      }
    }
  }
  diffLines.value = result
  stats.value = { added, removed }
}

watch([oldText, newText], () => { if (oldText.value || newText.value) computeDiff() }, { immediate: true })

useHead({ title: t('pages.textDiff.title'), meta: [{ name: 'description', content: t('pages.textDiff.description') }] })
</script>
