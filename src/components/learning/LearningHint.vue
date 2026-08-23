<script setup>
import { ref } from 'vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  concepts: { type: Array, default: () => [] },
  code: { type: String, default: '' },
  flow: { type: Array, default: () => [] },
  tone: { type: String, default: 'pink' },
})

const showCode = ref(false)
const showFlow = ref(false)
</script>

<template>
  <aside class="learning-hint" :class="`learning-hint--${tone}`" role="note">
    <div class="learning-hint-kicker">📘 VUE POINT</div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>

    <div class="learning-concepts">
      <code v-for="concept in concepts" :key="concept">{{ concept }}</code>
    </div>

    <div class="learning-hint-actions">
      <el-button v-if="code" text size="small" @click="showCode = !showCode">
        {{ showCode ? '코드 닫기' : '코드 미리보기' }}
      </el-button>
      <el-button v-if="flow.length" text size="small" @click="showFlow = !showFlow">
        {{ showFlow ? '흐름 닫기' : '데이터 흐름' }}
      </el-button>
    </div>

    <pre v-if="showCode" class="learning-code"><code>{{ code }}</code></pre>
    <ol v-if="showFlow" class="learning-flow">
      <li v-for="(step, index) in flow" :key="`${step}-${index}`">{{ step }}</li>
    </ol>
  </aside>
</template>

<style scoped>
.learning-hint {
  width: 246px;
  padding: 12px 13px;
  border: 3px solid #8c6a58;
  border-radius: 14px;
  color: #302448;
  background: #fff7d9f5;
  box-shadow: 4px 5px 0 #8c6a58, 0 10px 18px #30244833;
  font-family: 'Noto Sans KR', sans-serif;
  pointer-events: auto;
}
.learning-hint--blue { background: #eaf6fff5; border-color: #6288a8; box-shadow: 4px 5px 0 #6288a8, 0 10px 18px #30244833; }
.learning-hint--mint { background: #edffeaf5; border-color: #6e9c7a; box-shadow: 4px 5px 0 #6e9c7a, 0 10px 18px #30244833; }
.learning-hint--pink { background: #fff0f3f5; }
.learning-hint-kicker { color: #d65f83; font: 800 9px 'Courier New', monospace; letter-spacing: .08em; }
.learning-hint--blue .learning-hint-kicker { color: #37729c; }
.learning-hint--mint .learning-hint-kicker { color: #4b845a; }
.learning-hint h3 { margin: 5px 0 6px; font-size: 14px; line-height: 1.25; }
.learning-hint p { margin: 0; color: #655875; font-size: 11px; line-height: 1.45; }
.learning-concepts { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.learning-concepts code { padding: 3px 5px; border: 1px solid #e4a6b4; border-radius: 5px; color: #b33e64; background: #fff; font: 800 10px 'Courier New', monospace; }
.learning-hint--blue .learning-concepts code { border-color: #a9c9e2; color: #2d6a98; }
.learning-hint--mint .learning-concepts code { border-color: #acd3b4; color: #4a7d55; }
.learning-hint-actions { display: flex; gap: 4px; margin-top: 7px; }
.learning-hint-actions :deep(.el-button) { min-height: 22px; padding: 2px 5px; color: #9b3f62; font-size: 10px; font-weight: 800; box-shadow: none; }
.learning-hint--blue .learning-hint-actions :deep(.el-button) { color: #2d6a98; }
.learning-hint--mint .learning-hint-actions :deep(.el-button) { color: #4a7d55; }
.learning-code { max-height: 165px; margin: 8px 0 0; padding: 8px; overflow: auto; border: 1px solid #d6b2b9; border-radius: 7px; color: #423455; background: #fffdf5; font: 10px/1.45 'Courier New', monospace; white-space: pre-wrap; }
.learning-flow { margin: 8px 0 0; padding: 8px 8px 8px 23px; border: 1px dashed #d6a4b0; border-radius: 7px; color: #655875; background: #fffdf5; font-size: 10px; line-height: 1.5; }
.learning-flow li::marker { color: #d65f83; font-weight: 800; }
</style>
