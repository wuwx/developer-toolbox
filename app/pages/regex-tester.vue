<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.regexTester.title')" :description="$t('pages.regexTester.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-magnifying-glass" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.regexPattern') }}</h3>
            </div>
          </template>
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.regexPattern') }}</label>
              <UInput v-model="pattern" placeholder="/pattern/flags" size="xl" class="font-mono" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Flags</label>
              <div class="space-y-2">
                <UCheckbox v-model="flags.g" :label="$t('ui.globalMatch')" />
                <UCheckbox v-model="flags.i" :label="$t('ui.caseInsensitive')" />
                <UCheckbox v-model="flags.m" :label="$t('ui.multilineMode')" />
                <UCheckbox v-model="flags.s" :label="$t('ui.singlelineMode')" />
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.quickRef') }}</h3>
            </div>
          </template>
          <div class="text-xs space-y-2 font-mono">
            <div><span class="text-primary-600">\d</span> - {{ $t('ui.digit') }}</div>
            <div><span class="text-primary-600">\w</span> - {{ $t('ui.wordChar') }}</div>
            <div><span class="text-primary-600">\s</span> - {{ $t('ui.whitespaceChar') }}</div>
            <div><span class="text-primary-600">.</span> - {{ $t('ui.anyChar') }}</div>
            <div><span class="text-primary-600">^</span> - {{ $t('ui.lineStart') }}</div>
            <div><span class="text-primary-600">$</span> - {{ $t('ui.lineEnd') }}</div>
            <div><span class="text-primary-600">*</span> - {{ $t('ui.zeroOrMore') }}</div>
            <div><span class="text-primary-600">+</span> - {{ $t('ui.oneOrMore') }}</div>
          </div>
        </UCard>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.testString') }}</h3>
            </div>
          </template>
          <UTextarea v-model="testText" :placeholder="$t('ui.inputPlaceholder')" :rows="10" class="font-mono" />
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.matchResult') }}</h3>
              </div>
              <UBadge :color="matches.length > 0 ? 'success' : 'neutral'" variant="subtle">{{ matches.length }} {{ $t('ui.matches') }}</UBadge>
            </div>
          </template>

          <div v-if="testText" class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
            <div class="font-mono text-sm whitespace-pre-wrap break-all" v-html="highlightedText"></div>
          </div>

          <div v-if="matches.length > 0" class="space-y-2">
            <div v-for="(match, index) in matches" :key="index" class="p-3 bg-success-50 dark:bg-success-950/30 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-medium text-gray-500">{{ $t('ui.match') }} #{{ index + 1 }}</span>
                <span class="text-xs text-gray-500">{{ $t('ui.position') }}: {{ match.index }}</span>
              </div>
              <div class="font-mono text-sm break-all">{{ match.value }}</div>
            </div>
          </div>

          <div v-else-if="error" class="p-4 bg-error-50 dark:bg-error-950/30 rounded-lg">
            <div class="flex items-center gap-2 text-error-600 dark:text-error-400">
              <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5" />
              <span class="font-medium">{{ error }}</span>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-400"><p>{{ $t('ui.inputPlaceholder') }}</p></div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()

const pattern = ref('')
const testText = ref('')
const flags = reactive({ g: true, i: false, m: false, s: false, u: false })

interface Match { value: string; index: number; groups: string[] }
const matches = ref<Match[]>([])
const error = ref('')

const flagsString = computed(() => Object.entries(flags).filter(([, value]) => value).map(([key]) => key).join(''))

const highlightedText = computed(() => {
  if (!testText.value || matches.value.length === 0) return testText.value
  let result = ''
  let lastIndex = 0
  const sorted = [...matches.value].sort((a, b) => a.index - b.index)
  sorted.forEach(match => {
    result += escapeHtml(testText.value.substring(lastIndex, match.index))
    result += `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${escapeHtml(match.value)}</mark>`
    lastIndex = match.index + match.value.length
  })
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
  if (!pattern.value || !testText.value) return
  try {
    const regex = new RegExp(pattern.value, flagsString.value)
    const results: Match[] = []
    if (flags.g) {
      let match
      while ((match = regex.exec(testText.value)) !== null) {
        results.push({ value: match[0], index: match.index, groups: match.slice(1) })
        if (regex.lastIndex === match.index) regex.lastIndex++
      }
    } else {
      const match = regex.exec(testText.value)
      if (match) results.push({ value: match[0], index: match.index, groups: match.slice(1) })
    }
    matches.value = results
  } catch (e) { error.value = (e as Error).message }
}

watch([pattern, testText, flags], () => testRegex(), { deep: true })

useHead({ title: t('pages.regexTester.title'), meta: [{ name: 'description', content: t('pages.regexTester.description') }] })
</script>
