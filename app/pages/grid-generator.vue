<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.gridGenerator.title')" :description="$t('pages.gridGenerator.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-squares-plus" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <div class="space-y-6">
        <UCard>
          <template #header><h3 class="font-semibold">{{ $t('ui.gridProps') }}</h3></template>
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.columns') }}: {{ cols }}</label>
              <URange v-model="cols" :min="1" :max="6" />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.rows') }}: {{ rows }}</label>
              <URange v-model="rows" :min="1" :max="6" />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.gap') }}: {{ gap }}px</label>
              <URange v-model="gap" :min="0" :max="50" />
            </div>
          </div>
        </UCard>
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">{{ $t('ui.cssCode') }}</h3>
              <UButton color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(cssCode, 'CSS')">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-900 rounded-lg">
            <pre class="text-xs text-gray-300">{{ cssCode }}</pre>
          </div>
        </UCard>
      </div>
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.preview') }}</h3></template>
        <div class="p-8 bg-gray-50 dark:bg-gray-900 rounded-lg" :style="gridStyle">
          <div v-for="i in cols * rows" :key="i" class="p-4 bg-primary-500 text-white rounded-lg flex items-center justify-center">{{ i }}</div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const cols = ref(3)
const rows = ref(2)
const gap = ref(16)

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${cols.value}, 1fr)`,
  gridTemplateRows: `repeat(${rows.value}, 1fr)`,
  gap: `${gap.value}px`
}))

const cssCode = computed(() => `.grid-container {
  display: grid;
  grid-template-columns: repeat(${cols.value}, 1fr);
  grid-template-rows: repeat(${rows.value}, 1fr);
  gap: ${gap.value}px;
}`)

useHead({ title: t('pages.gridGenerator.title'), meta: [{ name: 'description', content: t('pages.gridGenerator.description') }] })
</script>
