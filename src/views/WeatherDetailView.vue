<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { weatherCities } from '../data/weatherData'
import { fetchWeatherDetailsForCity } from '../services/weatherService'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const baseCity = computed(() => weatherCities.find((city) => city.id === route.params.cityId))
const liveCity = ref(null)
const forecast = ref([])
const airQuality = ref(null)
const isLoading = ref(false)
const generalError = ref('')
const forecastError = ref('')
const airQualityError = ref('')

const cityData = computed(() => liveCity.value || baseCity.value)
const isLiveData = computed(() => Boolean(liveCity.value?.coordinates))
const displayTemp = computed(() => cityData.value && convertTemperature(cityData.value.temp))
const displayedForecast = computed(() => forecast.value.map((day) => ({
  ...day,
  minTemp: convertTemperature(day.minTemp),
  maxTemp: convertTemperature(day.maxTemp),
})))
const currentStats = computed(() => cityData.value ? [
  { label: '습도', value: `${cityData.value.humidity}%` },
  { label: '바람', value: `${cityData.value.windSpeed}m/s` },
  { label: '강수확률', value: `${cityData.value.rainProbability}%` },
  { label: '기준 단위', value: configStore.unit === 'celsius' ? '섭씨' : '화씨' },
] : [])
const airQualityTagType = computed(() => {
  if (!airQuality.value) return 'info'
  if (airQuality.value.index <= 2) return 'success'
  if (airQuality.value.index === 3) return 'warning'
  return 'danger'
})

function convertTemperature(value) {
  return configStore.unit === 'fahrenheit' ? Math.round((value * 9) / 5 + 32) : value
}

async function loadCityDetails() {
  liveCity.value = null
  forecast.value = []
  airQuality.value = null
  generalError.value = ''
  forecastError.value = ''
  airQualityError.value = ''
  if (!baseCity.value) return

  isLoading.value = true
  try {
    const detail = await fetchWeatherDetailsForCity(baseCity.value)
    liveCity.value = detail.current
    forecast.value = detail.forecast
    airQuality.value = detail.airQuality
    forecastError.value = detail.errors.forecast
    airQualityError.value = detail.errors.airQuality
  } catch {
    generalError.value = 'OpenWeatherMap 연결에 실패해 기본 도시 정보를 표시하고 있습니다.'
    forecastError.value = '5일 예보를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.'
    airQualityError.value = '대기질 정보를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.'
  } finally {
    isLoading.value = false
  }
}

watch(() => route.params.cityId, loadCityDetails, { immediate: true })
</script>

