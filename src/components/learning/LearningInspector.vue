<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  points: { type: Array, required: true },
  selectedPointId: { type: Number, default: 1 },
  context: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['select-point', 'close'])
const activeTab = ref('concept')
const tabs = [
  { id: 'concept', label: '개념' },
  { id: 'data', label: '데이터' },
  { id: 'flow', label: '흐름' },
  { id: 'code', label: '코드' },
]

const selectedPoint = computed(() => props.points.find((point) => point.id === props.selectedPointId) || props.points[0])
const selectedCity = computed(() => props.context.city || {})
const selectedPet = computed(() => props.context.pet || {})

const choosePoint = (id) => emit('select-point', id)
</script>

<template>
  <aside class="learning-inspector" aria-label="Vue Learning Inspector">
    <header class="inspector-titlebar">
      <div class="inspector-window-controls" aria-hidden="true"><i></i><i></i><i></i></div>
      <strong>Vue Learning Inspector</strong>
      <button type="button" aria-label="학습 패널 닫기" @click="emit('close')">×</button>
    </header>

    <div class="inspector-toolbar"><span class="inspector-live-dot"></span><span>LIVE LEARNING</span><small>Weather Pet</small></div>

    <nav class="inspector-tabs" aria-label="학습 정보 탭">
      <button v-for="tab in tabs" :key="tab.id" type="button" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">{{ tab.label }}</button>
    </nav>

    <div class="inspector-content">
      <section class="inspector-section inspector-selected">
        <span class="inspector-label">현재 선택 영역</span>
        <div class="selected-point-row"><b>{{ selectedPoint.marker }}</b><strong>{{ selectedPoint.title }}</strong></div>
        <div class="point-picker">
          <button v-for="point in points" :key="point.id" type="button" :class="{ active: point.id === selectedPointId }" :aria-label="`${point.marker} ${point.title} 선택`" @click="choosePoint(point.id)">{{ point.marker }}</button>
        </div>
      </section>

      <section v-if="activeTab === 'concept'" class="inspector-section">
        <span class="inspector-label">사용 Vue 개념</span>
        <div class="inspector-concepts"><code v-for="concept in selectedPoint.concepts" :key="concept">{{ concept }}</code></div>
        <p class="inspector-description">{{ selectedPoint.description }}</p>
      </section>

      <section v-else-if="activeTab === 'data'" class="inspector-section">
        <span class="inspector-label">현재 반응형 데이터</span>
        <dl class="inspector-data-list">
          <div><dt>selectedCity.name</dt><dd>{{ selectedCity.name || '전주' }}</dd></div>
          <div><dt>selectedCity.temp</dt><dd>{{ selectedCity.temp ?? 30 }}℃</dd></div>
          <div><dt>selectedCity.status</dt><dd>{{ selectedCity.status || '맑음' }}</dd></div>
          <div><dt>pet.energy</dt><dd>{{ selectedPet.energy ?? 80 }}%</dd></div>
          <div><dt>pet.hunger</dt><dd>{{ selectedPet.hunger ?? 30 }}%</dd></div>
        </dl>
      </section>

      <section v-else-if="activeTab === 'flow'" class="inspector-section">
        <span class="inspector-label">데이터 흐름</span>
        <ol class="inspector-flow"><li v-for="(step, index) in selectedPoint.flow" :key="`${step}-${index}`">{{ step }}</li></ol>
      </section>

      <section v-else class="inspector-section">
        <div class="code-heading"><span class="inspector-label">관련 코드</span><span>.vue</span></div>
        <pre class="inspector-code"><code>{{ selectedPoint.code }}</code></pre>
      </section>

      <div class="inspector-footer-actions"><button type="button" @click="activeTab = 'code'">관련 코드 보기</button><button type="button" @click="activeTab = 'flow'">이 개념 실습하기</button></div>
    </div>
  </aside>
</template>

