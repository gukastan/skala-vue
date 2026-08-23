<script setup>
import { computed } from 'vue'

const props = defineProps({
  pet: { type: Object, required: true },
})

const energyStatus = computed(() => getStatus(props.pet.energy, ['위험', '피곤', '보통', '최상']))
const comfortStatus = computed(() => getStatus(props.pet.comfort, ['매우 불쾌', '불쾌', '보통', '쾌적']))
const hungerStatus = computed(() => getStatus(100 - props.pet.hunger, ['매우 배고픔', '출출함', '보통', '배부름']))

function getStatus(value, labels) {
  if (value < 20) return labels[0]
  if (value < 50) return labels[1]
  if (value < 80) return labels[2]
  return labels[3]
}
</script>

<template>
  <el-card class="pet-status-card" shadow="never">
    <div class="pet-status-heading"><div><span class="section-kicker">PET STATUS</span><h3>{{ pet.name }}의 상태</h3><small>10초마다 상태가 5%씩 변화해요</small></div><el-tag type="success">{{ pet.mood }}</el-tag></div>
    <div class="status-row"><div class="status-label"><span>⚡ 체력</span><el-tag size="small" :type="energyStatus === '위험' ? 'danger' : energyStatus === '피곤' ? 'warning' : 'success'">{{ energyStatus }}</el-tag></div><el-progress :percentage="pet.energy" :stroke-width="10" color="#67c23a" /></div>
    <div class="status-row"><div class="status-label"><span>🌿 쾌적도</span><el-tag size="small" :type="comfortStatus === '매우 불쾌' ? 'danger' : comfortStatus === '불쾌' ? 'warning' : 'success'">{{ comfortStatus }}</el-tag></div><el-progress :percentage="pet.comfort" :stroke-width="10" color="#409eff" /></div>
    <div class="status-row"><div class="status-label"><span>🍪 배고픔</span><el-tag size="small" :type="hungerStatus === '매우 배고픔' ? 'danger' : hungerStatus === '출출함' ? 'warning' : 'success'">{{ hungerStatus }}</el-tag></div><el-progress :percentage="pet.hunger" :stroke-width="10" color="#e6a23c" /></div>
  </el-card>
</template>

<style scoped>
.pet-status-card :deep(.el-card__body) { padding: 16px; }.pet-status-heading { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }.section-kicker { color: #2680eb; font-size: 10px; font-weight: 800; letter-spacing: .12em; }.pet-status-heading h3 { margin: 5px 0 0; font-size: 17px; }.pet-status-heading small { display: block; margin-top: 4px; color: #829ab1; font-size: 10px; }.status-row { display: grid; grid-template-columns: 1fr; gap: 6px; margin-top: 11px; color: #627d98; font-size: 11px; font-weight: 700; }.status-label { display: flex; align-items: center; justify-content: space-between; }
</style>
