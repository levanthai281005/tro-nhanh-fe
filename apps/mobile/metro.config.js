const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('node:path');

const config = getDefaultConfig(__dirname);

// Expo SDK 52+ configures pnpm monorepos automatically. Avoid overriding
// watchFolders and nodeModulesPaths so Metro can use Expo's supported defaults.
module.exports = withNativeWind(config, {
  input: './src/global.css',
  configPath: path.join(__dirname, 'tailwind.config.js'),
});
