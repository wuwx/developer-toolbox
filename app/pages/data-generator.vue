<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.dataGenerator.title')" :description="$t('pages.dataGenerator.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-table-cells" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-3 gap-6">
      <UCard>
        <template #header><h3 class="font-semibold">配置</h3></template>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-2 block">数据类型</label>
            <USelect v-model="dataType" :options="[
              {label: '姓名', value: 'name'},
              {label: '邮箱', value: 'email'},
              {label: '手机号', value: 'phone'},
              {label: '地址', value: 'address'},
              {label: '公司', value: 'company'},
              {label: 'URL', value: 'url'}
            ]" class="w-full" />
          </div>
          <div>
            <label class="text-sm font-medium mb-2 block">数量: {{ count }}</label>
            <URange v-model="count" :min="1" :max="100" />
          </div>
          <UButton block color="primary" size="lg" @click="generate">生成数据</UButton>
        </div>
      </UCard>
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">生成结果</h3>
              <UButton v-if="results.length" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(results.join('\\n'), '数据')">复制</UButton>
            </div>
          </template>
          <div class="space-y-2 max-h-[500px] overflow-y-auto">
            <div v-for="(item, i) in results" :key="i" class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg font-mono text-sm">{{ item }}</div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const dataType = ref('name')
const count = ref(10)
const results = ref<string[]>([])

const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
const domains = ['gmail.com', 'qq.com', '163.com', 'outlook.com']
const companies = ['阿里巴巴', '腾讯', '百度', '字节跳动', '美团', '京东']

function generate() {
  results.value = []
  for (let i = 0; i < count.value; i++) {
    switch (dataType.value) {
      case 'name':
        results.value.push(names[Math.floor(Math.random() * names.length)])
        break
      case 'email':
        results.value.push(`user${i}@${domains[Math.floor(Math.random() * domains.length)]}`)
        break
      case 'phone':
        results.value.push(`1${Math.floor(Math.random() * 9) + 3}${Math.random().toString().slice(2, 11)}`)
        break
      case 'address':
        results.value.push(`北京市朝阳区${Math.floor(Math.random() * 100)}号`)
        break
      case 'company':
        results.value.push(companies[Math.floor(Math.random() * companies.length)])
        break
      case 'url':
        results.value.push(`https://example${i}.com`)
        break
    }
  }
}

useHead({ title: t('pages.dataGenerator.title') })
</script>
