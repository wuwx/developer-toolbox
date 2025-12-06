<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="CSS Clip Path" description="CSS 裁剪路径生成器" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-scissors" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">形状</h3></template>
        <div class="space-y-4">
          <USelect v-model="shape" :options="shapes.map(s=>({label:s.name,value:s.value}))"/>
          <div class="p-4 bg-gray-900 rounded-lg">
            <pre class="text-xs text-green-400">clip-path: {{currentShape}};</pre>
          </div>
          <UButton block color="primary" variant="soft" @click="copyToClipboard('clip-path: '+currentShape+';','CSS')">复制 CSS</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">预览</h3></template>
        <div class="flex items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div class="w-48 h-48 bg-gradient-to-br from-primary-500 to-purple-600" :style="{clipPath:currentShape}"></div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const {copyToClipboard}=useToolClipboard()
const shape=ref('circle')
const shapes=[
  {name:'圆形',value:'circle'},
  {name:'椭圆',value:'ellipse'},
  {name:'三角形',value:'triangle'},
  {name:'菱形',value:'rhombus'},
  {name:'五角星',value:'star'}
]

const shapeValues:Record<string,string>={
  circle:'circle(50%)',
  ellipse:'ellipse(50% 35%)',
  triangle:'polygon(50% 0%, 0% 100%, 100% 100%)',
  rhombus:'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  star:'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
}

const currentShape=computed(()=>shapeValues[shape.value])

useHead({title:'CSS Clip Path | 开发者工具箱'})
</script>
