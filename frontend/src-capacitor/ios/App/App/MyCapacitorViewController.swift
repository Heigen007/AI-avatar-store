// PluginViewController.swift
import UIKit
import Capacitor
import WebKit

private extension UIColor {
    convenience init(hex: String) {
        var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        if hexSanitized.hasPrefix("#") { hexSanitized.removeFirst() }
        var rgb: UInt64 = 0
        Scanner(string: hexSanitized).scanHexInt64(&rgb)
        self.init(
            red: CGFloat((rgb & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgb & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgb & 0x0000FF) / 255.0,
            alpha: 1.0
        )
    }
}

class MyCapacitorViewController: CAPBridgeViewController {

    private let chromeColor = UIColor(hex: "#091a2c")

    override func viewDidLoad() {
        super.viewDidLoad()

        // Цвет "пустых" зон (за пределами safe area и под webview)
        view.backgroundColor = chromeColor
        view.isOpaque = true

        // Сделать WebView прозрачным, чтобы не пробивался белый фон
        if let wk = webView as? WKWebView {
            wk.isOpaque = false
            wk.backgroundColor = .clear
            wk.scrollView.backgroundColor = .clear
        } else {
            webView?.isOpaque = false
            webView?.backgroundColor = .clear
        }

        // Привязать webView к safe area (без ручного вычисления фреймов)
        pinWebViewToSafeArea()

        // Обновить стиль статус-бара (светлый текст на тёмном фоне)
        setNeedsStatusBarAppearanceUpdate()
    }

    // Светлая надпись в статус-баре
    override var preferredStatusBarStyle: UIStatusBarStyle {
        if #available(iOS 13.0, *) {
            return .lightContent
        } else {
            return .lightContent
        }
    }

    private func pinWebViewToSafeArea() {
        guard let webView = self.webView else { return }
        webView.translatesAutoresizingMaskIntoConstraints = false

        let g = view.safeAreaLayoutGuide
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: g.topAnchor),
            webView.bottomAnchor.constraint(equalTo: g.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: g.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: g.trailingAnchor)
        ])
    }
}