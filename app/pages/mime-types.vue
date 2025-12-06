<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="MIME Types 查询" description="常用文件 MIME 类型速查表" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-document" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <UCard>
      <template #header>
        <div class="flex items-center gap-4">
          <UInput v-model="search" placeholder="搜索扩展名或 MIME 类型..." size="xl" class="flex-1" icon="i-heroicons-magnifying-glass" />
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left font-semibold">扩展名</th>
              <th class="px-4 py-3 text-left font-semibold">MIME Type</th>
              <th class="px-4 py-3 text-left font-semibold">描述</th>
              <th class="px-4 py-3 text-center font-semibold">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr v-for="item in filteredMimes" :key="item.ext" class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <td class="px-4 py-3 font-mono text-primary-600">{{ item.ext }}</td>
              <td class="px-4 py-3 font-mono text-sm">{{ item.mime }}</td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ item.desc }}</td>
              <td class="px-4 py-3 text-center">
                <UButton color="primary" variant="ghost" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(item.mime, 'MIME')" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const search = ref('')

const mimeTypes = [
  { ext: '.html', mime: 'text/html', desc: 'HTML 文档' },
  { ext: '.css', mime: 'text/css', desc: 'CSS 样式表' },
  { ext: '.js', mime: 'application/javascript', desc: 'JavaScript' },
  { ext: '.json', mime: 'application/json', desc: 'JSON 数据' },
  { ext: '.xml', mime: 'application/xml', desc: 'XML 文档' },
  { ext: '.txt', mime: 'text/plain', desc: '纯文本' },
  { ext: '.pdf', mime: 'application/pdf', desc: 'PDF 文档' },
  { ext: '.zip', mime: 'application/zip', desc: 'ZIP 压缩包' },
  { ext: '.jpg', mime: 'image/jpeg', desc: 'JPEG 图片' },
  { ext: '.png', mime: 'image/png', desc: 'PNG 图片' },
  { ext: '.gif', mime: 'image/gif', desc: 'GIF 图片' },
  { ext: '.svg', mime: 'image/svg+xml', desc: 'SVG 矢量图' },
  { ext: '.webp', mime: 'image/webp', desc: 'WebP 图片' },
  { ext: '.ico', mime: 'image/x-icon', desc: '图标文件' },
  { ext: '.mp3', mime: 'audio/mpeg', desc: 'MP3 音频' },
  { ext: '.mp4', mime: 'video/mp4', desc: 'MP4 视频' },
  { ext: '.webm', mime: 'video/webm', desc: 'WebM 视频' },
  { ext: '.woff', mime: 'font/woff', desc: 'WOFF 字体' },
  { ext: '.woff2', mime: 'font/woff2', desc: 'WOFF2 字体' },
  { ext: '.ttf', mime: 'font/ttf', desc: 'TrueType 字体' },
  { ext: '.otf', mime: 'font/otf', desc: 'OpenType 字体' },
  { ext: '.csv', mime: 'text/csv', desc: 'CSV 表格' },
  { ext: '.doc', mime: 'application/msword', desc: 'Word 文档' },
  { ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', desc: 'Word 文档 (新)' },
  { ext: '.xls', mime: 'application/vnd.ms-excel', desc: 'Excel 表格' },
  { ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', desc: 'Excel 表格 (新)' },
  { ext: '.ppt', mime: 'application/vnd.ms-powerpoint', desc: 'PowerPoint' },
  { ext: '.pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', desc: 'PowerPoint (新)' }
]

const filteredMimes = computed(() => {
  if (!search.value) return mimeTypes
  const query = search.value.toLowerCase()
  return mimeTypes.filter(item => 
    item.ext.toLowerCase().includes(query) || 
    item.mime.toLowerCase().includes(query) ||
    item.desc.toLowerCase().includes(query)
  )
})

useHead({
  title: 'MIME Types 查询表 | 开发者工具箱',
  meta: [{ name: 'description', content: '常用文件 MIME 类型速查工具' }]
})
</script>
