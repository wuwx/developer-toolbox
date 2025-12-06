<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.pinyin.title')" :description="$t('pages.pinyin.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-language" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.inputChinese') }}</h3></template>
        <UTextarea v-model="input" :placeholder="$t('ui.inputChinese') + '...'" :rows="15" class="w-full" @input="convert" />
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">{{ $t('ui.pinyinOutput') }}</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, $t('ui.pinyinOutput'))">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" readonly class="w-full" />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const input = ref('')
const output = ref('')

const pinyinMap: Record<string, string> = {
  '你': 'ni', '好': 'hao', '世': 'shi', '界': 'jie', '中': 'zhong', '国': 'guo',
  '人': 'ren', '大': 'da', '小': 'xiao', '天': 'tian', '地': 'di', '上': 'shang',
  '下': 'xia', '左': 'zuo', '右': 'you', '前': 'qian', '后': 'hou', '开': 'kai',
  '关': 'guan', '是': 'shi', '的': 'de', '了': 'le', '在': 'zai', '有': 'you',
  '个': 'ge', '我': 'wo', '他': 'ta', '她': 'ta', '它': 'ta', '们': 'men'
}

function convert() {
  output.value = input.value.split('').map(char => {
    if (pinyinMap[char]) return pinyinMap[char]
    if (/[\u4e00-\u9fa5]/.test(char)) return '[?]'
    return char
  }).join(' ')
}

useHead({ title: t('pages.pinyin.title'), meta: [{ name: 'description', content: t('pages.pinyin.description') }] })
</script>
