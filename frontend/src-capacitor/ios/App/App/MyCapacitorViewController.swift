// PluginViewController.swift
import UIKit
import Capacitor
import WebKit

class MyCapacitorViewController: CAPBridgeViewController {

    private let chromeColor = UIColor(red: 0x09/255.0, green: 0x1A/255.0, blue: 0x2C/255.0, alpha: 1.0)

    // "Планки" по краям вне safe area
    private let topChrome = UIView()
    private let bottomChrome = UIView()
    private let leftChrome = UIView()
    private let rightChrome = UIView()

    override func viewDidLoad() {
        super.viewDidLoad()

        // Цвет фона всего корневого вью (на всякий)
        view.backgroundColor = chromeColor

        // Сделать сам webView прозрачным, чтобы "хром" не перекрывался
        if let wk = webView as? WKWebView {
            wk.isOpaque = false
            wk.backgroundColor = .clear
            wk.scrollView.backgroundColor = .clear
        } else {
            webView?.isOpaque = false
            webView?.backgroundColor = .clear
        }

        // Добавляем цветные планки позади webView
        for v in [topChrome, bottomChrome, leftChrome, rightChrome] {
            v.backgroundColor = chromeColor
            v.isUserInteractionEnabled = false
            view.addSubview(v)
        }

        // Твоя текущая логика отступов — оставляем
        DispatchQueue.main.async {
            self.setupWebViewPadding()
        }
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        DispatchQueue.main.async {
            self.setupWebViewPadding()
        }
    }

    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        setupWebViewPadding()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        layoutChrome()
        if let webView = webView { view.bringSubviewToFront(webView) }
    }

    // Светлый текст в статус-баре под тёмный фон
    override var preferredStatusBarStyle: UIStatusBarStyle { .lightContent }

    private func layoutChrome() {
        let insets = view.safeAreaInsets
        let b = view.bounds

        // верхняя "полоска" — от верхней кромки экрана до safe area
        topChrome.frame = CGRect(x: 0, y: 0, width: b.width, height: insets.top)

        // нижняя — от safe area до низа (домашняя индикаторная зона)
        bottomChrome.frame = CGRect(x: 0, y: b.height - insets.bottom, width: b.width, height: insets.bottom)

        // боковые уши (актуально в ландшафте/на iPad с вырезами)
        leftChrome.frame = CGRect(x: 0, y: insets.top, width: insets.left, height: b.height - insets.top - insets.bottom)
        rightChrome.frame = CGRect(x: b.width - insets.right, y: insets.top, width: insets.right, height: b.height - insets.top - insets.bottom)
    }

    // ---- твой код без изменений ----
    private func setupWebViewPadding() {
        guard let webView = self.webView else { return }

        var topPadding: CGFloat = 0
        var bottomPadding: CGFloat = 0
        var leftPadding: CGFloat = 0
        var rightPadding: CGFloat = 0

        if #available(iOS 13.0, *) {
            let window = view.window ?? UIApplication.shared.windows.first { $0.isKeyWindow }
            topPadding = window?.safeAreaInsets.top ?? 0
            bottomPadding = window?.safeAreaInsets.bottom ?? 0
            leftPadding = window?.safeAreaInsets.left ?? 0
            rightPadding = window?.safeAreaInsets.right ?? 0
        } else {
            topPadding = UIApplication.shared.statusBarFrame.height
        }

        webView.frame.origin = CGPoint(x: leftPadding, y: topPadding)
        webView.frame.size = CGSize(
            width: UIScreen.main.bounds.width - leftPadding - rightPadding,
            height: UIScreen.main.bounds.height - topPadding - bottomPadding
        )
    }
}
