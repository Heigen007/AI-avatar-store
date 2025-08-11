// PluginViewController.swift
import UIKit
import Capacitor

class MyCapacitorViewController: CAPBridgeViewController {

    private var topOverlay: UIView?
    private var bottomOverlay: UIView?

    override open func viewDidLoad() {
        super.viewDidLoad()

        // Фон вокруг webView
        view.backgroundColor = .white

        // Настройка прозрачности webView, чтобы не было черного подложенного фона
        if let webView = self.webView {
            webView.isOpaque = false
            webView.backgroundColor = .clear
        }

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.setupWebViewPadding()
            self.ensureNativeOverlays(color: .white)
            self.layoutNativeOverlays()
        }
    }

    override open func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        DispatchQueue.main.async { [weak self] in
            self?.setupWebViewPadding()
            self?.layoutNativeOverlays()
        }
    }

    override open func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        setupWebViewPadding()
        layoutNativeOverlays()
    }

    override open func viewSafeAreaInsetsDidChange() {
        super.viewSafeAreaInsetsDidChange()
        layoutNativeOverlays()
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

    // Создаем верхний/нижний оверлеи цвета фона
    private func ensureNativeOverlays(color: UIColor) {
        if topOverlay == nil {
            let v = UIView()
            v.backgroundColor = color
            view.addSubview(v)
            topOverlay = v
        }
        if bottomOverlay == nil {
            let v = UIView()
            v.backgroundColor = color
            view.addSubview(v)
            bottomOverlay = v
        }
        topOverlay?.backgroundColor = color
        bottomOverlay?.backgroundColor = color
    }

    // Кладем оверлеи ровно на зоны safe-area, которые ты вычитаешь из webView
    private func layoutNativeOverlays() {
        let insets: UIEdgeInsets
        if #available(iOS 13.0, *) {
            insets = (view.window?.safeAreaInsets ?? view.safeAreaInsets)
        } else {
            insets = view.safeAreaInsets
        }

        let w = view.bounds.width
        let h = view.bounds.height

        topOverlay?.frame = CGRect(x: 0, y: 0, width: w, height: insets.top)
        bottomOverlay?.frame = CGRect(x: 0, y: h - insets.bottom, width: w, height: insets.bottom)
    }
}
