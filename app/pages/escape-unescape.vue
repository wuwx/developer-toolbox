<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.escape.title')" :description="$t('pages.escape.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.input') }}</h3></template>
        <UTextarea v-model="input" :placeholder="$t('ui.inputPlaceholder')" :rows="15" class="w-full" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">{{ $t('ui.output') }}</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'Result')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" readonly class="w-full" />
      </UCard>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      <UButton block color="primary" @click="escapeHtml">HTML Escape</UButton>
      <UButton block color="primary" @click="unescapeHtml">HTML Unescape</UButton>
      <UButton block color="primary" @click="escapeJs">JavaScript Escape</UButton>
      <UButton block color="primary" @click="unescapeJs">JavaScript Unescape</UButton>
      <UButton block color="primary" @click="escapeJson">JSON Escape</UButton>
      <UButton block color="primary" @click="unescapeJson">JSON Unescape</UButton>
      <UButton block color="primary" @click="escapeXml">XML Escape</UButton>
      <UButton block color="primary" @click="unescapeXml">XML Unescape</UButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const input = ref('')
const output = ref('')

function escapeHtml() {
  output.value = input.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
function unescapeHtml() {
  output.value = input.value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}
function escapeJs() {
  output.value = input.value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
}
function unescapeJs() {
  output.value = input.value.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\')
}
function escapeJson() {
  try { output.value = JSON.stringify(input.value) } catch (e) { output.value = t('ui.operationFailed') }
}
function unescapeJson() {
  try { output.value = JSON.parse(input.value) } catch (e) { output.value = t('ui.operationFailed') }
}
function escapeXml() { escapeHtml() }
function unescapeXml() { unescapeHtml() }

useHead({ title: t('pages.escape.title'), meta: [{ name: 'description', content: t('pages.escape.description') }] })
</script>
