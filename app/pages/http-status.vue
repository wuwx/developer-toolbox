<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="HTTP 状态码查询"
      description="快速查找 HTTP 状态码含义和解决方案"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-signal" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 搜索和筛选 -->
    <div class="mb-8 flex flex-wrap gap-4">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="搜索状态码或描述..."
        size="lg"
        class="flex-1 min-w-[200px]"
      />
      <div class="flex gap-2">
        <UButton
          v-for="cat in categories"
          :key="cat.value"
          :color="selectedCategory === cat.value ? 'primary' : 'neutral'"
          :variant="selectedCategory === cat.value ? 'solid' : 'soft'"
          size="sm"
          @click="selectedCategory = cat.value"
        >
          {{ cat.label }}
        </UButton>
      </div>
    </div>

    <!-- 列表 -->
    <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <UCard
        v-for="code in filteredCodes"
        :key="code.code"
        class="group hover:ring-2 hover:ring-primary-500/50 transition-all"
      >
        <div class="flex items-start justify-between mb-2">
          <UBadge :color="getColor(code.code)" size="lg" variant="solid">
            {{ code.code }}
          </UBadge>
          <UIcon
            name="i-heroicons-information-circle"
            class="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            @click="showDetail(code)"
          />
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">{{ code.phrase }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ code.description }}</p>
      </UCard>
    </div>

    <!-- 详情 Modal -->
    <UModal v-model="isOpen">
      <div class="p-6" v-if="currentCode">
        <div class="flex items-center gap-4 mb-6">
          <UBadge :color="getColor(currentCode.code)" size="xl" variant="solid" class="text-xl px-4 py-2">
            {{ currentCode.code }}
          </UBadge>
          <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ currentCode.phrase }}</h3>
            <div class="text-sm text-gray-500">{{ getCategoryLabel(currentCode.code) }}</div>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white mb-2">描述</div>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ currentCode.description }}
            </p>
          </div>

          <div v-if="currentCode.solution">
            <div class="text-sm font-semibold text-gray-900 dark:text-white mb-2">解决方案 / 建议</div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-600 dark:text-gray-300">
              {{ currentCode.solution }}
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <UButton color="neutral" variant="ghost" @click="isOpen = false">关闭</UButton>
        </div>
      </div>
    </UModal>
  </UContainer>
</template>

<script setup lang="ts">
interface StatusCode {
  code: number
  phrase: string
  description: string
  solution?: string
}

const searchQuery = ref('')
const selectedCategory = ref('all')
const isOpen = ref(false)
const currentCode = ref<StatusCode | null>(null)

const categories = [
  { label: '全部', value: 'all' },
  { label: '1xx 信息', value: '1' },
  { label: '2xx 成功', value: '2' },
  { label: '3xx 重定向', value: '3' },
  { label: '4xx 客户端错误', value: '4' },
  { label: '5xx 服务端错误', value: '5' }
]

const codes: StatusCode[] = [
  // 1xx
  { code: 100, phrase: 'Continue', description: '服务器仅接收到部分请求，但是一旦服务器并没有拒绝该请求，客户端应该继续发送其余的请求。' },
  { code: 101, phrase: 'Switching Protocols', description: '服务器转换协议：服务器将遵从客户的请求转换到另外一种协议。' },
  
  // 2xx
  { code: 200, phrase: 'OK', description: '请求成功。一般用于 GET 与 POST 请求。' },
  { code: 201, phrase: 'Created', description: '已创建。成功请求并创建了新的资源。' },
  { code: 202, phrase: 'Accepted', description: '已接受。已经接受请求，但未处理完成。' },
  { code: 204, phrase: 'No Content', description: '无内容。服务器成功处理，但未返回内容。' },
  
  // 3xx
  { code: 301, phrase: 'Moved Permanently', description: '永久移动。请求的资源已被永久的移动到新URI，返回信息会包括新的URI，浏览器会自动定向到新URI。' },
  { code: 302, phrase: 'Found', description: '临时移动。与301类似。但资源只是临时被移动。客户端应继续使用原有URI。' },
  { code: 304, phrase: 'Not Modified', description: '未修改。所请求的资源未修改，服务器返回此状态码时，不会返回任何资源。' },
  
  // 4xx
  { code: 400, phrase: 'Bad Request', description: '客户端请求的语法错误，服务器无法理解。', solution: '检查请求参数、格式或语法是否正确。' },
  { code: 401, phrase: 'Unauthorized', description: '请求要求用户的身份认证。', solution: '请登录或提供有效的认证凭证（如 Token）。' },
  { code: 403, phrase: 'Forbidden', description: '服务器理解请求客户端的请求，但是拒绝执行此请求。', solution: '检查权限设置，确认是否有权访问该资源。' },
  { code: 404, phrase: 'Not Found', description: '服务器无法根据客户端的请求找到资源（网页）。', solution: '检查 URL 是否拼写正确，或资源是否已被删除。' },
  { code: 405, phrase: 'Method Not Allowed', description: '客户端请求中的方法被禁止。', solution: '检查使用的 HTTP 方法（GET/POST/PUT等）是否被服务端允许。' },
  { code: 429, phrase: 'Too Many Requests', description: '客户端发送的请求过多。', solution: '稍后重试，减少请求频率。' },
  
  // 5xx
  { code: 500, phrase: 'Internal Server Error', description: '服务器内部错误，无法完成请求。', solution: '查看服务器日志，检查代码是否有 bug 或配置错误。' },
  { code: 502, phrase: 'Bad Gateway', description: '作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应。', solution: '检查上游服务是否正常运行，或网关配置是否正确。' },
  { code: 503, phrase: 'Service Unavailable', description: '由于超载或系统维护，服务器暂时的无法处理客户端的请求。', solution: '服务可能正在维护或过载，稍后重试。' },
  { code: 504, phrase: 'Gateway Timeout', description: '充当网关或代理的服务器，未及时从远端服务器获取请求。', solution: '检查上游服务响应时间，或增加超时限制。' }
]

const filteredCodes = computed(() => {
  return codes.filter(code => {
    const matchSearch = 
      code.code.toString().includes(searchQuery.value) ||
      code.phrase.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      code.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      
    const matchCategory = 
      selectedCategory.value === 'all' ||
      Math.floor(code.code / 100).toString() === selectedCategory.value
      
    return matchSearch && matchCategory
  })
})

function getColor(code: number) {
  if (code >= 500) return 'error'
  if (code >= 400) return 'warning'
  if (code >= 300) return 'primary'
  if (code >= 200) return 'success'
  return 'neutral'
}

function getCategoryLabel(code: number) {
  const cat = Math.floor(code / 100)
  const map: Record<number, string> = {
    1: '信息响应',
    2: '成功响应',
    3: '重定向',
    4: '客户端错误',
    5: '服务端错误'
  }
  return map[cat] || '未知分类'
}

function showDetail(code: StatusCode) {
  currentCode.value = code
  isOpen.value = true
}

// SEO
useHead({
  title: 'HTTP 状态码查询 - 状态码含义速查 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 HTTP 状态码查询工具，快速查找 200, 404, 500 等状态码含义及解决方案。Web 开发必备参考。' }
  ]
})
</script>
