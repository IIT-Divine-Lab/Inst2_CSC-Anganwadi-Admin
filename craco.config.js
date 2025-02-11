module.exports = {
   webpack: {
      configure: (webpackConfig) => {
         webpackConfig.ignoreWarnings = [/Critical dependency:/];
         return webpackConfig;
      },
   },
};
