<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import PetStage from '../components/pet/PetStage.vue'
import { weatherCities } from '../data/weatherData'
import { learningPoints } from '../data/learningPoints'
import { usePetStore } from '../stores/petStore'
import { fetchWeatherForCities, hasWeatherApiKey } from '../services/weatherService'

const router = useRouter()
const route = useRoute()
const learningMode = inject('learningMode', ref(false))
const selectedLearningPoint = inject('selectedLearningPoint', ref(1))
const learningContext = inject('learningContext', ref({ city: null, pet: null }))
const weatherList = ref(weatherCities)
const searchQuery = ref('')
const selectedCity = ref(weatherList.value[0])
const petStore = usePetStore()
const { name: petName, mood, energy, comfort, hunger, statusText } = storeToRefs(petStore)
const isWeatherLoading = ref(false)
const weatherSource = ref(hasWeatherApiKey ? 'live' : 'mock')
const weatherError = ref('')
const WEATHER_REFRESH_INTERVAL = 10 * 60 * 1000
let weatherRefreshTimer

onMounted(() => {
  if (route.query.search) searchQuery.value = route.query.search
  petStore.startTimeDecay()
  loadWeatherData()
  if (hasWeatherApiKey) weatherRefreshTimer = window.setInterval(loadWeatherData, WEATHER_REFRESH_INTERVAL)
})

onUnmounted(() => {
  petStore.stopTimeDecay()
  if (weatherRefreshTimer) window.clearInterval(weatherRefreshTimer)
})

