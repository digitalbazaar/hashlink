const path = require('path');

module.exports = {
  mode: "production", // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  entry: "./main.js", // string | object | array
  // defaults to ./src
  // Here the application starts executing
  // and webpack starts bundling
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "hashlink.min.js", // string
    // the url to the output directory resolved relative to the HTML page
    library: "hashlink", // string,
    // the name of the exported library
    libraryTarget: "umd", // universal module definition
    // the type of the exported library
    /* Advanced output configuration (click to show) */
    /* Expert output configuration (on own risk) */
  },
  devtool: "source-map", // enum
  // enhance debugging by adding meta info for the browser devtools
};
