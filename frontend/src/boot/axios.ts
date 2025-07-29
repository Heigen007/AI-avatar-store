import { boot } from 'quasar/wrappers'
import axios from 'axios'

type TSystemStatus = 'test' | 'prod'
const systemStatus: TSystemStatus = window.location.href.includes('localhost') ? 'test' : 'prod'
console.log(`System status: ${systemStatus}`)

const testURL = 'http://127.0.0.1:3000/api'
const prodURL = 'https://api.heylumi.kz/api'


export const currentURL = systemStatus === 'test' ? testURL : prodURL

const instance = axios.create({
    baseURL: currentURL,
    timeout: 180000
})

// 👇 правильный экспорт для Quasar
export default boot(({ app }) => {
    app.config.globalProperties.$axios = instance
})

// если нужно использовать напрямую:
export { instance as axios }