const loadWeatherData = async () => {
  if (!hasWeatherApiKey) return
  isWeatherLoading.value = true
  weatherError.value = ''
  try {
    weatherList.value = await fetchWeatherForCities(weatherList.value)
    selectedCity.value = weatherList.value.find((city) => city.id === selectedCity.value.id) || weatherList.value[0]
    weatherSource.value = 'live'
  } catch {
    weatherSource.value = 'mock'
    weatherError.value = '실시간 날씨를 불러오지 못해 Mock Data를 표시하고 있어요.'
  } finally {
    isWeatherLoading.value = false
  }
}

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: ${searchQuery.value || '전체 도시'}`)
})

watch(searchQuery, (newQuery) => {
  router.replace({ path: route.path, query: { search: newQuery || undefined } })
})

watch([selectedCity, energy, comfort, hunger, mood, statusText], () => {
  learningContext.value = {
    city: selectedCity.value,
    pet: { energy: energy.value, comfort: comfort.value, hunger: hunger.value, mood: mood.value, statusText: statusText.value },
  }
}, { immediate: true })

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

const selectCity = (city) => {
  selectedCity.value = city
  petStore.resetStatus(city.petMessage)
}

const handleCare = (action) => petStore.care(action, selectedCity.value)

const handleDetailJump = (id) => router.push(`/weather/${id}`)
const selectLearningPoint = (id) => { selectedLearningPoint.value = id }
</script>

<template>
  <div class="dashboard-wrapper pixel-weather-app" :class="{ 'learning-enabled': learningMode }">
    <div class="weather-page-heading"><h1>구름이 키우기</h1></div>
    <div class="weather-console">
      <aside class="weather-control-column">
        <div class="learning-anchor search-anchor">
          <BaseDashboardCard class="search-panel"><SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" /></BaseDashboardCard>
          <button v-if="learningMode" class="learning-marker marker-search" type="button" aria-label="도시 검색 학습 포인트 선택" @click="selectLearningPoint(1)">{{ learningPoints[0].marker }}</button>
        </div>

        <div class="learning-anchor city-anchor">
          <BaseDashboardCard class="city-list-card" v-loading="isWeatherLoading">
            <div class="section-heading"><div class="city-list-title-row"><h2>여행할 도시</h2><el-tag class="city-count" effect="plain">{{ filteredWeatherList.length }}개 도시</el-tag></div></div>
            <WeatherCard v-for="item in filteredWeatherList" :key="item.id" :city-item="item" @click="selectCity(item)" @select-card="selectCity(item)" @click-detail="handleDetailJump" />
            <el-empty v-if="filteredWeatherList.length === 0" description="검색 결과와 일치하는 도시가 없습니다." :image-size="90" />
            <el-alert v-if="weatherError" :title="weatherError" type="warning" :closable="false" show-icon />
          </BaseDashboardCard>
          <button v-if="learningMode" class="learning-marker marker-city" type="button" aria-label="여행할 도시 학습 포인트 선택" @click="selectLearningPoint(2)">{{ learningPoints[1].marker }}</button>
        </div>
      </aside>

      <section class="pet-console-column">
        <div class="learning-anchor pet-anchor">
          <PetStage
            :city="selectedCity"
            :pet="{ name: petName, mood, energy, comfort, hunger, statusText }"
            :learning-mode="learningMode"
            :learning-points="learningPoints"
            @care="handleCare"
            @select-learning-point="selectLearningPoint"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pixel-weather-app { position: relative; }.weather-page-heading { position: absolute; z-index: 2; top: 9px; left: 0; display: flex; align-items: center; height: 42px; margin: 0; pointer-events: none; }.weather-page-heading h1 { margin: 0; color: #3d2b52; font-size: 27px; letter-spacing: -.04em; }
.weather-console { display: grid; grid-template-columns: minmax(430px, .84fr) minmax(700px, 1.4fr); gap: 18px; align-items: stretch; max-width: none; margin: 0 auto; position: relative; }.weather-control-column, .pet-console-column { min-width: 0; }.weather-control-column { display: flex; flex-direction: column; justify-content: center; gap: 18px; height: 100%; }.pet-console-column { display: flex; justify-content: stretch; }.pet-anchor { width: 100%; }.search-anchor, .city-anchor, .search-panel, .city-list-card { min-height: 0; height: auto; }.search-panel, .city-list-card { margin-bottom: 0 !important; }.search-panel { margin-top: 0; }.pet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 16px; }.recommendation-alert, .action-alert { margin-top: 14px; border-radius: 14px; }.status-bar { margin-top: 14px; border-radius: 14px; }.source-tags { display: flex; gap: 6px; }
.learning-anchor { position: relative; }
.learning-enabled .search-anchor { z-index: 30; }
.learning-enabled .city-anchor { z-index: 20; }
.learning-enabled .pet-anchor { z-index: 10; }
.learning-marker { position: absolute; z-index: 100; display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border: 3px solid #fff8e8; border-radius: 50%; color: #fff; background: #c94f78; box-shadow: 0 4px 0 #8c6a58, 0 5px 12px #30244866; font-size: 17px; font-weight: 900; cursor: pointer; transition: transform .18s ease, background .18s ease; }
.learning-marker:hover, .learning-marker:focus-visible { outline: none; background: #b54872; transform: scale(1.12); }
.marker-search { top: 12px; right: 12px; }
.marker-city { top: 12px; right: 12px; background: #4e8eb8; }
.city-list-title-row { display: flex; align-items: center; gap: 10px; }.city-list-title-row h2 { margin: 0; }.city-count { flex: 0 0 auto; }.city-list-card :deep(.section-heading) { display: flex; align-items: center; justify-content: space-between; width: 100%; }.city-list-card :deep(.section-heading .unit-toggler) { margin-left: 0; }
.city-list-card > :deep(.el-card__body) { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-rows: auto auto auto; align-content: start; gap: 12px; min-width: 0; }.city-list-card :deep(.section-heading), .city-list-card :deep(.el-alert), .city-list-card :deep(.el-empty) { grid-column: 1 / -1; }.city-list-card :deep(.weather-card) { width: 100%; height: auto; min-width: 0; margin-bottom: 0; }.city-list-card :deep(.weather-card .el-card__body) { min-width: 0; height: auto; }
 .search-panel :deep(.el-card__body) { padding: 14px 18px; }.city-list-card :deep(.weather-card) { overflow: visible; }.city-list-card :deep(.weather-card .el-card__body) { padding: 12px 10px; overflow: visible; }.city-list-card :deep(.weather-card .temperature) { margin: -2px 0 0 auto; font-size: 26px; }.city-list-card :deep(.weather-card .weather-card-bottom) { gap: 6px; margin-top: 18px; }.city-list-card :deep(.weather-card .btn-detail) { padding: 5px 9px; }
</style>
