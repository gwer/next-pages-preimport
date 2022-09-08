const path = require('path');

const pagesPreimport = ({ nextPath = '.next', verbose = false }) => {
  try {
    const serverPath = path.join(path.resolve('.'), nextPath, 'server');
    const pagesManifest = require(path.join(serverPath, 'pages-manifest.json'));

    Object.values(pagesManifest).forEach((dep) => {
      if (path.extname(dep) !== '.js') {
        return;
      }

      if (verbose) {
        console.log('Preimport ', dep);
      }
      require(path.join(serverPath, dep));
    });
  } catch (e) {
    console.warn("Can't preimport pages");
  }
};

module.exports = pagesPreimport;
