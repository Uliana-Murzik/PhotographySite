<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import SiteHeader from './components/layout/SiteHeader.vue'
import SiteFooter from './components/layout/SiteFooter.vue'

const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault()
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
  window.addEventListener('copy', handleCopy)
  document.addEventListener('selectstart', handleSelectStart)
})

onUnmounted(() => {
  window.removeEventListener('contextmenu', handleContextMenu)
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

    <SiteFooter />
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
  display: flex;
  flex-direction: column;
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
