<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import happyPuppySprite from '../../assets/pixel/pet-puppy-happy.png'
import normalPuppySprite from '../../assets/pixel/pet-puppy-normal.png'
import sleepyPuppySprite from '../../assets/pixel/pet-puppy-sleepy.png'
import hungryPuppySprite from '../../assets/pixel/pet-puppy-hungry.png'
import weatherPetFrame from '../../assets/pixel/weather-pet-frame-latest.png'

const props = defineProps({
  city: { type: Object, required: true },
  pet: { type: Object, required: true },
  learningMode: { type: Boolean, default: false },
  learningPoints: { type: Array, default: () => [] },
})
const emit = defineEmits(['care', 'select-learning-point'])
const configStore = useConfigStore()
const displayTemp = computed(() => configStore.unit === 'fahrenheit' ? Math.round((props.city.temp * 9) / 5 + 32) : props.city.temp)

const getStatus = (value, labels) => {
  if (value < 20) return labels[0]
  if (value < 50) return labels[1]
  if (value < 80) return labels[2]
  return labels[3]
}

const statusSummary = computed(() => ({
  energy: getStatus(props.pet.energy, ['위험', '피곤', '보통', '최상']),
  comfort: getStatus(props.pet.comfort, ['매우 불쾌', '불쾌', '보통', '쾌적']),
  hunger: getStatus(100 - props.pet.hunger, ['매우 배고픔', '출출함', '보통', '배부름']),
}))

const deviceMessage = computed(() => props.pet.statusText?.includes('도시를 선택하면') ? props.city.petMessage : props.pet.statusText || props.city.petMessage)

const petState = computed(() => {
  if (props.pet.energy < 35) return 'sleepy'
  if (props.pet.hunger > 70) return 'hungry'
  if (props.pet.mood === '행복') return 'happy'
  return 'normal'
})

const puppySprite = computed(() => ({
  happy: happyPuppySprite,
  normal: normalPuppySprite,
  sleepy: sleepyPuppySprite,
  hungry: hungryPuppySprite,
}[petState.value]))
</script>

<template>
  <el-card class="pet-stage-card" shadow="never">
    <div class="pet-device">
      <img class="pet-device-frame" :src="weatherPetFrame" alt="" aria-hidden="true" />
      <button v-if="learningMode" class="learning-marker device-marker marker-pet" type="button" aria-label="Pixel Pet Stage 학습 포인트 선택" @click="emit('select-learning-point', 3)">{{ learningPoints[2]?.marker || '3' }}</button>
      <div class="device-screen">
        <div :class="['pixel-stage', city.backgroundClass]">
          <div class="pixel-stage-top">
            <div class="pixel-location">
              <span class="pixel-location-label">📍 {{ city.name }}</span>
              <span class="pixel-weather-line"><span class="pixel-weather-icon">{{ city.weatherIcon }}</span><strong>{{ city.status }}</strong><b>{{ displayTemp }}{{ configStore.unitSymbol }}</b></span>
            </div>
            <div class="pet-status-anchor">
            <div class="pixel-status">
              <div class="status-header"><span>PET STATUS</span><strong>😊 {{ pet.mood }}</strong></div>
              <div class="mini-status status-energy"><div class="mini-status-heading"><span>⚡ 체력</span><strong>{{ statusSummary.energy }}</strong><b>{{ pet.energy }}%</b></div><i><em :style="{ width: `${pet.energy}%` }"></em></i></div>
              <div class="mini-status status-comfort"><div class="mini-status-heading"><span>🌿 쾌적도</span><strong>{{ statusSummary.comfort }}</strong><b>{{ pet.comfort }}%</b></div><i><em :style="{ width: `${pet.comfort}%` }"></em></i></div>
              <div class="mini-status status-hunger"><div class="mini-status-heading"><span>🍪 배고픔</span><strong>{{ statusSummary.hunger }}</strong><b>{{ pet.hunger }}%</b></div><i><em :style="{ width: `${pet.hunger}%` }"></em></i></div>
            </div>
              <button v-if="learningMode" class="learning-marker device-marker marker-status" type="button" aria-label="PET STATUS 학습 포인트 선택" @click="emit('select-learning-point', 4)">{{ learningPoints[3]?.marker || '4' }}</button>
            </div>
          </div>
          <div class="pixel-scene">
            <img :class="['pixel-puppy-sprite', `is-${petState}`]" :src="puppySprite" :alt="`${pet.name} ${petState} 캐릭터`" />
          </div>
          <div class="pixel-message">{{ deviceMessage }}</div>
        </div>
      </div>
      <div class="device-care">
        <button type="button" aria-label="물 주기" title="물 주기" @click="emit('care', 'water')"></button>
        <button type="button" aria-label="간식 주기" title="간식 주기" @click="emit('care', 'snack')"></button>
        <button type="button" aria-label="산책하기" title="산책하기" @click="emit('care', 'walk')"></button>
        <button type="button" aria-label="휴식하기" title="휴식하기" @click="emit('care', 'rest')"></button>
        <button v-if="learningMode" class="learning-marker device-marker marker-care" type="button" aria-label="돌봄 행동 학습 포인트 선택" @click="emit('select-learning-point', 5)">{{ learningPoints[4]?.marker || '5' }}</button>
      </div>
      <div class="device-controls"><span>◀ SELECT</span><span>● OK</span><span>▶ BACK</span></div>
    </div>
  </el-card>
