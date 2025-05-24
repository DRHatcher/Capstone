
  PROXY_CONFIG = {
    "/api": {
      "target": 'https://nn608r3gr4.execute-api.us-east-2.amazonaws.com/default',
      "secure": false,
      "changeOrigin": true,
      "pathRewrite": {
        "^/api/": ""
      },
    }
  }

module.exports = PROXY_CONFIG;