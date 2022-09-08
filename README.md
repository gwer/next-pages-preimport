# next-pages-preimport

Speed up first render of pages in your Next.js application.

## Motivation

With Next.js a first render of each page has a large TTFB.

The overhead is due to the fact that dependencies are imported on demand when the user requests a page. In real complex applications this overhead can increase TTFB to tens of seconds.

The second time the page loads faster, since the modules are cached (in `ssr-module-cache.js`).

You can find details here: https://github.com/vercel/next.js/issues/23187. 

This issue can be fixed with pages pre-import. Right now only `_app` and `_document` can be pre-imported (implemented here: https://github.com/vercel/next.js/pull/23261).

With `next-page-preimport` you can speed up your Next.js application and make it more stable.

## Installation

```
yarn add next-pages-preimport
```

or

```
npm install next-pages-preimport
```

## Usage

It works only with [Custom Server](https://nextjs.org/docs/advanced-features/custom-server).

```js
// server.js
const express = require('express');
const next = require('next')

const nextPagesPreimport = require('next-pages-preimport');

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  if (!dev) {
    nextPagesPreimport();
  }

  const server = express();

  server.all('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) {
      throw err;
    }

    console.log(`Ready on http://${hostname}:${port}`);
  });
})
```

## Options

### options.nextPath
_Default:_ `.next`

```js
nextPagesPreimport({ nextPath: 'build' });
```

This option may be useful when you set [custom](https://nextjs.org/docs/api-reference/next.config.js/setting-a-custom-build-directory) `distDir` in your `next.config.js`.

### options.verbose
_Default:_ `false`

```js
nextPagesPreimport({ verbose: true });
```

When `verbose` is `true` all preimported modules are printed. Useful for debugging.
