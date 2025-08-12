module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Support for React Native Reanimated
      'react-native-reanimated/plugin',
      // Support for inline environment variables
      ['inline-dotenv'],
    ],
  };
};