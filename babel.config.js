module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Reanimated v4 moved its plugin to react-native-worklets/plugin.
    // It must be the LAST plugin in the list.
    plugins: ['react-native-worklets/plugin'],
  };
};
