module.exports = {
  presets: [
    '@vue/app'
  ],
  env: {
    development: {
      plugins: ['dynamic-import-node'],
      compact: false
    }
  },
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
