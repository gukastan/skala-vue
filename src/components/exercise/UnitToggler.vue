<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label">단위</span>
    <el-switch
      :model-value="configStore.unit === 'fahrenheit'"
      active-text="°F"
      inactive-text="°C"
      @change="configStore.toggleUnit"
    />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 58px;
  gap: var(--space-2);
  margin-left: 0;
  padding: 7px 9px;
  border: 3px solid #d5ae91;
  border-radius: var(--radius-lg);
  color: var(--muted);
  background: #fff5d9;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.unit-toggler .el-switch { --el-switch-on-color: var(--accent-strong); --el-switch-off-color: #bca9bd; }
</style>