</template>

<style scoped>
.pet-stage-card { border: 0 !important; border-radius: 0 !important; background: transparent !important; box-shadow: none !important; }
.pet-stage-card :deep(.el-card__body) { padding: 0; }
.pet-device { position: relative; width: 100%; aspect-ratio: 1; overflow: hidden; }
.pet-device-frame { position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%; object-fit: contain; pointer-events: none; user-select: none; }
.device-screen { position: absolute; z-index: 2; top: 22.8%; left: 10.8%; width: 78.4%; height: 54.6%; padding: 7px; overflow: hidden; border: 0; border-radius: 10px; background: transparent; box-shadow: none; }
.pixel-stage { display: flex; min-height: 0; height: 100%; flex-direction: column; padding: 9px; color: #fff; font-family: 'Courier New', monospace; image-rendering: pixelated; border: 3px solid #211e28; border-radius: 7px; background-position: center; background-size: cover; box-shadow: inset 0 0 0 2px #f3dcae, inset 0 0 22px #11182755; }
.jeonju-bg { background-image: linear-gradient(rgba(0,0,0,.08), rgba(0,0,0,.08)), url('../../assets/pixel/jeonju-bg.png'); }
.busan-bg { background-image: linear-gradient(rgba(0,0,0,.08), rgba(0,0,0,.08)), url('../../assets/pixel/busan-bg.png'); }
.gwangju-bg { background-image: linear-gradient(rgba(0,0,0,.12), rgba(0,0,0,.12)), url('../../assets/pixel/gwangju-bg.png'); }
.cheonan-bg { background-image: linear-gradient(rgba(0,0,0,.08), rgba(0,0,0,.08)), url('../../assets/pixel/cheonan-bg.png'); }
.pixel-stage-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 7px; font-size: 11px; font-weight: 700; }
.pixel-location, .pixel-status { background: rgba(15, 25, 39, .93); border: 2px solid #f0d8a8; box-shadow: inset 0 0 0 2px #3f4855, 3px 3px 0 #191b26aa; text-shadow: none; }
.pixel-location { display: grid; gap: 4px; min-width: 0; padding: 7px 8px; }
.pixel-location-label { color: #f8e8bc; font-size: 9px; letter-spacing: .04em; }
.pixel-weather-line { display: flex; align-items: baseline; gap: 7px; color: #fff; }
.pixel-weather-icon { font-size: 14px; line-height: 1; }
.pixel-weather-line strong { color: #f3f0e7; font-size: 10px; }
.pixel-weather-line b { margin-left: auto; color: #fff4cb; font-size: 18px; letter-spacing: -.04em; }
.pet-status-anchor { position: relative; width: 180px; min-width: 0; }
.pixel-status { display: grid; gap: 6px; width: 100%; min-height: 0; padding: 7px 8px; }
.status-header { display: flex; align-items: center; justify-content: space-between; gap: 5px; padding-bottom: 5px; border-bottom: 1px solid #77808c; }
.status-header > span { color: #f7d678; font-size: 8px; letter-spacing: .08em; }
.status-header strong { padding: 2px 4px; color: #fff7dc; background: #596574; font-size: 9px; }
.mini-status { display: grid; gap: 3px; }
.mini-status-heading { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 4px; color: #f7f4ec; font-size: 8px; line-height: 1.2; }
.mini-status-heading strong { color: #e8dcb5; font-size: 8px; font-weight: 700; }
.mini-status-heading b { min-width: 28px; color: #fff4c5; font-size: 9px; text-align: right; }
.mini-status i { display: block; height: 6px; overflow: hidden; border: 1px solid #111820; background: #d7d0c3; box-shadow: inset 0 1px 0 #fff8e5; }
.mini-status em { display: block; height: 100%; background: #72c46a; transition: width .25s ease; }
.status-comfort em { background: #55bff2; }
.status-hunger em { background: #efb947; }
.pixel-scene { display: flex; min-height: 0; flex: 1; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.pixel-message { padding: 6px 8px; color: #222; background: #fff5c2; border: 2px solid #222; font-size: 9px; font-weight: 700; line-height: 1.3; }
.device-care { position: absolute; z-index: 4; right: 24.7%; bottom: 11.7%; left: 24.7%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 3.8%; height: 11.2%; margin: 0; padding: 0; border: 0; background: transparent; box-shadow: none; }
.device-care-label { display: none; }
.device-care > button:not(.learning-marker) { display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; aspect-ratio: auto; min-height: 0; padding: 0; border: 0; border-radius: 50%; color: transparent; background: transparent; box-shadow: none; font-size: 0; line-height: 1; cursor: pointer; transform: scale(1.04); transform-origin: center; transition: transform .1s ease, filter .1s ease; }
.device-care > button:not(.learning-marker):hover { filter: brightness(1.06); }
.device-care > button:not(.learning-marker):active { transform: translateY(2px) scale(.98); }
.device-controls { display: none; }
.learning-marker { position: absolute; z-index: 100; display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border: 3px solid #fff8e8; border-radius: 50%; color: #fff; background: #c94f78; box-shadow: 0 4px 0 #8c6a58, 0 5px 12px #30244866; font-size: 17px; font-weight: 900; cursor: pointer; transition: transform .18s ease, background .18s ease; }
.learning-marker:hover, .learning-marker:focus-visible { outline: none; background: #b54872; transform: scale(1.12); }
.device-marker.marker-pet { top: 19%; left: 10%; background: #67a66f; }
.device-marker.marker-status { top: -17px; right: -17px; background: #a04d89; }
.device-marker.marker-care { top: -25px; right: -2px; background: #4e8eb8; }
</style>

<style scoped>
.pixel-puppy-sprite { width: 190px; height: 210px; object-fit: contain; image-rendering: pixelated; filter: drop-shadow(7px 7px 0 rgba(0,0,0,.4)); }.pixel-puppy-sprite.is-sleepy { filter: grayscale(.45) brightness(.9) drop-shadow(7px 7px 0 rgba(0,0,0,.4)); }.pixel-puppy-sprite.is-hot { filter: sepia(.35) saturate(1.3) drop-shadow(7px 7px 0 rgba(0,0,0,.4)); }.pixel-puppy-sprite.is-hungry { transform: translateY(3px) scale(.96); }.pixel-puppy-sprite.is-happy { animation: puppy-bounce .8s steps(2, end) infinite alternate; }
@keyframes puppy-bounce { from { transform: translateY(0); } to { transform: translateY(-5px); } }
</style>

<style scoped>
.pixel-status { box-sizing: border-box; }
</style>
