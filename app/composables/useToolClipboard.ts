/**
 * 工具页面复制到剪贴板的通用逻辑
 * @returns { copyToClipboard } - 复制方法
 */
export function useToolClipboard() {
  const toast = useToast()

  const copyToClipboard = async (text: string, label = '内容') => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      
      toast.add({
        title: '复制成功',
        description: `${label}已复制到剪贴板`,
        icon: 'i-heroicons-check-circle',
        color: 'success'
      })
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.add({
        title: '复制失败',
        description: '请尝试手动复制',
        icon: 'i-heroicons-exclamation-circle',
        color: 'error'
      })
    }
  }

  return {
    copyToClipboard
  }
}
