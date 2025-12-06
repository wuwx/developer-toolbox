<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.markdown.title')" :description="$t('pages.markdown.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-900 mb-6 shadow-xl">
          <UIcon name="i-heroicons-pencil-square" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="mb-6 flex flex-wrap items-center gap-4">
      <UButton :color="mode === 'split' ? 'primary' : 'neutral'" :variant="mode === 'split' ? 'soft' : 'ghost'" size="sm" icon="i-heroicons-squares-2x2" @click="mode = 'split'">Split</UButton>
      <UButton :color="mode === 'edit' ? 'primary' : 'neutral'" :variant="mode === 'edit' ? 'soft' : 'ghost'" size="sm" icon="i-heroicons-pencil" @click="mode = 'edit'">Edit</UButton>
      <UButton :color="mode === 'preview' ? 'primary' : 'neutral'" :variant="mode === 'preview' ? 'soft' : 'ghost'" size="sm" icon="i-heroicons-eye" @click="mode = 'preview'">{{ $t('ui.preview') }}</UButton>
      <div class="ml-auto flex gap-2">
        <UButton color="neutral" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(markdown, 'Markdown')">{{ $t('ui.copy') }}</UButton>
        <UButton color="neutral" variant="soft" size="sm" icon="i-heroicons-arrow-down-tray" @click="downloadMarkdown">{{ $t('ui.download') }}</UButton>
        <UButton v-if="markdown" color="neutral" variant="ghost" size="sm" icon="i-heroicons-x-mark" @click="markdown = ''">{{ $t('ui.clear') }}</UButton>
      </div>
    </div>

    <div class="grid gap-4" :class="mode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'">
      <UCard v-if="mode !== 'preview'">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-pencil" class="w-5 h-5" />
              <h3 class="font-semibold">Editor</h3>
            </div>
            <UBadge color="neutral" variant="subtle" size="sm">{{ markdown.length }} {{ $t('ui.characters') }}</UBadge>
          </div>
        </template>
        <UTextarea v-model="markdown" placeholder="# Enter Markdown..." :rows="25" autoresize :maxrows="40" class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" />
      </UCard>

      <UCard v-if="mode !== 'edit'">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-eye" class="w-5 h-5" />
            <h3 class="font-semibold">{{ $t('ui.preview') }}</h3>
          </div>
        </template>
        <div v-if="markdown" class="prose prose-sm dark:prose-invert max-w-none" v-html="renderedHtml" />
        <div v-else class="text-center py-12 text-gray-400">Enter Markdown to preview</div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const markdown = ref('')
const mode = ref<'split' | 'edit' | 'preview'>('split')

const renderedHtml = computed(() => {
  if (!markdown.value) return ''
  let html = markdown.value
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">$1</code>')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />')
  html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
  html = html.replace(/^&gt;\s*(.*)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
  html = html.replace(/^---$/gm, '<hr class="my-4" />')
  html = html.replace(/^(?!<[hul]|<blockquote)(.+)$/gm, '<p>$1</p>')
  html = html.replace(/\n/g, '<br />')
  return html
})

function downloadMarkdown() {
  const blob = new Blob([markdown.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'document.md'; a.click()
  URL.revokeObjectURL(url)
}

useHead({ title: t('pages.markdown.title'), meta: [{ name: 'description', content: t('pages.markdown.description') }] })
</script>