<template>
  <section v-if="cityData" class="detail-container" v-loading="isLoading" tabindex="0" aria-label="도시 상세 날씨 데이터">
    <header class="detail-heading">
      <div>
        <span class="eyebrow">CITY WEATHER REPORT</span>
        <h1>{{ cityData.name }} 상세 날씨</h1>
        <p>{{ cityData.landmark }}를 여행 중인 구름이의 관측 리포트입니다.</p>
      </div>
      <div class="detail-heading-actions">
        <el-tag :type="isLiveData ? 'success' : 'info'" effect="plain">{{ isLiveData ? 'OPENWEATHER LIVE' : 'MOCK DATA' }}</el-tag>
        <el-button @click="router.push('/')">대시보드로 돌아가기</el-button>
      </div>
    </header>

    <el-alert v-if="generalError" class="detail-alert" :title="generalError" type="warning" :closable="false" show-icon />

    <div class="detail-overview-grid">
      <div :class="['detail-banner', cityData.backgroundClass]">
        <span aria-hidden="true">{{ cityData.weatherIcon }}</span>
        <div>
          <strong>{{ cityData.name }}</strong>
          <small>{{ cityData.description || cityData.status }} · {{ displayTemp }}{{ configStore.unitSymbol }}</small>
        </div>
        <el-tag type="warning" effect="dark">{{ cityData.landmark }}</el-tag>
      </div>

      <article class="api-panel air-quality-panel">
        <header class="api-panel-heading">
          <div><span class="panel-overline">AIR POLLUTION API</span><h2>현재 대기질</h2></div>
          <el-tag :type="airQualityTagType" effect="dark">{{ airQuality ? `AQI ${airQuality.index}` : '연결 대기' }}</el-tag>
        </header>

        <template v-if="airQuality">
          <div class="air-quality-summary"><strong>{{ airQuality.label }}</strong><small>{{ airQuality.measuredAt }} 기준</small></div>
          <dl class="pollutant-grid">
            <div v-for="pollutant in airQuality.pollutants" :key="pollutant.label">
              <dt>{{ pollutant.label }}</dt><dd>{{ pollutant.value }}</dd>
            </div>
          </dl>
          <p class="panel-note">오염물질 농도 단위: μg/m³</p>
        </template>
        <el-alert v-else-if="airQualityError" :title="airQualityError" type="warning" :closable="false" show-icon />
        <el-skeleton v-else :rows="3" animated />
      </article>
    </div>

    <div class="current-stat-grid" aria-label="현재 날씨 관측값">
      <article v-for="stat in currentStats" :key="stat.label" class="current-stat">
        <small>{{ stat.label }}</small><strong>{{ stat.value }}</strong>
      </article>
    </div>

    <article class="api-panel forecast-panel">
      <header class="api-panel-heading">
        <div><span class="panel-overline">5 DAY / 3 HOUR FORECAST API</span><h2>5일 예보</h2></div>
        <el-tag type="primary" effect="plain">3시간 간격 집계</el-tag>
      </header>

      <div v-if="displayedForecast.length" class="forecast-grid">
        <article v-for="day in displayedForecast" :key="day.timestamp" class="forecast-day">
          <small>{{ day.dayLabel }}</small>
          <strong>{{ day.minTemp }}{{ configStore.unitSymbol }} / {{ day.maxTemp }}{{ configStore.unitSymbol }}</strong>
          <span>{{ day.status }}</span>
          <em>강수확률 {{ day.rainProbability }}%</em>
        </article>
      </div>
      <el-alert v-else-if="forecastError" :title="forecastError" type="warning" :closable="false" show-icon />
      <el-skeleton v-else :rows="2" animated />
    </article>

    <el-alert class="pet-message" :title="cityData.petMessage" type="warning" :closable="false" show-icon />
    <p class="api-source-note">현재 날씨·5일 예보·대기질 데이터 제공: OpenWeatherMap</p>
  </section>

  <el-empty v-else description="해당 도시의 날씨 정보를 찾을 수 없습니다.">
    <el-button type="primary" @click="router.push('/')">대시보드로 돌아가기</el-button>
  </el-empty>
</template>

<style scoped>
.detail-container {
  height: 100%;
  min-height: 0;
  padding: var(--space-5);
  overflow-x: hidden;
  overflow-y: auto;
  border: 3px solid var(--line-strong);
  border-radius: var(--radius-2xl);
  background: var(--surface-soft);
  box-shadow: 0 4px 0 var(--shadow-pink), 0 12px 16px color-mix(in srgb, var(--ink) 14%, transparent);
  scrollbar-gutter: stable;
}
.detail-container:focus-visible { outline: 2px solid var(--accent-strong); outline-offset: -4px; }

.detail-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-5); }
.detail-heading h1 { margin: var(--space-1) 0 0; color: var(--ink); font-size: 28px; line-height: 1.2; letter-spacing: -.03em; }
.detail-heading p { margin: var(--space-2) 0 0; color: var(--muted); font-size: 12px; line-height: 1.55; }
.detail-heading-actions { display: flex; align-items: center; gap: var(--space-3); }
.detail-alert { margin-top: var(--space-4); }

