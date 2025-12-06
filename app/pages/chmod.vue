<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.chmod.title')" :description="$t('pages.chmod.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-command-line" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <ToolCard>
        <div class="space-y-8">
          <div v-for="(perm, key) in permissions" :key="key" class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ key === 'owner' ? 'Owner' : key === 'group' ? 'Group' : 'Others' }}</h3>
              <UBadge color="primary" variant="subtle">{{ calculateScore(perm) }}</UBadge>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <UCheckbox v-model="perm.read" label="Read (4)" />
              <UCheckbox v-model="perm.write" label="Write (2)" />
              <UCheckbox v-model="perm.execute" label="Execute (1)" />
            </div>
            <USeparator v-if="key !== 'other'" />
          </div>
        </div>
      </ToolCard>

      <div class="space-y-6">
        <UCard>
          <template #header><h3 class="font-semibold flex items-center gap-2"><UIcon name="i-heroicons-calculator" class="w-5 h-5" />{{ $t('ui.result') }}</h3></template>
          <div class="space-y-6">
            <div class="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div class="text-sm text-gray-500 mb-2">Octal</div>
              <div class="text-6xl font-bold text-primary-600 font-mono tracking-wider">{{ octalCode }}</div>
            </div>
            <div class="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div class="text-sm text-gray-500 mb-2">Symbolic</div>
              <div class="text-2xl font-bold text-gray-700 dark:text-gray-200 font-mono tracking-widest">{{ symbolicCode }}</div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Linux Command</label>
              <div class="flex gap-2">
                <UInput :model-value="`chmod ${octalCode} filename`" readonly class="flex-1 font-mono" icon="i-heroicons-command-line" />
                <UButton color="neutral" variant="soft" icon="i-heroicons-clipboard-document" @click="copyToClipboard(`chmod ${octalCode} filename`, 'Command')" />
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

const permissions = reactive({
  owner: { read: true, write: true, execute: false },
  group: { read: true, write: false, execute: false },
  other: { read: true, write: false, execute: false }
})

const calculateScore = (p: { read: boolean, write: boolean, execute: boolean }) => (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0)
const getSymbol = (p: { read: boolean, write: boolean, execute: boolean }) => (p.read ? 'r' : '-') + (p.write ? 'w' : '-') + (p.execute ? 'x' : '-')

const octalCode = computed(() => `${calculateScore(permissions.owner)}${calculateScore(permissions.group)}${calculateScore(permissions.other)}`)
const symbolicCode = computed(() => getSymbol(permissions.owner) + getSymbol(permissions.group) + getSymbol(permissions.other))

useHead({ title: t('pages.chmod.title'), meta: [{ name: 'description', content: t('pages.chmod.description') }] })
</script>
