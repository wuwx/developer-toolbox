<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.hashFile.title')" :description="$t('pages.hashFile.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-finger-print" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <UCard>
      <template #header><h3 class="font-semibold">{{ $t('ui.input') }}</h3></template>
      <div class="space-y-6">
        <div class="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors hover:border-primary-400" @click="$refs.fileInput?.click()">
          <UIcon name="i-heroicons-document" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p class="text-lg font-medium mb-2">Click to select file</p>
          <p class="text-sm text-gray-500">Supports any file type</p>
        </div>

        <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" />

        <div v-if="fileName" class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-primary-500" />
            <div class="flex-1">
              <div class="font-medium">{{ fileName }}</div>
              <div class="text-sm text-gray-500">{{ fileSize }}</div>
            </div>
          </div>
        </div>

        <div v-if="computing" class="text-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 mx-auto mb-4 text-primary-500 animate-spin" />
          <p class="text-gray-500">Computing hash...</p>
        </div>

        <div v-if="hashes.md5" class="space-y-4">
          <div v-for="(value, algo) in hashes" :key="algo" class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold uppercase">{{ algo }}</span>
              <UButton color="primary" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(value, algo.toUpperCase())">{{ $t('ui.copy') }}</UButton>
            </div>
            <code class="text-xs font-mono break-all text-gray-600 dark:text-gray-400">{{ value }}</code>
          </div>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const fileInput = ref<HTMLInputElement | null>(null)
const fileName = ref('')
const fileSize = ref('')
const computing = ref(false)
const hashes = ref<Record<string, string>>({})

async function handleFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  fileName.value = file.name
  fileSize.value = formatBytes(file.size)
  computing.value = true
  hashes.value = {}
  try {
    const buffer = await file.arrayBuffer()
    const data = new Uint8Array(buffer)
    hashes.value = { md5: await computeHash(data, 'MD5'), sha1: await computeHash(data, 'SHA-1'), sha256: await computeHash(data, 'SHA-256') }
  } catch (e) { alert('Failed: ' + (e as Error).message) }
  finally { computing.value = false }
}

async function computeHash(data: Uint8Array, algorithm: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

useHead({ title: t('pages.hashFile.title'), meta: [{ name: 'description', content: t('pages.hashFile.description') }] })
</script>
