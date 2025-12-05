<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Markdown 预览器</h1>
      <p class="text-gray-600 dark:text-gray-400">
        实时预览 Markdown 文档，支持 GitHub Flavored Markdown 语法
      </p>
    </div>

    <!-- 工具栏 -->
    <div class="mb-6 flex flex-wrap items-center gap-4">
      <UButton
        :color="mode === 'split' ? 'primary' : 'neutral'"
        :variant="mode === 'split' ? 'soft' : 'ghost'"
        size="sm"
        icon="i-heroicons-squares-2x2"
        @click="mode = 'split'"
      >
        分栏
      </UButton>
      <UButton
        :color="mode === 'edit' ? 'primary' : 'neutral'"
        :variant="mode === 'edit' ? 'soft' : 'ghost'"
        size="sm"
        icon="i-heroicons-pencil"
        @click="mode = 'edit'"
      >
        编辑
      </UButton>
      <UButton
        :color="mode === 'preview' ? 'primary' : 'neutral'"
        :variant="mode === 'preview' ? 'soft' : 'ghost'"
        size="sm"
        icon="i-heroicons-eye"
        @click="mode = 'preview'"
      >
        预览
      </UButton>
      
      <div class="ml-auto flex gap-2">
        <UButton
          color="neutral"
          variant="soft"
          size="sm"
          icon="i-heroicons-clipboard-document"
          @click="copyToClipboard(markdown, 'Markdown')"
        >
          复制
        </UButton>
        <UButton
          color="neutral"
          variant="soft"
          size="sm"
          icon="i-heroicons-arrow-down-tray"
          @click="downloadMarkdown"
        >
          下载
        </UButton>
        <UButton
          v-if="markdown"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark"
          @click="markdown = ''"
        >
          清空
        </UButton>
      </div>
    </div>

    <!-- 主要区域 -->
    <div class="grid gap-4" :class="mode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'">
      <!-- 编辑器 -->
      <UCard v-if="mode !== 'preview'">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-pencil" class="w-5 h-5" />
              <h3 class="font-semibold">编辑器</h3>
            </div>
            <UBadge color="neutral" variant="subtle" size="sm">
              {{ markdown.length }} 字符
            </UBadge>
          </div>
        </template>

        <UTextarea
          v-model="markdown"
          placeholder="# 在此输入 Markdown...

## 快速开始

支持的语法：
- **粗体** 和 *斜体*
- [链接](https://example.com)
- `代码`
- 列表
- 表格
- 等等..."
          :rows="25"
          autoresize
          :maxrows="40"
          class="font-mono text-sm"
        />
      </UCard>

      <!-- 预览 -->
      <UCard v-if="mode !== 'edit'">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-eye" class="w-5 h-5" />
            <h3 class="font-semibold">预览</h3>
          </div>
        </template>

        <div
          v-if="markdown"
          class="prose prose-sm dark:prose-invert max-w-none"
          v-html="renderedHtml"
        />
        <div v-else class="text-center py-12 text-gray-400">
          在左侧输入 Markdown 查看预览
        </div>
      </UCard>
    </div>

    <!-- Markdown 语法参考 -->
    <div class="mt-8">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
            <h3 class="font-semibold">Markdown 语法参考</h3>
          </div>
        </template>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div>
            <div class="font-semibold text-gray-700 dark:text-gray-300 mb-2">标题</div>
            <div class="space-y-1 font-mono text-xs text-gray-600 dark:text-gray-400">
              <div># 一级标题</div>
              <div>## 二级标题</div>
              <div>### 三级标题</div>
            </div>
          </div>

          <div>
            <div class="font-semibold text-gray-700 dark:text-gray-300 mb-2">文本样式</div>
            <div class="space-y-1 font-mono text-xs text-gray-600 dark:text-gray-400">
              <div>**粗体**</div>
              <div>*斜体*</div>
              <div>~~删除线~~</div>
              <div>`代码`</div>
            </div>
          </div>

          <div>
            <div class="font-semibold text-gray-700 dark:text-gray-300 mb-2">列表</div>
            <div class="space-y-1 font-mono text-xs text-gray-600 dark:text-gray-400">
              <div>- 无序列表</div>
              <div>1. 有序列表</div>
              <div>- [ ] 任务列表</div>
            </div>
          </div>

          <div>
            <div class="font-semibold text-gray-700 dark:text-gray-300 mb-2">链接和图片</div>
            <div class="space-y-1 font-mono text-xs text-gray-600 dark:text-gray-400">
              <div>[链接](url)</div>
              <div>![图片](url)</div>
            </div>
          </div>

          <div>
            <div class="font-semibold text-gray-700 dark:text-gray-300 mb-2">代码块</div>
            <div class="space-y-1 font-mono text-xs text-gray-600 dark:text-gray-400">
              <div>```语言</div>
              <div>代码</div>
              <div>```</div>
            </div>
          </div>

          <div>
            <div class="font-semibold text-gray-700 dark:text-gray-300 mb-2">引用</div>
            <div class="space-y-1 font-mono text-xs text-gray-600 dark:text-gray-400">
              <div>&gt; 引用文本</div>
              <div>&gt;&gt; 嵌套引用</div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const markdown = ref('')
const mode = ref<'split' | 'edit' | 'preview'>('split')

// 渲染 HTML（简单实现，生产环境应使用 marked 或 markdown-it）
const renderedHtml = computed(() => {
  if (!markdown.value) return ''
  
  let html = markdown.value
  
  // 标题
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')
  
  // 粗体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // 斜体
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // 删除线
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')
  
  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">$1</code>')
  
  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')
  
  // 图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />')
  
  // 无序列表
  html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc list-inside">$1</ul>')
  
  // 有序列表
  html = html.replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>')
  
  // 引用
  html = html.replace(/^&gt;\s*(.*)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
  
  // 水平线
  html = html.replace(/^---$/gm, '<hr class="my-4" />')
  
  // 段落
  html = html.replace(/^(?!<[hul]|<blockquote)(.+)$/gm, '<p>$1</p>')
  
  // 换行
  html = html.replace(/\n/g, '<br />')
  
  return html
})

function downloadMarkdown() {
  const blob = new Blob([markdown.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.md'
  a.click()
  URL.revokeObjectURL(url)
}

// SEO
useHead({
  title: 'Markdown 预览器 - 在线 Markdown 编辑器 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 Markdown 预览器和编辑器，支持 GitHub Flavored Markdown，实时预览，分栏显示。写文档必备工具。' }
  ]
})
</script>
