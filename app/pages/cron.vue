<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.cron.title')" :description="$t('pages.cron.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-clock" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <template #header><div class="flex items-center gap-2"><UIcon name="i-heroicons-bolt" class="w-5 h-5" /><h3 class="font-semibold">Templates</h3></div></template>
          <div class="grid grid-cols-2 gap-2">
            <UButton v-for="preset in presets" :key="preset.name" color="neutral" variant="soft" size="sm" @click="applyPreset(preset)">{{ preset.name }}</UButton>
          </div>
        </UCard>

        <UCard>
          <template #header><div class="flex items-center gap-2"><UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" /><h3 class="font-semibold">{{ $t('ui.settings') }}</h3></div></template>
          <div class="space-y-4">
            <div v-for="field in fields" :key="field.name">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">{{ field.label }}</label>
              <div class="flex gap-2">
                <USelectMenu v-model="field.type" :options="typeOptions" size="sm" class="w-32" />
                <UInput v-if="field.type !== 'every'" v-model="field.value" :placeholder="field.placeholder" size="sm" class="flex-1 font-mono" />
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2"><UIcon name="i-heroicons-code-bracket" class="w-5 h-5" /><h3 class="font-semibold">Cron Expression</h3></div>
              <UButton color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(cronExpression, 'Cron')">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div class="font-mono text-lg text-center text-gray-900 dark:text-white font-bold">{{ cronExpression }}</div>
          </div>
        </UCard>
      </div>

      <div class="space-y-6">
        <UCard>
          <template #header><div class="flex items-center gap-2"><UIcon name="i-heroicons-information-circle" class="w-5 h-5" /><h3 class="font-semibold">Fields</h3></div></template>
          <div class="space-y-3 text-sm">
            <div class="font-mono text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-2">MIN HOUR DAY MON DOW</div>
            <div><div class="font-semibold text-gray-700 dark:text-gray-300">Minute</div><div class="text-xs text-gray-500">0-59</div></div>
            <div><div class="font-semibold text-gray-700 dark:text-gray-300">Hour</div><div class="text-xs text-gray-500">0-23</div></div>
            <div><div class="font-semibold text-gray-700 dark:text-gray-300">Day</div><div class="text-xs text-gray-500">1-31</div></div>
            <div><div class="font-semibold text-gray-700 dark:text-gray-300">Month</div><div class="text-xs text-gray-500">1-12</div></div>
            <div><div class="font-semibold text-gray-700 dark:text-gray-300">Day of Week</div><div class="text-xs text-gray-500">0-6 (0=Sun)</div></div>
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

const typeOptions = [{ label: 'Every', value: 'every' }, { label: 'Specific', value: 'specific' }]
const presets = [{ name: 'Every minute', cron: '* * * * *' }, { name: 'Every 5 min', cron: '*/5 * * * *' }, { name: 'Every hour', cron: '0 * * * *' }, { name: 'Daily 0:00', cron: '0 0 * * *' }, { name: 'Daily 12:00', cron: '0 12 * * *' }, { name: 'Mon 9:00', cron: '0 9 * * 1' }, { name: 'Monthly 1st', cron: '0 0 1 * *' }]

const fields = reactive([
  { name: 'minute', label: 'Minute (0-59)', type: 'every', value: '0', placeholder: '0' },
  { name: 'hour', label: 'Hour (0-23)', type: 'every', value: '0', placeholder: '0' },
  { name: 'day', label: 'Day (1-31)', type: 'every', value: '1', placeholder: '1' },
  { name: 'month', label: 'Month (1-12)', type: 'every', value: '1', placeholder: '1' },
  { name: 'week', label: 'Day of Week (0-6)', type: 'every', value: '0', placeholder: '0' }
])

const cronExpression = computed(() => fields.map(f => f.type === 'every' ? '*' : f.value).join(' '))

function applyPreset(preset: typeof presets[0]) {
  const parts = preset.cron.split(' ')
  fields.forEach((field, i) => {
    const part = parts[i] || '*'
    field.type = part === '*' || part.startsWith('*/') ? 'every' : 'specific'
    field.value = part === '*' || part.startsWith('*/') ? field.placeholder : part
  })
}

useHead({ title: t('pages.cron.title'), meta: [{ name: 'description', content: t('pages.cron.description') }] })
</script>
