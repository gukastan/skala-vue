import axios from 'axios'

const API_URL = 'https://api.openweathermap.org/data/2.5'
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

export const hasWeatherApiKey = Boolean(API_KEY)
const TRACKED_CITY_IDS = new Set(['city_jeonju', 'city_busan', 'city_gwangju', 'city_cheonan'])
const AIR_QUALITY_LABELS = {
  1: '좋음',
  2: '양호',
  3: '보통',
  4: '나쁨',
  5: '매우 나쁨',
}

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 8000,
})

export async function fetchWeatherForCity(city) {
  if (!hasWeatherApiKey) return city

  const { data } = await apiClient.get('weather', {
    params: {
      q: city.apiQuery,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  const weather = data.weather?.[0]

  return {
    ...city,
    temp: Math.round(data.main.temp),
    status: weatherStatusFor(weather?.main) || city.status,
    description: weather?.description || city.description || city.status,
    humidity: data.main.humidity ?? city.humidity,
    windSpeed: data.wind?.speed ?? city.windSpeed,
    weatherIcon: weatherIconFor(data.weather?.[0]?.main),
    coordinates: data.coord ? { lat: data.coord.lat, lon: data.coord.lon } : null,
    timezoneOffset: data.timezone ?? 0,
  }
}

export async function fetchWeatherForCities(cities) {
  const trackedCities = cities.filter((city) => TRACKED_CITY_IDS.has(city.id))
  return Promise.all(trackedCities.map((city) => fetchWeatherForCity(city)))
}

export async function fetchWeatherDetailsForCity(city) {
  if (!hasWeatherApiKey) {
    const message = 'OpenWeatherMap API 키가 없어 실시간 데이터를 불러오지 못했습니다.'
    return { current: city, forecast: [], airQuality: null, errors: { forecast: message, airQuality: message } }
  }

  const current = await fetchWeatherForCity(city)
  if (!current.coordinates) throw new Error('OpenWeatherMap current weather response omitted coordinates')

  const requestContext = {
    ...current.coordinates,
    timezoneOffset: current.timezoneOffset,
  }
  const [forecastResult, airQualityResult] = await Promise.allSettled([
    fetchFiveDayForecast(requestContext),
    fetchCurrentAirQuality(requestContext),
  ])

  return {
    current,
    forecast: forecastResult.status === 'fulfilled' ? forecastResult.value : [],
    airQuality: airQualityResult.status === 'fulfilled' ? airQualityResult.value : null,
    errors: {
      forecast: forecastResult.status === 'rejected' ? '5일 예보를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.' : '',
      airQuality: airQualityResult.status === 'rejected' ? '대기질 정보를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.' : '',
    },
  }
}

async function fetchFiveDayForecast({ lat, lon, timezoneOffset }) {
  const { data } = await apiClient.get('forecast', {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'kr' },
  })

  return summarizeForecast(data.list || [], data.city?.timezone ?? timezoneOffset)
}

async function fetchCurrentAirQuality({ lat, lon, timezoneOffset }) {
  const { data } = await apiClient.get('air_pollution', {
    params: { lat, lon, appid: API_KEY },
  })
  const observation = data.list?.[0]
  if (!observation) throw new Error('OpenWeatherMap air pollution response was empty')

  const components = observation.components || {}
  return {
    index: observation.main?.aqi ?? 0,
    label: AIR_QUALITY_LABELS[observation.main?.aqi] || '정보 없음',
    measuredAt: formatLocalDate(observation.dt, timezoneOffset, {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    pollutants: [
      { label: '초미세먼지 PM2.5', value: roundPollutant(components.pm2_5) },
      { label: '미세먼지 PM10', value: roundPollutant(components.pm10) },
      { label: '이산화질소 NO₂', value: roundPollutant(components.no2) },
      { label: '오존 O₃', value: roundPollutant(components.o3) },
    ],
  }
}

function summarizeForecast(items, timezoneOffset = 0) {
  const groupedByDay = new Map()

  items.forEach((item) => {
    const dateKey = localDate(item.dt, timezoneOffset).toISOString().slice(0, 10)
    const dayItems = groupedByDay.get(dateKey) || []
    dayItems.push(item)
    groupedByDay.set(dateKey, dayItems)
  })

  return [...groupedByDay.values()].slice(0, 5).map((dayItems) => {
    const representative = dayItems.reduce((closest, item) => {
      const itemDistance = Math.abs(localDate(item.dt, timezoneOffset).getUTCHours() - 12)
      const closestDistance = Math.abs(localDate(closest.dt, timezoneOffset).getUTCHours() - 12)
      return itemDistance < closestDistance ? item : closest
    })

    return {
      timestamp: representative.dt,
      dayLabel: formatLocalDate(representative.dt, timezoneOffset, { month: 'numeric', day: 'numeric', weekday: 'short' }),
      status: representative.weather?.[0]?.description || '정보 없음',
      minTemp: Math.round(Math.min(...dayItems.map((item) => item.main.temp_min))),
      maxTemp: Math.round(Math.max(...dayItems.map((item) => item.main.temp_max))),
      rainProbability: Math.round(Math.max(...dayItems.map((item) => item.pop || 0)) * 100),
    }
  })
}

function localDate(timestamp, timezoneOffset = 0) {
  return new Date((timestamp + timezoneOffset) * 1000)
}

function formatLocalDate(timestamp, timezoneOffset, options) {
  return new Intl.DateTimeFormat('ko-KR', { ...options, timeZone: 'UTC' }).format(localDate(timestamp, timezoneOffset))
}

function roundPollutant(value) {
  return Number.isFinite(value) ? Math.round(value * 10) / 10 : '-'
}

function weatherIconFor(condition) {
  if (condition === 'Rain' || condition === 'Drizzle') return '🌧️'
  if (condition === 'Clouds') return '🌤️'
  if (condition === 'Snow') return '❄️'
  if (condition === 'Thunderstorm') return '⛈️'
  return '☀️'
}

function weatherStatusFor(condition) {
  if (condition === 'Clear') return '맑음'
  if (condition === 'Clouds') return '구름'
  if (condition === 'Rain' || condition === 'Drizzle') return '비'
  if (condition === 'Snow') return '눈'
  if (condition === 'Thunderstorm') return '뇌우'
  if (['Mist', 'Fog', 'Haze', 'Smoke'].includes(condition)) return '안개'
  if (['Dust', 'Sand', 'Ash'].includes(condition)) return '황사'
  if (condition === 'Squall') return '돌풍'
  if (condition === 'Tornado') return '토네이도'
  return ''
}
