// PluginViewController.swift
import UIKit
import Capacitor
import WebKit

class MyCapacitorViewController: CAPBridgeViewController, CAPBridgeDelegate {

    override open func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor.white // цвет фона за пределами webView

        DispatchQueue.main.async {
            self.setupWebViewFrameAndStatusBar()
        }
    }

    override open func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        DispatchQueue.main.async {
            self.setupWebViewFrameAndStatusBar()
        }
    }

    override open func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        setupWebViewFrameAndStatusBar()
    }

    private func setupWebViewFrameAndStatusBar() {
        guard let webView = self.webView else { return }

        var topPadding: CGFloat = 0
        var bottomPadding: CGFloat = 0
        var leftPadding: CGFloat = 0
        var rightPadding: CGFloat = 0

        if #available(iOS 13.0, *) {
            let window = view.window ?? UIApplication.shared.connectedScenes
                .compactMap { $0 as? UIWindowScene }
                .first?.windows.first { $0.isKeyWindow }
            topPadding = window?.safeAreaInsets.top ?? 0
            bottomPadding = window?.safeAreaInsets.bottom ?? 0
            leftPadding = window?.safeAreaInsets.left ?? 0
            rightPadding = window?.safeAreaInsets.right ?? 0

            // подложка под статус-бар
            if let statusBarFrame = window?.windowScene?.statusBarManager?.statusBarFrame {
                let statusBarView = UIView(frame: statusBarFrame)
                statusBarView.backgroundColor = UIColor.white // твой цвет
                if statusBarView.superview == nil {
                    window?.addSubview(statusBarView)
                }
            }

        } else {
            topPadding = UIApplication.shared.statusBarFrame.height
            if let statusBar = UIApplication.shared.value(forKey: "statusBar") as? UIView {
                statusBar.backgroundColor = UIColor.white // твой цвет
            }
        }

        webView.frame.origin = CGPoint(x: leftPadding, y: topPadding)
        webView.frame.size = CGSize(
            width: UIScreen.main.bounds.width - leftPadding - rightPadding,
            height: UIScreen.main.bounds.height - topPadding - bottomPadding
        )
    }

    // реализация протокола CAPBridgeDelegate
    public var bridgedWebView: WKWebView? {
        return self.webView
    }

    public var bridgedViewController: UIViewController? {
        return self
    }
}