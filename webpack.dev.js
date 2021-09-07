module.exports = async (env) => {
  let config;

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

      config.devServer.client = {
        webSocketURL: GET_NGROK_DOMAIN,
      };
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
    const _devServer = {
      host: "localhost",
      static: {
        directory: path.join(__dirname, './dist'),
        watch: true,
      },
      watchFiles: './src/**/*',
    };
    if (!env.NGROK_SERVE_ON) {
      _devServer['open'] = {
        app: {
          name: 'chrome',
        },
      };
    }
    return _devServer;
  }

  async function _config(env) {
    config = {
      devServer: _devServer(env),
      mode: 'development',
      devtool: 'inline-source-map',
    };
    config['plugins'] = await _plugins(env);
    return config;
  }

  return merge(common(env), await _config(env));
};
