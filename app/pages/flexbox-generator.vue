<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="Flexbox 生成器" description="可视化生成 Flexbox 布局代码" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-squares-2x2" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <div class="space-y-6">
        <UCard>
          <template #header><h3 class="font-semibold">容器属性</h3></template>
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium mb-2 block">flex-direction</label>
              <USelect v-model="flexDirection" :options="[
                {label: 'row', value: 'row'},
                {label: 'row-reverse', value: 'row-reverse'},
                {label: 'column', value: 'column'},
                {label: 'column-reverse', value: 'column-reverse'}
              ]" />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">justify-content</label>
              <USelect v-model="justifyContent" :options="[
                {label: 'flex-start', value: 'flex-start'},
                {label: 'center', value: 'center'},
                {label: 'flex-end', value: 'flex-end'},
                {label: 'space-between', value: 'space-between'},
                {label: 'space-around', value: 'space-around'},
                {label: 'space-evenly', value: 'space-evenly'}
              ]" />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">align-items</label>
              <USelect v-model="alignItems" :options="[
                {label: 'stretch', value: 'stretch'},
                {label: 'flex-start', value: 'flex-start'},
                {label: 'center', value: 'center'},
                {label: 'flex-end', value: 'flex-end'},
                {label: 'baseline', value: 'baseline'}
              ]" />
            </div>
            <UCheckbox v-model="flexWrap" label="flex-wrap: wrap" />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">CSS 代码</h3>
              <UButton color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(cssCode, 'CSS')">复制</UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-900 rounded-lg">
            <pre class="text-xs text-gray-300 overflow-x-auto">{{ cssCode }}</pre>
          </div>
        </UCard>
      </div>

      <UCard>
        <template #header><h3 class="font-semibold">实时预览</h3></template>
        <div class="p-8 bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[400px]" :style="containerStyle">
          <div v-for="i in 5" :key="i" class="p-4 bg-primary-500 text-white rounded-lg m-2">{{ i }}</div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const flexDirection = ref('row')
const justifyContent = ref('flex-start')
const alignItems = ref('stretch')
const flexWrap = ref(false)

const containerStyle = computed(() => ({
  display: 'flex',
  flexDirection: flexDirection.value,
  justifyContent: justifyContent.value,
  alignItems: alignItems.value,
  flexWrap: flexWrap.value ? 'wrap' : 'nowrap'
}))

const cssCode = computed(() => {
  return `.container {
  display: flex;
  flex-direction: ${flexDirection.value};
  justify-content: ${justifyContent.value};
  align-items: ${alignItems.value};${flexWrap.value ? '\n  flex-wrap: wrap;' : ''}
}`
})

useHead({
  title: 'Flexbox 生成器 | 开发者工具箱',
  meta: [{ name: 'description', content: '可视化 Flexbox 布局生成工具' }]
})
</script>
