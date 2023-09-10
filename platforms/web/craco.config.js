const webpack = require("webpack");
const { getWebpackTools } = require("@packages/metro-monorepo-tools");

const monorepoWebpackTools = getWebpackTools({
  resolveFromCwdLibNames: [
    'react',
    'react-dom',
    'react-native',
    '@react-native-async-storage/async-storage',
  ],
});

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Allow importing from external workspaces.
      monorepoWebpackTools.enableWorkspacesResolution(webpackConfig);
      // Ensure nohoisted libraries are resolved from this workspace.
      monorepoWebpackTools.addNohoistAliases(webpackConfig);
      return webpackConfig;
    },
    plugins: [
      // Inject the "__DEV__" global variable.
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== "production",
      })
    ],
  },
};
