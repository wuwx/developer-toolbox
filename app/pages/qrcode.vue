<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.qrcode.title')" :description="$t('pages.qrcode.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-black mb-6 shadow-xl">
          <UIcon name="i-heroicons-qr-code" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid gap-8 lg:grid-cols-12">
      <div class="lg:col-span-7 space-y-6">
        <ToolCard>
          <div class="space-y-6">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">{{ $t('ui.input') }}</label>
              <UTextarea v-model="content" :placeholder="$t('ui.inputPlaceholder')" :rows="8" size="xl" autoresize :maxrows="20" class="font-mono text-sm block w-full" :ui="{ base: 'p-4' }" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">{{ locale === 'zh-CN' ? '容错率' : 'Error Correction' }}</label>
                <USelect v-model="options.errorCorrectionLevel" :options="[{ label: 'L - 7%', value: 'L' }, { label: 'M - 15%', value: 'M' }, { label: 'Q - 25%', value: 'Q' }, { label: 'H - 30%', value: 'H' }]" />
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">{{ locale === 'zh-CN' ? '图片宽度 (px)' : 'Width (px)' }}</label>
                <UInput type="number" v-model="options.width" min="100" max="1000" step="10" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">{{ locale === 'zh-CN' ? '前景色' : 'Foreground' }}</label>
                <div class="flex gap-2">
                  <input type="color" v-model="options.color.dark" class="h-9 w-9 rounded cursor-pointer border border-gray-300 dark:border-gray-700" />
                  <UInput v-model="options.color.dark" class="flex-1 font-mono" />
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">{{ locale === 'zh-CN' ? '背景色' : 'Background' }}</label>
                <div class="flex gap-2">
                  <input type="color" v-model="options.color.light" class="h-9 w-9 rounded cursor-pointer border border-gray-300 dark:border-gray-700" />
                  <UInput v-model="options.color.light" class="flex-1 font-mono" />
                </div>
              </div>
            </div>
          </div>
        </ToolCard>
      </div>

      <div class="lg:col-span-5">
        <div class="sticky top-24 space-y-4">
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 flex items-center justify-center min-h-[300px] shadow-sm">
            <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR Code" class="max-w-full h-auto rounded-lg shadow-sm border border-gray-100 dark:border-gray-800" :style="{ backgroundColor: options.color.light }" />
            <div v-else class="text-center text-gray-400">
              <UIcon name="i-heroicons-qr-code" class="w-16 h-16 mb-2 opacity-50" />
              <p class="text-sm">{{ locale === 'zh-CN' ? '输入内容以生成二维码' : 'Enter content to generate QR code' }}</p>
            </div>
          </div>
          <UButton block size="lg" color="primary" icon="i-heroicons-arrow-down-tray" :disabled="!qrDataUrl" @click="downloadQR">{{ $t('ui.download') }}</UButton>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <ToolInfo :title="$t('ui.about') + ' QR Code'" :items="accordionItems" />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t, locale } = useI18n()
const content = ref('https://www.example.com')
const qrDataUrl = ref('')
const options = reactive({ errorCorrectionLevel: 'M', width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } })

const generateQR = async () => {
  if (!content.value) { qrDataUrl.value = ''; return }
  try {
    qrDataUrl.value = await QRCode.toDataURL(content.value, {
      errorCorrectionLevel: options.errorCorrectionLevel as any,
      width: Number(options.width),
      margin: options.margin,
      color: { dark: options.color.dark, light: options.color.light }
    })
  } catch (err) { console.error(err) }
}

let timer: ReturnType<typeof setTimeout> | null = null
watch([content, options], () => { if (timer) clearTimeout(timer); timer = setTimeout(generateQR, 100) }, { deep: true })
onMounted(() => { generateQR() })

const downloadQR = () => {
  if (!qrDataUrl.value) return
  const a = document.createElement('a')
  a.href = qrDataUrl.value
  a.download = `qrcode-${Date.now()}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'correction', label: locale.value === 'zh-CN' ? '容错率是什么？' : 'What is Error Correction?', icon: 'i-heroicons-shield-check', content: locale.value === 'zh-CN' ? '二维码具有容错能力，即使部分遮挡或破损也能扫描。L (7%) 适合普通场景，H (30%) 适合在中间添加 Logo。' : 'QR codes have error correction capability. L (7%) for normal use, H (30%) for adding logos in the center.' },
  { slot: 'size', label: locale.value === 'zh-CN' ? '尺寸建议' : 'Size Recommendations', icon: 'i-heroicons-arrows-pointing-out', content: locale.value === 'zh-CN' ? '如果用于打印，建议尺寸设置大一些（如 500px 以上）以保证清晰度。' : 'For printing, use larger sizes (500px+) for better clarity. For mobile display, 300px is sufficient.' }
])

useHead({ title: t('pages.qrcode.title'), meta: [{ name: 'description', content: t('pages.qrcode.description') }] })
</script>
