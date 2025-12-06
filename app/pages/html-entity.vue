<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.htmlEntity.title')" :description="$t('pages.htmlEntity.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-6">
        <div class="flex justify-center">
          <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
            <UButton :color="mode === 'encode' ? 'primary' : 'neutral'" :variant="mode === 'encode' ? 'solid' : 'ghost'" size="md" class="px-6" @click="mode = 'encode'">{{ $t('ui.encode') }}</UButton>
            <UButton :color="mode === 'decode' ? 'primary' : 'neutral'" :variant="mode === 'decode' ? 'solid' : 'ghost'" size="md" class="px-6" @click="mode = 'decode'">{{ $t('ui.decode') }}</UButton>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('ui.input') }}</label>
            <UTextarea v-model="input" :placeholder="mode === 'encode' ? '<div class=\'test\'>' : '&lt;div class=&quot;test&quot;&gt;'" :rows="12" autoresize :maxrows="20" class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" />
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('ui.output') }}</label>
              <UButton color="neutral" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'Result')">{{ $t('ui.copy') }}</UButton>
            </div>
            <UTextarea v-model="output" readonly :rows="12" autoresize :maxrows="20" class="font-mono text-sm w-full" :ui="{ base: 'bg-gray-50 dark:bg-gray-800/50 p-4' }" />
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
const mode = ref<'encode' | 'decode'>('encode')
const input = ref('')

const output = computed(() => {
  if (!input.value) return ''
  if (mode.value === 'encode') return encodeHTML(input.value)
  return decodeHTML(input.value)
})

function encodeHTML(str: string) {
  const div = document.createElement('div')
  div.innerText = str
  return div.innerHTML
}

function decodeHTML(str: string) {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

useHead({ title: t('pages.htmlEntity.title'), meta: [{ name: 'description', content: t('pages.htmlEntity.description') }] })
</script>
