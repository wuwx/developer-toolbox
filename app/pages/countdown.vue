<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.countdown.title')" :description="$t('pages.countdown.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-clock" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="max-w-3xl mx-auto space-y-8">
      <UCard>
        <div class="space-y-4">
          <UInput v-model="eventName" placeholder="事件名称" size="xl" class="w-full" />
          <UInput v-model="targetDate" type="datetime-local" size="xl" class="w-full" />
          <UButton block color="primary" size="lg" @click="start">开始倒计时</UButton>
        </div>
      </UCard>
      <UCard v-if="counting">
        <div class="text-center space-y-4">
          <div class="text-2xl font-semibold">{{ eventName || '倒计时' }}</div>
          <div class="grid grid-cols-4 gap-4">
            <div v-for="(value, label) in timeLeft" :key="label" class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div class="text-4xl font-bold text-primary-600">{{ value }}</div>
              <div class="text-sm text-gray-500 mt-2">{{ label }}</div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const eventName = ref('')
const targetDate = ref('')
const counting = ref(false)
const timeLeft = ref({ 天: 0, 时: 0, 分: 0, 秒: 0 })

let timer: any = null

function start() {
  if (!targetDate.value) return
  counting.value = true
  update()
  timer = setInterval(update, 1000)
}

function update() {
  const now = new Date().getTime()
  const target = new Date(targetDate.value).getTime()
  const diff = target - now
  if (diff <= 0) {
    clearInterval(timer)
    timeLeft.value = { 天: 0, 时: 0, 分: 0, 秒: 0 }
    return
  }
  timeLeft.value = {
    天: Math.floor(diff / (1000 * 60 * 60 * 24)),
    时: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    分: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    秒: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

onUnmounted(() => clearInterval(timer))

useHead({ title: t('pages.countdown.title') })
</script>
