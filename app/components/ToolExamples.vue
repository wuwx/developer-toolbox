<template>
  <UCard class="mb-8">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-yellow-500" />
        <h3 class="text-lg font-semibold">快速示例</h3>
      </div>
    </template>
    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="example in examples"
        :key="example.label"
        variant="soft"
        size="sm"
        @click="$emit('select', example.text)"
      >
        {{ example.label }}
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Example {
  label: string
  text: string
}

defineProps<{
  examples: Example[]
}>()

defineEmits<{
  select: [text: string]
}>()

defineOptions({
  name: 'ToolExamples'
})
</script>
