<script setup>
import { computed, ref } from 'vue'

const flowSteps = [
  { id: 1, title: '도시 카드 클릭', concept: '@click', description: '사용자가 여행할 도시에서 부산 카드를 클릭합니다.', code: '<WeatherCard @click="selectCity(city)" />' },
  { id: 2, title: '이벤트 처리', concept: '@click · emits', description: '클릭 이벤트가 부모 화면의 selectCity 함수로 전달됩니다.', code: 'const selectCity = (city) => { selectedCity.value = city }' },
  { id: 3, title: 'selectedCity 변경', concept: 'ref', description: '반응형 도시 상태가 전주에서 부산 객체로 변경됩니다.', before: '전주', after: '부산', code: 'selectedCity.value = city' },
  { id: 4, title: '펫 상태 초기화', concept: 'Pinia action', description: '새 도시의 추천 메시지를 전달하고 펫 수치를 여행 시작 상태로 초기화합니다.', code: 'petStore.resetStatus(city.petMessage)' },
  { id: 5, title: '화면 데이터 전달', concept: 'props · emits', description: '선택 도시와 Pinia의 펫 상태가 PetStage에 전달되고, 돌봄 이벤트는 부모 화면으로 올라옵니다.', code: `<PetStage
  :city="selectedCity"
  :pet="{ name: petName, mood, energy, comfort, hunger, statusText }"
  @care="handleCare"
/>` },
  { id: 6, title: '파생 값 계산', concept: 'computed', description: '도시는 표시 온도와 메시지에, 펫 수치는 상태 라벨과 캐릭터 모습에 각각 반영됩니다.', code: 'computed → displayTemp · deviceMessage · statusSummary · petState' },
  { id: 7, title: '화면 자동 갱신', concept: 'Vue Reactivity', description: '반응성이 변경을 감지해 도시 배경, 날씨, 추천 메시지와 PET STATUS를 자동으로 갱신합니다.', before: '전주 화면', after: '부산 화면', code: '상태 변경 → template 자동 갱신' },
]

const technologyMap = [
  { name: 'ref', label: '반응형 상태', usage: 'searchQuery · selectedCity · 학습모드', practice: 'ReactiveRef' },
  { name: 'v-for', label: '목록 반복 렌더링', usage: '여행할 도시 · 학습 포인트', practice: 'VueFor' },
  { name: 'v-if', label: '조건부 렌더링', usage: '날씨 라벨 · 학습 UI 표시', practice: 'VueIf' },
  { name: 'computed', label: '파생 상태 계산', usage: '검색 결과 · 표시 온도 · 펫 상태 라벨', practice: 'ComputedBasic' },
  { name: ':class', label: '동적 스타일 연결', usage: '도시별 배경 · 펫 캐릭터 상태', practice: 'VueBindClass' },
  { name: 'props / emits', label: '컴포넌트 통신', usage: 'PetStage · 돌봄 이벤트', practice: 'PropsEmitsParent' },
  { name: 'Pinia', label: '전역 상태 관리', usage: '체력 · 쾌적도 · 배고픔', practice: 'StoreCounter' },
  { name: 'setInterval', label: '시간에 따른 변화', usage: '10초마다 펫 상태 감소', practice: 'WatchersBasic' },
  { name: 'Axios', label: '외부 API 통신', usage: 'OpenWeatherMap 최신 날씨', practice: 'AxiosWeather' },
  { name: 'Vue Router', label: '페이지 이동', usage: '서비스 · 원리 · 실습 · 상세', practice: 'Router' },
]

const selectedStep = ref(3)
const activeStep = computed(() => flowSteps.find((step) => step.id === selectedStep.value) || flowSteps[0])
</script>

