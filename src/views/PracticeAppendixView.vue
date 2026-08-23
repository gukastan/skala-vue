<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const practiceModules = import.meta.glob('../components/practices/**/*.vue', {
  eager: true,
  import: 'default',
})

const groupMeta = {
  basic: { label: 'Vue 기본 문법', description: 'Directive, 이벤트, 폼, 스타일' },
  composition: { label: 'Composition API', description: '반응형 상태, computed, watcher' },
  component: { label: 'Component', description: 'Lifecycle, Props, Emits, Slot' },
  library: { label: '외부 라이브러리', description: 'Pinia, Axios, Element Plus' },
}

const formatName = (filename) => filename.replace(/\.vue$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([._-])/g, ' ')

const lessons = Object.entries(practiceModules)
  .map(([path, component]) => {
    const match = path.match(/practices\/([^/]+)\/([^/]+)\.vue$/)
    const groupId = match?.[1] || 'basic'
    const filename = match?.[2] || path
    return {
      id: path,
      groupId,
      groupLabel: groupMeta[groupId]?.label || groupId,
      label: filename,
      title: formatName(filename),
      component,
    }
  })
  .sort((a, b) => a.id.localeCompare(b.id))

const route = useRoute()
const routeSearch = () => String(route.query.search || '')
const findLesson = (query) => lessons.find((lesson) => `${lesson.label} ${lesson.title}`.toLowerCase().includes(query.toLowerCase())) || lessons[0]
const searchQuery = ref(routeSearch())
const selectedLesson = ref(findLesson(searchQuery.value))

watch(() => route.query.search, () => {
  searchQuery.value = routeSearch()
  selectedLesson.value = findLesson(searchQuery.value)
})

const filteredLessons = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return lessons
  return lessons.filter((lesson) => `${lesson.label} ${lesson.title} ${lesson.groupLabel}`.toLowerCase().includes(query))
})

const groupedLessons = computed(() => Object.entries(groupMeta).map(([id, meta]) => ({
  id,
  ...meta,
  lessons: filteredLessons.value.filter((lesson) => lesson.groupId === id),
})).filter((group) => group.lessons.length))

const selectLesson = (id) => {
  selectedLesson.value = lessons.find((lesson) => lesson.id === id) || lessons[0]
}
</script>

<template>
  <section class="practice-page">
    <div class="page-heading compact">
      <h1>Vue.js 실습</h1>
    </div>

    <div class="practice-toolbar">
      <el-input v-model="searchQuery" clearable size="large" placeholder="실습 이름이나 개념 검색" class="practice-search">
        <template #prefix>⌕</template>
      </el-input>
      <el-tag type="primary" effect="light" size="large">전체 {{ lessons.length }}개</el-tag>
    </div>

    <div class="practice-layout">
      <el-menu :default-active="selectedLesson.id" class="lesson-nav" @select="selectLesson">
        <div v-for="group in groupedLessons" :key="group.id" class="lesson-group">
          <div class="lesson-group-heading"><strong>{{ group.label }}</strong><el-badge :value="group.lessons.length" type="primary" /><small>{{ group.description }}</small></div>
          <el-menu-item v-for="lesson in group.lessons" :key="lesson.id" :index="lesson.id"><code>{{ lesson.label }}</code><span>{{ lesson.title }}</span><b>→</b></el-menu-item>
        </div>
        <el-empty v-if="groupedLessons.length === 0" description="실습이 없습니다." :image-size="70" />
      </el-menu>

      <el-card class="practice-stage" shadow="never">
        <div class="stage-heading"><div><el-tag type="success" effect="light">LIVE PRACTICE</el-tag><h2>{{ selectedLesson.title }}</h2></div><el-tag effect="plain">{{ selectedLesson.groupLabel }}</el-tag></div>
        <el-divider />
        <div class="practice-content"><component :is="selectedLesson.component" /></div>
      </el-card>
    </div>
  </section>
</template>

<style scoped>
.practice-page { height: 100%; display: grid; grid-template-rows: 58px 46px 1fr; gap: 14px; }.practice-page .page-heading { display: flex; align-items: center; max-width: none; margin: 0; }.practice-page .page-heading h1 { margin: 0; font-size: 32px; }.practice-toolbar { margin: 0; }.practice-search { max-width: 460px; }.practice-layout { min-width: 0; min-height: 0; height: 100%; grid-template-columns: 300px minmax(0, 1fr); gap: 16px; }.lesson-nav { height: 100%; max-height: none; overflow-x: hidden; overflow-y: auto; padding: 8px 8px 28px; scrollbar-gutter: stable; scroll-padding-block: 14px; }.lesson-group-heading { padding: 8px 10px 6px; }.lesson-nav .el-menu-item { height: 38px; scroll-margin-block: 14px; }.practice-stage { display: flex; min-width: 0; height: 100%; min-height: 0; overflow: hidden; }.practice-stage :deep(.el-card__body) { display: flex; min-width: 0; min-height: 0; flex: 1 1 auto; flex-direction: column; overflow: hidden; padding: 18px; }.practice-content { min-width: 0; max-width: 100%; min-height: 0; flex: 1 1 auto; overflow-x: hidden; overflow-y: auto; padding: 0 8px 28px 0; scrollbar-gutter: stable; }.practice-content :deep(.practice-section) { width: 100%; max-width: 100%; min-width: 0; overflow: visible; }.practice-content :deep(.practice-section input[type='text']) { display: block; width: min(100%, 560px); max-width: 100%; min-width: 0; min-height: 34px; padding: 7px 10px; line-height: 1.35; }.practice-content :deep(.practice-section .input-zone) { min-width: 0; }.practice-content :deep(.practice-section .input-zone input[type='text']) { display: block; width: auto; flex: 1 1 auto; }.stage-heading { margin-bottom: 12px; }.stage-heading h2 { font-size: 20px; }
</style>
