<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.ulid.title')" :description="$t('pages.ulid.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-bars-arrow-down" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-6">
        <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium">{{ $t('ui.count') }}</label>
            <div class="w-32"><UInput type="number" v-model="count" min="1" max="50" class="w-full" /></div>
          </div>
          <UButton size="lg" color="primary" icon="i-heroicons-arrow-path" @click="generate">{{ $t('ui.regenerate') }}</UButton>
        </div>

        <div v-if="ulids.length > 0" class="space-y-4 animate-fade-in">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">{{ $t('ui.results') }}</h3>
            <UButton color="neutral" variant="soft" size="sm" icon="i-heroicons-clipboard-document-list" @click="copyAll">{{ $t('ui.copyAll') }}</UButton>
          </div>

          <div class="grid gap-2">
            <div
              v-for="(ulid, index) in ulids"
              :key="index"
              class="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div class="font-mono text-lg tracking-wide">{{ ulid }}</div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400 font-mono hidden sm:inline">{{ ulidTime(ulid) }}</span>
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(ulid, 'ULID')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo :title="$t('ui.aboutUlid')" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const count = ref(5)
const ulids = ref<string[]>([])

// Simple ULID implementation
const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const ENCODING_LEN = ENCODING.length
const TIME_LEN = 10
const RANDOM_LEN = 16

const encodeTime = (now: number, len: number): string => {
  let str = ''
  for (let i = len; i > 0; i--) {
    const mod = now % ENCODING_LEN
    str = ENCODING.charAt(mod) + str
    now = (now - mod) / ENCODING_LEN
  }
  return str
}

const encodeRandom = (len: number): string => {
  let str = ''
  for (let i = 0; i < len; i++) {
    str += ENCODING.charAt(Math.floor(Math.random() * ENCODING_LEN))
  }
  return str
}

const ulid = (seedTime?: number): string => {
  const now = seedTime || Date.now()
  return encodeTime(now, TIME_LEN) + encodeRandom(RANDOM_LEN)
}

const decodeTime = (id: string): number => {
  if (id.length !== TIME_LEN + RANDOM_LEN) throw new Error('Invalid ULID length')
  const timePart = id.substr(0, TIME_LEN)
  let time = 0
  for (let i = 0; i < TIME_LEN; i++) {
    time = time * ENCODING_LEN + ENCODING.indexOf(timePart.charAt(i))
  }
  return time
}

const ulidTime = (id: string) => {
  try {
    const time = decodeTime(id)
    return new Date(time).toLocaleString()
  } catch (e) {
    return '-'
  }
}

const generate = () => {
  const newUlids = []
  for (let i = 0; i < count.value; i++) {
    newUlids.push(ulid())
  }
  ulids.value = newUlids
}

const copyAll = () => {
  copyToClipboard(ulids.value.join('\n'), t('ui.allUlid'))
}

onMounted(() => {
  generate()
})

const accordionItems = computed<AccordionItem[]>(() => [
  {
    slot: 'what',
    label: t('ui.whatIsUlid'),
    icon: 'i-heroicons-question-mark-circle',
    content: t('ui.ulidDescription')
  },
  {
    slot: 'features',
    label: t('ui.ulidFeatures'),
    icon: 'i-heroicons-star',
    content: t('ui.ulidFeaturesContent')
  }
])

useHead({ title: t('pages.ulid.title'), meta: [{ name: 'description', content: t('pages.ulid.description') }] })
</script>