<template>
  <section class="learning-page">
    <header class="learning-intro">
      <p class="learning-intro-copy">구현 원리를 단계별로 살펴봅시다.</p>
    </header>

    <div class="learning-main">
      <el-card class="flow-map-card" shadow="never">
        <div class="learning-section-heading"><div><el-tag type="primary" effect="light">실행 흐름</el-tag><h2>부산 여행 시작</h2></div><span>단계를 눌러보세요</span></div>
        <div class="flow-step-list">
          <template v-for="(step, index) in flowSteps" :key="step.id">
            <button class="flow-step-button" :class="{ 'is-active': selectedStep === step.id }" type="button" @click="selectedStep = step.id"><strong>{{ step.id }}</strong><span><b>{{ step.title }}</b><small>{{ step.concept }}</small></span></button>
            <div v-if="index < flowSteps.length - 1" class="flow-connector">↓</div>
          </template>
        </div>
      </el-card>

      <el-card class="flow-detail-card" shadow="never">
        <div class="learning-section-heading"><div><el-tag type="success" effect="light">현재 단계 해설</el-tag><h2>{{ activeStep.title }}</h2></div><code>{{ activeStep.concept }}</code></div>
        <p class="flow-detail-description">{{ activeStep.description }}</p>
        <div v-if="activeStep.before || activeStep.after" class="state-change" aria-label="상태 변화"><div><small>BEFORE</small><strong>{{ activeStep.before }}</strong></div><span>→</span><div class="state-after"><small>AFTER</small><strong>{{ activeStep.after }}</strong></div></div>
        <div class="code-preview"><span>실제 코드</span><pre><code>{{ activeStep.code }}</code></pre></div>
        <div class="flow-detail-footer"><span>이 단계에서 Vue가 데이터와 화면을 연결합니다.</span><RouterLink to="/practice">관련 실습 보기 →</RouterLink></div>
      </el-card>
    </div>

    <section class="technology-map" aria-labelledby="technology-map-title">
      <div class="technology-map-heading"><h2 id="technology-map-title">이 프로젝트에서 사용된 Vue 기술 지도</h2><span>사용 위치와 교수님 실습을 연결했습니다.</span></div>
      <div class="technology-grid"><el-card v-for="concept in technologyMap" :key="concept.name" class="technology-card" shadow="never"><code>{{ concept.name }}</code><strong>{{ concept.label }}</strong><p>{{ concept.usage }}</p><RouterLink :to="{ path: '/practice', query: { search: concept.practice } }">실습 보기 →</RouterLink></el-card></div>
    </section>
  </section>
</template>

