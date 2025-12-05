<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">密码强度检测</h1>
      <p class="text-gray-600 dark:text-gray-400">
        评估密码安全性，提供改进建议
      </p>
    </div>

    <div class="space-y-6">
      <!-- 密码输入 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-key" class="w-5 h-5" />
            <h3 class="font-semibold">输入密码</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div class="relative">
            <UInput
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="输入要检测的密码..."
              size="lg"
              class="font-mono"
            />
          </div>
          <UCheckbox v-model="showPassword" label="显示密码" size="sm" />
        </div>
      </UCard>

      <!-- 强度指示器 -->
      <UCard v-if="password">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5" />
              <h3 class="font-semibold">密码强度</h3>
            </div>
            <UBadge
              :color="strengthColor"
              variant="subtle"
              size="lg"
            >
              {{ strengthText }}
            </UBadge>
          </div>
        </template>

        <!-- 强度条 -->
        <div class="space-y-4">
          <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-500"
              :class="strengthBarClass"
              :style="{ width: `${score}%` }"
            />
          </div>

          <!-- 评分详情 -->
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ Math.round(score) }}</div>
              <div class="text-sm text-gray-500">总分</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ password.length }}</div>
              <div class="text-sm text-gray-500">字符数</div>
            </div>
          </div>

          <!-- 检查项 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm">
              <UIcon
                :name="checks.length ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                :class="checks.length ? 'text-green-500' : 'text-gray-300'"
              />
              <span :class="checks.length ? 'text-gray-900 dark:text-white' : 'text-gray-400'">
                长度至少 8 个字符 (当前 {{ password.length }} 个)
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <UIcon
                :name="checks.lowercase ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                :class="checks.lowercase ? 'text-green-500' : 'text-gray-300'"
              />
              <span :class="checks.lowercase ? 'text-gray-900 dark:text-white' : 'text-gray-400'">
                包含小写字母
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <UIcon
                :name="checks.uppercase ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                :class="checks.uppercase ? 'text-green-500' : 'text-gray-300'"
              />
              <span :class="checks.uppercase ? 'text-gray-900 dark:text-white' : 'text-gray-400'">
                包含大写字母
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <UIcon
                :name="checks.number ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                :class="checks.number ? 'text-green-500' : 'text-gray-300'"
              />
              <span :class="checks.number ? 'text-gray-900 dark:text-white' : 'text-gray-400'">
                包含数字
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <UIcon
                :name="checks.special ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                :class="checks.special ? 'text-green-500' : 'text-gray-300'"
              />
              <span :class="checks.special ? 'text-gray-900 dark:text-white' : 'text-gray-400'">
                包含特殊字符 (!@#$%^&* 等)
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <UIcon
                :name="checks.noCommon ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                :class="checks.noCommon ? 'text-green-500' : 'text-red-500'"
              />
              <span :class="checks.noCommon ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'">
                {{ checks.noCommon ? '不是常见密码' : '这是常见密码，不安全！' }}
              </span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- 建议 -->
      <UCard v-if="password && suggestions.length > 0">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-light-bulb" class="w-5 h-5" />
            <h3 class="font-semibold">改进建议</h3>
          </div>
        </template>

        <ul class="space-y-2 text-sm">
          <li v-for="(suggestion, index) in suggestions" :key="index" class="flex items-start gap-2">
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 mt-0.5 text-primary-500 shrink-0" />
            <span class="text-gray-700 dark:text-gray-300">{{ suggestion }}</span>
          </li>
        </ul>
      </UCard>

      <!-- 说明 -->
      <UCard v-if="!password">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5" />
            <h3 class="font-semibold">如何创建强密码</h3>
          </div>
        </template>

        <div class="prose prose-sm dark:prose-invert max-w-none">
          <ul>
            <li>至少使用 <strong>12 个字符</strong></li>
            <li>混合使用大小写字母、数字和特殊符号</li>
            <li>避免使用个人信息（生日、姓名等）</li>
            <li>不要使用常见密码（123456、password 等）</li>
            <li>不同网站使用不同密码</li>
            <li>定期更换密码</li>
          </ul>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const password = ref('')
const showPassword = ref(false)

// 常见弱密码列表
const commonPasswords = [
  '123456', 'password', '12345678', 'qwerty', '123456789',
  '12345', '1234', '111111', '1234567', 'dragon',
  '123123', 'baseball', 'iloveyou', 'trustno1', '1234567890',
  'sunshine', 'master', '123321', 'welcome', 'admin'
]

// 检查项
const checks = computed(() => ({
  length: password.value.length >= 8,
  lowercase: /[a-z]/.test(password.value),
  uppercase: /[A-Z]/.test(password.value),
  number: /\d/.test(password.value),
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value),
  noCommon: !commonPasswords.includes(password.value.toLowerCase())
}))

// 计算得分
const score = computed(() => {
  let points = 0
  
  // 长度得分 (最多40分)
  if (password.value.length >= 8) points += 20
  if (password.value.length >= 12) points += 10
  if (password.value.length >= 16) points += 10
  
  // 字符类型得分 (每种10分，最多40分)
  if (checks.value.lowercase) points += 10
  if (checks.value.uppercase) points += 10
  if (checks.value.number) points += 10
  if (checks.value.special) points += 10
  
  // 非常见密码 (20分)
  if (checks.value.noCommon) points += 20
  
  return Math.min(points, 100)
})

// 强度等级
const strengthLevel = computed(() => {
  if (score.value >= 80) return 'strong'
  if (score.value >= 60) return 'good'
  if (score.value >= 40) return 'medium'
  return 'weak'
})

const strengthText = computed(() => {
  const levels = {
    weak: '弱',
    medium: '中',
    good: '良好',
    strong: '强'
  }
  return levels[strengthLevel.value]
})

const strengthColor = computed((): 'error' | 'warning' | 'primary' | 'success' => {
  const colors: Record<string, 'error' | 'warning' | 'primary' | 'success'> = {
    weak: 'error',
    medium: 'warning',
    good: 'primary',
    strong: 'success'
  }
  return colors[strengthLevel.value] || 'error'
})

const strengthBarClass = computed(() => {
  const classes = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    good: 'bg-blue-500',
    strong: 'bg-green-500'
  }
  return classes[strengthLevel.value]
})

// 建议
const suggestions = computed(() => {
  const tips: string[] = []
  
  if (!checks.value.length) {
    tips.push('增加密码长度至少到 8 个字符')
  } else if (password.value.length < 12) {
    tips.push('建议密码长度至少 12 个字符')
  }
  
  if (!checks.value.lowercase) tips.push('添加小写字母')
  if (!checks.value.uppercase) tips.push('添加大写字母')
  if (!checks.value.number) tips.push('添加数字')
  if (!checks.value.special) tips.push('添加特殊字符（如 !@#$%）')
  if (!checks.value.noCommon) tips.push('这是常见密码，请更换为更复杂的密码')
  
  return tips
})

// SEO
useHead({
  title: '密码强度检测 - 在线密码安全评估 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线密码强度检测工具，评估密码安全性，提供改进建议。检测常见弱密码，保护账户安全。' }
  ]
})
</script>
