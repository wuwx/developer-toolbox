<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.nanoid.title')" :description="$t('pages.nanoid.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-finger-print" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.settings') }}</h3></template>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-2 block">{{ $t('ui.length') }}: {{ size }}</label>
            <URange v-model="size" :min="8" :max="64" />
          </div>
          <div>
            <label class="text-sm font-medium mb-2 block">{{ $t('ui.count') }}: {{ count }}</label>
            <URange v-model="count" :min="1" :max="100" />
          </div>
          <div>
            <label class="text-sm font-medium mb-2 block">{{ $t('ui.charset') }}</label>
            <USelect v-model="alphabet" :options="alphabets" size="lg" />
          </div>
          <UButton block color="primary" size="lg" icon="i-heroicons-arrow-path" @click="generate">{{ $t('ui.generate') }}</UButton>
        </div>
      </UCard>

      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">{{ $t('ui.results') }} ({{ ids.length }})</h3>
              <UButton v-if="ids.length" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(ids.join('\\n'), 'Nano IDs')">{{ $t('ui.copyAll') }}</UButton>
            </div>
          </template>
          <div v-if="ids.length" class="space-y-2 max-h-[500px] overflow-y-auto">
            <div v-for="(id, i) in ids" :key="i" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg group">
              <code class="flex-1 font-mono text-sm break-all">{{ id }}</code>
              <UButton color="primary" variant="ghost" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(id, 'ID')" class="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div v-else class="text-center py-12 text-gray-400">
            <UIcon name="i-heroicons-finger-print" class="w-16 h-16 mx-auto mb-4" />
            <p>{{ $t('ui.clickToGenerate') }}</p>
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
const size = ref(21)
const count = ref(10)
const alphabet = ref('default')
const ids = ref<string[]>([])

const alphabets = [
  { label: 'Default (A-Za-z0-9_-)', value: 'default' },
  { label: 'Numbers (0-9)', value: 'numbers' },
  { label: 'Lowercase (a-z)', value: 'lowercase' },
  { label: 'Uppercase (A-Z)', value: 'uppercase' },
  { label: 'Hex (0-9a-f)', value: 'hex' }
]

const charSets: Record<string, string> = {
  default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-',
  numbers: '0123456789',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  hex: '0123456789abcdef'
}

function generate() {
  const charset = charSets[alphabet.value] || charSets.default
  ids.value = Array.from({ length: count.value }, () => {
    let id = ''
    const bytes = new Uint8Array(size.value)
    crypto.getRandomValues(bytes)
    for (let i = 0; i < size.value; i++) {
      id += charset[bytes[i]! % charset.length]
    }
    return id
  })
}

onMounted(() => generate())

useHead({ title: t('pages.nanoid.title'), meta: [{ name: 'description', content: t('pages.nanoid.description') }] })
</script>
