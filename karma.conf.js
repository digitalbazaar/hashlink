module.exports = function(config) {
  return config.set({
    frameworks: ['mocha'],
    files: ['test/unit/index.js'],
    reporters: ['mocha'],
    basePath: '',
    port: 9876,
    colors: true,
    browsers: ['ChromeHeadless'],
    client: {
      mocha: {
        timeout: 2000
      }
    },
    singleRun: true,
    // preprocess matching files before serving them to the browser
    // available preprocessors:
    // https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/unit/*.js': ['webpack', 'sourcemap'],
    },
    webpack: {
      devtool: 'inline-source-map',
      mode: 'development',
      node: {
        //Buffer: false,
        crypto: false,
        setImmediate: false
      }
    }
  });
};
