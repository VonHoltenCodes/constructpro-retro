const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for TypeScript and additional file types
config.resolver.assetExts.push(
  // Audio files
  'mp3',
  'wav',
  'aiff',
  'aac',
  'm4a',
  // Font files
  'otf',
  'ttf',
  // Other assets
  'bin'
);

// Support for retro sound effects and custom fonts
config.resolver.sourceExts.push('tsx', 'ts', 'jsx', 'js', 'json');

module.exports = config;