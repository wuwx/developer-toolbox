<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="Unicode 转换"
      description="字符与 Unicode 编码互转，支持多种常见格式"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-language" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 模式切换 -->
    <div class="mb-6 flex items-center gap-4">
      <UButton
        :color="mode === 'encode' ? 'primary' : 'neutral'"
        :variant="mode === 'encode' ? 'solid' : 'soft'"
        icon="i-heroicons-arrow-down"
        @click="mode = 'encode'"
      >
        字符转 Unicode
      </UButton>
      <UButton
        :color="mode === 'decode' ? 'primary' : 'neutral'"
        :variant="mode === 'decode' ? 'solid' : 'soft'"
        icon="i-heroicons-arrow-up"
        @click="mode = 'decode'"
      >
        Unicode 转字符
      </UButton>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- 输入 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">{{ mode === 'encode' ? '输入字符' : '输入 Unicode' }}</h3>
            </div>
            <UButton
              v-if="inputText"
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
              @click="inputText = ''"
            >
              清空
            </UButton>
          </div>
        </template>

        <UTextarea
          v-model="inputText"
          :placeholder="mode === 'encode' ? '输入要转换的文字...' : '\\u4f60\\u597d'"
          :rows="12"
          autoresize
          :maxrows="20"
          class="font-mono text-sm w-full"
          :ui="{ base: 'p-4' }"
        />
      </UCard>

      <!-- 输出 -->
      <div class="space-y-4">
        <!-- 主要输出 -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
                <h3 class="font-semibold">转换结果</h3>
              </div>
              <UButton
                v-if="result"
                color="primary"
                variant="soft"
                size="sm"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(result, '结果')"
              >
                复制
              </UButton>
            </div>
          </template>

          <UTextarea
            v-model="result"
            readonly
            :rows="12"
            autoresize
            :maxrows="20"
            class="font-mono text-sm w-full"
            :ui="{ base: 'p-4' }"
          />
        </UCard>

        <!-- 编码格式选项 (仅编码模式) -->
        <UCard v-if="mode === 'encode'">
          <template #header>
            <h3 class="font-semibold">格式选项</h3>
          </template>

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
const { copyToClipboard } = useToolClipboard()

const mode = ref<'encode' | 'decode'>('encode')
const inputText = ref('')
const format = ref('\\u')

const result = computed(() => {
  if (!inputText.value) return ''
  
  if (mode.value === 'encode') {
    return encode(inputText.value)
  } else {
    return decode(inputText.value)
  }
})

function encode(text: string): string {
  return text.split('').map(char => {
    const code = char.charCodeAt(0)
    const hex = code.toString(16).toUpperCase().padStart(4, '0')
    
    switch (format.value) {
      case '\\u':
        return `\\u${hex.toLowerCase()}`
      case 'U+':
        return `U+${hex}`
      case '&#x':
        return `&#x${hex};`
      case '&#':
        return `&#${code};`
      case 'css':
        return `\\${hex}`
      default:
        return `\\u${hex}`
    }
  }).join('')
}

function decode(text: string): string {
  try {
    // 处理 \uXXXX
    let str = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => 
      String.fromCharCode(parseInt(hex, 16))
    )
    
    // 处理 U+XXXX
    str = str.replace(/U\+([0-9a-fA-F]{4,6})/g, (_, hex) => 
      String.fromCharCode(parseInt(hex, 16))
    )
    
    // 处理 HTML Hex
    str = str.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => 
      String.fromCharCode(parseInt(hex, 16))
    )
    
    // 处理 HTML Decimal
    str = str.replace(/&#(\d+);/g, (_, dec) => 
      String.fromCharCode(parseInt(dec, 10))
    )
    
    return str
  } catch (e) {
    return '解码失败'
  }
}

// SEO
useHead({
  title: 'Unicode 编码转换工具 - 字符与 Unicode 互转 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 Unicode 编码转换工具，支持中文转 Unicode，Unicode 转中文。支持 \\u, U+, HTML 实体等多种格式。' }
  ]
})
</script>
