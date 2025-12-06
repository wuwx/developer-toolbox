<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.unicode.title')" :description="$t('pages.unicode.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-language" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="mb-6 flex items-center gap-4">
      <UButton :color="mode === 'encode' ? 'primary' : 'neutral'" :variant="mode === 'encode' ? 'solid' : 'soft'" icon="i-heroicons-arrow-down" @click="mode = 'encode'">{{ $t('ui.encode') }}</UButton>
      <UButton :color="mode === 'decode' ? 'primary' : 'neutral'" :variant="mode === 'decode' ? 'solid' : 'soft'" icon="i-heroicons-arrow-up" @click="mode = 'decode'">{{ $t('ui.decode') }}</UButton>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.input') }}</h3>
            </div>
            <UButton v-if="inputText" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="inputText = ''">{{ $t('ui.clear') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="inputText" :placeholder="mode === 'encode' ? 'Hello 你好' : '\\u4f60\\u597d'" :rows="12" autoresize :maxrows="20" class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" />
      </UCard>

      <div class="space-y-4">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.result') }}</h3>
              </div>
              <UButton v-if="result" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(result, 'Result')">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <UTextarea v-model="result" readonly :rows="12" autoresize :maxrows="20" class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" />
        </UCard>

        <UCard v-if="mode === 'encode'">
          <template #header><h3 class="font-semibold">{{ $t('ui.options') }}</h3></template>
          <div class="space-y-3">
            <URadio v-model="format" value="\u" label="\uXXXX (JavaScript/JSON)" />
            <URadio v-model="format" value="U+" label="U+XXXX (Unicode Standard)" />
            <URadio v-model="format" value="&#x" label="&#xXXXX; (HTML Hex)" />
            <URadio v-model="format" value="&#" label="&#DDDD; (HTML Decimal)" />
            <URadio v-model="format" value="css" label="\XXXX (CSS)" />
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
const mode = ref<'encode' | 'decode'>('encode')
const inputText = ref('')
const format = ref('\\u')

const result = computed(() => {
  if (!inputText.value) return ''
  if (mode.value === 'encode') return encode(inputText.value)
  return decode(inputText.value)
})

function encode(text: string): string {
  return text.split('').map(char => {
    const code = char.charCodeAt(0)
    const hex = code.toString(16).toUpperCase().padStart(4, '0')
    switch (format.value) {
      case '\\u': return `\\u${hex.toLowerCase()}`
      case 'U+': return `U+${hex}`
      case '&#x': return `&#x${hex};`
      case '&#': return `&#${code};`
      case 'css': return `\\${hex}`
      default: return `\\u${hex}`
    }
  }).join('')
}

function decode(text: string): string {
  try {
    let str = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    str = str.replace(/U\+([0-9a-fA-F]{4,6})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    str = str.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    str = str.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    return str
  } catch (e) { return t('ui.operationFailed') }
}

useHead({ title: t('pages.unicode.title'), meta: [{ name: 'description', content: t('pages.unicode.description') }] })
</script>
