<script setup>
// 1. 상위로 입력 텍스트를 전달할 커스텀 이벤트 등록 (매크로)
const emit = defineEmits(['update-query'])

// 2. 상위로부터 현재 검색 상태 값을 수신 (한글 동기화 상태 유지용)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const handleInput = (event) => emit('update-query', event.target.value)
const clearQuery = () => emit('update-query', '')
</script>

<template>
  <div class="search-inner">
    <div class="search-heading"><div><h3>도시 검색</h3></div><el-tag type="info" effect="plain">{{ currentQuery ? '검색 중' : '전체 도시' }}</el-tag></div>
    <div class="search-input-wrap">
      <input class="search-input" :value="currentQuery" placeholder="도시 이름을 입력하세요" @input="handleInput" />
      <button v-if="currentQuery" class="clear-search" type="button" aria-label="검색어 지우기" @click="clearQuery">×</button>
    </div>
    <p class="search-result">검색 중인 도시: <strong>{{ currentQuery || '전체 도시' }}</strong></p>
  </div>
</template>

<style scoped>
.search-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.search-kicker { color: #2680eb; font-size: 10px; font-weight: 800; letter-spacing: .12em; }
h3 { margin: 5px 0 0; font-size: 19px; }
.search-input-wrap { display: flex; align-items: center; min-height: 40px; border: 3px solid #e0a8b7; border-radius: 12px; box-shadow: inset 0 3px #f7dce0; background: #fffaf1; }
.search-input { width: 100%; min-width: 0; padding: 9px 12px; border: 0; outline: 0; color: #302448; background: transparent; font-size: 14px; }
.search-input::placeholder { color: #a49aaa; }
.clear-search { flex: 0 0 auto; width: 28px; height: 28px; margin-right: 5px; border: 0; border-radius: 50%; color: #8c6a58; background: #ffe1e7; font-size: 20px; line-height: 1; }
.search-result { margin: 11px 0 0; color: #829ab1; font-size: 12px; }
.search-result strong { color: #102a43; }
</style>
