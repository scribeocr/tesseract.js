import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default {
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: 'last 2 versions',
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
