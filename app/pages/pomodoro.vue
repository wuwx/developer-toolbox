<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.pomodoro.title')" :description="$t('pages.pomodoro.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-clock" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 主时钟区域 -->
      <div class="lg:col-span-2 space-y-6">
        <UCard class="text-center py-12 relative overflow-hidden">
          <!-- 背景进度环 (SVG) -->
          <svg class="absolute inset-0 w-full h-full -z-10 opacity-10 text-primary-500" viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect width="100%" :height="progress + '%'" fill="currentColor" class="transition-all duration-1000 ease-linear bottom-0" y="0" />
          </svg>

          <div class="text-8xl sm:text-9xl font-bold font-mono tabular-nums tracking-tighter text-gray-900 dark:text-white mb-8 transition-colors" :class="modeColor">
            {{ formattedTime }}
          </div>

          <div class="flex justify-center gap-4 mb-8">
            <UButton
              v-if="status !== 'running'"
              size="xl"
              color="primary"
              icon="i-heroicons-play"
              class="px-8"
              @click="start"
            >
              {{ status === 'paused' ? '继续' : '开始' }}
            </UButton>
            <UButton
              v-else
              size="xl"
              color="warning"
              icon="i-heroicons-pause"
              class="px-8"
              @click="pause"
            >
              暂停
            </UButton>
            <UButton
              size="xl"
              color="neutral"
              variant="soft"
              icon="i-heroicons-arrow-path"
              @click="reset"
            >
              重置
            </UButton>
          </div>

          <div class="flex justify-center gap-2">
            <UBadge
              v-for="m in modes"
              :key="m.value"
              :color="mode === m.value ? 'primary' : 'neutral'"
              :variant="mode === m.value ? 'solid' : 'soft'"
              size="lg"
              class="cursor-pointer"
              @click="switchMode(m.value as any)"
            >
              {{ m.label }}
            </UBadge>
          </div>
        </UCard>
      </div>

      <!-- 设置和统计 -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
              <h3 class="font-semibold">设置</h3>
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium mb-1 block">专注时长 (分钟)</label>
              <UInput type="number" v-model="settings.work" :min="1" :max="60" />
            </div>
            <div>
              <label class="text-sm font-medium mb-1 block">短休息 (分钟)</label>
              <UInput type="number" v-model="settings.shortBreak" :min="1" :max="30" />
            </div>
            <div>
              <label class="text-sm font-medium mb-1 block">长休息 (分钟)</label>
              <UInput type="number" v-model="settings.longBreak" :min="1" :max="60" />
            </div>
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium">桌面通知</label>
              <UToggle v-model="settings.notifications" />
            </div>
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium">自动开始休息</label>
              <UToggle v-model="settings.autoStartBreak" />
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5" />
              <h3 class="font-semibold">今日统计</h3>
            </div>
          </template>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-500">完成专注</span>
              <span class="font-bold text-xl">{{ stats.completed }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-500">专注时长</span>
              <span class="font-bold text-xl">{{ formatDuration(stats.totalMinutes) }}</span>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()

type Mode = 'work' | 'shortBreak' | 'longBreak'
type Status = 'idle' | 'running' | 'paused'

const mode = ref<Mode>('work')
const status = ref<Status>('idle')
const timeLeft = ref(25 * 60)
const timer = ref<number | null>(null)

const settings = reactive({
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  notifications: false,
  autoStartBreak: false
})

const stats = reactive({
  completed: 0,
  totalMinutes: 0
})

const modes = [
  { label: '专注', value: 'work' },
  { label: '短休息', value: 'shortBreak' },
  { label: '长休息', value: 'longBreak' }
]

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const progress = computed(() => {
  const total = settings[mode.value] * 60
  return ((total - timeLeft.value) / total) * 100
})

const modeColor = computed(() => {
  return mode.value === 'work' ? 'text-primary-600 dark:text-primary-400' : 'text-green-600 dark:text-green-400'
})

function switchMode(newMode: Mode) {
  mode.value = newMode
  status.value = 'idle'
  timeLeft.value = settings[newMode] * 60
  if (timer.value) clearInterval(timer.value)
}

function start() {
  if (status.value === 'running') return
  
  // 请求通知权限
  if (settings.notifications && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  
  status.value = 'running'
  timer.value = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
      // 更新标题
      document.title = `${formattedTime.value} - 番茄钟`
    } else {
      finish()
    }
  }, 1000)
}

function pause() {
  status.value = 'paused'
  if (timer.value) clearInterval(timer.value)
  document.title = '番茄钟 - 暂停中'
}

function reset() {
  pause()
  status.value = 'idle'
  timeLeft.value = settings[mode.value] * 60
  document.title = '番茄钟 | 开发者工具箱'
}

function finish() {
  pause()
  status.value = 'idle'
  
  // 播放提示音 (可选)
  // const audio = new Audio('/bell.mp3')
  // audio.play()
  
  // 发送通知
  if (settings.notifications && Notification.permission === 'granted') {
    new Notification('番茄钟', {
      body: mode.value === 'work' ? '专注结束，休息一下吧！' : '休息结束，开始工作吧！',
      icon: '/favicon.ico'
    })
  }
  
  if (mode.value === 'work') {
    stats.completed++
    stats.totalMinutes += settings.work
    if (settings.autoStartBreak) {
      switchMode('shortBreak')
      start()
    }
  } else {
    switchMode('work')
  }
  
  document.title = '完成！'
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// 监听设置变化
watch(settings, () => {
  if (status.value === 'idle') {
    timeLeft.value = settings[mode.value] * 60
  }
}, { deep: true })

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})

useHead({ title: t('pages.pomodoro.title'), meta: [{ name: 'description', content: t('pages.pomodoro.description') }] })
</script>
