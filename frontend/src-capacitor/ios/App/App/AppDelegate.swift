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

        // ВАЖНО: activateApp переносим в applicationDidBecomeActive
        return true
    }

    // Показ ATT после появления UI + отправка activateApp
    func applicationDidBecomeActive(_ application: UIApplication) {
        // Событие активизации приложения для Meta App Events
        AppEvents.shared.activateApp()

        // ATT-попап — только если статус не определён
        guard #available(iOS 14, *) else { return }

        let askedKey = "attPromptShown"
        if UserDefaults.standard.bool(forKey: askedKey) { return }

        if ATTrackingManager.trackingAuthorizationStatus == .notDetermined {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                ATTrackingManager.requestTrackingAuthorization { _ in
                    // SDK сам читает статус ATT; сохраняем флаг, чтобы не тревожить пользователя повторно
                    UserDefaults.standard.set(true, forKey: askedKey)
                }
            }
        } else {
            // Статус уже определён (authorized/denied/restricted) — диалог больше не покажется
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

    // Universal Links
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

    // Остальные хуки (по необходимости)
    func applicationWillResignActive(_ application: UIApplication) { }
    func applicationDidEnterBackground(_ application: UIApplication) { }
    func applicationWillEnterForeground(_ application: UIApplication) { }
    func applicationWillTerminate(_ application: UIApplication) { }
}
