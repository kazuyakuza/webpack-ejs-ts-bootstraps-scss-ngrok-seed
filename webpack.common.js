module.exports = (env) => {

  const path = require('path');
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
      test: /\.(json|txt)$/i,
      type: 'asset',
    };
  }

  function _fonts() {
    return {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset',
      generator: {
        filename: 'assets/fonts/[name][hash][ext]'
      },
    };
  }

  function _media() {
    return {
      test: /\.(mp3|mp4)$/i,
      type: 'asset',
      generator: {
        filename: 'assets/media/[name][hash][ext]'
      },
    };
  }

  function _imgs() {
    return {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset',
      generator: {
        filename: 'assets/imgs/[name][hash][ext]'
      },
    };
  }

  function _scss() {
    return {
      test: /\.s[ac]ss$/i,
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
        loader: 'sass-loader',
        options: {
          // Prefer `dart-sass`
          implementation: require('sass'),
        },
      }
      ]
    };
  }

  function _ejs() {
    return {
      test: /\.ejs$/i,
      use: [
        'html-loader',
        'template-ejs-loader',
      ],
    };
  }

  function _rules() {
    return [
      _ejs(),
      _scss(),
      _typescript(),
      _assets(),
      _fonts(),
      _media(),
      _imgs(),
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ];
  }

  function _htmlWebpackPlugin() {
    return [
      new HtmlWebpackPlugin({
        template: './src/index.ejs',
        filename: './index.html',
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
      entry: './src/app.ts',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        assetModuleFilename: 'assets/[name][hash][ext]'
      },
      plugins: _plugins(env),
      module: {
        rules: _rules(),
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      },
    };
  }

  return _config(env);
};
