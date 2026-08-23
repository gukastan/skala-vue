<script setup>
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
import LearningInspector from './components/learning/LearningInspector.vue'
import { learningPoints } from './data/learningPoints'

const route = useRoute()
const desktopScreen = ref(null)
const appWindow = ref(null)
const appScaleShell = ref(null)
const appScale = ref(1)
const learningMode = ref(false)
const selectedLearningPoint = ref(1)
const learningContext = ref({ city: null, pet: null })
let resizeObserver

provide('learningMode', learningMode)
provide('selectedLearningPoint', selectedLearningPoint)
provide('learningContext', learningContext)

const updateAppScale = () => {
  if (!desktopScreen.value || !appScaleShell.value) return
  const availableWidth = desktopScreen.value.clientWidth - (learningMode.value ? 380 : 32)
  const availableHeight = desktopScreen.value.clientHeight - 42
  const naturalWidth = appScaleShell.value.offsetWidth
  const naturalHeight = appScaleShell.value.scrollHeight
  if (!availableWidth || !availableHeight || !naturalWidth || !naturalHeight) return
  appScale.value = Math.min(1, availableWidth / naturalWidth, availableHeight / naturalHeight)
}

onMounted(() => {
  resizeObserver = new ResizeObserver(() => requestAnimationFrame(updateAppScale))
  resizeObserver.observe(desktopScreen.value)
  resizeObserver.observe(appScaleShell.value)
  window.addEventListener('resize', updateAppScale)
  nextTick(updateAppScale)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updateAppScale)
})

watch(() => route.fullPath, () => nextTick(updateAppScale))
watch(learningMode, () => nextTick(updateAppScale))
</script>

<template>
  <div class="desktop-stage" :class="{ 'is-learning-mode': learningMode }">
    <section class="monitor-frame" aria-label="macOS 데스크톱 모니터">
      <div ref="desktopScreen" class="desktop-screen">
        <img class="desktop-wallpaper" src="/mac-desktop-wallpaper.png" alt="Dock과 아이콘이 없는 Mac 바탕화면" />

        <div class="mac-menu-bar" aria-label="macOS 메뉴 막대">
          <div class="mac-menu-left"><strong></strong><span>파일</span><span>편집</span><span>보기</span></div>
          <div class="mac-menu-right"><span>⌁</span><span>⌁▮</span><span>Thu 9:41 AM</span></div>
        </div>

        <section ref="appWindow" class="app-window" :style="{ transform: `translate(-50%, -50%) scale(${appScale})` }" aria-label="Weather Pet 독립 프로그램 창">
          <div ref="appScaleShell" class="app-scale-shell">
            <header class="app-top-bar">
              <div class="window-controls" aria-label="프로그램 창 조작 버튼"><span></span><span></span><span></span></div>
              <el-menu :default-active="route.path" :ellipsis="false" mode="horizontal" router class="main-menu app-nav" aria-label="프로그램 메뉴">
                <el-menu-item index="/">사용자 모드</el-menu-item>
                <el-menu-item index="/about">서비스 소개</el-menu-item>
                <el-menu-item index="/how-it-works">구현 원리</el-menu-item>
                <el-menu-item index="/practice">실습 부록</el-menu-item>
              </el-menu>
              <div class="header-unit-control">
                <UnitToggler />
              </div>
            </header>
            <div class="route-bar" aria-label="현재 Vue Router 경로">
              <span>ROUTE MONITOR</span>
              <code>{{ route.fullPath }}</code>
              <div class="learning-toggle" :class="{ 'is-on': learningMode }">
                <span>학습모드</span>
                <el-switch v-model="learningMode" size="small" active-text="ON" inactive-text="OFF" aria-label="학습모드 토글" />
              </div>
            </div>
            <main class="app-content"><RouterView /></main>
            <footer class="app-footer"><span>Vue 3 Learning Studio</span><span>Element Plus UI</span></footer>
          </div>
        </section>

        <LearningInspector
          v-if="learningMode"
          :points="learningPoints"
          :selected-point-id="selectedLearningPoint"
          :context="learningContext"
          @select-point="selectedLearningPoint = $event"
          @close="learningMode = false"
        />
      </div>
    </section>
  </div>
</template>
