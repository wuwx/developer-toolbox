<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.qrScanner.title')" :description="$t('pages.qrScanner.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-qr-code" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="max-w-2xl mx-auto">
      <UCard>
        <div class="space-y-6">
          <div class="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer" @click="$refs.fileInput?.click()">
            <UIcon name="i-heroicons-photo" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p class="text-lg font-medium mb-2">{{ $t('ui.uploadImage') }}</p>
            <p class="text-sm text-gray-500">{{ $t('ui.supportFormats') }}</p>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile" />
          <div v-if="result" class="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div class="text-sm text-gray-500 mb-2">{{ $t('ui.scanResult') }}:</div>
            <div class="font-mono break-all">{{ result }}</div>
            <UButton class="mt-4" color="primary" @click="copyToClipboard(result, 'QR')">{{ $t('ui.copy') }}</UButton>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const fileInput = ref<HTMLInputElement | null>(null)
const result = ref('')

function handleFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  result.value = 'QR code scanning requires a dedicated library'
}

useHead({ title: t('pages.qrScanner.title'), meta: [{ name: 'description', content: t('pages.qrScanner.description') }] })
</script>