<style scoped>
.learning-page { display: grid; grid-template-rows: 48px minmax(0, 1fr) 230px; gap: 12px; height: 100%; min-height: 0; }
.learning-intro { display: flex; align-items: center; min-width: 0; }.learning-intro-copy { max-width: 920px; margin: 0; color: #3d2b52; font-size: 27px; font-weight: 400; letter-spacing: -.04em; line-height: 1.2; }
.learning-main { display: grid; grid-template-columns: minmax(270px, .78fr) minmax(0, 1.22fr); gap: 12px; min-width: 0; min-height: 0; }.flow-map-card, .flow-detail-card, .technology-card { min-width: 0; min-height: 0; border: 3px solid #d18ba5; border-radius: 16px; background: #fff7ed; box-shadow: 0 5px 0 #c88fa8; }.learning-main :deep(.el-card__body) { display: flex; min-width: 0; min-height: 0; flex: 1; flex-direction: column; padding: 14px; overflow: hidden; }
.learning-section-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 10px; }.learning-section-heading > div { min-width: 0; }.learning-section-heading h2 { margin: 6px 0 0; color: #3d2b52; font-size: 17px; }.learning-section-heading > span { color: #8a789a; font-size: 10px; white-space: nowrap; }.learning-section-heading > code { padding: 4px 7px; border: 1px solid #d8aec0; border-radius: 6px; color: #b33e64; background: #fff0f3; font: 700 10px 'Courier New', monospace; white-space: nowrap; }
.flow-step-list { min-height: 0; overflow-y: auto; padding: 1px 3px 4px 0; scrollbar-gutter: stable; }.flow-step-button { display: grid; grid-template-columns: 26px minmax(0, 1fr); align-items: center; width: 100%; min-height: 31px; padding: 3px 6px; border: 2px solid transparent; border-radius: 9px; color: #554466; background: transparent; text-align: left; cursor: pointer; }.flow-step-button:hover, .flow-step-button.is-active { border-color: #e1a0b2; background: #ffe5eb; }.flow-step-button > strong { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; color: #fff; background: #c94f78; font-size: 11px; }.flow-step-button span { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 6px; min-width: 0; }.flow-step-button b { overflow: hidden; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }.flow-step-button small { color: #9a6680; font: 10px 'Courier New', monospace; white-space: nowrap; }.flow-connector { height: 9px; padding-left: 9px; color: #c88fa8; font-size: 12px; line-height: 9px; }
.flow-detail-description { margin: 2px 0 10px; color: #655875; font-size: 12px; line-height: 1.5; }.state-change { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }.state-change > div { display: grid; gap: 2px; min-width: 95px; padding: 6px 9px; border: 2px solid #d9c4cd; border-radius: 8px; background: #fffdf5; }.state-change small { color: #9b8799; font: 800 9px 'Courier New', monospace; }.state-change strong { color: #554466; font-size: 13px; }.state-change > span { color: #d65f83; font-size: 20px; font-weight: 900; }.state-change .state-after { border-color: #8fc8aa; background: #edffe9; }.state-change .state-after strong { color: #3e7a50; }
.code-preview { min-height: 0; }.code-preview > span { color: #a35a75; font-size: 10px; font-weight: 800; }.code-preview pre { max-height: 92px; margin: 5px 0 8px; padding: 8px 10px; overflow: auto; border: 2px solid #d8c0cb; border-radius: 8px; color: #423455; background: #fffdf5; font: 10px/1.45 'Courier New', monospace; white-space: pre-wrap; }.flow-detail-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: auto; color: #8b7992; font-size: 10px; }.flow-detail-footer a, .technology-card a { color: #b33e64; font-weight: 800; text-decoration: none; white-space: nowrap; }.flow-detail-footer a:hover, .technology-card a:hover { text-decoration: underline; }
.technology-map { display: grid; grid-template-rows: 35px minmax(0, 1fr); min-width: 0; min-height: 0; }.technology-map-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }.technology-map-heading h2 { margin: 0; color: #3d2b52; font-size: 16px; }.technology-map-heading > span { color: #8a789a; font-size: 10px; }.technology-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 8px; min-height: 0; }.technology-card { overflow: visible; border-width: 2px; border-radius: 11px; box-shadow: 0 3px 0 #c88fa8; }.technology-card :deep(.el-card__body) { display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto minmax(22px, 1fr) auto; align-content: start; gap: 3px 6px; min-width: 0; padding: 8px; overflow: visible !important; }.technology-card code { grid-column: 1 / -1; overflow: visible; color: #c94f78; font: 800 11px/1.2 'Courier New', monospace; white-space: normal; overflow-wrap: anywhere; }.technology-card strong { overflow: visible; color: #554466; font-size: 11px; line-height: 1.2; white-space: normal; overflow-wrap: anywhere; }.technology-card p { grid-column: 1 / -1; min-width: 0; margin: 0; overflow: visible; color: #806f8d; font-size: 10px; line-height: 1.35; white-space: normal; }.technology-card a { grid-column: 2; justify-self: end; font-size: 10px; }
@media (max-width: 850px) { .learning-intro-copy { font-size: 20px; }.learning-main { grid-template-columns: 1fr; }.flow-map-card { min-height: 220px; }.technology-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); overflow-y: auto; }.learning-page { grid-template-rows: 70px minmax(0, 1fr) 240px; } }
</style>
