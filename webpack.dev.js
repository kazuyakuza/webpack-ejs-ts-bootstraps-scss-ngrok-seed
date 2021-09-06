module.exports = async (env) => {
  const {
    merge
  } = require('webpack-merge');
  const common = require('./webpack.common.js');
  const path = require("path");
  const HookShellScriptPlugin = require('hook-shell-script-webpack-plugin');
  const {
    getNgrokDomain
  } = require('./ngrok-tools');

  async function _ngrokServe(env) {
    if (env.NGROK_SERVE_ON) {
      const GET_NGROK_DOMAIN = await getNgrokDomain();

      devServer.compress = true;
      devServer.public = GET_NGROK_DOMAIN;
      devServer.sockHost = GET_NGROK_DOMAIN;
      return [
        new HookShellScriptPlugin({
          afterEmit: [`echo 
          NGROK INSPECT: http://127.0.0.1:4040
          NGROK URL: ${GET_NGROK_DOMAIN}`]
        }),
      ];
    }
    return [];
  }

  async function _plugins(env) {
    const plugins = [
      ...(await _ngrokServe(env)),
    ];
    return plugins;
  }

  function _devServer() {
    return {
      host: "localhost",
      static: {
        directory: path.join(__dirname, './dist'),
        watch: true,
      },
      watchFiles: './src/**/*',
      open: {
        app: {
          name: 'chrome',
        },
      },
    };
  }

  async function _config(env) {
    return {
      plugins: await _plugins(env),
      mode: 'development',
      devServer: _devServer(),
      devtool: 'inline-source-map',
    };
  }

  return merge(common(env), await _config(env));
};
