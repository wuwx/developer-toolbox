<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.jwt.title')" :description="$t('pages.jwt.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-key" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="mb-8 space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Encoded Token</label>
          <UButton v-if="token" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="clearAll">{{ $t('ui.clear') }}</UButton>
        </div>
        <UTextarea v-model="token" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." :rows="8" size="xl" autoresize :maxrows="20" class="font-mono text-sm block w-full" :ui="{ base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 min-h-[200px] p-4 w-full' }" />
        <div v-if="error" class="animate-fade-in">
          <UAlert icon="i-heroicons-exclamation-triangle" :title="$t('ui.operationFailed')" :description="error" color="error" variant="subtle" size="sm" />
        </div>
      </div>

      <div v-if="decodedHeader || decodedPayload" class="grid gap-6 lg:grid-cols-2 animate-fade-in">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UBadge color="error" variant="subtle" size="sm">Header</UBadge>
              <span class="text-xs text-gray-500 font-normal">Algorithm & Token Type</span>
            </h3>
            <UButton size="xs" color="neutral" variant="ghost" icon="i-heroicons-clipboard-document" @click="() => copyToClipboard(JSON.stringify(decodedHeader, null, 2), 'Header')" />
          </div>
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg opacity-10 group-hover:opacity-20 transition duration-200"></div>
            <div class="relative bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 h-full">
              <pre class="text-xs sm:text-sm font-mono text-red-600 dark:text-red-400 overflow-auto max-h-[300px]">{{ JSON.stringify(decodedHeader, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UBadge color="primary" variant="subtle" size="sm">Payload</UBadge>
              <span class="text-xs text-gray-500 font-normal">Data & Claims</span>
            </h3>
            <UButton size="xs" color="neutral" variant="ghost" icon="i-heroicons-clipboard-document" @click="() => copyToClipboard(JSON.stringify(decodedPayload, null, 2), 'Payload')" />
          </div>
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-10 group-hover:opacity-20 transition duration-200"></div>
            <div class="relative bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 h-full">
              <pre class="text-xs sm:text-sm font-mono text-purple-600 dark:text-purple-400 overflow-auto max-h-[300px]">{{ JSON.stringify(decodedPayload, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <div v-if="timestamps.length > 0" class="mt-6 animate-fade-in">
        <USeparator class="mb-6" label="Time Info" />
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="ts in timestamps" :key="ts.key" class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="text-xs text-gray-500 mb-1 uppercase tracking-wider">{{ ts.label }} ({{ ts.key }})</div>
            <div class="font-medium text-sm">{{ ts.value }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ ts.relative }}</div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo :title="$t('ui.about') + ' JWT'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const token = ref('')
const error = ref('')
const decodedHeader = ref<any>(null)
const decodedPayload = ref<any>(null)
const { copyToClipboard } = useToolClipboard()

const timestamps = computed(() => {
  if (!decodedPayload.value) return []
  const list = []
  const keys = [{ key: 'iat', label: 'Issued At' }, { key: 'nbf', label: 'Not Before' }, { key: 'exp', label: 'Expires' }]
  for (const { key, label } of keys) {
    if (decodedPayload.value[key]) {
      const date = new Date(decodedPayload.value[key] * 1000)
      list.push({ key, label, value: date.toLocaleString(), relative: getRelativeTime(date) })
    }
  }
  return list
})

const getRelativeTime = (date: Date) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const absDiff = Math.abs(diff)
  const isPast = diff < 0
  const minutes = Math.floor(absDiff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return isPast ? `${days} days ago` : `in ${days} days`
  if (hours > 0) return isPast ? `${hours} hours ago` : `in ${hours} hours`
  if (minutes > 0) return isPast ? `${minutes} minutes ago` : `in ${minutes} minutes`
  return 'just now'
}

const decodeJWT = () => {
  if (!token.value) { clearAll(); return }
  try {
    error.value = ''
    const parts = token.value.split('.')
    if (parts.length !== 3) throw new Error('Invalid JWT format')
    decodedHeader.value = JSON.parse(base64UrlDecode(parts[0] || ''))
    decodedPayload.value = JSON.parse(base64UrlDecode(parts[1] || ''))
  } catch (err: any) {
    error.value = err.message || 'Parse failed'
    decodedHeader.value = null
    decodedPayload.value = null
  }
}

const base64UrlDecode = (str: string) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  switch (base64.length % 4) { case 2: base64 += '=='; break; case 3: base64 += '='; break; }
  try { return decodeURIComponent(escape(window.atob(base64))) } catch { return window.atob(base64) }
}

const clearAll = () => { token.value = ''; error.value = ''; decodedHeader.value = null; decodedPayload.value = null }
watch(token, decodeJWT)

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'structure', label: t('pages.jwt.structure'), icon: 'i-heroicons-cube', content: t('pages.jwt.structureContent') },
  { slot: 'security', label: t('pages.jwt.security'), icon: 'i-heroicons-shield-exclamation', content: t('pages.jwt.securityContent') }
])

useHead({ title: t('pages.jwt.title'), meta: [{ name: 'description', content: t('pages.jwt.description') }] })
</script>
