// Swift Package Manager (iOS) verification only. See scripts/prebuild-ios-spm.js.
// These libraries ship no Package.swift and the example does not use them natively,
// so they are excluded from iOS autolinking while the ios/ project uses Swift Package Manager.
// CocoaPods builds and Android are unaffected.
//
// The Xcode scheme pre-action re-runs autolinking on every build without PAYJP_IOS_SPM,
// so the SPM marker file written by setup-apple-spm.js is checked as well.
const fs = require('fs');
const path = require('path');

const SPM_UNSUPPORTED_LIBRARIES = [
    // react-native-screens cannot be excluded: expo-router's JavaScript (Stack) needs it.
    'react-native-gesture-handler',
    '@react-native-masked-view/masked-view',
];

const isSwiftPMProject = () => {
    if (process.env.PAYJP_IOS_SPM === '1') {
        return true;
    }
    const iosDir = path.join(__dirname, 'ios');
    if (!fs.existsSync(iosDir)) {
        return false;
    }
    return fs
        .readdirSync(iosDir)
        .filter(entry => entry.endsWith('.xcodeproj'))
        .some(entry => fs.existsSync(path.join(iosDir, entry, '.spm-injected.json')));
};

module.exports = {
    dependencies: isSwiftPMProject()
        ? Object.fromEntries(SPM_UNSUPPORTED_LIBRARIES.map(name => [name, { platforms: { ios: null } }]))
        : {},
};
