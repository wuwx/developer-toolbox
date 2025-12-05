<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Lorem Ipsum 生成器</h1>
      <p class="text-gray-600 dark:text-gray-400">
        生成用于设计和排版的占位文本
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 配置区域 -->
      <div class="lg:col-span-1 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
              <h3 class="font-semibold">生成配置</h3>
            </div>
          </template>

          <div class="space-y-6">
            <!-- 单位 -->
            <div class="space-y-2">
              <label class="text-sm font-medium">生成单位</label>
              <div class="flex flex-col gap-2">
                <URadio v-model="unit" value="paragraphs" label="段落 (Paragraphs)" />
                <URadio v-model="unit" value="sentences" label="句子 (Sentences)" />
                <URadio v-model="unit" value="words" label="单词 (Words)" />
              </div>
            </div>

            <!-- 数量 -->
            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm font-medium">数量</label>
                <span class="text-sm font-bold text-primary-600">{{ count }}</span>
              </div>
              <URange v-model="count" :min="1" :max="50" />
            </div>

            <!-- 选项 -->
            <div class="space-y-3">
              <UCheckbox v-model="startWithLorem" label="以 'Lorem ipsum' 开头" />
              <UCheckbox v-model="asHtml" label="生成 HTML 标签 (<p>)" />
            </div>

            <UButton
              block
              color="primary"
              size="lg"
              icon="i-heroicons-arrow-path"
              @click="generate"
            >
              生成
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- 结果区域 -->
      <div class="lg:col-span-2">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                <h3 class="font-semibold">生成结果</h3>
              </div>
              <div class="flex gap-2">
                <UButton
                  v-if="result"
                  color="primary"
                  variant="soft"
                  size="sm"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(result, '文本')"
                >
                  复制
                </UButton>
              </div>
            </div>
          </template>

          <div class="relative flex-1 min-h-[400px]">
            <UTextarea
              v-model="result"
              readonly
              :rows="20"
              class="absolute inset-0 h-full w-full font-serif text-lg leading-relaxed"
              :ui="{ base: 'h-full' }"
            />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const unit = ref<'paragraphs' | 'sentences' | 'words'>('paragraphs')
const count = ref(3)
const startWithLorem = ref(true)
const asHtml = ref(false)
const result = ref('')

// 词库
const words = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est',
  'laborum'
]

function generate() {
  let text = ''
  
  if (unit.value === 'words') {
    text = generateWords(count.value)
  } else if (unit.value === 'sentences') {
    text = generateSentences(count.value)
  } else {
    text = generateParagraphs(count.value)
  }
  
  if (startWithLorem.value && !text.toLowerCase().startsWith('lorem ipsum')) {
    // 简单处理：如果是 words 模式，直接替换前两个词
    if (unit.value === 'words' && count.value >= 2) {
      const parts = text.split(' ')
      parts[0] = 'Lorem'
      parts[1] = 'ipsum'
      text = parts.join(' ')
    } else if (unit.value !== 'words') {
      // 其他模式强制加在开头
      text = 'Lorem ipsum dolor sit amet, ' + text.charAt(0).toLowerCase() + text.slice(1)
    }
  }
  
  result.value = text
}

function generateWords(n: number): string {
  const res = []
  for (let i = 0; i < n; i++) {
    res.push(randomWord())
  }
  return res.join(' ')
}

function generateSentences(n: number): string {
  const res = []
  for (let i = 0; i < n; i++) {
    const len = Math.floor(Math.random() * 10) + 5 // 5-15 words
    let sentence = generateWords(len)
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
    if (asHtml.value) {
      // 句子不需要特定的 HTML 标签，或者是 span? 暂不加
    }
    res.push(sentence)
  }
  return res.join(' ')
}

function generateParagraphs(n: number): string {
  const res = []
  for (let i = 0; i < n; i++) {
    const len = Math.floor(Math.random() * 5) + 3 // 3-8 sentences
    let paragraph = generateSentences(len)
    
    if (asHtml.value) {
      paragraph = `<p>${paragraph}</p>`
    }
    
    res.push(paragraph)
  }
  return res.join(asHtml.value ? '\n\n' : '\n\n')
}

function randomWord() {
  return words[Math.floor(Math.random() * words.length)]
}

// 初始化
onMounted(() => {
  generate()
})

// SEO
useHead({
  title: 'Lorem Ipsum 生成器 - 占位文本生成 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 Lorem Ipsum 生成器，快速生成占位文本，支持段落、句子、单词模式，可生成 HTML 标签。UI 设计师和开发者必备。' }
  ]
})
</script>
