<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Cron 表达式生成器</h1>
      <p class="text-gray-600 dark:text-gray-400">
        可视化配置定时任务，生成标准 Cron 表达式
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 配置区域 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 快捷选择 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-bolt" class="w-5 h-5" />
              <h3 class="font-semibold">常用模板</h3>
            </div>
          </template>

          <div class="grid grid-cols-2 gap-2">
            <UButton
              v-for="preset in presets"
              :key="preset.name"
              color="neutral"
              variant="soft"
              size="sm"
              @click="applyPreset(preset)"
            >
              {{ preset.name }}
            </UButton>
          </div>
        </UCard>

        <!-- Cron 字段配置 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
              <h3 class="font-semibold">自定义配置</h3>
            </div>
          </template>

          <div class="space-y-4">
            <!-- 分钟 -->
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                分钟 (0-59)
              </label>
              <div class="flex gap-2">
                <USelectMenu v-model="minuteType" :options="typeOptions" size="sm" class="w-32" />
                <UInput
                  v-if="minuteType !== 'every'"
                  v-model="minute"
                  placeholder="0"
                  size="sm"
                  class="flex-1 font-mono"
                />
              </div>
            </div>

            <!-- 小时 -->
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                小时 (0-23)
              </label>
              <div class="flex gap-2">
                <USelectMenu v-model="hourType" :options="typeOptions" size="sm" class="w-32" />
                <UInput
                  v-if="hourType !== 'every'"
                  v-model="hour"
                  placeholder="0"
                  size="sm"
                  class="flex-1 font-mono"
                />
              </div>
            </div>

            <!-- 日期 -->
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                日期 (1-31)
              </label>
              <div class="flex gap-2">
                <USelectMenu v-model="dayType" :options="typeOptions" size="sm" class="w-32" />
                <UInput
                  v-if="dayType !== 'every'"
                  v-model="day"
                  placeholder="1"
                  size="sm"
                  class="flex-1 font-mono"
                />
              </div>
            </div>

            <!-- 月份 -->
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                月份 (1-12)
              </label>
              <div class="flex gap-2">
                <USelectMenu v-model="monthType" :options="typeOptions" size="sm" class="w-32" />
                <UInput
                  v-if="monthType !== 'every'"
                  v-model="month"
                  placeholder="1"
                  size="sm"
                  class="flex-1 font-mono"
                />
              </div>
            </div>

            <!-- 星期 -->
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                星期 (0-6, 0=周日)
              </label>
              <div class="flex gap-2">
                <USelectMenu v-model="weekType" :options="typeOptions" size="sm" class="w-32" />
                <UInput
                  v-if="weekType !== 'every'"
                  v-model="week"
                  placeholder="0"
                  size="sm"
                  class="flex-1 font-mono"
                />
              </div>
            </div>
          </div>
        </UCard>

        <!-- 生成的表达式 -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
                <h3 class="font-semibold">Cron 表达式</h3>
              </div>
              <UButton
                color="primary"
                variant="soft"
                size="sm"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(cronExpression, 'Cron 表达式')"
              >
                复制
              </UButton>
            </div>
          </template>

          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div class="font-mono text-lg text-center text-gray-900 dark:text-white font-bold">
              {{ cronExpression }}
            </div>
          </div>
        </UCard>

        <!-- 执行时间预览 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-clock" class="w-5 h-5" />
              <h3 class="font-semibold">执行时间描述</h3>
            </div>
          </template>

          <div class="text-sm text-gray-700 dark:text-gray-300">
            {{ description }}
          </div>
        </UCard>
      </div>

      <!-- 右侧参考 -->
      <div class="space-y-6">
        <!-- 字段说明 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-information-circle" class="w-5 h-5" />
              <h3 class="font-semibold">字段说明</h3>
            </div>
          </template>

          <div class="space-y-3 text-sm">
            <div class="font-mono text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-2">
              分 时 日 月 周
            </div>
            <div>
              <div class="font-semibold text-gray-700 dark:text-gray-300">分钟</div>
              <div class="text-xs text-gray-500">0-59</div>
            </div>
            <div>
              <div class="font-semibold text-gray-700 dark:text-gray-300">小时</div>
              <div class="text-xs text-gray-500">0-23</div>
            </div>
            <div>
              <div class="font-semibold text-gray-700 dark:text-gray-300">日期</div>
              <div class="text-xs text-gray-500">1-31</div>
            </div>
            <div>
              <div class="font-semibold text-gray-700 dark:text-gray-300">月份</div>
              <div class="text-xs text-gray-500">1-12</div>
            </div>
            <div>
              <div class="font-semibold text-gray-700 dark:text-gray-300">星期</div>
              <div class="text-xs text-gray-500">0-6 (0=周日)</div>
            </div>
          </div>
        </UCard>

        <!-- 特殊字符 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star" class="w-5 h-5" />
              <h3 class="font-semibold">特殊字符</h3>
            </div>
          </template>

          <div class="space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="font-mono font-bold">*</span>
              <span class="text-gray-500">任意值</span>
            </div>
            <div class="flex justify-between">
              <span class="font-mono font-bold">,</span>
              <span class="text-gray-500">值列表</span>
            </div>
            <div class="flex justify-between">
              <span class="font-mono font-bold">-</span>
              <span class="text-gray-500">范围</span>
            </div>
            <div class="flex justify-between">
              <span class="font-mono font-bold">/</span>
              <span class="text-gray-500">步长</span>
            </div>
          </div>
        </UCard>

        <!-- 示例 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-light-bulb" class="w-5 h-5" />
              <h3 class="font-semibold">常用示例</h3>
            </div>
          </template>

          <div class="space-y-3 text-xs">
            <div>
              <div class="font-mono text-primary-600 dark:text-primary-400 mb-1">0 0 * * *</div>
              <div class="text-gray-500">每天 0 点</div>
            </div>
            <div>
              <div class="font-mono text-primary-600 dark:text-primary-400 mb-1">*/5 * * * *</div>
              <div class="text-gray-500">每 5 分钟</div>
            </div>
            <div>
              <div class="font-mono text-primary-600 dark:text-primary-400 mb-1">0 */2 * * *</div>
              <div class="text-gray-500">每 2 小时</div>
            </div>
            <div>
              <div class="font-mono text-primary-600 dark:text-primary-400 mb-1">0 9 * * 1</div>
              <div class="text-gray-500">每周一 9 点</div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const minuteType = ref('every')
