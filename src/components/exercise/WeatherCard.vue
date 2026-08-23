<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수 (매크로)
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록 (매크로)
const emit = defineEmits(['select-card', 'click-detail'])
const configStore = useConfigStore()
const displayTemp = computed(() => configStore.unit === 'fahrenheit' ? Math.round((props.cityItem.temp * 9) / 5 + 32) : props.cityItem.temp)
</script>

<template>
  <el-card class="weather-card" shadow="hover" @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)">
    <div class="weather-card-heading">
      <div class="weather-card-city"><h4>{{ cityItem.name }}</h4><el-tag :type="cityItem.temp >= 25 ? 'danger' : 'info'" effect="light">{{ cityItem.status }}</el-tag></div>
      <p class="temperature">{{ displayTemp }}<sup>{{ configStore.unitSymbol }}</sup></p>
    </div>

    <div class="weather-card-bottom">
      <el-tag v-if="cityItem.temp >= 25" type="danger" effect="dark">🔥 더움</el-tag>
      <el-tag v-else type="info" effect="dark">❄️ 선선함</el-tag>
      <el-button class="btn-detail" type="primary" plain @click.stop="emit('click-detail', cityItem.id)">상세보기</el-button>
    </div>
  </el-card>
</template>

<style scoped>
.weather-card {
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
}
.weather-card :deep(.el-card__body) { padding: 17px 18px; }
.weather-card-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }.weather-card-city { display: flex; align-items: center; gap: 7px; min-width: 0; }.weather-card h4 { margin: 0; font-size: 18px; }.temperature { flex: 0 0 auto; margin: -2px 0 0 auto; color: #102a43; font-size: 30px; font-weight: 800; line-height: 1; text-align: right; }.temperature sup { margin-left: 3px; font-size: 15px; font-weight: 600; }
.weather-card-bottom { display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-top: 22px; }.weather-card-bottom .btn-detail { margin-left: auto; }.btn-detail { flex: 0 0 auto; }
</style>
