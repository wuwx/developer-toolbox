<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.macGenerator.title')" :description="$t('pages.macGenerator.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-500 to-gray-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-cpu-chip" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-6">
        <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium mb-2">{{ $t('ui.separator') }}</label>
              <USelect v-model="separator" :options="separatorOptions" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">{{ $t('ui.case') }}</label>
              <USelect v-model="casing" :options="casingOptions" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">{{ $t('ui.count') }}</label>
              <UInput type="number" v-model="count" min="1" max="100" class="w-full" />
            </div>
          </div>
          
          <div class="mt-6">
            <UButton block size="lg" color="primary" icon="i-heroicons-arrow-path" @click="generate">{{ $t('ui.regenerate') }}</UButton>
          </div>
        </div>

        <div v-if="macs.length > 0" class="space-y-4 animate-fade-in">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">{{ $t('ui.result') }}</h3>
            <UButton color="neutral" variant="soft" size="sm" icon="i-heroicons-clipboard-document-list" @click="copyAll">{{ $t('ui.copyAll') }}</UButton>
          </div>
          <div class="grid gap-2">
            <div v-for="(mac, index) in macs" :key="index" class="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div class="font-mono text-lg">{{ mac }}</div>
              <UButton color="neutral" variant="ghost" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(mac, 'MAC')" />
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const separator = ref(':')
const casing = ref('upper')
const count = ref(5)
const macs = ref<string[]>([])

const separatorOptions = computed(() => [
  { label: t('ui.colon') + ' (:)', value: ':' },
  { label: t('ui.hyphen') + ' (-)', value: '-' },
  { label: t('ui.noSeparator'), value: '' }
])

const casingOptions = computed(() => [
  { label: t('ui.uppercase'), value: 'upper' },
  { label: t('ui.lowercase'), value: 'lower' }
])

const generate = () => {
  const newMacs = []
  const hex = '0123456789ABCDEF'
  for (let i = 0; i < count.value; i++) {
    let mac = ''
    for (let j = 0; j < 12; j++) mac += hex.charAt(Math.floor(Math.random() * 16))
    let formatted = separator.value ? mac.match(/.{1,2}/g)?.join(separator.value) || mac : mac
    if (casing.value === 'lower') formatted = formatted.toLowerCase()
    newMacs.push(formatted)
  }
  macs.value = newMacs
}

const copyAll = () => copyToClipboard(macs.value.join('\n'), 'All MAC')

onMounted(() => generate())

useHead({ title: t('pages.macGenerator.title'), meta: [{ name: 'description', content: t('pages.macGenerator.description') }] })
</script>
