// PluginViewController.swift
import UIKit
import Capacitor

class MyCapacitorViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Красим ВСЁ нативное окружение в белый
        view.backgroundColor = .white
        navigationController?.view.backgroundColor = .white
        parent?.view?.backgroundColor = .white
        view.window?.backgroundColor = .white

        // Красим сам WKWebView, чтобы нигде не проступал чёрный
        if let webView = self.webView {
            webView.isOpaque = false
            webView.backgroundColor = .white
            webView.scrollView.backgroundColor = .white
        }

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

    override func viewSafeAreaInsetsDidChange() {
        super.viewSafeAreaInsetsDidChange()
        setupWebViewPadding()
    }

    private func setupWebViewPadding() {
        guard let webView = self.webView else { return }

        // Берём актуальные инсетсы из окна (если уже есть) или из view
        let insets: UIEdgeInsets
        if #available(iOS 13.0, *) {
            insets = (view.window?.safeAreaInsets ?? view.safeAreaInsets)
        } else {
            insets = view.safeAreaInsets
        }

        let left = insets.left
        let right = insets.right
        let top = insets.top
        let bottom = insets.bottom

        // Лэйаутим webView как у тебя: внутри safe-area (с отступами)
        let screenBounds = UIScreen.main.bounds
        webView.frame.origin = CGPoint(x: left, y: top)
        webView.frame.size = CGSize(
            width: screenBounds.width - left - right,
            height: screenBounds.height - top - bottom
        )

        // Дублируем белый фон на случай пересоздания/перелайаута
        view.backgroundColor = .white
        webView.backgroundColor = .white
        webView.scrollView.backgroundColor = .white
    }
}
