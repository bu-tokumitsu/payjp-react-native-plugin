#!/usr/bin/env node

// Generates ios/ with Swift Package Manager (experimental, Expo SDK 58+ / React Native 0.88+).
//
//   yarn prebuild:ios:spm   generate ios/
//   yarn build:ios:spm      generate ios/ and build for the iOS Simulator
//
// The workarounds below are for third-party libraries only; payjp-react-native ships its own Package.swift.
//   1. expo-router: its iOS native module imports RNScreens, which SwiftPM cannot build. It is excluded with
//      `expo.autolinking.ios.exclude` in package.json (kept there, because Xcode re-runs autolinking on every build).
//      JavaScript routing still works. CocoaPods builds exclude it too.
//   2. react-native-gesture-handler / @react-native-masked-view/masked-view: excluded in react-native.config.js.
//   3. react-native-screens: ships no Package.swift. One is scaffolded into node_modules and the missing header
//      search path is added.
// Run this again after reinstalling node_modules.
// TODO: remove these workarounds once the libraries ship Package.swift and Expo / React Native SwiftPM support is stable.

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const appRoot = path.resolve(__dirname, '..');
const setupAppleSpm = path.join(__dirname, 'setup-apple-spm.js');
const expoCli = require.resolve('expo/bin/cli', { paths: [appRoot] });

const SCREENS_MANIFEST = path.join(appRoot, 'node_modules/react-native-screens/Package.swift');
const SCREENS_HEADER_SEARCH_PATH = '.headerSearchPath("common/cpp/react/renderer/components")';

const env = { ...process.env, PAYJP_IOS_SPM: '1' };

const run = (command, args) => {
    console.log(`\n> ${[command, ...args].join(' ')}`);
    const result = spawnSync(command, args, { cwd: appRoot, env, stdio: 'inherit' });
    if (result.error) {
        throw result.error;
    }
    if (result.status !== 0) {
        throw new Error(`Command failed (exit ${result.status ?? result.signal}): ${command} ${args.join(' ')}`);
    }
};

// setup-apple-spm.js uses CocoaPods for `pod deintegrate` and for reading podspecs (`pod ipc spec`) while scaffolding.
const assertCocoaPodsInstalled = () => {
    const result = spawnSync('pod', ['--version'], { encoding: 'utf8' });
    if (result.error || result.status !== 0) {
        throw new Error(
            'CocoaPods (`pod`) is required even for the Swift Package Manager setup. Install CocoaPods first.',
        );
    }
};

const patchScreensManifest = () => {
    if (!fs.existsSync(SCREENS_MANIFEST)) {
        throw new Error(`${SCREENS_MANIFEST} was not generated. Check the scaffold output above.`);
    }
    const manifest = fs.readFileSync(SCREENS_MANIFEST, 'utf8');
    if (manifest.includes(SCREENS_HEADER_SEARCH_PATH)) {
        return;
    }
    const patched = manifest.replace(/\.headerSearchPath\("common\/cpp"\)/g, `$&, ${SCREENS_HEADER_SEARCH_PATH}`);
    if (patched === manifest) {
        throw new Error(`Could not add ${SCREENS_HEADER_SEARCH_PATH} to ${SCREENS_MANIFEST}`);
    }
    fs.writeFileSync(SCREENS_MANIFEST, patched);
    console.log(`Patched ${path.relative(appRoot, SCREENS_MANIFEST)}`);
};

const main = () => {
    assertCocoaPodsInstalled();
    // --no-install skips Expo's own SwiftPM setup, which would fail before the manifests below exist.
    run(process.execPath, [expoCli, 'prebuild', '--platform', 'ios', '--clean', '--no-install']);
    run(process.execPath, [setupAppleSpm, 'scaffold', '--yes']);
    patchScreensManifest();
    run(process.execPath, [setupAppleSpm, 'add', '--deintegrate', '--yes']);
};

try {
    main();
} catch (error) {
    console.error(`\n${error.message}`);
    process.exit(1);
}
