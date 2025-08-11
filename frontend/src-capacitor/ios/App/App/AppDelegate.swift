import UIKit
import Capacitor
import FBSDKCoreKit
import AppTrackingTransparency

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        // Инициализация Facebook SDK
        ApplicationDelegate.shared.application(
            application,
            didFinishLaunchingWithOptions: launchOptions
        )

        // DEBUG-логи SDK (опционально)
        #if DEBUG
        Settings.shared.isAutoLogAppEventsEnabled = true
        Settings.shared.loggingBehaviors = [.appEvents, .networkRequests]
        #endif

        // Отправка события запуска в App Events
        AppEvents.shared.activateApp()

        return true
    }

    // Показ ATT-попапа после появления UI (надёжнее) и только один раз
    func applicationDidBecomeActive(_ application: UIApplication) {
        guard #available(iOS 14, *) else { return }

        let askedKey = "attPromptShown"
        if UserDefaults.standard.bool(forKey: askedKey) { return }

        if ATTrackingManager.trackingAuthorizationStatus == .notDetermined {
            // Небольшая задержка, чтобы UI точно успел отрисоваться
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                ATTrackingManager.requestTrackingAuthorization { _ in
                    UserDefaults.standard.set(true, forKey: askedKey)
                    // Ничего вручную в FBSDK ставить не нужно — он сам читает статус ATT
                }
            }
        } else {
            // Уже определён (authorized/denied/limited) — фиксируем, чтобы не пытаться снова
            UserDefaults.standard.set(true, forKey: askedKey)
        }
    }

    // URL-схемы: сначала Facebook, потом Capacitor
    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        if ApplicationDelegate.shared.application(app, open: url, options: options) {
            return true
        }
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    // Universal Links: корректный вызов без restorationHandler для FBSDK
    func application(
        _ application: UIApplication,
        continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        if ApplicationDelegate.shared.application(application, continue: userActivity) {
            return true
        }
        return ApplicationDelegateProxy.shared.application(
            application,
            continue: userActivity,
            restorationHandler: restorationHandler
        )
    }

    // Остальные хуки оставлены пустыми
    func applicationWillResignActive(_ application: UIApplication) { }
    func applicationDidEnterBackground(_ application: UIApplication) { }
    func applicationWillEnterForeground(_ application: UIApplication) { }
    func applicationWillTerminate(_ application: UIApplication) { }
}
