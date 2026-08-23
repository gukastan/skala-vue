import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const usePetStore = defineStore('pet', () => {
  const name = ref('구름이')
  const mood = ref('보통')
  const energy = ref(80)
  const comfort = ref(70)
  const hunger = ref(30)
  const statusText = ref('도시를 선택하면 구름이가 여행을 시작해요.')
  let decayTimer

  const moodLabel = computed(() => `${name.value} · ${mood.value}`)

  function resetStatus(message = '새로운 도시에서 여행을 시작했어요.') {
    mood.value = '보통'
    energy.value = 80
    comfort.value = 70
    hunger.value = 30
    statusText.value = message
  }

  function decayByTime() {
    energy.value = Math.max(0, energy.value - 5)
    comfort.value = Math.max(0, comfort.value - 5)
    hunger.value = Math.min(100, hunger.value + 5)

    if (energy.value <= 20) mood.value = '졸림'
    else if (comfort.value <= 20) mood.value = '불편'
    else if (hunger.value >= 80) mood.value = '배고픔'
  }

  function startTimeDecay() {
    if (decayTimer) return
    decayTimer = window.setInterval(decayByTime, 10000)
  }

  function stopTimeDecay() {
    if (!decayTimer) return
    window.clearInterval(decayTimer)
    decayTimer = undefined
  }

  function care(action, city) {
    if (action === 'water') {
      comfort.value = Math.min(100, comfort.value + (city.temp >= 27 ? 15 : 5))
      statusText.value = '💧 시원한 물을 마신 구름이의 쾌적도가 올라갔어요.'
    } else if (action === 'snack') {
      hunger.value = Math.max(0, hunger.value - 20)
      mood.value = '행복'
      statusText.value = '🍪 맛있는 간식을 먹고 구름이가 행복해졌어요.'
    } else if (action === 'walk') {
      if (city.rainProbability >= 60 || city.airQuality === '나쁨') {
        energy.value = Math.max(0, energy.value - 10)
        statusText.value = '🌧️ 날씨가 좋지 않아 산책이 조금 힘들었어요.'
      } else {
        mood.value = '행복'
        energy.value = Math.max(0, energy.value - 5)
        statusText.value = '🌳 즐겁게 산책하고 구름이의 기분이 좋아졌어요.'
      }
    } else {
      energy.value = Math.min(100, energy.value + 15)
      comfort.value = Math.min(100, comfort.value + 5)
      statusText.value = '🛋️ 포근하게 쉬고 구름이의 체력이 회복됐어요.'
    }
  }

  return { name, mood, energy, comfort, hunger, statusText, moodLabel, resetStatus, care, startTimeDecay, stopTimeDecay }
})
