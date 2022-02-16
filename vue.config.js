/* eslint-disable */
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const path = require('path')

module.exports = {
  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        // webpack 打包结果会放到 dist 目录
        // prerenderSPAPlugin 会在 webpack 打包之后，启动一个web server
        // 该配置是把 dist 目录指定为 web server 的静态目录
        staticDir: path.join(__dirname, `dist`),

        // 预渲染之后的 html文件 写入到该目录
        outputDir: path.join(__dirname, 'packages'),

        indexPath: path.join(
          __dirname,
          'dist',
          'index.html'
        ),

        // Required - Routes to render.
        // 配置要预渲染的页面路径
        // 这些路径是 prerenderSPAPlugin 的 web server 的静态资源路径
        // 由于 /dist 目录为 webserver 的静态资源目录
        // 所以此时配置的路径应该是 /index.html
        // 而 indexPath 又配置为 /index.html， 所以此处的配置路径为 /
        routes: [`/`],

        // 预编译的启动时机，在 id=app 的 div 加载完成之后再启动预渲染
        renderAfterElementExists: '#app'
      })
    ],
  },
}
