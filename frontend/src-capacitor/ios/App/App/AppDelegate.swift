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

        // (опционально) включим автолог и логи в дебаге
        #if DEBUG
        Settings.shared.isAutoLogAppEventsEnabled = true
        Settings.shared.isLoggingBehaviorEnabled = true
        Settings.shared.loggingBehaviors = [.appEvents, .networkRequests]
        #endif

        // ATT-запрос (по правилам Apple лучше показывать не на первом кадре,
        // но для теста можно и тут)
        requestTrackingPermission()

        // Отправка события запуска в App Events
        AppEvents.shared.activateApp()

        return true
    }

    private func requestTrackingPermission() {
        if #available(iOS 14, *) {
            DispatchQueue.main.async {
                ATTrackingManager.requestTrackingAuthorization { _ in
                    // Ничего не ставим вручную: SDK сам читает статус ATT
                }
            }
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

    // Universal Links: корректный вызов без restorationHandler
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
}
