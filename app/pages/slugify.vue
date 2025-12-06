<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="Slugify 转换器"
      description="将文本转换为 URL 友好的 Slug 格式，适用于 SEO 和文件名生成"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-link" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- 输入 -->
        <div class="space-y-6">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">输入文本</h3>
                <UButton
                  v-if="input"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-x-mark"
                  @click="input = ''"
                >
                  清空
                </UButton>
              </div>
            </template>
            <UTextarea
              v-model="input"
              placeholder="Hello World! This is a test."
              :rows="8"
              autoresize
              class="font-mono text-sm w-full"
              :ui="{ base: 'p-4' }"
            />
          </UCard>

          <!-- 选项 -->
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">分隔符</label>
              <UInput v-model="separator" placeholder="-" />
            </div>
            <div class="flex items-end mb-1">
              <UCheckbox v-model="lowercase" label="转小写" />
            </div>
          </div>
        </div>

        <!-- 输出 -->
        <div class="space-y-6">
          <UCard class="h-full flex flex-col">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">转换结果 (Slug)</h3>
                <UButton
                  color="primary"
                  variant="soft"
                  size="xs"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(output, 'Slug')"
                >
                  复制
                </UButton>
              </div>
            </template>
            <UTextarea
              v-model="output"
              readonly
              :rows="8"
              autoresize
              class="font-mono text-sm w-full h-full"
              :ui="{ base: 'bg-gray-50 dark:bg-gray-800/50 p-4 h-full' }"
            />
          </UCard>
        </div>
      </div>
    </ToolCard>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

definePageMeta({
  layout: 'default'
})

const input = ref('Hello World! This is a test.')
const separator = ref('-')
const lowercase = ref(true)

const output = computed(() => {
  if (!input.value) return ''
  
  let text = input.value.toString().trim()
  
  if (lowercase.value) {
    text = text.toLowerCase()
  }
  
  const sep = separator.value || '-'
  
  return text
    .replace(/\s+/g, sep)           // Replace spaces with -
    .replace(/&/g, `${sep}and${sep}`)         // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, sep)         // Replace multiple - with single -
    .replace(new RegExp(`^${sep}+|${sep}+$`, 'g'), '') // Trim - from start and end
})

useHead({
  title: 'Slugify 文本转换工具 - URL 友好字符串生成',
  meta: [
    { name: 'description', content: '在线 Slugify 工具，将标题或文本转换为 URL 友好的 Slug 格式。' }
  ]
})
</script>
