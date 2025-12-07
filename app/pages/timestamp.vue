<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.timestamp.title')" :description="$t('pages.timestamp.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 mb-6 shadow-xl">
          <UIcon name="i-heroicons-clock" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="mb-8 text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
      <h3 class="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">{{ $t('ui.currentTime') }} (Unix)</h3>
      <div class="flex flex-col items-center justify-center gap-2">
        <div class="font-mono text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white tracking-tight tabular-nums">{{ currentTimestamp }}</div>
        <div class="flex items-center gap-2 text-gray-500 mt-2">
          <UIcon name="i-heroicons-play-pause" class="w-4 h-4 animate-pulse" />
          <span class="font-mono text-lg">{{ currentDate }}</span>
        </div>
      </div>
      <div class="mt-6 flex justify-center gap-3">
        <UButton v-if="isPaused" icon="i-heroicons-play" color="success" variant="soft" @click="togglePause">{{ $t('ui.resume') }}</UButton>
        <UButton v-else icon="i-heroicons-pause" color="warning" variant="soft" @click="togglePause">{{ $t('ui.pause') }}</UButton>
        <UButton icon="i-heroicons-clipboard-document" color="neutral" variant="soft" @click="() => copyToClipboard(currentTimestamp.toString(), 'Timestamp')">{{ $t('ui.copy') }}</UButton>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-2">
      <ToolCard>
        <div class="flex items-center gap-2 mb-6">
          <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600"><UIcon name="i-heroicons-arrow-down-on-square" class="w-5 h-5" /></div>
          <h3 class="text-lg font-semibold">{{ $t('ui.toDate') }}</h3>
        </div>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Unix Timestamp</label>
            <div class="flex gap-2">
              <UInput v-model="inputTimestamp" :placeholder="$t('ui.inputPlaceholder')" class="flex-1 font-mono" icon="i-heroicons-hashtag" />
              <USelect v-model="timestampUnit" :options="[{ label: 's', value: 's' }, { label: 'ms', value: 'ms' }]" class="w-24" />
            </div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <div class="text-xs text-gray-500 mb-1">{{ $t('ui.localTime') }}</div>
            <div class="font-mono text-lg font-medium text-gray-900 dark:text-white break-all">{{ formattedDate || '-' }}</div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <div class="text-xs text-gray-500 mb-1">{{ $t('ui.utcTime') }}</div>
            <div class="font-mono text-lg font-medium text-gray-900 dark:text-white break-all">{{ formattedDateUTC || '-' }}</div>
          </div>
        </div>
      </ToolCard>

      <ToolCard>
        <div class="flex items-center gap-2 mb-6">
          <div class="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600"><UIcon name="i-heroicons-arrow-up-on-square" class="w-5 h-5" /></div>
          <h3 class="text-lg font-semibold">{{ $t('ui.toTimestamp') }}</h3>
        </div>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Date Time</label>
            <UInput type="datetime-local" v-model="inputDate" class="flex-1 font-mono" step="1" />
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <div class="flex items-center justify-between mb-1">
              <div class="text-xs text-gray-500">{{ $t('ui.timestampSeconds') }}</div>
              <UButton v-if="generatedTimestamp" icon="i-heroicons-clipboard-document" size="xs" color="neutral" variant="ghost" @click="() => copyToClipboard(generatedTimestamp!.toString(), 'Timestamp (s)')" />
            </div>
            <div class="font-mono text-lg font-medium text-blue-600 dark:text-blue-400">{{ generatedTimestamp || '-' }}</div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <div class="flex items-center justify-between mb-1">
              <div class="text-xs text-gray-500">{{ $t('ui.timestampMs') }}</div>
              <UButton v-if="generatedTimestampMs" icon="i-heroicons-clipboard-document" size="xs" color="neutral" variant="ghost" @click="() => copyToClipboard(generatedTimestampMs!.toString(), 'Timestamp (ms)')" />
            </div>
            <div class="font-mono text-lg font-medium text-purple-600 dark:text-purple-400">{{ generatedTimestampMs || '-' }}</div>
          </div>
        </div>
      </ToolCard>
    </div>

    <ToolInfo :title="$t('ui.about') + ' Timestamp'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const now = ref(new Date())
const isPaused = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const inputTimestamp = ref('')
const timestampUnit = ref('s')
const inputDate = ref('')

const currentTimestamp = computed(() => Math.floor(now.value.getTime() / 1000))
const currentDate = computed(() => now.value.toLocaleString())

const formattedDate = computed(() => {
  if (!inputTimestamp.value) return ''
  const ts = parseInt(inputTimestamp.value)
  if (isNaN(ts)) return 'Invalid'
  return new Date(timestampUnit.value === 's' ? ts * 1000 : ts).toLocaleString()
})

const formattedDateUTC = computed(() => {
  if (!inputTimestamp.value) return ''
  const ts = parseInt(inputTimestamp.value)
  if (isNaN(ts)) return 'Invalid'
  return new Date(timestampUnit.value === 's' ? ts * 1000 : ts).toUTCString()
})

const generatedTimestamp = computed(() => { if (!inputDate.value) return ''; return Math.floor(new Date(inputDate.value).getTime() / 1000) })
const generatedTimestampMs = computed(() => { if (!inputDate.value) return ''; return new Date(inputDate.value).getTime() })

const togglePause = () => {
  isPaused.value = !isPaused.value
  if (isPaused.value) { if (timer) clearInterval(timer) }
  else { now.value = new Date(); timer = setInterval(() => { now.value = new Date() }, 1000) }
}

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'what', label: t('pages.timestamp.what'), icon: 'i-heroicons-question-mark-circle', content: t('pages.timestamp.whatContent') },
  { slot: 'year2038', label: t('pages.timestamp.year2038'), icon: 'i-heroicons-exclamation-triangle', content: t('pages.timestamp.year2038Content') }
])

onMounted(() => {
  timer = setInterval(() => { now.value = new Date() }, 1000)
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  inputDate.value = d.toISOString().slice(0, 19)
})

onUnmounted(() => { if (timer) clearInterval(timer) })

useHead({ title: t('pages.timestamp.title'), meta: [{ name: 'description', content: t('pages.timestamp.description') }] })
</script>
