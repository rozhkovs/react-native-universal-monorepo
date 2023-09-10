const path = require("path");
const getWorkspaces = require("./get-workspaces");

/**
 * @typedef {Object} MonorepoWebpackConfig
 * @prop {Function} addNohoistAliases - Updates a webpack config to ensure nohoisted libraries are resolved correctly.
 * @prop {Function} enableWorkspacesResolution - Updates a webpack config allowing to import from external workspaces.
 */

/**
 * Return Webpack tools to make it compatible with Yarn workspaces.
 * @param {object} params - Input parameters
 * @param {string} [params.cwd] - Current working dir (defaults to process.cwd()).
 * @param {string[]} [params.resolveFromCwdLibNames] - Allow libraries only from the current directory (e.g., react, react-native, ...).
 * @returns {MonorepoWebpackConfig} Webpack config for this monorepo.
 */
module.exports = function getWebpackTools(params = {}) {
  const { cwd = process.cwd(), resolveFromCwdLibNames = [] } = params;

  const nohoistAlias = {};
  resolveFromCwdLibNames.forEach((nohoistLibName) => {
    nohoistAlias[nohoistLibName] =
      nohoistLibName === "react-native"
        ? path.resolve(cwd, "./node_modules/react-native-web")
        : path.resolve(cwd, `./node_modules/${nohoistLibName}`);
  });
  function addNohoistAliases(webpackConfig) {
    console.log('nohoistAlias', nohoistAlias);
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      ...nohoistAlias,
    };
  }

  // Allow importing from external workspaces.
  const workspaces = getWorkspaces({ cwd });
  function enableWorkspacesResolution(webpackConfig) {
    let targetIndex = 1;
    if (webpackConfig.module.rules.length === 1) {
      targetIndex = 0; // CRACO 7 / CRA 5 has only one rule
    }

    const babelLoader = webpackConfig.module.rules[targetIndex].oneOf.find((rule) =>
      rule.loader && rule.loader.includes("babel-loader")
    );
    babelLoader.include = Array.isArray(babelLoader.include)
      ? babelLoader.include
      : [babelLoader.include];
    for (const workspace of workspaces) {
      babelLoader.include.push(workspace);
    }
  }

  return {
    addNohoistAliases,
    enableWorkspacesResolution,
    alias: nohoistAlias // Deprecated
  };
};
