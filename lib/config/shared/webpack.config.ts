import {
  Configuration,
  EnvironmentPlugin
} from 'webpack'

import {
  optimize
} from 'webpack'

import {
  findPath
} from './path'

const config: Configuration = {

  entry: findPath('index'),

  externals: [
    'react',
    'react-redux',
    'redux-actions',
    'reselect'
  ],

  resolve: {
    extensions: [ '.ts', '.js', '.json' ]
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader'
      }
    ]
  },

  plugins: [
    new optimize.ModuleConcatenationPlugin()
  ],

  target: 'web'

}

export default config
