<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.xmlFormatter.title')" :description="$t('pages.xmlFormatter.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="grid lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <UCard class="h-full flex flex-col">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">{{ $t('ui.input') }}</h3>
                <UButton v-if="input" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="input = ''">{{ $t('ui.clear') }}</UButton>
              </div>
            </template>
            <UTextarea v-model="input" placeholder="<root><child>text</child></root>" :rows="20" class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" />
          </UCard>
        </div>

        <div class="space-y-6">
          <UCard class="h-full flex flex-col">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">{{ $t('ui.output') }}</h3>
                <div class="flex gap-2">
                  <UButton color="neutral" variant="soft" size="xs" icon="i-heroicons-arrows-pointing-in" @click="compress">{{ $t('ui.compress') }}</UButton>
                  <UButton color="primary" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'XML')">{{ $t('ui.copy') }}</UButton>
                </div>
              </div>
            </template>
            <UTextarea v-model="output" readonly :rows="20" class="font-mono text-sm w-full text-blue-600 dark:text-blue-400" :ui="{ base: 'bg-gray-50 dark:bg-gray-800/50 p-4' }" />
          </UCard>
        </div>
      </div>
    </ToolCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const input = ref('<root><user id="1"><name>John</name><email>john@example.com</email></user></root>')

const output = computed(() => { if (!input.value) return ''; return formatXml(input.value) })

const compress = () => { if (!input.value) return; input.value = input.value.replace(/>\s+</g, '><').trim() }

function formatXml(xml: string) {
  let formatted = ''
  const reg = /(>)(<)(\/*)/g
  xml = xml.replace(reg, '$1\r\n$2$3')
  let pad = 0
  const PADDING = '  '
  xml.split('\r\n').forEach((node) => {
    let indent = 0
    if (node.match(/.+<\/\w[^>]*>$/)) indent = 0
    else if (node.match(/^<\/\w/)) { if (pad !== 0) pad -= 1 }
    else if (node.match(/^<\w[^>]*[^\/]>.*$/)) indent = 1
    else indent = 0
    let padding = ''
    for (let i = 0; i < pad; i++) padding += PADDING
    formatted += padding + node + '\r\n'
    pad += indent
  })
  return formatted.trim()
}

useHead({ title: t('pages.xmlFormatter.title'), meta: [{ name: 'description', content: t('pages.xmlFormatter.description') }] })
</script>
