<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="调色板生成器" description="生成配色方案" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-swatch" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="space-y-6">
      <UCard>
        <div class="flex items-center gap-4">
          <input type="color" v-model="baseColor" class="w-16 h-16 rounded-lg cursor-pointer" />
          <div class="flex-1">
            <label class="text-sm font-medium mb-2 block">基础颜色</label>
            <UInput v-model="baseColor" size="xl" class="w-full" />
          </div>
          <UButton color="primary" @click="generate">生成配色</UButton>
        </div>
      </UCard>
      <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <UCard v-for="(color, i) in palette" :key="i">
          <div class="space-y-4">
            <div class="h-32 rounded-lg" :style="{backgroundColor: color}"></div>
            <div class="text-center">
              <div class="font-mono text-sm">{{ color }}</div>
              <UButton size="xs" variant="soft" class="mt-2" @click="copyToClipboard(color, '颜色')">复制</UButton>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const baseColor = ref('#3b82f6')
const palette = ref<string[]>([])

function generate() {
  palette.value = [
    baseColor.value,
    adjustColor(baseColor.value, 30),
    adjustColor(baseColor.value, -30),
    adjustColor(baseColor.value, 60),
    adjustColor(baseColor.value, -60)
  ]
}

function adjustColor(color: string, amount: number): string {
  const num = parseInt(color.slice(1), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}

onMounted(() => generate())

useHead({ title: '调色板生成器 | 开发者工具箱' })
</script>
