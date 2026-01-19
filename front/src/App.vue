<script setup lang="ts">
import SiteHeader from './components/layout/SiteHeader.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
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
  background: #ffffff;
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
}

.page-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}
</style>
