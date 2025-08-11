// statusBar.ts
import { StatusBar, Style } from '@capacitor/status-bar'

export async function applyStatusBarBase() {
    await StatusBar.setStyle({ style: Style.Light })
    await StatusBar.setBackgroundColor({ color: '#091a2c' })
}

/**
 * Жёсткий фикс для iOS-пикера: дёргаем overlay true/false, чтобы
 * Capacitor пересчитал фрейм WebView и вернул safe area.
 */
export async function fixStatusBarAfterPicker() {
    try {
        // 1) Быстрый рефлоу: включить overlay
        await StatusBar.setOverlaysWebView({ overlay: true })
        // 2) Подождать один тик рендера
        await new Promise((r) => requestAnimationFrame(() => r(null)))
        // 3) Выключить overlay обратно
        await StatusBar.setOverlaysWebView({ overlay: false })
        // 4) Вернуть цвет/стиль
        await applyStatusBarBase()
    } catch (e) {
        console.warn('fixStatusBarAfterPicker error', e)
    }
}