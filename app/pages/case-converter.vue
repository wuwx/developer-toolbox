<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="文本大小写转换"
      description="支持 Camel、Snake、Kebab、Pascal 等多种命名风格互转"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-language" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- 输入区域 -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                <h3 class="font-semibold">输入文本</h3>
              </div>
              <div class="flex gap-2">
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
            </div>
          </template>

          <UTextarea
            v-model="inputText"
            placeholder="在此输入要转换的文本..."
            :rows="12"
            autoresize
            :maxrows="20"
            class="font-mono text-sm w-full"
            :ui="{ base: 'p-4' }"
          />
        </UCard>
      </div>

      <!-- 转换结果 -->
      <div class="space-y-4">
        <div v-for="converter in converters" :key="converter.id">
          <div class="flex items-center justify-between mb-1">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ converter.name }}
              <span class="text-xs text-gray-500 font-normal ml-2">{{ converter.desc }}</span>
            </label>
            <UButton
              v-if="inputText"
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-heroicons-clipboard-document"
              @click="copyToClipboard(convert(inputText, converter.id), converter.name)"
            >
              复制
            </UButton>
          </div>
          <div class="relative">
            <UInput
              :model-value="convert(inputText, converter.id)"
              readonly
              size="md"
              class="font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const inputText = ref('hello world example text')

const converters = [
  { id: 'lowercase', name: 'lower case', desc: '全小写' },
  { id: 'uppercase', name: 'UPPER CASE', desc: '全大写' },
  { id: 'camel', name: 'camelCase', desc: '驼峰式 (小)' },
  { id: 'pascal', name: 'PascalCase', desc: '驼峰式 (大)' },
  { id: 'snake', name: 'snake_case', desc: '下划线' },
  { id: 'kebab', name: 'kebab-case', desc: '短横线' },
  { id: 'constant', name: 'CONSTANT_CASE', desc: '常量式' },
  { id: 'dot', name: 'dot.case', desc: '点号分隔' },
  { id: 'path', name: 'path/case', desc: '路径分隔' },
  { id: 'sentence', name: 'Sentence case', desc: '句首大写' },
  { id: 'title', name: 'Title Case', desc: '标题式' },
  { id: 'alternating', name: 'aLtErNaTiNg cAsE', desc: '交替大小写' }
]

function convert(text: string, type: string): string {
  if (!text) return ''

  // 将文本分割成单词
  const words = text
    .replace(/([a-z])([A-Z])/g, '$1 $2') // 拆分驼峰
    .replace(/[-_.\/]/g, ' ') // 拆分分隔符
    .trim()
    .split(/\s+/)

  switch (type) {
    case 'lowercase':
      return text.toLowerCase()
      
    case 'uppercase':
      return text.toUpperCase()
      
    case 'camel':
      return words
        .map((w, i) => i === 0 ? w.toLowerCase() : capitalize(w))
        .join('')
        
    case 'pascal':
      return words
        .map(w => capitalize(w))
        .join('')
        
    case 'snake':
      return words
        .map(w => w.toLowerCase())
        .join('_')
        
    case 'kebab':
      return words
        .map(w => w.toLowerCase())
        .join('-')
        
    case 'constant':
      return words
        .map(w => w.toUpperCase())
        .join('_')
        
    case 'dot':
      return words
        .map(w => w.toLowerCase())
        .join('.')
        
    case 'path':
      return words
        .map(w => w.toLowerCase())
        .join('/')
        
    case 'sentence':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
      
    case 'title':
      return words
        .map(w => capitalize(w))
        .join(' ')
        
    case 'alternating':
      return text.split('').map((c, i) => 
        i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()
      ).join('')
      
    default:
      return text
  }
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

// SEO
useHead({
  title: '大小写转换工具 - Camel Snake Pascal Kebab | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线文本大小写转换工具，支持 CamelCase, Snake_case, Kebab-case, PascalCase 等多种命名规范互转。程序员必备变量名转换器。' }
  ]
})
</script>
