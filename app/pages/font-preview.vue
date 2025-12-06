<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.fontPreview.title')" :description="$t('pages.fontPreview.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-language" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="space-y-6">
      <UCard>
        <div class="space-y-4">
          <UInput v-model="text" :placeholder="$t('ui.enterPreviewText')" size="xl" class="w-full" />
          <div>
            <label class="text-sm font-medium mb-2 block">{{ $t('ui.fontSize') }}: {{ fontSize }}px</label>
            <URange v-model="fontSize" :min="12" :max="120" />
          </div>
        </div>
      </UCard>
      <UCard v-for="font in fonts" :key="font">
        <div class="p-6" :style="{fontFamily: font, fontSize: fontSize + 'px'}">
          {{ text || '快速的棕色狐狸跳过懒狗 The Quick Brown Fox Jumps Over The Lazy Dog' }}
        </div>
        <template #footer>
          <div class="text-sm text-gray-500">{{ font }}</div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()
const text = ref('')
const fontSize = ref(32)
const fonts = [
  'Arial, sans-serif',
  'Helvetica, sans-serif',
  'Times New Roman, serif',
  'Georgia, serif',
  'Courier New, monospace',
  'Monaco, monospace',
  'Comic Sans MS, cursive',
  'Impact, fantasy',
  'system-ui',
  '-apple-system, BlinkMacSystemFont'
]

useHead({ title: t('pages.fontPreview.title'), meta: [{ name: 'description', content: t('pages.fontPreview.description') }] })
</script>
