<script setup>
defineEmits(['care'])
</script>

<template>
  <el-card class="care-card" shadow="never">
    <div class="care-heading"><div><span class="section-kicker">CARE ACTIONS</span><h3>구름이 돌보기</h3></div><el-tag type="warning" effect="plain">날씨 반응형</el-tag></div>
    <div class="care-actions"><el-button size="small" type="primary" @click="$emit('care', 'water')">💧 물 주기</el-button><el-button size="small" type="warning" @click="$emit('care', 'snack')">🍪 간식 주기</el-button><el-button size="small" type="success" @click="$emit('care', 'walk')">🌳 산책하기</el-button><el-button size="small" type="info" @click="$emit('care', 'rest')">🛋️ 실내 쉬기</el-button></div>
  </el-card>
</template>

<style scoped>
.care-card :deep(.el-card__body) { padding: 16px; }.care-heading { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }.section-kicker { color: #2680eb; font-size: 10px; font-weight: 800; letter-spacing: .12em; }.care-heading h3 { margin: 5px 0 0; font-size: 17px; }.care-actions { display: flex; flex-wrap: wrap; gap: 6px; }.care-actions .el-button { margin: 0; }
</style>
