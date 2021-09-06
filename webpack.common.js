module.exports = (env) => {

  const path = require("path");
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  function _typescript() {
    return {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    };
  }

  function _assets() {
    return {
      test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|mp3|mp4|json|txt)$/i,
      type: "asset/resource",
    };
  }

  function _scss() {
    return {
      test: /\.(scss)$/,
      use: [{
          // Adds CSS to the DOM by injecting a `<style>` tag
          loader: 'style-loader'
        },
        {
          // Interprets `@import` and `url()` like `import/require()` and will resolve them
          loader: 'css-loader'
        },
        {
          // Loader for webpack to process CSS with PostCSS
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              },
            },
          }
        },
        {
          // Loads a SASS/SCSS file and compiles it to CSS
          loader: 'sass-loader'
        }
      ]
    };
  }

  function _ejs() {
    return {
      test: /\.ejs$/i,
      use: ['html-loader', 'template-ejs-loader'],
    };
  }

  function _rules() {
    return [
      _ejs(),
      _scss(),
      _typescript(),
      _assets(),
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ];
  }

  function _htmlWebpackPlugin() {
    return [
      new HtmlWebpackPlugin({
        template: "./src/index.ejs",
        filename: "./index.html",
        cache: false,
        inject: 'body',
        minify: true,
      }),
    ];
  }

  function _plugins(env) {
    const plugins = [
      ..._htmlWebpackPlugin(),
    ];
    return plugins;
  }

  function _config(env) {
    return {
      target: 'web',
      entry: "./src/app.ts",
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js',
        assetModuleFilename: 'assets/[name][ext]'
      },
      plugins: _plugins(env),
      module: {
        rules: _rules(),
      },
    };
  }

  return _config(env);
};
