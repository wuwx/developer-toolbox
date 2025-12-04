<template>
  <UContainer class="py-12">
    <!-- Hero 区域 -->
    <UPageHero
      title="开发者工具箱"
      description="一站式在线开发工具集合，快速高效，安全可靠"
      align="center"
    >
      <template #icon>
        <div class="text-7xl mb-4">🛠️</div>
      </template>
      
      <template #links>
        <div class="flex flex-wrap justify-center gap-2">
          <UChip text="完全免费" color="success" />
          <UChip text="即开即用" color="primary" />
          <UChip text="本地运行" color="neutral" />
        </div>
      </template>
    </UPageHero>

    <!-- 工具网格 -->
    <UPageGrid class="mt-12">
      <!-- MD5 工具卡片 -->
      <UPageCard
        to="/md5"
        title="MD5 哈希"
        description="将文本转换为 MD5 哈希值，用于数据校验和完整性验证"
        icon="i-heroicons-lock-closed"
      />

      <!-- 占位卡片 -->
      <UPageCard
        title="Base64 编码"
        description="即将推出..."
        icon="i-heroicons-wrench-screwdriver"
        class="opacity-60"
      />

      <UPageCard
        title="JSON 格式化"
        description="即将推出..."
        icon="i-heroicons-code-bracket"
        class="opacity-60"
      />
    </UPageGrid>

    <!-- 分隔线 -->
    <USeparator class="my-12" />

    <!-- 底部信息 -->
    <UAlert
      icon="i-heroicons-information-circle"
      title="关于此工具箱"
      description="这是一个为开发者打造的在线工具集合，提供各种实用的开发工具。所有工具均在浏览器本地运行，保护您的数据隐私和安全。"
      color="primary"
      variant="soft"
    />
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: '开发者工具箱 - 在线开发工具集合',
  meta: [
    { name: 'description', content: '免费的在线开发工具集合，包括 MD5 哈希、编码转换等实用工具' }
  ]
})
</script>
