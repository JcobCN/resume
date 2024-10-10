const path = require('path');
const {ESBuildPlugin, ESBuildMinifyPlugin} = require('esbuild-loader')

exports.onCreateWebpackConfig = ({ actions, loaders, stage, getConfig }) => {
  const config = getConfig();

  if (config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
  } else {
    config.resolve = {
      alias: { '@': path.resolve(__dirname, 'src') },
    };
  }

  // This will completely replace the webpack config with the modified object.
  actions.replaceWebpackConfig(config);

  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /bad-module/,
            use: loaders.null(),
            loader: 'esbuild-loader',
          },
        ],
      },
      optimization:{
        minimize: true,
        minimizer: [
            new ESBuildMinifyPlugin({
                target: 'es2015'
            })
        ]
    },
    plugins: [
        new ESBuildPlugin()
    ]
    });
  }
};
