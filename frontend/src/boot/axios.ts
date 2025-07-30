import { boot } from 'quasar/wrappers'
import axios from 'axios'

type TSystemStatus = 'test' | 'prod'
// const systemStatus: TSystemStatus = window.location.href.includes('localhost') ? 'test' : 'prod'
const systemStatus: TSystemStatus = 'prod'

// const testURL = 'https://api.repliky.kz/api'
// const prodURL = 'https://api.repliky.kz/api'


export const currentURL = 'https://api.repliky.kz/api'

const instance = axios.create({
    baseURL: currentURL,
    timeout: 120000
})

// 👇 правильный экспорт для Quasar
export default boot(({ app }) => {
    app.config.globalProperties.$axios = instance
})

// если нужно использовать напрямую:
export { instance as axios }