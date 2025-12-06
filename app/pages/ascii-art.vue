<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="ASCII Art 生成器" description="将文本转换为 ASCII 艺术字" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-sparkles" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <UCard>
        <template #header><h3 class="font-semibold">输入文本</h3></template>
        <UInput v-model="inputText" placeholder="输入文字..." size="xl" maxlength="20" />
        <div class="mt-4">
          <label class="text-sm font-medium mb-2 block">字体样式</label>
          <USelect v-model="selectedFont" :options="fonts" size="lg" />
        </div>
      </UCard>

      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">ASCII Art</h3>
              <UButton v-if="asciiArt" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(asciiArt, 'ASCII Art')">复制</UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-900 rounded-lg overflow-x-auto">
            <pre class="font-mono text-xs text-green-400 whitespace-pre">{{ asciiArt || '输入文字生成 ASCII Art...' }}</pre>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const inputText = ref('HELLO')
const selectedFont = ref('standard')
const asciiArt = ref('')

const fonts = [
  { label: '标准', value: 'standard' },
  { label: '大号', value: 'big' },
  { label: '小号', value: 'small' }
]

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

useHead({
  title: 'ASCII Art 生成器 | 开发者工具箱',
  meta: [{ name: 'description', content: '在线 ASCII 艺术字生成工具' }]
})
</script>
