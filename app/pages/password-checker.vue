<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="密码安全检测" description="检测密码强度和安全性" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-shield-check" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="max-w-2xl mx-auto space-y-6">
      <UCard>
        <div class="space-y-4">
          <UInput v-model="password" type="password" placeholder="输入密码..." size="xl" @input="check"/>
          <div v-if="score>=0" class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div class="h-full transition-all" :style="{width:score*25+'%',backgroundColor:colors[Math.floor(score)]}"></div>
              </div>
              <span class="text-sm font-semibold" :style="{color:colors[Math.floor(score)]}">{{labels[Math.floor(score)]}}</span>
            </div>
            <div class="grid sm:grid-cols-2 gap-2 text-sm">
              <div :class="checks.length?'text-green-600':'text-gray-400'">✓ 长度 ≥ 8</div>
              <div :class="checks.upper?'text-green-600':'text-gray-400'">✓ 大写字母</div>
              <div :class="checks.lower?'text-green-600':'text-gray-400'">✓ 小写字母</div>
              <div :class="checks.number?'text-green-600':'text-gray-400'">✓ 数字</div>
              <div :class="checks.special?'text-green-600':'text-gray-400'">✓ 特殊字符</div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const password=ref('')
const score=ref(-1)
const checks=ref({length:false,upper:false,lower:false,number:false,special:false})
const colors=['#ef4444','#f97316','#eab308','#22c55e']
const labels=['弱','中','强','很强']

function check(){
  if(!password.value){score.value=-1;return}
  checks.value={
    length:password.value.length>=8,
    upper:/[A-Z]/.test(password.value),
    lower:/[a-z]/.test(password.value),
    number:/\d/.test(password.value),
    special:/[!@#$%^&*]/.test(password.value)
  }
  score.value=Object.values(checks.value).filter(Boolean).length*0.8
}

useHead({title:'密码安全检测 | 开发者工具箱'})
</script>