const minute = ref('0')
const hourType = ref('every')
const hour = ref('0')
const dayType = ref('every')
const day = ref('1')
const monthType = ref('every')
const month = ref('1')
const weekType = ref('every')
const week = ref('0')

const typeOptions = [
  { label: '每个', value: 'every' },
  { label: '指定', value: 'specific' }
]

const presets = [
  { name: '每分钟', cron: '* * * * *' },
  { name: '每5分钟', cron: '*/5 * * * *' },
  { name: '每小时', cron: '0 * * * *' },
  { name: '每天0点', cron: '0 0 * * *' },
  { name: '每天12点', cron: '0 12 * * *' },
  { name: '每周一9点', cron: '0 9 * * 1' },
  { name: '每月1号0点', cron: '0 0 1 * *' }
]

const cronExpression = computed(() => {
  const parts = [
    minuteType.value === 'every' ? '*' : minute.value,
    hourType.value === 'every' ? '*' : hour.value,
    dayType.value === 'every' ? '*' : day.value,
    monthType.value === 'every' ? '*' : month.value,
    weekType.value === 'every' ? '*' : week.value
  ]
  return parts.join(' ')
})

const description = computed(() => {
  const parts: string[] = []
  
  if (minuteType.value === 'specific') {
    parts.push(`第 ${minute.value} 分钟`)
  }
  
  if (hourType.value === 'specific') {
    parts.push(`${hour.value} 点`)
  } else if (minuteType.value === 'specific') {
    parts.push('每小时')
  }
  
  if (weekType.value === 'specific') {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    parts.push(`每${days[parseInt(week.value)]}`)
  } else if (dayType.value === 'specific') {
    parts.push(`每月 ${day.value} 号`)
  } else if (monthType.value === 'specific') {
    parts.push(`每年 ${month.value} 月`)
  } else if (hourType.value === 'specific' || minuteType.value === 'specific') {
    parts.push('每天')
  }
  
  return parts.length > 0 ? parts.join(' ') : '每分钟执行'
})

function applyPreset(preset: typeof presets[0]) {
  const parts = preset.cron.split(' ')
  
  minute.value = parts[0] === '*' || parts[0]?.startsWith('*/') ? '0' : parts[0] || '0'
  minuteType.value = parts[0] === '*' || parts[0]?.startsWith('*/') ? 'every' : 'specific'
  
  hour.value = parts[1] === '*' || parts[1]?.startsWith('*/') ? '0' : parts[1] || '0'
  hourType.value = parts[1] === '*' || parts[1]?.startsWith('*/') ? 'every' : 'specific'
  
  day.value = parts[2] === '*' ? '1' : parts[2] || '1'
  dayType.value = parts[2] === '*' ? 'every' : 'specific'
  
  month.value = parts[3] === '*' ? '1' : parts[3] || '1'
  monthType.value = parts[3] === '*' ? 'every' : 'specific'
  
  week.value = parts[4] === '*' ? '0' : parts[4] || '0'
  weekType.value = parts[4] === '*' ? 'every' : 'specific'
}

// SEO
useHead({
  title: 'Cron 表达式生成器 - 定时任务配置工具 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 Cron 表达式生成器，可视化配置定时任务，支持常用模板，实时预览执行时间。Linux、Node.js 定时任务必备。' }
  ]
})
</script>
