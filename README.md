# wweb

A WhatsApp web automation app.


## Run Locally

Clone the project

```bash
  git clone https://github.com/matheusferrera/wppJoao
```

Go to the project directory

```bash
  cd wweb
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Local Patch

Go to `node_modules/whatsapp-web.js/src/util/Constants.js` and make sure you have the following under `exports.DefaultOptions`:

```javascript
webVersion: '2.2411.2',
webVersionCache: {
  type: 'remote',
  remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html',
},
```

## API Reference

A Swagger-UI page is hosted at `localhost:3000/api-docs` for the API endpoints.

## External Documentation

Documentation regarding the core WhatsApp library used in this project can be found
[here](https://docs.wwebjs.dev/index.html) and in their [GitHub page](https://github.com/pedroslopez/whatsapp-web.js).
