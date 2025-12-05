<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-500" />
        <h3 class="text-lg font-semibold">{{ title }}</h3>
      </div>
    </template>
    
    <UAccordion :items="items">
      <template #item="{ item }">
        <div class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {{ item.content }}
        </div>
      </template>
    </UAccordion>
  </UCard>
</template>

<script setup lang="ts">
interface AccordionItem {
  slot: string
  label: string
  icon: string
  content: string
}

defineProps<{
  title: string
  items: AccordionItem[]
}>()

defineOptions({
  name: 'ToolInfo'
})
</script>
