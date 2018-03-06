const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const px2rem = require('postcss-plugin-px2rem');
const root = path.join(__dirname, './', 'static/resources/');
const entry = require('./webpack.entry');
const fs = require('fs');

const pkgPath = path.join(__dirname, 'package.json');

const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {};
let theme = {};

if (pkg.theme && typeof pkg.theme === 'string') {
  let cfgPath = pkg.theme;
  // relative path
  if (cfgPath.charAt(0) === '.') {
    cfgPath = resolve(args.cwd, cfgPath);
  }
  const getThemeConfig = require(cfgPath);
  theme = getThemeConfig();
} else if (pkg.theme && typeof pkg.theme === 'object') {
  theme = pkg.theme;
}

const extractPCSS = new ExtractTextPlugin({
  filename: getPath => {
    return getPath('css/[name].css');
  },
  allChunks: true,
});
const extractLESS = new ExtractTextPlugin({
  filename: 'css/less.css',
  allChunks: true,
});

const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''), // 1. 属于 antd-mobile 内置 svg 文件
  // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 2. 自己私人的 svg 存放目录
];

module.exports = {
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'static/resources/react-build'),
    filename: '[name].js',
    library: 'groupBuyLib[name]',
  },
  devtool: 'source-map',
  resolve: {
    // alias: {
    //     'react': 'react-lite',
    //     'react-dom': 'react-lite'
    // },
    modules: [path.resolve(root, 'react-src'), 'node_modules'],
    extensions: [
      '.webpack.js',
      '.web.js',
      '.ts',
      '.tsx',
      '.js',
      '.less',
      '.css',
      '.svg',
    ],
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.tsx?$/, //匹配的文件类型
        use: ['babel-loader', 'awesome-typescript-loader'],
        exclude: [/react-build/], //配置不需要编译的文件
      },
      {
        test: /\.less$/i,
        exclude: [/react-build/], //配置不需要编译的文件
        use: extractLESS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
                modifyVars: theme,
              },
            },
          ],
        }),
      },
      {
        test: /\.p?css$/,
        exclude: [/react-build/], //配置不需要编译的文件
        use: extractPCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            // { loader: 'resolve-url-loader' },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: 'inline',
                plugins: function () {
                  return [
                    require('postcss-import'),
                    require('postcss-custom-properties'),
                    require('postcss-apply'),
                    require('precss'),
                    require('postcss-cssnext'),
                    px2rem({
                      rootValue: 100,
                      unitPrecision: 5,
                      propWhiteList: [],
                      propBlackList: [],
                      selectorBlackList: [],
                      ignoreIdentifier: false,
                      replace: true,
                      mediaQuery: false,
                      minPixelValue: 0,
                    }),
                  ];
                },
              },
            },
          ],
        }),
      },
      {
        test: /\.(gif|jpg|png|woff|eot|ttf|svg)\??.*$/,
        loader: 'url-loader',
        options: {
          limit: 5000000,
          name: '/[path][name].[ext]',
        },
      },
      {
        test: /\/*\.(svg)$/i,
        loader: 'svg-sprite-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin('static/resources/react-build', {
      verbose: true,
      dry: false,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.js',
      minChunks: 3,
    }),
    // new webpack.LoaderOptionsPlugin({
    //     options: {
    //         context: __dirname,
    //         postcss: function() {
    //             return [
    //                 // less({ strictMath: true }),
    //                 // require('postcss-smart-import'),

    //             ]
    //         }
    //     }
    // }),
    // extractCSS,
    extractPCSS,
    extractLESS,
  ],
};
