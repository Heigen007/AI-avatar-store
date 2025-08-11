// statusBar.ts
import { StatusBar, Style } from '@capacitor/status-bar'

export async function applyStatusBar() {
    try {
        await StatusBar.setOverlaysWebView({ overlay: false })
        await StatusBar.setBackgroundColor({ color: '#091a2c' })
        await StatusBar.setStyle({ style: Style.Light })
    } catch (e) {
        console.warn('StatusBar apply error', e)
    }
}
