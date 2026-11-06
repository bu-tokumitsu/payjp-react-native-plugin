# React Native Plugin for PAY.JP SDK

![npm](https://img.shields.io/npm/v/payjp-react-native)
![Build and Test](https://github.com/payjp/payjp-react-native-plugin/workflows/Build%20and%20Test/badge.svg?branch=master)

オンライン決済サービス「[PAY.JP](https://pay.jp/)」をReact Nativeアプリケーションに組み込むためのプラグインです。
このプラグインは以下の機能を提供します。

- クレジットカード決済のためのカードフォーム
- Apple Payアプリ内決済（iOSのみ）

詳細は[公式オンラインドキュメント](https://pay.jp/docs/mobileapp-react-native)を確認ください。

## サンプルコード

exampleをご覧ください。

※Android Emulator環境で3Dセキュア機能を動作させる場合、Chromeアプリが初期画面になっていると3Dセキュアの認証画面が立ち上がらない場合がありますのでご注意ください。 ref: https://github.com/payjp/payjp-android/pull/61  
この事象が起こる場合、一度Chromeアプリを開き初期画面を完了しておくことで解決されます。

## Compatible Platforms

|Platform|CardForm          |ApplePay          |
|--------|------------------|------------------|
|iOS     |:white_check_mark:|:white_check_mark:|
|Android |:white_check_mark:|                  |

## Swift Package Manager (iOS, 実験的)

React Native 0.87 で実験的に導入された [Swift Package Manager サポート](https://reactnative.dev/blog/2026/08/11/react-native-0.87#experimental-swift-package-manager-support-for-ios) に対応した `Package.swift` を同梱しています。
動作確認は React Native 0.88 で行っています。React Native 側の仕様変更により、動作しなくなる可能性があります。
React Native 側の機能が実験段階のため、本番環境では引き続き CocoaPods を利用してください。CocoaPods を利用する場合は従来通りで、追加の対応は不要です。

```sh
cd ios
npx react-native spm --deintegrate

# 元に戻す場合
npx react-native spm deinit
```

- PAY.JP iOS SDK と GoogleUtilities は SwiftPM で取得されます。CocoaPods と SwiftPM を併用して同じライブラリを二重に導入しないでください。
- SwiftPM で利用する場合の最低対応 iOS バージョンは 15 です。
- React Native の既定のフォルダ構成（autolinking の既定設定）を前提にしています。
- `NSCameraUsageDescription` など Info.plist の設定は CocoaPods 利用時と同様に必要です。
- Expo（SDK 58 以降）では、アプリ設定の `experiments.swiftPackageManager` で試せます。Expo 側も実験的な機能で、React Native 0.88 以降が必要です。
  - 他のライブラリが `Package.swift` を同梱していない場合は、`npx react-native spm scaffold` などで個別の対応が必要です。設定例は example をご覧ください。

## API References

https://payjp.github.io/payjp-react-native-plugin/

## License

React Native Plugin for PAY.JP SDK is available under the MIT license. See the LICENSE file for more info.

## Development

```
yarn install
yarn build
```

```
cd example
yarn start
yarn ios or android
```
