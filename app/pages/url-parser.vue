<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="URL 解析器"
      description="解析、编辑和构建 URL，支持查询参数单独编辑"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-link" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="space-y-6">
      <!-- 输入 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">输入 URL</h3>
            <div class="flex gap-2">
              <UButton
                color="neutral"
                variant="soft"
                size="xs"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(urlInput, 'URL')"
              >
                复制
              </UButton>
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click="urlInput = ''"
              >
                清空
              </UButton>
            </div>
          </div>
        </template>
        <UInput
          v-model="urlInput"
          placeholder="https://example.com/path?query=1"
          size="lg"
          class="font-mono"
        />
      </UCard>

      <div v-if="parsedUrl" class="grid lg:grid-cols-2 gap-6">
        <!-- 组成部分 -->
        <UCard>
          <template #header>
            <h3 class="font-semibold">URL 组件</h3>
          </template>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-medium text-gray-500">Protocol</label>
              <USelect
                v-model="components.protocol"
                :options="[{label: 'https:', value: 'https:'}, {label: 'http:', value: 'http:'}, {label: 'ftp:', value: 'ftp:'}, {label: 'ws:', value: 'ws:'}, {label: 'wss:', value: 'wss:'}]"
                size="sm"
                class="w-full"
              />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500">Hostname</label>
              <UInput v-model="components.hostname" size="sm" class="font-mono w-full" />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500">Port</label>
              <UInput v-model="components.port" size="sm" class="font-mono w-full" placeholder="Default" />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500">Pathname</label>
              <UInput v-model="components.pathname" size="sm" class="font-mono w-full" />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500">Hash</label>
              <UInput v-model="components.hash" size="sm" class="font-mono w-full" />
            </div>
          </div>
        </UCard>

        <!-- 查询参数 -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">查询参数 (Query Params)</h3>
              <UButton
                color="primary"
                variant="soft"
                size="xs"
                icon="i-heroicons-plus"
                @click="addParam"
              >
                添加
              </UButton>
            </div>
          </template>
          
          <div class="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            <div v-if="components.params.length === 0" class="text-sm text-gray-400 text-center py-4">
              无查询参数
            </div>
            <div 
              v-for="(param, index) in components.params" 
              :key="index"
              class="flex gap-2"
            >
              <UInput v-model="param.key" placeholder="Key" size="sm" class="flex-1 font-mono" />
              <UInput v-model="param.value" placeholder="Value" size="sm" class="flex-1 font-mono" />
              <UButton
                color="error"
                variant="ghost"
                icon="i-heroicons-trash"
                size="xs"
                @click="removeParam(index)"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const urlInput = ref('https://example.com/search?q=hello&page=1#top')
const parsedUrl = ref(true) // 始终显示编辑器

const components = reactive({
  protocol: 'https:',
  hostname: 'example.com',
  port: '',
  pathname: '/search',
  hash: '#top',
  params: [
    { key: 'q', value: 'hello' },
    { key: 'page', value: '1' }
  ]
})

// 双向绑定逻辑
let isUpdating = false

// 1. 监听 urlInput 变化 -> 解析并更新 components
watch(urlInput, (newUrl) => {
  if (isUpdating) return
  try {
    const url = new URL(newUrl)
    isUpdating = true
    
    components.protocol = url.protocol
    components.hostname = url.hostname
    components.port = url.port
    components.pathname = url.pathname
    components.hash = url.hash
    
    const params: {key: string, value: string}[] = []
    url.searchParams.forEach((value, key) => {
      params.push({ key, value })
    })
    components.params = params
    
    parsedUrl.value = true
    
    nextTick(() => isUpdating = false)
  } catch (e) {
    // 解析失败不更新 components
  }
})

// 2. 监听 components 变化 -> 构建并更新 urlInput
watch(components, () => {
  if (isUpdating) return
  try {
    const url = new URL('https://example.com') // Base
    
    url.protocol = components.protocol
    url.hostname = components.hostname || 'example.com'
    url.port = components.port
    url.pathname = components.pathname
    url.hash = components.hash
    
    // 清空原参数并重新添加
    // 注意：这种方式会丢失同名参数，但简化了逻辑
    const searchParams = new URLSearchParams()
    components.params.forEach(p => {
      if (p.key) searchParams.append(p.key, p.value)
    })
    url.search = searchParams.toString()
    
    isUpdating = true
    urlInput.value = url.toString()
    nextTick(() => isUpdating = false)
  } catch (e) {
    // 构建失败
  }
}, { deep: true })

function addParam() {
  components.params.push({ key: '', value: '' })
}

function removeParam(index: number) {
  components.params.splice(index, 1)
}

// SEO
useHead({
  title: 'URL 解析器 - URL Encode/Decode 编辑器 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 URL 解析器，可视化编辑 Protocol, Host, Path, Query Parameters，支持编码解码。' }
  ]
})
</script>
