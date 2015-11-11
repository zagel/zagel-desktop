import Promise from 'bluebird';
import fs from 'fs-extra';
import rollup from 'rollup';
import npm from 'rollup-plugin-npm';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import rootPackage from './package.json';

const fsp = Promise.promisifyAll(fs);

function bundle(src, dest) {
  return rollup.rollup({
    entry: src,
    plugins: [
      npm({jsnext: true, main: true}),
      commonjs({include: 'node_modules/**'}),
      babel({exclude: 'node_modules/**'}),
    ],
  }).then(bundle => {
    bundle.write({dest: dest, format: 'iife'});
  });
}

function error(err) {
  console.error('An error occurred:', err);
}

bundle('src/app.js', 'bundle/app.js').then(() => {
  fsp.copyAsync('src/app.html', 'bundle/app.html').catch(error);
  fsp.copyAsync('src/index.js', 'bundle/index.js').catch(error);
  fsp.copyAsync('src/css', 'bundle/css').catch(error);
  fsp.writeJSONAsync("bundle/package.json", {
    name: rootPackage.name,
    version: rootPackage.version,
    main: "index.js",
  }).catch(error);
}).catch(error);
