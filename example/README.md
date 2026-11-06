# example構成

* Expoプロジェクト

## iOS の依存管理の切り替え（CocoaPods / Swift Package Manager）

`ios/` は `prebuild` で生成します。
CocoaPods 版と Swift Package Manager（SwiftPM）版は、次のスクリプトで切り替えます。

```bash
# CocoaPods（既定）
yarn prebuild:ios

# Swift Package Manager（実験的。Expo SDK 58 以降・React Native 0.88 以降）
yarn prebuild:ios:spm

# Swift Package Manager 版を生成し、続けてシミュレータ向けにビルドする
yarn build:ios:spm

# 起動（CocoaPods 版は yarn ios、Swift Package Manager 版は yarn ios:spm）
yarn ios
yarn ios:spm
```

- どちらも `ios/` を作り直します。2 つの `ios/` を同時に置くことはできません。
- SwiftPM 版の `ios/` に対して `yarn ios` を実行すると、Expo CLI がエラーで止まります。`yarn ios:spm` を使ってください。
- SwiftPM 版でも CocoaPods（`pod` コマンド）が必要です。`pod deintegrate` と、podspec の読み取りに使います。
- SwiftPM 版を作り直すときは、必ず `yarn prebuild:ios:spm` を使ってください。
  - `yarn prebuild` など `--clean` 付きの `expo prebuild` を実行すると、CocoaPods 版に戻ります。
  - `--clean` なしの `expo prebuild` を SwiftPM 版の `ios/` に実行すると、Expo CLI がエラーで止まります。
- Detox による E2E テスト（`make e2e-ios`）は CocoaPods 版でのみ動きます。
- SwiftPM 版では、SwiftPM に未対応の他社ライブラリ向けの回避策を `scripts/prebuild-ios-spm.js` で自動的に入れています。payjp-react-native 自体には回避策は不要です。
  - expo-router の iOS ネイティブモジュールを除外します（`package.json` の `expo.autolinking.ios.exclude`）。JavaScript の画面遷移は動きます。Xcode がビルドのたびに autolinking を作り直すため、この設定は常に残しており、CocoaPods 版でも除外されます。
  - react-native-gesture-handler と @react-native-masked-view/masked-view を、iOS の autolinking から除外します（`react-native.config.js`）。
  - react-native-screens の `Package.swift` を `node_modules` 内に自動生成し、足りないヘッダー検索パスを追加します。
- `node_modules` を入れ直したあとは、`yarn prebuild:ios:spm` をもう一度実行してください。

