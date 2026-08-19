<script setup>
import { ref } from 'vue'

import SampleOne from './components/practices/basic/SampleOne.vue'
import SampleTwo from './components/practices/basic/SampleTwo.vue'
import Vuehtml from './components/practices/basic/Vuehtml.vue'
import VueBindClass from './components/practices/basic/VueBindClass.vue'
import VueBindShorthand from './components/practices/basic/VueBindShorthand.vue'
import VueBindStyle from './components/practices/basic/VueBindStyle.vue'
import VueText from './components/practices/basic/VueText.vue'
import Vueif from './components/practices/basic/Vueif.vue'

const current = ref('SampleOne')

const components = {
  SampleOne,
  SampleTwo,
  Vuehtml,
  VueBindClass,
  VueBindShorthand,
  VueBindStyle,
  VueText,
  Vueif,
}
</script>

<template>
  <div class="launcher">
    <header class="launcher-header">
      <h2>🚀 SKALA Component Launcher</h2>

      <div class="menu">
        <button v-for="name in Object.keys(components)" :key="name" @click="current = name">
          {{ name }}
        </button>
      </div>
    </header>

    <main class="viewer">
      <h3 class="current-title">📄 현재 실습 : {{ current }}</h3>
      <hr />

      <component :is="components[current]" />
    </main>
  </div>
</template>

<style scoped>
.launcher {
  width: 90%;
  max-width: 1400px;
  margin: 30px auto;
}

.launcher-header {
  position: sticky;
  top: 0;

  background: #2b2b2b;

  padding: 20px;

  border: 1px solid #555;
  border-radius: 10px;

  z-index: 100;
}

.launcher-header h2 {
  margin: 0;
  margin-bottom: 15px;
}

.menu {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.menu button {
  padding: 8px 14px;

  border: none;
  border-radius: 6px;

  cursor: pointer;

  background: white;
}

.menu button:hover {
  background: #42b883;
  color: white;
}

.viewer {
  margin-top: 25px;

  padding: 30px;

  border: 1px solid #555;
  border-radius: 10px;

  background: #252526;

  color: #d4d4d4;
  min-height: 600px;
}

.viewer h3 {
  margin-top: 0;
  margin-bottom: 20px;
}
.current-title {
  color: #8cdcfe;

  font-size: 24px;

  margin-bottom: 20px;
}
</style>
