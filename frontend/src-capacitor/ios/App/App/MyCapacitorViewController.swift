// PluginViewController.swift
import UIKit
import Capacitor

class MyCapacitorViewController: CAPBridgeViewController {
    override open func viewDidLoad() {
        super.viewDidLoad()

        // Красим фон всего нативного контейнера в белый
        view.backgroundColor = .white

        // Красим фон самого webView и убираем черную непрозрачность
        if let webView = self.webView {
            webView.isOpaque = false
            webView.backgroundColor = .white
            webView.scrollView.backgroundColor = .white
        }

        DispatchQueue.main.async {
            self.setupWebViewPadding()
        }
    }

    override open func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        DispatchQueue.main.async {
            self.setupWebViewPadding()
        }
    }

    override open func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        setupWebViewPadding()
    }

    private func setupWebViewPadding() {
        guard let webView = self.webView else { return }

        var topPadding: CGFloat = 0
        var bottomPadding: CGFloat = 0
        var leftPadding: CGFloat = 0
        var rightPadding: CGFloat = 0

        if #available(iOS 13.0, *) {
            let window = view.window ?? UIApplication.shared.windows.first { $0.isKeyWindow }
            let insets = window?.safeAreaInsets ?? view.safeAreaInsets
            topPadding = insets.top
            bottomPadding = insets.bottom
            leftPadding = insets.left
            rightPadding = insets.right
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
