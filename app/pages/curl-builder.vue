<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="Curl 命令构建器"
      description="图形化配置 HTTP 请求参数，自动生成 Curl 命令"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-black mb-6 shadow-xl">
          <UIcon name="i-heroicons-command-line" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-8">
        <!-- 基本信息 -->
        <div class="grid gap-4 lg:grid-cols-12">
          <div class="lg:col-span-3">
            <label class="block text-sm font-medium mb-1">Method</label>
            <USelect v-model="method" :options="['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']" />
          </div>
          <div class="lg:col-span-9">
            <label class="block text-sm font-medium mb-1">URL</label>
            <UInput v-model="url" placeholder="https://api.example.com/v1/users" class="w-full" />
          </div>
        </div>

        <USeparator />

        <!-- Headers -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Headers</h3>
            <UButton size="xs" color="neutral" variant="soft" icon="i-heroicons-plus" @click="addHeader">添加</UButton>
          </div>
          <div v-for="(header, index) in headers" :key="index" class="flex gap-2">
            <UInput v-model="header.key" placeholder="Key (e.g. Content-Type)" class="flex-1" />
            <UInput v-model="header.value" placeholder="Value (e.g. application/json)" class="flex-1" />
            <UButton color="error" variant="ghost" icon="i-heroicons-trash" @click="removeHeader(index)" />
          </div>
          <div v-if="headers.length === 0" class="text-sm text-gray-400 italic">无 Header</div>
        </div>

        <USeparator />

        <!-- Body -->
        <div v-if="['POST', 'PUT', 'PATCH'].includes(method)" class="space-y-4">
          <h3 class="font-semibold">Request Body</h3>
          <UTextarea
            v-model="body"
            placeholder='{"key": "value"}'
            :rows="6"
            class="font-mono text-sm w-full"
            :ui="{ base: 'p-4' }"
          />
        </div>

        <!-- 结果 -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">生成的 Curl 命令</label>
            <UButton
              color="primary"
              variant="soft"
              size="xs"
              icon="i-heroicons-clipboard-document"
              @click="copyToClipboard(curlCommand, 'Curl 命令')"
            >
              复制
            </UButton>
          </div>
          <UTextarea
            v-model="curlCommand"
            readonly
            :rows="6"
            class="font-mono text-sm w-full"
            :ui="{ base: 'bg-gray-900 text-green-400 p-4' }"
          />
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

const method = ref('GET')
const url = ref('')
const headers = ref<{key: string, value: string}[]>([
  { key: 'Content-Type', value: 'application/json' }
])
const body = ref('')

const addHeader = () => {
  headers.value.push({ key: '', value: '' })
}

const removeHeader = (index: number) => {
  headers.value.splice(index, 1)
}

const curlCommand = computed(() => {
  let cmd = `curl -X ${method.value}`
  
  if (url.value) {
    cmd += ` "${url.value}"`
  } else {
    cmd += ` "http://localhost"`
  }
  
  headers.value.forEach(h => {
    if (h.key) {
      cmd += ` \\\n  -H "${h.key}: ${h.value}"`
    }
  })
  
  if (['POST', 'PUT', 'PATCH'].includes(method.value) && body.value) {
    // Simple escape for single quotes (not perfect but works for basic JSON)
    const escapedBody = body.value.replace(/'/g, "'\\''")
    cmd += ` \\\n  -d '${escapedBody}'`
  }
  
  return cmd
})

useHead({
  title: 'Curl 命令构建器 - 在线生成 HTTP 请求 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线图形化构建 Curl 命令，支持自定义 Header、Method 和 Body。' }
  ]
})
</script>
