import UIKit
import Capacitor
import FBSDKCoreKit

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

        // Отправка события "App Launch"
        AppEvents.shared.activateApp()

        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Переход в неактивное состояние (входящий звонок, SMS и т.д.)
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Приложение ушло в фон
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Приложение возвращается на передний план
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Приложение стало активным
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Приложение завершает работу
    }

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        // Обработка URL (в том числе для Facebook SDK)
        if ApplicationDelegate.shared.application(app, open: url, options: options) {
            return true
        }
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(
        _ application: UIApplication,
        continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        if ApplicationDelegate.shared.application(application, continue: userActivity, restorationHandler: restorationHandler) {
            return true
        }
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
