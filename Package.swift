// swift-tools-version: 6.0

import Foundation
import PackageDescription

// Swift Package Manager support for React Native's SwiftPM autolinking
// (introduced in react-native 0.87, experimental; verified with 0.88). CocoaPods users are unaffected; see the podspec.
// The two React Native packages are resolved by the autolinker relative to
// build/generated/autolinking/libs/PayjpReactNative in the app (default autolinking layout only).

// Keep the PAY.JP iOS SDK version in sync with the podspec via sdkconfig.json.
func readPayjpSdkVersion() -> Version {
    let url = URL(fileURLWithPath: Context.packageDirectory).appendingPathComponent("sdkconfig.json")
    guard
        let data = try? Data(contentsOf: url),
        let json = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any],
        let raw = json["ios"] as? String,
        let version = Version(raw)
    else {
        fatalError("payjp-react-native: could not read a semantic version (x.y.z) from \"ios\" in \(url.path)")
    }
    return version
}

let package = Package(
    name: "PayjpReactNative",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "PayjpReactNative", targets: ["PayjpReactNative"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
        // Equivalent to the podspec's `~> x.y.z`.
        .package(url: "https://github.com/payjp/payjp-ios.git", .upToNextMinor(from: readPayjpSdkVersion())),
        .package(url: "https://github.com/google/GoogleUtilities.git", "8.0.0"..<"9.0.0"),
    ],
    targets: [
        .target(
            name: "PayjpReactNative",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
                .product(name: "PAYJP", package: "payjp-ios"),
                .product(name: "GULAppDelegateSwizzler", package: "GoogleUtilities"),
            ],
            path: "ios/Classes",
            publicHeadersPath: ".",
            linkerSettings: [
                .linkedFramework("UIKit"),
                .linkedFramework("Foundation"),
                .linkedFramework("PassKit"),
            ]
        ),
    ]
)
