const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
console.log(process.env.NODE_ENV)
module.exports = {
    //路径前缀
    publicPath: "/",
    lintOnSave: true,
    productionSourceMap: false,
    configureWebpack: config => {
        config.performance={
            hints:false
        }
        config.entry.app = ["babel-polyfill", "./src/main.js"];
        if (process.env.NODE_ENV === 'production') {
            config.externals = {
                'vue': 'Vue',
                'vue-router': 'VueRouter',
                'vuex': 'Vuex',
                'axios': 'axios',
                'element-ui': 'ELEMENT',
            }
            return {
                plugins: [
                    new CompressionPlugin({
                        /* [file]被替换为原始资产文件名。
                           [path]替换为原始资产的路径。
                           [dir]替换为原始资产的目录。
                           [name]被替换为原始资产的文件名。
                           [ext]替换为原始资产的扩展名。
                           [query]被查询替换。*/
                        filename: '[path].gz[query]',
                        //压缩算法
                        algorithm: 'gzip',
                        //匹配文件
                        test: /\.js$|\.css$|\.html$/,
                        //压缩超过此大小的文件,以字节为单位
                        threshold: 10240,
                        minRatio: 0.8,
                        //删除原始文件只保留压缩后的文件
                        deleteOriginalAssets: false
                    })
                ]
            }
        }
    },
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.plugins.delete('preload');
            config.plugins.delete('prefetch');
            config.optimization.minimize(true);
        }
    },
    devServer: {
        port: 8090,
        proxy: {
            '/api': {
                //本地服务接口地址
                target: 'http://cloud.yunhengzhizao.com/api',
                ws: false,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }
}