.detail-overview-grid { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(320px, .75fr); gap: var(--space-4); margin-top: var(--space-4); }
.detail-banner { display: flex; min-width: 0; min-height: 184px; align-items: center; gap: var(--space-4); padding: var(--space-5); color: var(--surface-soft); border: 4px solid var(--line-strong); border-radius: var(--radius-xl); font-family: 'Courier New', monospace; background-position: center; background-size: cover; box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--surface-soft) 68%, transparent); text-shadow: 2px 2px var(--ink); }
.jeonju-bg { background-image: linear-gradient(color-mix(in srgb, var(--ink) 12%, transparent), color-mix(in srgb, var(--ink) 12%, transparent)), url('../assets/pixel/jeonju-bg.png'); }
.busan-bg { background-image: linear-gradient(color-mix(in srgb, var(--ink) 12%, transparent), color-mix(in srgb, var(--ink) 12%, transparent)), url('../assets/pixel/busan-bg.png'); }
.gwangju-bg { background-image: linear-gradient(color-mix(in srgb, var(--ink) 16%, transparent), color-mix(in srgb, var(--ink) 16%, transparent)), url('../assets/pixel/gwangju-bg.png'); }
.cheonan-bg { background-image: linear-gradient(color-mix(in srgb, var(--ink) 12%, transparent), color-mix(in srgb, var(--ink) 12%, transparent)), url('../assets/pixel/cheonan-bg.png'); }
.detail-banner > span { font-size: 52px; }
.detail-banner strong, .detail-banner small { display: block; }
.detail-banner strong { font-size: 28px; line-height: 1.2; }
.detail-banner small { margin-top: var(--space-2); font-size: 12px; }
.detail-banner .el-tag { margin-left: auto; }

.api-panel { min-width: 0; padding: var(--space-4); border: 2px solid var(--line); border-radius: var(--radius-2xl); background: var(--panel); box-shadow: 0 4px 0 var(--shadow-pink); }
.api-panel-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3); }
.api-panel-heading h2 { margin: var(--space-1) 0 0; color: var(--ink); font-size: 18px; line-height: 1.35; letter-spacing: -.01em; }
.panel-overline { color: var(--accent-deep); font: 800 10px/1.3 'Courier New', monospace; letter-spacing: .12em; }
.air-quality-summary { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-2); margin-top: var(--space-3); padding-bottom: var(--space-2); border-bottom: 2px solid var(--line); }
.air-quality-summary strong { color: var(--accent-deep); font-size: 22px; line-height: 1.25; }
.air-quality-summary small, .panel-note { color: var(--muted); font-size: 11px; line-height: 1.4; }
.pollutant-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-2); margin: var(--space-3) 0 0; }
.pollutant-grid div { min-width: 0; padding: var(--space-2); border-radius: var(--radius-sm); background: var(--surface-soft); }
.pollutant-grid dt { overflow: hidden; color: var(--muted); font-size: 10px; font-weight: 800; text-overflow: ellipsis; white-space: nowrap; }
.pollutant-grid dd { margin: var(--space-1) 0 0; color: var(--ink); font-size: 14px; font-weight: 800; }
.panel-note { margin: var(--space-2) 0 0; }

.current-stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-3); margin-top: var(--space-4); }
.current-stat { display: flex; align-items: center; justify-content: space-between; min-width: 0; padding: var(--space-3) var(--space-4); border: 2px solid var(--line); border-radius: var(--radius-lg); background: var(--panel); }
.current-stat small { color: var(--muted); font-size: 11px; font-weight: 700; }
.current-stat strong { color: var(--ink); font-size: 18px; line-height: 1.35; }

.forecast-panel { margin-top: var(--space-4); }
.forecast-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(152px, 100%), 1fr)); gap: var(--space-2); margin-top: var(--space-3); }
.forecast-day { display: flex; min-width: 0; flex-direction: column; gap: var(--space-1); padding: var(--space-3); border: 2px solid var(--line); border-radius: var(--radius-lg); background: var(--surface-soft); }
.forecast-day small { color: var(--accent-deep); font-size: 11px; font-weight: 800; }
.forecast-day strong { color: var(--ink); font-size: 14px; line-height: 1.6; }
.forecast-day span { overflow: hidden; color: var(--muted); font-size: 12px; line-height: 1.55; text-overflow: ellipsis; white-space: nowrap; }
.forecast-day em { color: var(--accent-deep); font-size: 11px; font-style: normal; font-weight: 700; }
.pet-message { margin-top: var(--space-4); }
.api-source-note { margin: var(--space-3) 0 0; color: var(--muted); font: 700 10px/1.3 'Courier New', monospace; text-align: right; }
</style>
