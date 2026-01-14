<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import SiteHeader from './components/layout/SiteHeader.vue'

const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault()
}

// Защита от горячих клавиш и скриншотов
const handleKeyDown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && (event.key === 's' || event.key === 'p')) {
    event.preventDefault()
  }

  if (event.key === 'PrintScreen' || event.key === 'F12') {
    event.preventDefault()
    return false
  }

  if (
    (event.ctrlKey || event.metaKey) &&
    (event.shiftKey || event.altKey) &&
    (event.key === 'I' || event.key === 'J' || event.key === 'C' || event.key === 'U')
  ) {
    event.preventDefault()
    return false
  }

  if (
    event.key === 'F12' ||
    ((event.ctrlKey || event.metaKey) && event.shiftKey && ['I', 'J', 'C'].includes(event.key)) ||
    ((event.ctrlKey || event.metaKey) && event.key === 'u')
  ) {
    event.preventDefault()
    return false
  }
}

const handleCopy = (event: ClipboardEvent) => {
  event.preventDefault()
  return false
}

const handleSelectStart = (event: Event) => {
  const target = event.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    return true
  }
  event.preventDefault()
  return false
}

onMounted(() => {
  window.addEventListener('contextmenu', handleContextMenu)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('copy', handleCopy)
  document.addEventListener('selectstart', handleSelectStart)
})

onUnmounted(() => {
  window.removeEventListener('contextmenu', handleContextMenu)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('copy', handleCopy)
  document.removeEventListener('selectstart', handleSelectStart)
})
</script>

<template>
  <div id="app">
    <SiteHeader />

    <main class="page-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  color: #1f1f1f;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

input,
textarea {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

#app {
  min-height: 100vh;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}

.page-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}
</style>
