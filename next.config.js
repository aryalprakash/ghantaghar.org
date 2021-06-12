// next.config.js
    
module.exports = {
    webpack(config, options) {
      const { isServer } = options;
      config.module.rules.push({
        test: /\.svg$/,
        issuer: {
          test: /\.(js|ts)x?$/,
        },
        use: ['@svgr/webpack'],
      });

      config.module.rules.push({
        test: /\.wav$/,
        exclude: config.exclude,
        use: {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/sounds/`,
            outputPath: `${isServer ? '../' : ''}sounds/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        }
      });
  
      return config;
    },
  };