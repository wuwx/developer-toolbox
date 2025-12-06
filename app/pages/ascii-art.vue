<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.asciiArt.title')" :description="$t('pages.asciiArt.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-sparkles" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.inputText') }}</h3></template>
        <UInput v-model="inputText" :placeholder="$t('ui.enterText')" size="xl" maxlength="20" class="w-full" />
        <div class="mt-4">
          <label class="text-sm font-medium mb-2 block">{{ $t('ui.fontStyle') }}</label>
          <USelect v-model="selectedFont" :options="fonts" size="lg" class="w-full" />
        </div>
      </UCard>

      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">ASCII Art</h3>
              <UButton v-if="asciiArt" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(asciiArt, 'ASCII Art')">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-900 rounded-lg overflow-x-auto">
            <pre class="font-mono text-xs text-green-400 whitespace-pre">{{ asciiArt || $t('ui.enterTextToGenerate') }}</pre>
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
const inputText = ref('HELLO')
const selectedFont = ref('standard')
const asciiArt = ref('')

const fonts = computed(() => [
  { label: t('ui.standard'), value: 'standard' },
  { label: t('ui.large'), value: 'big' },
  { label: t('ui.small'), value: 'small' }
])

const fontMaps: Record<string, Record<string, string>> = {
  standard: {
    'A': ' █████╗ \n██╔══██╗\n███████║\n██╔══██║\n██║  ██║\n╚═╝  ╚═╝',
    'B': '██████╗ \n██╔══██╗\n██████╔╝\n██╔══██╗\n██████╔╝\n╚═════╝ ',
    'C': ' ██████╗\n██╔════╝\n██║     \n██║     \n╚██████╗\n ╚═════╝',
    'D': '██████╗ \n██╔══██╗\n██║  ██║\n██║  ██║\n██████╔╝\n╚═════╝ ',
    'E': '███████╗\n██╔════╝\n█████╗  \n██╔══╝  \n███████╗\n╚══════╝',
    'F': '███████╗\n██╔════╝\n█████╗  \n██╔══╝  \n██║     \n╚═╝     ',
    'G': ' ██████╗ \n██╔════╝ \n██║  ███╗\n██║   ██║\n╚██████╔╝\n ╚═════╝ ',
    'H': '██╗  ██╗\n██║  ██║\n███████║\n██╔══██║\n██║  ██║\n╚═╝  ╚═╝',
    'I': '██╗\n██║\n██║\n██║\n██║\n╚═╝',
    'J': '     ██╗\n     ██║\n     ██║\n██   ██║\n╚█████╔╝\n ╚════╝ ',
    'K': '██╗  ██╗\n██║ ██╔╝\n█████╔╝ \n██╔═██╗ \n██║  ██╗\n╚═╝  ╚═╝',
    'L': '██╗     \n██║     \n██║     \n██║     \n███████╗\n╚══════╝',
    'M': '███╗   ███╗\n████╗ ████║\n██╔████╔██║\n██║╚██╔╝██║\n██║ ╚═╝ ██║\n╚═╝     ╚═╝',
    'N': '███╗   ██╗\n████╗  ██║\n██╔██╗ ██║\n██║╚██╗██║\n██║ ╚████║\n╚═╝  ╚═══╝',
    'O': ' ██████╗ \n██╔═══██╗\n██║   ██║\n██║   ██║\n╚██████╔╝\n ╚═════╝ ',
    'P': '██████╗ \n██╔══██╗\n██████╔╝\n██╔═══╝ \n██║     \n╚═╝     ',
    'Q': ' ██████╗ \n██╔═══██╗\n██║   ██║\n██║▄▄ ██║\n╚██████╔╝\n ╚══▀▀═╝ ',
    'R': '██████╗ \n██╔══██╗\n██████╔╝\n██╔══██╗\n██║  ██║\n╚═╝  ╚═╝',
    'S': '███████╗\n██╔════╝\n███████╗\n╚════██║\n███████║\n╚══════╝',
    'T': '████████╗\n╚══██╔══╝\n   ██║   \n   ██║   \n   ██║   \n   ╚═╝   ',
    'U': '██╗   ██╗\n██║   ██║\n██║   ██║\n██║   ██║\n╚██████╔╝\n ╚═════╝ ',
    'V': '██╗   ██╗\n██║   ██║\n██║   ██║\n╚██╗ ██╔╝\n ╚████╔╝ \n  ╚═══╝  ',
    'W': '██╗    ██╗\n██║    ██║\n██║ █╗ ██║\n██║███╗██║\n╚███╔███╔╝\n ╚══╝╚══╝ ',
    'X': '██╗  ██╗\n╚██╗██╔╝\n ╚███╔╝ \n ██╔██╗ \n██╔╝ ██╗\n╚═╝  ╚═╝',
    'Y': '██╗   ██╗\n╚██╗ ██╔╝\n ╚████╔╝ \n  ╚██╔╝  \n   ██║   \n   ╚═╝   ',
    'Z': '███████╗\n╚══███╔╝\n  ███╔╝ \n ███╔╝  \n███████╗\n╚══════╝',
    ' ': '   \n   \n   \n   \n   \n   '
  }
}

function generate() {
  const text = inputText.value.toUpperCase()
  const font = fontMaps[selectedFont.value] || fontMaps.standard
  const lines = ['', '', '', '', '', '']
  
  for (const char of text) {
    const charArt = font[char] || font[' ']
    const charLines = charArt.split('\n')
    charLines.forEach((line, i) => {
      lines[i] += line + ' '
    })
  }
  
  asciiArt.value = lines.join('\n')
}

watch([inputText, selectedFont], generate, { immediate: true })

useHead({ title: t('pages.asciiArt.title'), meta: [{ name: 'description', content: t('pages.asciiArt.description') }] })
</script>
