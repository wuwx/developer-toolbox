<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.regex.title')" :description="$t('pages.regex.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket-square" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.regexPattern') }}</h3>
            </div>
          </template>
          <div class="space-y-4">
            <div class="flex gap-2">
              <div class="flex-1 relative">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-lg">/</div>
                <UInput v-model="pattern" :placeholder="$t('ui.inputPlaceholder')" size="lg" class="font-mono pl-8 pr-8" :color="regexError ? 'error' : 'primary'" />
                <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-lg">/{{ flags }}</div>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <UCheckbox v-model="globalFlag" :label="$t('ui.globalMatch')" />
              <UCheckbox v-model="multilineFlag" :label="$t('ui.multilineMode')" />
              <UCheckbox v-model="insensitiveFlag" :label="$t('ui.caseInsensitive')" />
              <UCheckbox v-model="singlelineFlag" :label="$t('ui.singlelineMode')" />
            </div>
            <div v-if="regexError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div class="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 mt-0.5 shrink-0" />
                <span>{{ regexError }}</span>
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.testString') }}</h3>
              </div>
              <div class="flex items-center gap-2">
                <UBadge v-if="matches.length > 0" color="success" variant="subtle">{{ matches.length }} {{ $t('ui.matches') }}</UBadge>
                <UButton v-if="testText" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="testText = ''">{{ $t('ui.clear') }}</UButton>
              </div>
            </div>
          </template>
          <UTextarea v-model="testText" :placeholder="$t('ui.inputPlaceholder')" :rows="12" autoresize :maxrows="20" size="lg" class="font-mono text-sm w-full" />
          <div v-if="testText && matches.length > 0" class="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('ui.matchPreview') }}:</div>
            <div class="font-mono text-sm whitespace-pre-wrap break-words" v-html="highlightedText" />
          </div>
        </UCard>

        <UCard v-if="matches.length > 0">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-list-bullet" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.matchDetails') }}</h3>
            </div>
          </template>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div v-for="(match, index) in matches" :key="index" class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <UBadge color="primary" variant="subtle" size="sm">{{ $t('ui.match') }} {{ index + 1 }}</UBadge>
                    <span class="text-xs text-gray-500">{{ $t('ui.position') }}: {{ match.index }}</span>
                  </div>
                  <div class="font-mono text-sm text-gray-900 dark:text-white break-all">{{ match[0] }}</div>
                  <div v-if="match.length > 1" class="mt-2 space-y-1">
                    <div v-for="(group, groupIndex) in match.slice(1)" :key="groupIndex" class="text-xs">
                      <span class="text-gray-500">{{ $t('ui.group') }} {{ groupIndex + 1 }}:</span>
                      <span class="font-mono text-gray-700 dark:text-gray-300 ml-2">{{ group || $t('ui.none') }}</span>
                    </div>
                  </div>
                </div>
                <UButton color="neutral" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(match[0], 'Match')" />
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <div class="space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.commonPatterns') }}</h3>
            </div>
          </template>
          <div class="space-y-2">
            <button v-for="template in regexTemplates" :key="template.name" class="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800" @click="applyTemplate(template)">
              <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">{{ template.name }}</div>
              <div class="text-xs font-mono text-gray-500 dark:text-gray-400 break-all">{{ template.pattern }}</div>
            </button>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-academic-cap" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.quickRef') }}</h3>
            </div>
          </template>
          <div class="space-y-3 text-sm">
            <div>
              <div class="font-semibold text-gray-700 dark:text-gray-300 mb-1">{{ $t('ui.charClass') }}</div>
              <div class="space-y-1 text-xs font-mono text-gray-600 dark:text-gray-400">
                <div>\d - {{ $t('ui.digit') }}</div>
                <div>\w - {{ $t('ui.wordChar') }}</div>
                <div>\s - {{ $t('ui.whitespaceChar') }}</div>
                <div>. - {{ $t('ui.anyChar') }}</div>
              </div>
            </div>
            <div>
              <div class="font-semibold text-gray-700 dark:text-gray-300 mb-1">{{ $t('ui.quantifiers') }}</div>
              <div class="space-y-1 text-xs font-mono text-gray-600 dark:text-gray-400">
                <div>* - {{ $t('ui.zeroOrMore') }}</div>
                <div>+ - {{ $t('ui.oneOrMore') }}</div>
                <div>? - {{ $t('ui.zeroOrOne') }}</div>
              </div>
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
const { copyToClipboard } = useToolClipboard()

const pattern = ref('')
const testText = ref('')
const globalFlag = ref(true)
const multilineFlag = ref(false)
const insensitiveFlag = ref(false)
const singlelineFlag = ref(false)
const regexError = ref('')

const flags = computed(() => {
  let f = ''
  if (globalFlag.value) f += 'g'
  if (multilineFlag.value) f += 'm'
  if (insensitiveFlag.value) f += 'i'
  if (singlelineFlag.value) f += 's'
  return f
})

const regex = computed(() => {
  if (!pattern.value) return null
  try { regexError.value = ''; return new RegExp(pattern.value, flags.value) }
  catch (e) { regexError.value = e instanceof Error ? e.message : t('ui.regexError'); return null }
})

const matches = computed(() => {
  if (!regex.value || !testText.value) return []
  const results: RegExpExecArray[] = []
  if (globalFlag.value) {
    let match
    while ((match = regex.value.exec(testText.value)) !== null) {
      results.push(match)
      if (match.index === regex.value.lastIndex) regex.value.lastIndex++
    }
  } else {
    const match = regex.value.exec(testText.value)
    if (match) results.push(match)
  }
  return results
})

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
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

const regexTemplates = [
  { name: 'Email', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
  { name: 'URL', pattern: 'https?://[^\\s]+' },
  { name: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
  { name: 'Hex Color', pattern: '#[0-9a-fA-F]{6}\\b' },
  { name: 'HTML Tag', pattern: '<[^>]+>' }
]

function applyTemplate(template: typeof regexTemplates[0]) {
  pattern.value = template.pattern
  globalFlag.value = true
  multilineFlag.value = false
  insensitiveFlag.value = false
}

useHead({ title: t('pages.regex.title'), meta: [{ name: 'description', content: t('pages.regex.description') }] })
</script>