<style scoped>
.learning-inspector { display: flex; flex-direction: column; width: min(340px, calc(100vw - 40px)); height: min(820px, calc(100dvh - 48px)); min-height: 0; overflow: hidden; border: 1px solid #8172b2; border-radius: 12px; color: #fffaff; background: #26213d; box-shadow: 0 18px 45px #171326aa, 0 0 0 1px #ffffff18; font-family: Inter, 'Noto Sans KR', system-ui, sans-serif; }
.inspector-titlebar { display: flex; align-items: center; gap: 8px; height: 42px; padding: 0 12px; border-bottom: 1px solid #514577; background: #322a4c; font-size: 12px; }.inspector-titlebar strong { flex: 1; letter-spacing: .02em; }.inspector-titlebar button { width: 22px; height: 22px; border: 0; color: #c7bce7; background: transparent; font-size: 18px; }.inspector-window-controls { display: flex; gap: 5px; margin-right: 2px; }.inspector-window-controls i { width: 8px; height: 8px; border-radius: 50%; background: #ed6a9a; }.inspector-window-controls i:nth-child(2) { background: #e6bd65; }.inspector-window-controls i:nth-child(3) { background: #76d18e; }
.inspector-toolbar { display: flex; align-items: center; gap: 7px; padding: 10px 13px; color: #e5ddff; font: 800 9px 'Courier New', monospace; letter-spacing: .08em; }.inspector-toolbar small { margin-left: auto; color: #bcb2dc; font: 10px Inter, sans-serif; letter-spacing: 0; }.inspector-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #6fd48a; box-shadow: 0 0 10px #6fd48a; }
.inspector-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; padding: 0 10px 10px; }.inspector-tabs button, .inspector-footer-actions button { border: 1px solid #75669d; border-radius: 6px; color: #e2d9f7; background: #302849; font-size: 11px; cursor: pointer; }.inspector-tabs button { min-height: 30px; }.inspector-tabs button.active { border-color: #f09aba; color: #fff; background: #713f6a; box-shadow: inset 0 -2px #ed91b2; }
.inspector-content { flex: 1; padding: 0 12px 13px; overflow: auto; }.inspector-section { margin-top: 12px; padding: 12px; border: 1px solid #665886; border-radius: 8px; background: #2d2747; }.inspector-selected { margin-top: 0; background: #322a4e; }.inspector-label { display: block; margin-bottom: 8px; color: #c5b9e8; font: 800 10px 'Courier New', monospace; letter-spacing: .08em; text-transform: uppercase; }.selected-point-row { display: flex; align-items: center; gap: 9px; }.selected-point-row b { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 7px; color: #fff; background: #d65f83; font-size: 17px; }.selected-point-row strong { color: #fffaff; font-size: 15px; }.point-picker { display: flex; gap: 6px; margin-top: 11px; }.point-picker button { width: 30px; height: 30px; border: 1px solid #75669d; border-radius: 6px; color: #e4dcfa; background: #25203b; font-size: 14px; font-weight: 800; cursor: pointer; }.point-picker button.active { border-color: #f09aba; color: #fff; background: #a14e78; }
.inspector-concepts { display: flex; flex-wrap: wrap; gap: 5px; }.inspector-concepts code { padding: 5px 7px; border: 1px solid #aa91d2; border-radius: 4px; color: #f0eaff; background: #3b315b; font: 11px 'Courier New', monospace; }.inspector-description { margin: 10px 0 0; color: #e0d8f0; font-size: 12px; line-height: 1.6; }.inspector-data-list { margin: 0; }.inspector-data-list div { display: flex; justify-content: space-between; gap: 12px; padding: 9px 0; border-bottom: 1px solid #51466f; }.inspector-data-list div:last-child { border-bottom: 0; }.inspector-data-list dt { color: #c8bee0; font: 11px 'Courier New', monospace; }.inspector-data-list dd { margin: 0; color: #ffe3ee; font-size: 13px; font-weight: 800; }.inspector-flow { margin: 0; padding: 0 0 0 22px; color: #e4dcf2; font-size: 12px; line-height: 1.9; }.inspector-flow li::marker { color: #f19abb; font-weight: 800; }.inspector-code { max-height: 270px; margin: 0; padding: 10px; overflow: auto; border: 1px solid #66598a; border-radius: 6px; color: #f1eaff; background: #1c1830; font: 11px/1.6 'Courier New', monospace; white-space: pre-wrap; }.code-heading { display: flex; justify-content: space-between; }.code-heading > span:last-child { color: #b3a7d0; font: 11px 'Courier New', monospace; }.inspector-footer-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 12px; }.inspector-footer-actions button { min-height: 34px; padding: 5px; color: #ffe8f2; border-color: #996b91; background: #4b304d; font-size: 11px; }.inspector-footer-actions button:hover { background: #6b3e5c; }
</style>
